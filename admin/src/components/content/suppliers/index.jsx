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
  getSuppliers,
  addSuppliers,
  deleteSuppliers
} from '../../../redux/action/suppliersAction'
import ModalEdit from "./EditSuppliers";
import { useHistory } from "react-router-dom";

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
  const history = useHistory()
  const dispatch = useDispatch();
  const listSuppliers = useSelector((store) => store.suppliersReducer);
  const [statusEdit, setStatusEdit] = useState(false);
  const [statusAdd, setStatusAdd] = useState(false);
  const [dataEdit, setDataEdit] = useState({});

  useEffect(() => {
    dispatch(getSuppliers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: "Id nhà cung cấp",
      dataIndex: "id",
      key: "id",
      width: 150
    },
    {
      title: "Tên nhà cùng cấp",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Số điện thoại NCC",
      dataIndex: "phone",
      key: "phone"
    },
    {
      title: "Địa chỉ nhà cùng cấp",
      dataIndex: "address",
      key: "address"
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (text, record) => (
        <div className="tableUser__button" style={{display: 'flex'}}>
          <div><Button type="primary" onClick={() => ShowFromEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Bạn có muốn xóa người dùng này không?"
            onConfirm={() => deleteTrademark(record.id)}
            onCancel={handleCancelButton}
          >
            <Button danger>Delete</Button>
          </Popconfirm></div>
          <Button type="primary" style={{marginTop: '20px'}} onClick={() => ShowProductSuppliers(record)}>
            Show
          </Button>
        </div>
      ),
    },
  ];

  const addTrademark = () => {
    setStatusAdd(true);
  };

  const deleteTrademark = (id) => {
    dispatch(deleteSuppliers(id))
    openNotification("Bạn đã xoá nhà cung cấp thành công");
  };

  const handleCancelButton = () => {};

  const ShowFromEdit = (value) => {
    setDataEdit(value);
    setStatusEdit(true);
  };

  const setStatusEditByModal = (a) => {
    setStatusEdit(a);
  };

  const onFinish = (value) => {
    dispatch(addSuppliers(value));
    handleCancelModalAdd();
  };

  const handleCancelModalAdd = () => {
    handleCancelForm();
  };

  const handleCancelForm = () => {
    setStatusAdd(false);
    form.resetFields();
  };

  const ShowProductSuppliers = (value) => {
    return history.push({
      pathname: `/body/suppliers/${value.id}`,
    });
  }

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
          Thêm nhà cung cấp
        </Button>
      </div>
      {listSuppliers && (
        <Table dataSource={listSuppliers} columns={columns} rowKey="id" />
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
            <label>Tên nhà cung cấp:</label>
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name supplies!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <label>Số điện thoại nhà cung cấp:</label>
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: 'Please input your phone!' },
                ({ getFieldValue }) => ({
                  validator(rule, value = '') {
                    const re = /((09|03|07|08|05)+([0-9]{8})\b)/g;
                    if (!re.test(value)) {
                      return Promise.reject('chưa đúng định dạng số điện thoại');
                    } else {
                      return Promise.resolve();
                    }
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>
            <label>Địa chỉ nhà cung cấp:</label>
            <Form.Item
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please input your address supplies!",
                },
              ]}
            >
              <Input />
            </Form.Item>
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
