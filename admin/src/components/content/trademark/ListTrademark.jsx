import React, { useEffect, useState } from "react";
import {
  Button,
  notification,
  Popconfirm,
  Table,
  Modal,
  Form,
  Input,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getTradeMark } from "../../../redux/action/trademarkAction";
import "./style.scss";

const openNotification = (item) => {
  notification.open({
    message: "",
    description: <p style={{ marginLeft: "10px" }}>{item}</p>,
    icon: (
      <i
        className="fab fa-optin-monster"
        style={{ fontSize: "40px", color: "#fe9705" }}
      ></i>
    ),
  });
};

const ListPosts = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const listTrademarks = useSelector((store) => store.trademarkReducer);
  const [statusEdit, setStatusEdit] = useState(false);
  const [dataEdit, setDataEdit] = useState(null);

  useEffect(() => {
    dispatch(getTradeMark());
  }, []);

  const columns = [
    {
      title: "Id Trademark",
      dataIndex: "id",
      key: "id",
      width: 180,
    },
    {
      title: "Trademark",
      dataIndex: "img",
      key: "img",
      width: 250,
      render: (text, record) => (
        <img style={{ width: "200px", height: "100px" }} src={text} alt="" />
      ),
    },
    {
      title: "Name Trademark",
      dataIndex: "name",
      key: "name",
      width: 100,
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (text, record) => (
        <div className="tableUser__button">
          <Button
            type="primary"
            onClick={() => ShowFromEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Bạn có muốn xóa người dùng này không?"
            onConfirm={() => deleteTrademark(record.id)}
            onCancel={handleCancelButton}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const addTrademark = () => {};

  const deleteTrademark = (id) => {
    console.log(id);
    openNotification("Bạn đã xoá thương hiệu thành công");
  };

  const handleCancelButton = () => {};

  const handleCancelModal = () => {
    setStatusEdit(false);
    form.resetFields();
    setDataEdit(null);
  };

  const ShowFromEdit = (value) => {
    setDataEdit(value);
    setStatusEdit(true);
  };

  const onFinish = (value) => {
    console.log(value);
  };

  const handleCancelForm = () => {
    setStatusEdit(false);
    form.resetFields();
    setDataEdit(null);
  };
  return (
    <>
      <div>
        <Button
          onClick={addTrademark}
          type="primary"
          style={{
            marginBottom: "20px",
            borderRadius: "10px",
          }}
        >
          Thêm thương hiệu
        </Button>
      </div>
      {listTrademarks && (
        <Table dataSource={listTrademarks} columns={columns} rowKey="id" />
      )}
      <Modal
        className="form__add"
        visible={statusEdit}
        title="Chỉnh sửa sản phẩm"
        onCancel={handleCancelModal}
      >
        {dataEdit && (
          <Form
            name="basic"
            form={form}
            initialValues={{
              name: dataEdit.name,
              img: dataEdit.img,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name trademark!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <label>Slide:</label>
            <Form.Item
              name="img"
              rules={[
                { required: true, message: "Please input your link image!" },
              ]}
            >
              <Input />
            </Form.Item>

            {dataEdit.img && (
              <div className="form__edit__img">
                <img
                  style={{ width: '200px', height: '100px' }}
                  src={dataEdit.img ? dataEdit.img : ""}
                  alt="link ảnh của bạn không đúng hoặc không tồn tại"
                />
              </div>
            )}
            <Form.Item className="groupButton">
              <Button
                className="btnSubmit"
                type="primary"
                danger
                onClick={handleCancelForm}
              >
                Huỷ
              </Button>
              <Button className="btnSubmit" type="primary" htmlType="submit">
                Thêm
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default ListPosts;
