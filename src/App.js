import React from "react";
import { ProvideFirebase } from "./firebase/useFirebase";
import { Router } from "@reach/router";
import MainPage from "./posts/MainPage";
import Login from "./auth/Login";
import Register from "./auth/Register";
import "./App.css";
import "antd/dist/antd.css";
import AuthorPosts from "./posts/AuthorPosts";

function App() {
    return (
        <ProvideFirebase>
            <Router>
                <MainPage path="/" />
                <Login path="/login" />
                <Register path="/register" />
                <AuthorPosts path="/posts/:userId" />
            </Router>
        </ProvideFirebase>
    );
}

export default App;
