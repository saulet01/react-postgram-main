import React from "react";
import styled from "styled-components";
import { Card, Row, Col, Button, message } from "antd";
import moment from "moment";
import { useFirebase } from "../firebase/useFirebase";

const MyCard = styled(Card)`
    margin-top: 50px;
    width: 800px;
`;

function SinglePost({ post }) {
    const { deletePost } = useFirebase();

    const handleDelete = async post => {
        try {
            await deletePost(post.id);
            message.success("Your post succesfully deleted!");
        } catch (error) {
            console.log(error);
            message.error(error);
        }
    };

    return (
        <MyCard
            title={post.title}
            extra={
                <Button type="primary" onClick={() => handleDelete(post)} danger>
                    Delete
                </Button>
            }
        >
            <Row>
                <Col>
                    <img style={{ width: 100 }} src={post.imageURL} alt="Logo" />
                </Col>
                <Col style={{ marginLeft: 20 }}>
                    <div>
                        <span style={{ fontWeight: "bold" }}>Date: </span>
                        {moment(post.date).format("DD/MM/YYYY ")}
                    </div>
                    <div>
                        <span style={{ fontWeight: "bold" }}>Text: </span>
                        {post.content}
                    </div>
                </Col>
            </Row>
        </MyCard>
    );
}

export default SinglePost;
