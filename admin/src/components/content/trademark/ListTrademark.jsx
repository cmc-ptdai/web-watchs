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
import {
  getTradeMark,
  addTradeMark,
  deleteTradeMark,
} from "../../../redux/action/trademarkAction";
import ModalEdit from "./EditTrademark";
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
  const [statusAdd, setStatusAdd] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const [imgChange, setImgChange] = useState(null);

  useEffect(() => {
    dispatch(getTradeMark());
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      width: 100,
      render: (text, record) => (
        <div className="tableUser__button">
          <Button type="primary" onClick={() => ShowFromEdit(record)}>
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

  const addTrademark = () => {
    setStatusAdd(true);
  };

  const deleteTrademark = (id) => {
    dispatch(deleteTradeMark(id))
    openNotification("Bạn đã xoá thương hiệu thành công");
  };

  const handleCancelButton = () => {};

  const ShowFromEdit = (value) => {
    setDataEdit(value);
    setStatusEdit(true);
  };

  const setStatusEditByModal = (a) => {
    setStatusEdit(a);
  };

  const changeEditImgAdd = (e) => {
    setImgChange(e.target.value);
  };

  const onFinish = (value) => {
    const newValue = {
      type: value.name.toLowerCase().replace(/\s/g, ""),
      img: value.img,
      name: value.name,
    };
    dispatch(addTradeMark(newValue));
    handleCancelModalAdd();
  };

  const handleCancelModalAdd = () => {
    handleCancelForm();
  };

  const handleCancelForm = () => {
    setImgChange(null);
    setStatusAdd(false);
    form.resetFields();
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
      {statusEdit && (
        <ModalEdit
          dataEdit={dataEdit}
          setStatusEditByModal={setStatusEditByModal}
        ></ModalEdit>
      )}
      {
        <Modal
          className="form__add"
          visible={statusAdd}
          title="Chỉnh sửa sản phẩm"
          onCancel={handleCancelModalAdd}
        >
          <Form name="basic" form={form} onFinish={onFinish}>
            <label>Tên thương hiệu:</label>
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

            <label>Ảnh thương hiệu:</label>
            <Form.Item
              name="img"
              rules={[
                { required: true, message: "Please input your link image!" },
              ]}
            >
              <Input onChange={changeEditImgAdd} />
            </Form.Item>

            {imgChange && (
              <div className="form__edit__img">
                <img
                  style={{ width: "200px", height: "100px" }}
                  src={imgChange ? imgChange : " "}
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
        </Modal>
      }
    </>
  );
};

export default ListPosts;
