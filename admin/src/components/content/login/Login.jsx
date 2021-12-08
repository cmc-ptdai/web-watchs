import React, { useState, useEffect } from 'react';
import { Button, Form, Input, notification } from 'antd';
import './login.scss'
import apiUser from '../../../api/apiUser'
import { useHistory } from "react-router-dom"

const openNotification = (item) => {
  notification.open({
    message: '',
    description:<span>bạn nhập sai tài khoản hoặc mật khẩu, hãy đăng nhập lại</span>,
    icon: <i className="fab fa-optin-monster" style={{fontSize: "40px", color: '#fe9705'}}></i>,
  });
};

const Login = () => {
  const history = useHistory()

  const [listUser, setListUser] = useState(null)

  useEffect(() => {
    fetchUser()
  },[])

  const fetchUser = async () => {
    const newList = await apiUser.getAllUser()
    setListUser(newList)
  }

  const createCookie = (name, value, m) => {
    let now = new Date()
    // date now.setTime(now.getTime() + m * 24 * 60 * 60 * 100)
    now.setTime(now.getTime() + m * 60 * 1000)

    document.cookie = name  + '=' + value + ';expires=' + now.toUTCString()
  }


  const onFinish = (values) => {
    const user = listUser.filter(item => item.userName === values.username && item.password === values.password && item.role === "admin")
    if (user.length > 0) {
      createCookie('idUserName', user[0].id, 1000)
      setTimeout(() => {
        return history.replace({ pathname: '/body' })
      }, 500);
    } else {
      openNotification()
    }
  };
  return (
    <div className="login-admin">
      <div className="login-admin-content">
        <div className="login-admin-content-title">
          <h1>Login Now</h1>
        </div>
        <div className="login-admin-content-form">
        <Form
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              placeholder= "Username *"
              style={{height: "45px",backgroundColor:"rgba(255, 255, 255, 0.7)"}}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              placeholder="Password *"
            />
          </Form.Item>

          {/* <p>Forgot Password? Click here </p> */}
          <Form.Item>
            <Button className="Button-submit" type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        </div>
      </div>
    </div>
  )
}

export default Login;
