import React from "react";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/storage";
import { config } from "./config";
import crypto from "crypto";
const firebaseContext = React.createContext();

// Provider hook that initializes firebase, creates firebase object and handles state
function useProvideFirebase() {
    const [user, setUser] = React.useState(null);
    const [posts, setPosts] = React.useState([]);

    React.useEffect(() => {
        if (!firebase.apps.length) {
            console.log("I am initializing new firebase app");
            firebase.initializeApp(config);
        }

        const unsubscribeFunction = firebase.auth().onAuthStateChanged(user => {
            // console.log("got new user", user);
            setUser(user);
        });

        firebase
            .database()
            .ref("/posts")
            .on("value", function(snapshot) {
                const postsArray = [];
                for (const key in snapshot.val()) {
                    postsArray.push({
                        ...snapshot.val()[key],
                        id: key
                    });
                }

                setPosts(postsArray);
            });

        return function cleanup() {
            // looks like you don't need to do any clean up, but if you do, do it here
            unsubscribeFunction();
            firebase
                .database()
                .ref("/posts")
                .off();
        };
    }, []);

    const deletePost = async postId => {
        await firebase
            .database()
            .ref("posts/" + postId)
            .remove();
    };

    const register = async (email, password) => {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
    };

    const login = async (email, password) => {
        await firebase.auth().signInWithEmailAndPassword(email, password);
    };

    const signout = async () => {
        await firebase.auth().signOut();
    };

    const post = async (values, file) => {
        console.log(file);
        let uniqueID = crypto.randomBytes(20).toString("hex");
        let fileExtension = file.type.split("/")[1];
        let filename = `${uniqueID}.${fileExtension}`;
        let storageRef = firebase.storage().ref();
        let imagesRef = storageRef.child(`${filename}`);
        var metadata = {
            contentType: "image/jpeg"
        };
        await imagesRef
            .put(file.originFileObj, metadata)
            .then(function(snapshot) {
                console.log("Uploaded a blob or file!");
            })
            .catch(e => {
                console.log(e);
                console.log("Error! Storage");
            });

        const imageURL = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${filename}?alt=media`;

        await firebase
            .database()
            .ref("posts")
            .push({ ...values, author: firebase.auth().currentUser.email, authorId: firebase.auth().currentUser.uid, date: new Date().toISOString(), imageURL: imageURL });
    };

    return {
        posts,
        user,
        register,
        login,
        signout,
        post,
        deletePost
    };
}

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useFirebase().
export function ProvideFirebase({ children }) {
    const firebaseHook = useProvideFirebase();
    return <firebaseContext.Provider value={firebaseHook}>{children}</firebaseContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useFirebase = () => {
    return React.useContext(firebaseContext);
};
