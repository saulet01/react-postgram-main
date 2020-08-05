import React, { Fragment } from "react";
import { useFirebase } from "../firebase/useFirebase";
import SinglePost from "./SinglePost";

function AuthorPosts(props) {
    const { posts } = useFirebase();

    const authorPosts = posts.filter(d => d.authorId === props.userId);

    return <Fragment>{authorPosts && authorPosts.map((post, index) => <SinglePost key={index} post={post} />)}</Fragment>;
}

export default AuthorPosts;
