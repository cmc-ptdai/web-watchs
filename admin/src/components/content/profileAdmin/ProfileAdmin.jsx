import React , { useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Input, Radio, Modal, notification } from 'antd';
import { useHistory } from "react-router-dom"
import { useDispatch } from 'react-redux';
import apiUser from '../../../api/apiUser'
import { getAccount } from '../../../redux/action/accLoginAction'
import './style.scss'


const openNotification = (number) => {
  notification.info({
    message: '',
    description: `Mật Khẩu cũ của bạn không hợp lệ`,
  });
};

const openNotificationSuccess = (text) => {
  notification.info({
    message: '',
    description: `Bạn đã đổi ${text} thành công`,
  });
};
const ProfileAdmin = () => {

  const history = useHistory();
  const dispatch = useDispatch()
  const [form] = Form.useForm();
  const user = useSelector(store => store.accLoginReducer)
  const [imgInput, setImgInput] = useState('')
  const [visible, setVisible] = useState(false)
  const [showButtonChange, setShowButtonChange]= useState(false)
  const [showChangePassword, setShowChangePassword]= useState(false)

  useEffect(() => {
    fetchDataUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const fetchDataUser = async () => {
    const id = getCookie('idUserName')
    const fetchUser = await apiUser.getUserById(id)
    setImgInput(fetchUser.img)
    dispatch(getAccount(fetchUser))
  }

  const getCookie = (cname) => {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        if (ca[i].indexOf(name) === 0) {
          return ca[i].substring(name.length, ca[i].length);
        }
    }
  }

  const ShowChangePwd = () => {
    setShowChangePassword(true)
  }

  const handleCancelPassword = () => {
    setShowChangePassword(false)
    form.resetFields();
  }

  const onFinishChangePassword = (value) => {
    if (user.password !== value.passwordOld) {
      openNotification(4)
    } else {
      openNotificationSuccess('mật khẩu')
      const newUser = {
        ...user,
        password: value.passwordNew
      }
      apiUser.editUser(newUser.id, newUser)
      setTimeout(() => {
        history.push('/')
      handleCancelPassword()
      }, 500);
    }
  }

  const ShowForm = () => {
    setVisible(true)
  }

  const handleCancel =  () => {
    setVisible(false)
    form.resetFields();
  }

  const onFinish = (values) => {
    const newDataUsers = {
      ...user,
      name: values.name,
      phone: values.phone,
      email: values.email,
      address: values.address,
      gender: values.gender,
    }
    apiUser.editUser(newDataUsers.id, newDataUsers)
    setTimeout(() => {
      openNotificationSuccess('ảnh')
      fetchDataUser()
    }, 200);
    handleCancel()
  }

  const inputFile = async (e) => {
    const file = e.target.files[0]
    const fileBase64 = await converterBase64(file)
    setImgInput(fileBase64);
    setShowButtonChange(true);
  }
  const converterBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result)
      };

      fileReader.onerror = (err) => {
        reject(err);
      };
    });
  };

  const handleSubmitImg = () => {
    const newUser = {
      ...user,
      img: imgInput
    }
    apiUser.editUser(newUser.id, newUser)
    setTimeout(() => {
      fetchDataUser()
    }, 500);
    setShowButtonChange(false)
    handleCancel()
  }

  const handleCancelImg = () => {
    setImgInput(user.img)
    setShowButtonChange(false)
  }
  return (
    <>
      <div className="profile-title">
        <div className="profile-title-text">
          <h3>Hồ Sơ Của Tôi</h3>
          <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
        </div>
        <div className="profile-title-changePassword">
          <Button type="primary" onClick={ShowChangePwd}>thay đổi mật khẩu</Button>
          <Modal
              visible={showChangePassword}
              title="Điền thông tin"
              onCancel={handleCancelPassword}
            >
              <Form
                name="basic"
                form={form}
                onFinish={onFinishChangePassword}
              >
                <label>Mật Khẩu cũ:</label>
                <Form.Item
                  name="passwordOld"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password!',
                    },
                  ]}
                >
                  <Input.Password/>
                </Form.Item>

                <label>Mật Khẩu mới:</label>
                <Form.Item
                  name="passwordNew"
                  rules={[
                    {
                      required: true
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

                <label>Nhập lại Mật khẩu:</label>
                <Form.Item
                  name="Confirm"
                  dependencies={['passwordNew']}
                  hasFeedback
                  rules={[
                    {
                      required: true
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('passwordNew') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Mật khẩu không khớp!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item  className="groupButton">
                  <Button className="btnSubmit" type="primary" danger onClick={handleCancelPassword}>
                    Huỷ
                  </Button>
                  <Button className="btnSubmit" type="primary" htmlType="submit" >
                    Chỉnh sửa
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
        </div>
      </div>
      <div className="profile-content row">
        <div className="col-7">
          <div className="profile-info">
            <div className="profile-info-item">
              <span>Tên đăng nhập:</span> {user.userName}
            </div>
            <div className="profile-info-item">
              <span>Họ tên:</span> {user.name}
            </div>
            <div className="profile-info-item">
              <span>Số điện thoại:</span> {user.phone}
            </div>
            <div className="profile-info-item">
              <span>Địa chỉ e-mail:</span> {user.email}
            </div>
            <div className="profile-info-item">
              <span>Địa chỉ:</span> {user.address}
            </div>
            <div className="profile-info-item">
              <span>Giới tính:</span> {user.gender}
            </div>
            <div className="profile-info-button">
              <Button type="primary" onClick={ShowForm}>Chỉnh sửa thông tin</Button>
            </div>
          </div>
          <div className="profile-form">
            <Modal
              visible={visible}
              title="Điền thông tin"
              onCancel={handleCancel}
            >
              <Form
                name="basic"
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
                      validator(rule, value = "") {
                        if (value.length > 25 || value.length < 10) {
                          return Promise.reject("Tối đa 25 kí tự");
                        } else {
                          return Promise.resolve();
                        }
                      }
                    })
                  ]}
                >
                  <Input/>
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
                  <Input/>
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
                  <Input/>
                </Form.Item>
                <label>Địa chỉ:</label>
                <Form.Item
                  name="address"
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(rule, value = "") {
                        if (value.length > 200 || value.length <= 0) {
                          return Promise.reject("tối đa 200 kí tự");
                        } else {
                          return Promise.resolve();
                        }
                      }
                    })
                  ]}
                >
                  <Input/>
                </Form.Item>

                <label>Giới tính:</label>
                <Form.Item
                  name="gender"
                >
                  <Radio.Group>
                    <Radio value="nam">Nam</Radio>
                    <Radio value="nu">Nữ</Radio>
                    <Radio value="khac">Khác</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item  className="groupButton">
                  <Button className="btnSubmit" type="primary" danger onClick={handleCancel}>
                    Huỷ
                  </Button>
                  <Button className="btnSubmit" type="primary" htmlType="submit" >
                    Chỉnh sửa
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
        <div className="col-5">
          {
            imgInput ? (
              <div className="profile-img">
                <img src={imgInput} alt=""/>
              </div>
            ) : (
              <div className="profile-img">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Breezeicons-actions-22-im-user.svg/1200px-Breezeicons-actions-22-im-user.svg.png" alt=""/>
              </div>
            )
          }
          <div className="ChangeImg">
            <input type="file" onChange={inputFile} accept=".jpg, .jpeg, .png" />
            {
              showButtonChange && (
                <div className="ChangeImg-button">
                  <Button className="btnSubmit" type="primary" danger onClick={handleCancelImg}>
                    Huỷ
                  </Button>
                  <Button className="btnSubmit" type="primary" onClick={handleSubmitImg} >
                    Thay đổi
                  </Button>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileAdmin;
