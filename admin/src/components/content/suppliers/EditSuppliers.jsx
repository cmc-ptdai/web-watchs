import React from "react";
import {
  Button,
  Modal,
  Form,
  Input,
} from "antd";
import { useDispatch } from 'react-redux'
import { editSuppliers } from '../../../redux/action/suppliersAction'

const EditTrademark = ({ dataEdit, setStatusEditByModal }) => {

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = (value) => {
    const newData = {
      ...value,
      id: dataEdit.id
    }
    dispatch(editSuppliers(newData));
    handleCancelModal()
  }
  const handleCancelForm = () => {
    setStatusEditByModal(false)
    form.resetFields();
  };

  const handleCancelModal = () => {
    handleCancelForm()
  };
  return (
    <>
      <Modal
        className="form__add"
        visible={true}
        title="Chỉnh sửa sản phẩm"
        onCancel={handleCancelModal}
      >
        {dataEdit && (
          <Form
            name="basic"
            form={form}
            initialValues={{ name: dataEdit.name, address: dataEdit.address,  phone: dataEdit.phone}}
            onFinish={onFinish}
          >
            <label>Tên nhà cung cấp :</label>
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
                { required: true, message: "Please input your address!" },
              ]}
            >
              <Input/>
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
        )}
      </Modal>
    </>
  );
};

export default EditTrademark;
