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
import moment from "moment";
import ApiVoucher from "../../../api/apiVoucher";
import { v4 as uuidv4 } from "uuid";

const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

const Slide = () => {
  const [form] = Form.useForm();
  const [listVoucher, setListVoucher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [dataEdit, setDataEdit] = useState(null);

  useEffect(() => {
    fetchSlide();
  }, [status]);

  const fetchSlide = async () => {
    const newData2 = await ApiVoucher.getAllVoucher();
    setListVoucher(newData2);
  };

  const disabledDate = (current) => {
    return current && current < moment().endOf("day");
  };

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
    setShowModalEdit(false);
    form.resetFields();
  };

  const deleteVoucher = (id) => {
    ApiVoucher.deleteVoucher(id);
    setStatus(!status);
  };

  const addSlide = () => {
    setShowModal(true);
  };

  const onFinish = (value) => {
    const newValue = {
      ...value,
      code: uuidv4(),
      listUserAddCode: [],
      dateStart: value.dateStart[0]._d,
      dateEnd: value.dateStart[1]._d,
    };
    ApiVoucher.addVoucher(newValue);
    setStatus(!status);
    handleCancel();
  };

  const ShowFromEdit = (value) => {
    setDataEdit(value);
    setShowModalEdit(true);
  };

  const onFinishEdit = (value) => {
    const newValue = {
      ...value,
      id: dataEdit.id,
      code: dataEdit.code,
      listUserAddCode: dataEdit.listUserAddCode,
      dateStart: value.dateStart[0]._d,
      dateEnd: value.dateStart[1]._d,
    };
    console.log(newValue);
    ApiVoucher.editVoucher(newValue.id, newValue)
    setStatus(!status);
    setDataEdit(null);
    handleCancel();
  }

  return (
    <div className="table__slide">
      <Button
        type="primary"
        onClick={addSlide}
        style={{ marginBottom: "20px" }}
      >
        Add voucher
      </Button>
      {listVoucher && (
        <Table dataSource={listVoucher} columns={columns} rowKey="id" />
      )}
      <Modal
        className="form__add"
        visible={showModal}
        title="Chỉnh sửa sản phẩm"
        onCancel={handleCancel}
      >
        <Form
          name="basic"
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
            <RangePicker disabledDate={disabledDate} />
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

      <Modal
        className="form__add"
        visible={showModalEdit}
        title="Chỉnh sửa sản phẩm"
        onCancel={handleCancel}
      >
        {dataEdit && (
          <Form
            name="basic"
            form={form}
            initialValues={{
              name: dataEdit.name,
              sale: dataEdit.sale,
              proviso: dataEdit.proviso,
              dateStart: [moment(dataEdit.dateStart, dateFormat), moment(dataEdit.dateEnd, dateFormat)]
            }}
            onFinish={onFinishEdit}
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
              <RangePicker disabledDate={disabledDate}
              />
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
        )}
      </Modal>
    </div>
  );
};

export default Slide;
