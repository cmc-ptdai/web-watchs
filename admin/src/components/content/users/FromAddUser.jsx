import React from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import userApi from '../../../api/apiUser'
import { addUser, getUser  } from '../../../redux/action/userAction';

const { Option } = Select;

const FromEdit = (props) => {

  const dataUser = useSelector(store => store.userReducer)
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const onFinish = (value) => {
    dispatch(addUser(value))
    setTimeout( async () => {
      try {
        const listUser = await userApi.getAllUser()
        dispatch(getUser(listUser))
      } catch (error) {
        console.log(error);
      }
    }, 500);
    handleCancel()
  }
  const handleCancel =  () => {
    props.editStatusFromAdd(false)
    form.resetFields();
  }

  return (
    <div>
      <Modal
        visible={true}
        title="Điền thông tin"
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          form={form}
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
        >
          <label>Họ tên:</label>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your username!' },
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

          <label>Tên đăng nhập:</label>
          <Form.Item
            name="userName"
            rules={[{ required: true, message: 'Please input your username!' },
              ({ getFieldValue }) => ({
                validator(rule, value = "") {
                  const user = dataUser.filter(item => item.userName.toLowerCase() === value.toLowerCase())
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

          <label>Mật khẩu:</label>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your username!' },
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
            <Input.Password />
          </Form.Item>

          <label>Role:</label>
          <Form.Item
            name="role"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Select
              placeholder="Select a option and change input text above"
              allowClear
            >
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <label>Ảnh:</label>
          <Form.Item
            name="img"
          >
            <Input />
          </Form.Item>

          <label>Giới tính:</label>
          <Form.Item
            name="gender"
          >
            <Select
              placeholder="Select a option and change input text above"
              allowClear
            >
              <Option value="nam">Nam</Option>
              <Option value="nu">Nữ</Option>
              <Option value="khac">Khác</Option>
            </Select>
          </Form.Item>
          <label>Số điện thoại:</label>
          <Form.Item
            name="phone"
            rules={[
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
          <label>Email:</label>
          <Form.Item
            name="email"
            rules={[
              ({ getFieldValue }) => ({
                validator(rule, value = "") {
                  //eslint-disable-next-line
                  const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                  if (!re.test(value)) {
                    return Promise.reject("email chưa đúng đinh dạng email @,com,gmail,.....");
                  } else {
                    return Promise.resolve();
                  }
                }
              })
            ]}
          >
            <Input />
          </Form.Item>
          <label>Địa chỉ:</label>
          <Form.Item
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
            <Input />
          </Form.Item>
            <Form.Item  className="groupButton">
              <Button className="btnSubmit" type="primary" danger onClick={handleCancel}>
                Huỷ
              </Button>
              <Button className="btnSubmit" type="primary" htmlType="submit" >
                Thêm
              </Button>
            </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default FromEdit;
