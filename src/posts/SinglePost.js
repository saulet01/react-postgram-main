import React from "react";
import styled from "styled-components";
import { Card } from "antd";

const MyCard = styled(Card)`
  margin-top: 50px;
  width: 800px;
`;

function SinglePost({ post }) {
  return <MyCard title={post.title}>{post.content}</MyCard>;
}

export default SinglePost;
