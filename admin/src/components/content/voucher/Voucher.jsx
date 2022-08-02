import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Input,
  Modal,
  Form,
  Select,
  DatePicker,
} from "antd";
//import moment from "moment";
import ApiVoucher from "../../../api/apiVoucher";
import { v4 as uuidv4 } from "uuid";
import FromEditVoucher from "./FromEditVoucher";

const { Option } = Select;
const { RangePicker } = DatePicker;

const Slide = () => {
  const [form] = Form.useForm();
  const [listVoucher, setListVoucher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [dataEdit, setDataEdit] = useState(null);

  useEffect(() => {
    fetchVoucher();
  }, [status, showModalEdit]);

  const fetchVoucher = async () => {
    const newData2 = await ApiVoucher.getAllVoucher();
    setListVoucher(newData2);
  };

  // const disabledDate = (current) => {
  //   return current && current < moment().endOf("day");
  // };

  const columns = [
    {
      title: "Id Voucher",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Mã Voucher",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên Voucher",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng voucher",
      dataIndex: "useNumber",
      key: "useNumber",
    },
    {
      title: "Tiêu đề",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Sale",
      dataIndex: "sale",
      key: "sale",
    },
    {
      title: "Điều kiện Voucher",
      dataIndex: "proviso",
      key: "proviso",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "dateStart",
      key: "dateStart",
    },
    {
      title: "ngày kết thúc",
      dataIndex: "dateEnd",
      key: "dateEnd",
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (text, record) => (
        <div className="tableUser__button">
          <Button type="primary" onClick={() => ShowFromEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Bạn có muốn xóa người dùng này không?"
            onConfirm={() => deleteVoucher(record.id)}
            onCancel={handleCancelButton}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleCancelButton = () => {};

  const handleCancel = () => {
    setShowModal(false);
    form.resetFields();
  };

  const deleteVoucher = (id) => {
    ApiVoucher.deleteVoucher(id);
    setStatus(!status);
    fetchVoucher();
  };

  const addVoucher = () => {
    setShowModal(true);
  };

  const onFinish = (value) => {
    const date1 = new Date(value.dateStart[0]._d);
    const c =
      date1.getFullYear().toString() +
      "/" +
      ((date1.getMonth() + 1) < 10 ? '0' + (date1.getMonth() + 1): (date1.getMonth() + 1)).toString() +
      "/" +
      (date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate()).toString();
    const date2 = new Date(value.dateStart[1]._d);
    const a =
      date2.getFullYear().toString() +
      "/" +
      ((date2.getMonth() + 1) < 10 ? '0' + (date2.getMonth() + 1): (date2.getMonth() + 1)).toString() +
      "/" +
      (date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate()).toString();
    const newValue = {
      ...value,
      code: uuidv4(),
      listUserAddCode: [],
      dateStart: c,
      dateEnd: a,
    };
    // console.log(newValue);
    ApiVoucher.addVoucher(newValue);
    setStatus(!status);
    handleCancel();
    fetchVoucher()
  };

  const ShowFromEdit = (value) => {
    setDataEdit(value);
    setShowModalEdit(true);
  };

  const statusFromEdit = (value) => {
    setShowModalEdit(value);
    setStatus(!status);
  };

  return (
    <div className="table__slide">
      <Button
        type="primary"
        onClick={addVoucher}
        style={{ marginBottom: "20px" }}
      >
        Add voucher
      </Button>
      {listVoucher && (
        <Table dataSource={listVoucher} columns={columns} rowKey="id" />
      )}
      <Modal
        className="form__add2"
        visible={showModal}
        title="Chỉnh sửa sản phẩm"
        onCancel={handleCancel}
      >
        <Form
          name="addVoucher"
          form={form}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <label>Tên voucher:</label>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your number sale of product!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <label>Tiêu đề:</label>
          <Form.Item
            name="content"
            rules={[
              {
                required: true,
                message: "Please input your number sale of product!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <label>Sale:</label>
          <Form.Item
            name="sale"
            rules={[
              {
                required: true,
                message: "Please input your number sale of product!",
              },
            ]}
          >
            <Input type="number" min="1" max="90" />
          </Form.Item>
          <label>Số lượng voucher:</label>
          <Form.Item
            name="useNumber"
            rules={[
              {
                required: true,
                message: "Please input your number sale of product!",
              },
            ]}
          >
            <Input type="number" min="1" />
          </Form.Item>
          <label>Điều kiện:</label>
          <Form.Item
            name="proviso"
            rules={[{ required: true, message: "Please input your type!" }]}
          >
            <Select placeholder="Chọn kiểu máy" allowClear name="proviso">
              <Option value="silver">Hạng bạc</Option>
              <Option value="gold">Hạng vàng</Option>
              <Option value="diamond">Hạng kim cương</Option>
              <Option value="all">Tất cả mọi người</Option>
              <Option value="single">Một người</Option>
            </Select>
          </Form.Item>
          <label>Thời hạn:</label>
          <Form.Item
            name="dateStart"
            rules={[{ required: true, message: "Please input your type!" }]}
          >
            {/* <RangePicker disabledDate={disabledDate} /> */}
            <RangePicker />
          </Form.Item>
          <Form.Item className="groupButton">
            <Button
              className="btnSubmit"
              type="primary"
              danger
              onClick={handleCancel}
            >
              Huỷ
            </Button>
            <Button className="btnSubmit" type="primary" htmlType="submit">
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {showModalEdit && (
        <FromEditVoucher dataEdit={dataEdit} statusFromEdit={statusFromEdit} />
      )}
    </div>
  );
};

export default Slide;
