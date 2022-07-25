import React , { useState, useEffect} from 'react';
import './style.scss'
import { Button, Form, Input, Modal, notification } from 'antd';
import { useHistory } from "react-router-dom"
import { useDispatch } from 'react-redux';
import userApi from '../../api/userApi'
import { editUserImg, editUserPW, getUser } from '../../redux/actions/userAction'
import FormEditUser from './FormEditUser';

const openNotification = (number) => {
  notification.info({
    message: '',
    description: `Mật Khẩu cũ của bạn bị sai ban còn ${number} lần để đổi`,
  });
};

const openNotificationSuccess = (number) => {
  notification.info({
    message: '',
    description: `Bạn đã đổi mật khẩu thành công`,
  });
};

const ProfileUser = () => {

  const history = useHistory();
  const dispatch = useDispatch()
  const [form] = Form.useForm();
  const [user, setUser] = useState({})
  const [visible, setVisible] = useState(false)
  const [imgInput, setImgInput] = useState('')
  const [showButtonChange, setShowButtonChange]= useState(false)
  const [showChangePassword, setShowChangePassword]= useState(false)

  useEffect(() => {
    fetchData()
  }, [visible])

  const fetchData = async () => {
    const id = atob(localStorage.getItem('userID'))
    const user = await userApi.getUserById(id)
    setImgInput(user.img)
    setUser(user)
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
    dispatch(editUserImg(imgInput))
  }

  const handleCancelImg = () => {
    setImgInput(user.img)
    setShowButtonChange(false)
  }

  const ShowForm = () => {
    setVisible(true)
  }

  const editStatus = (value) => {
    setVisible(value)
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
      openNotificationSuccess()
      dispatch(editUserPW(value));
      const newCart = JSON.parse(localStorage.getItem('cart'))
      const user = {
        cart: newCart,
      }
      localStorage.removeItem('userID')
      dispatch(getUser(user))
      setTimeout(() => {
        history.push('/login')
      handleCancelPassword()
      }, 500);
    }
  }
  const FormatDate = () => {
    const date = new Date(user.birthday)
    const c = date.getDate().toString() + '/' + (date.getMonth() + 1).toString() + '/' + date.getFullYear().toString()
    return c
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
                  rules={[{ required: true, message: 'Please input your password!'}]}
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
              <span>Ngày sinh:</span> {FormatDate()}
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
          {
            visible && (<FormEditUser user={user} editStatus={editStatus}/>)
          }
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
                <div>
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

export default ProfileUser;
