import React from "react";
import { Button, Input, Modal, Form, Select, DatePicker } from "antd";
import moment from "moment";
import ApiVoucher from "../../../api/apiVoucher";

const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

const FromEditVoucher = ({dataEdit, statusFromEdit}) => {
  const [form] = Form.useForm();

  const onFinishEdit = (value) => {
    const newValue = {
      ...value,
      id: dataEdit.id,
      code: dataEdit.code,
      listUserAddCode: dataEdit.listUserAddCode,
      dateStart: value.dateStart[0]._d,
      dateEnd: value.dateStart[1]._d,
    };
    ApiVoucher.editVoucher(newValue.id, newValue);
    handleCancel();
  };

  const handleCancel = () => {
    form.resetFields();
    statusFromEdit(false)
  };
  const disabledDate = (current) => {
    return current && current < moment().endOf("day");
  };
  return (
    <>
      <Modal
        className="form__Edit"
        visible={true}
        title="Chỉnh sửa sản phẩm"
        onCancel={handleCancel}
      >
        {dataEdit && (
          <Form
            name="editVoucher"
            form={form}
            initialValues={{
              name: dataEdit.name,
              sale: dataEdit.sale,
              content: dataEdit.content,
              proviso: dataEdit.proviso,
              useNumber: dataEdit.useNumber,
              dateStart: [
                moment(dataEdit.dateStart, dateFormat),
                moment(dataEdit.dateEnd, dateFormat),
              ],
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
                Sửa
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default FromEditVoucher;