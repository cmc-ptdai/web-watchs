import React, { useState } from 'react'
import './style.scss'
import { Link, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Avatar } from 'antd'
import { getUser as getUserAction }  from '../../redux/actions/userAction'
import { UserOutlined } from '@ant-design/icons'

const Header = () => {
  const history = useHistory();
  const dispatch = useDispatch()
  const myStore = useSelector(store => store.userReducer.user)
  const [keyActive, setKeyActive] = useState('')
  const onActive = (key) => {
    setKeyActive(key)
  }

  const logout = () => {
    const newCart = JSON.parse(localStorage.getItem('cart'))
    const user = {
      cart: newCart,
    }
    localStorage.removeItem('userID')
    dispatch(getUserAction(user))
    history.push('/')
    setKeyActive('')
  }
  return (
    <div className="header">
      <div className="header__content">
        <Row>
          <Col span={5} offset={1} className="login">
            {
              myStore && (
                myStore.id ? (
                  <div className="login__imgUser">
                    {
                      myStore.img ? (
                        <div>
                          <Avatar size={50} src={myStore.img} />
                          <span>{ myStore.name }</span>
                        </div>
                      ) : (
                        <div>
                          <Avatar size={50} icon={<UserOutlined />} />
                          <span>{ myStore.name }</span>
                        </div>
                      )
                    }
                    <div className="login__listchose">
                      <ul>
                        <Link to='/profileUser'>
                          <li onClick={() => onActive(1)}
                            style={{backgroundColor: keyActive === 1 ? '#ccc' : ''}}
                          >
                            <i className="fas fa-user-tie"/>thông tin cá nhân
                          </li>
                        </Link>

                        <Link to='/orderInformation'>
                          <li onClick={() => onActive(2)} style={{backgroundColor: keyActive === 2 ? '#ccc' : ''}}>
                            <i className="fas fa-cart-plus"/>đơn hàng
                          </li>
                        </Link>

                        <Link to='#'>
                          <li onClick={() => logout()}>
                            <i className="fas fa-sign-out-alt"/>logout
                          </li>
                        </Link>
                      </ul>
                    </div>
                  </div>
                ) : <Link to='/login'>Đăng Nhập</Link>
              )
            }
          </Col>
          <Col span={12} className="logo">
            <img src="/logo2.png" alt=""/>
          </Col>
          <Col span={5} className="cart">
            <Link to="/cart">
              <i className="fab fa-opencart">
                {
                  myStore && (<span>{myStore.cart.length}</span>)
                }
              </i>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Header;
