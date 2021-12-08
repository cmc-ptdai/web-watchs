import React, {useEffect, useState} from 'react'
import { useDispatch } from 'react-redux'
import { Form, Input, Button, Select, notification } from 'antd';
import {Link, useHistory } from "react-router-dom"
import './style.scss'
import userApi from '../../api/userApi'
import { addUser as addUserAction } from '../../redux/actions/userAction'

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};

const { Option } = Select;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const openNotification = () => {
  notification.open({
    message: '',
    description:<span style={{display: 'block', height: '60px' , fontSize: '15px'}}>Bạn đã tạo tài khoản thành công</span>,
    icon: <i className="fab fa-optin-monster" style={{fontSize: '50px', color: '#fe9705'}}></i>,
  });
};

const SingUp = () => {

  const history = useHistory();
  const [form] = Form.useForm();

  const [listUser, setListUser] = useState([])

  const dispatch = useDispatch()

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    const listUser = await userApi.getUser()
    setListUser(listUser)
  }

  const onFinish = (values) => {
    dispatch(addUserAction(values))
    openNotification()
    form.resetFields();
    setTimeout(() => {
      history.push('/login')
    }, 200);
  };

  return (
    <div className="singUp">
      <Form
        form={form}
        name="singUp"
        {...layout}
        onFinish={onFinish}
      >
         <Form.Item
          label="Họ Tên"
          name="name"
          rules={[{ required: true, message: 'Please input your full name!' },
              ({ getFieldValue }) => ({
                validator(rule, value = "") {
                  if (value.length > 25) {
                    return Promise.reject("Tối đa 25 kí tự");
                  } else {
                    return Promise.resolve();
                  }
                }
              })
            ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: 'Please input your gender!' }]}
        >
          <Select
            placeholder="Select a option and change gender"
            allowClear
          >
            <Option value="nam">Nam</Option>
            <Option value="nu">Nữ</Option>
            <Option value="khac">Khác</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Please input your address!' },
            ({ getFieldValue }) => ({
              validator(rule, value = "") {
                if (value.length > 200) {
                  return Promise.reject("tối đa 200 kí tự");
                } else {
                  return Promise.resolve();
                }
              }
            })
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: 'Please input your phone!' },
            ({ getFieldValue }) => ({
              validator(rule, value = "") {
                const re = /((09|03|07|08|05)+([0-9]{8})\b)/g;
                if (!re.test(value)) {
                  return Promise.reject("chưa đúng định dạng số điện thoại");
                } else {
                  return Promise.resolve();
                }
              }
            })
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Username"
          name="userName"
          rules={[{ required: true, message: 'Please input your username!' },
            ({ getFieldValue }) => ({
              validator(rule, value = "") {
                const user = listUser.filter(item => item.userName.toLowerCase() === value.toLowerCase())
                if (user.length > 0) {
                  return Promise.reject("tên đăng nhập đã tồn tại hoặc không hợp lệ");
                } else {
                  return Promise.resolve();
                }
              }
            })
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
            ({ getFieldValue }) => ({
              validator(rule, value = "") {
                if (value.length > 6) {
                  return Promise.resolve();
                }
                return Promise.reject("Mật khẩu phải nhiều hơn 6 kid tự");
              }
            })
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="Confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Link to="/login" >
            <Button type="primary">
              Quay lại trang đăng nhập
            </Button>
          </Link>
          <Button type="primary" danger htmlType="submit">
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default SingUp;
