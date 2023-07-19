"use client";

import Image from "next/image";
import LeftArrowIcon from "../images/LeftArrowIcon.svg";
import EmailIcon from "../images/EmailIcon.svg";
import FileUploadIcon from "../images/fileUploadIcon.svg";
import MarkIcon from "../images/MarkIcon.svg";
import {
  Button,
  Divider,
  Input,
  Modal,
  Spin,
  Typography,
  Upload,
  message,
  Form,
} from "antd";
import { useState } from "react";

const { Title, Text } = Typography;
const { Dragger } = Upload;

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [dataFile, setdataFile] = useState("");
  const [dataEntries, setDataEntries] = useState(0);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  // handle the "go to my entries" button of modal
  const handleOk = (e) => {
    setOpen(false);
  };

  // handle the "cancel" button of modal
  const handleCancel = (e) => {
    setOpen(false);
  };

  // check if the file type is json or not
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "application/json";
    if (!isJpgOrPng) {
      message.error("You can only upload Json file!");
    }
    return isJpgOrPng;
  };

  // handle the input change of file change
  const handleChange = (info) => {
    const { status, originFileObj } = info.file;

    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (status === "done") {
      // Read the file data here
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = e.target.result;
        setdataFile(fileData);
      };
      reader.readAsText(originFileObj);
      setLoading(false);
    } else if (status === "error") {
      // File upload failed
      message.error("File upload failed");
      setLoading(false);
    }
  };

  // handle submit button
  const handleSubmit = () => {
    let dataLength = 0;
    // calculate data entries
    if (dataFile) {
      const data = JSON.parse(dataFile);
      Object.keys(data).map(
        (keyName, keyIndex) => (dataLength += data[keyName].length)
      );
      setDataEntries(dataLength);
      setOpen(true);
    }
  };

  return (
    <div className="bg-[#443C3C]">
      <div className="max-w-sm mx-h-screen m-auto bg-white">
        {/* Form */}
        <Form form={form} layout="vertical">
          <div className="px-5">
            <div className="flex gap-5 items-center">
              <Image src={LeftArrowIcon} alt="left arrow icon" />
              <Title level={4} style={{ margin: 0 }}>
                Submit form
              </Title>
            </div>
            <Form.Item label="Full Name" className="mt-4">
              <Input
                size="large"
                placeholder="Full Name"
                bordered={false}
                className="bg-[#FAFAFA]"
              />
            </Form.Item>
            <Form.Item label="Email">
              <Input
                size="large"
                placeholder="Email"
                bordered={false}
                className="bg-[#FAFAFA]"
                suffix={<Image src={EmailIcon} alt="email icon" />}
              />
            </Form.Item>
            <Form.Item label="Upload JSON File">
              <Dragger
                name="file uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                className="rounded-2xl h-28 bg-[#FAFAFA]"
              >
                <div className="flex items-center flex-col">
                  {loading ? (
                    <>
                      <Spin size="large" />
                      <Text className="text-[#4381FF]">Validating</Text>
                    </>
                  ) : (
                    <>
                      <Image src={FileUploadIcon} alt="file upload icon" />
                      <p className="ant-upload-hint">Browse File</p>
                    </>
                  )}
                </div>
              </Dragger>
            </Form.Item>
            <Form.Item label="File Contents">
              <pre className="overflow-auto bg-[#FAFAFA] h-36">{dataFile}</pre>
            </Form.Item>
          </div>
          <Divider className="m-0" />
          <div className="px-5 py-5">
            <Button
              className="rounded-3xl bg-[#3062C8] py-3 h-12 text-white"
              block
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </Form>
        <Modal
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button
              key="submit"
              onClick={handleCancel}
              className="bg-[#3062C8] rounded-3xl w-full my-4 text-white"
            >
              Go to My Entries
            </Button>,
            <Button
              key="back"
              type="primary"
              onClick={handleOk}
              className="bg-[#E9F0FF] text-[#4381FF] rounded-3xl w-full"
              style={{ margin: 0 }}
            >
              cancel
            </Button>,
          ]}
          closeIcon={false}
          width={300}
        >
          <div className="text-center items-center">
            <Image src={MarkIcon} className="m-auto" alt="Mark icon" />
            <Text className="text-[#4381FF]">Success</Text>
            <div className="my-4">
              <Text>{`${dataEntries} entries successfully uploaded`}</Text>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
