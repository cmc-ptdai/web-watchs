import React, { useState } from 'react';
import './style.scss';
import { Button, Form, Input, Radio, Modal, DatePicker } from 'antd';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { editUser } from '../../redux/actions/userAction';

const dateFormat = 'YYYY/MM/DD';


const FormEditUser = ({ user, editStatus }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [value, setValue]= useState(null)
  const onFinish = (values) => {
    let newData = {
      ...values
    }
    if (value) {
      newData = {
        ...values,
        birthday: value._d
      }
    }
    dispatch(editUser(newData));
    editStatus(false);
    handleCancel();
  };

  const handleCancel = () => {
    editStatus(false);
    form.resetFields();
  };

  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };
  const FormatDate = () => {
    const date = new Date(user.birthday)
    const c = date.getFullYear().toString() + '/' + (date.getMonth() + 1).toString() + '/' + date.getDate().toString()
    return c
  }
  return (
    <>
      <div className="profile-form">
        <Modal visible={true} title="Điền thông tin" onCancel={handleCancel}>
          <Form
            name="basic2"
            form={form}
            initialValues={{
              phone: user.phone,
              email: user.email,
              name: user.name,
              address: user.address,
              gender: user.gender,
            }}
            onFinish={onFinish}
          >
            <p>Tên đăng nhập: {user.userName}</p>
            <label>Họ tên:</label>
            <Form.Item
              name="name"
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value = '') {
                    if (value.length > 25 || value.length < 10) {
                      return Promise.reject('Tối đa 25 kí tự');
                    } else {
                      return Promise.resolve();
                    }
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>
            <label>Số điện thoại:</label>
            <Form.Item
              name="phone"
              rules={[
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
            <label>Ngày sinh:</label>
            <div>
            <DatePicker
              defaultValue={moment(FormatDate(), dateFormat)}
              format={dateFormat}
              disabledDate={disabledDate}
              onChange={(val) => setValue(val)}
            />
            </div>
            <label>Email:</label>
            <Form.Item
              name="email"
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value = '') {
                    //eslint-disable-next-line
                    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                    if (!re.test(value)) {
                      return Promise.reject('email chưa đúng đinh dạng email @,com,gmail,.....');
                    } else {
                      return Promise.resolve();
                    }
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>
            <label>Địa chỉ:</label>
            <Form.Item
              name="address"
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value = '') {
                    if (value.length > 200 || value.length <= 0) {
                      return Promise.reject('tối đa 200 kí tự');
                    } else {
                      return Promise.resolve();
                    }
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>

            <label>Giới tính:</label>
            <Form.Item name="gender">
              <Radio.Group>
                <Radio value="nam">Nam</Radio>
                <Radio value="nư">Nữ</Radio>
                <Radio value="khac">Khác</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item className="groupButton">
              <Button className="btnSubmit" type="primary" danger onClick={handleCancel}>
                Huỷ
              </Button>
              <Button className="btnSubmit" type="primary" htmlType="submit">
                Chỉnh sửa
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default FormEditUser;
