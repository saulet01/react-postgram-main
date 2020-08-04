import React from "react";
import styled from "styled-components";
import { Form, Input, Button, Layout, PageHeader, message, Space, DatePicker } from "antd";
import { useFirebase } from "../firebase/useFirebase";

const MainLayout = styled(Layout)`
    width: 100vw;
    height: 100vh;
    align-items: center;
`;

const Header = styled(PageHeader)`
    width: 1000px;
`;

const MyForm = styled(Form)`
    width: 1000px;
`;

function CreatePost({ onCancelClick }) {
    const { post } = useFirebase();

    const onFormFinish = async values => {
        console.log("got some values", { ...values, date: new Date().toISOString() });
        await post({ ...values, date: new Date().toISOString() });
        message.success("Saved your post!");
        onCancelClick();
    };

    return (
        <MainLayout>
            <Header title="Create Post" />
            <MyForm onFinish={onFormFinish} layout="vertical">
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: "Please input title for the post"
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="content" label="Content">
                    <Input.TextArea />
                </Form.Item>

                <Form.Item name="imageURL" label="Image URL">
                    <Input.TextArea />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Post
                        </Button>
                        <Button onClick={onCancelClick}>Cancel</Button>
                    </Space>
                </Form.Item>
            </MyForm>
        </MainLayout>
    );
}

export default CreatePost;
