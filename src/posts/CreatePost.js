import React, { useState } from "react";
import styled from "styled-components";
import { Form, Input, Button, Layout, PageHeader, message, Space, Upload } from "antd";
import { useFirebase } from "../firebase/useFirebase";
import { UploadOutlined } from "@ant-design/icons";

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
    const [file, setFile] = useState(null);

    const props = {
        name: "file",
        action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
        headers: {
            authorization: "authorization-text"
        },
        onChange(info) {
            if (info.file.status === "done") {
                setFile(info.file);
                // message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === "error") {
                message.error(`${info.file.name} file upload failed.`);
            }
        }
    };

    const onFormFinish = async values => {
        if (file == null) {
            return message.error("Image is required! Please upload an image");
        }

        await post(values, file);
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

                <Form.Item
                    name="content"
                    label="Content"
                    rules={[
                        {
                            required: true,
                            message: "Please input content for the post"
                        }
                    ]}
                >
                    <Input.TextArea />
                </Form.Item>

                <Upload {...props}>
                    <Button>
                        <UploadOutlined /> Click to Upload
                    </Button>
                </Upload>

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
