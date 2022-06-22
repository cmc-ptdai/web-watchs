import React, { useState, useEffect } from 'react';
import { Layout, Menu,Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  AppstoreFilled,
  DropboxOutlined
} from '@ant-design/icons';
import './style.scss';
import {
  Switch,
  Route,
  Link,
  Redirect,
  useHistory
} from "react-router-dom"

import { getUser } from '../redux/action/userAction';
import { getProduct } from '../redux/action/productAction';
import { getOrder } from '../redux/action/orderAction';
import { getAccount } from '../redux/action/accLoginAction';

import router from './router'
import userApi from '../api/apiUser'
import productApi from '../api/apiProduct'
import orderApi from '../api/apiOrders'


const { Header, Content,  Sider } = Layout;
// const { SubMenu } = Menu;

function Body() {

  const history = useHistory()
  const dispatch = useDispatch();
  const [collapsed, setCollapse] = useState(false)
  const accountUser = useSelector(store => store.accLoginReducer)

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const fetchData = async () => {
    try {
      const idUser = getCookie('idUserName')
      const listUser = await userApi.getAllUser()
      const listProduct = await productApi.getAllProduct()
      const listOrder = await orderApi.getAllOrders()
      if (idUser !== undefined) {
        const accountUser = await userApi.getUserById(idUser)
        dispatch(getAccount(accountUser))
      }


      dispatch(getOrder(listOrder))
      dispatch(getUser(listUser))
      dispatch(getProduct(listProduct))
    } catch (error) {
      console.log(error);
    }
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
  const deleteCookie = (name) => {
    let now = new Date()
    now.setTime(now.getTime() + 60 * 1000)
    document.cookie = `${name}=;expires= ${now.toUTCString()}`
  }

  const toggle  = () => {
    setCollapse(!collapsed)
  }
  const handleClickMenu = e => {
  }

  const logout = () => {
    deleteCookie('idUserName')
    return history.replace({ pathname: '/' })
  }
  const Profile = () => {
    return history.push({ pathname: '/body/profileAdmin' })
  }

  if (getCookie('idUserName') === undefined || getCookie('idUserName') === '') {
    console.log(1);
    return <Redirect to='/' />
  }


  return (
    <div className="manageProduct">
        <Layout>
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="logo" />
            <Menu className="nav-item" theme="dark" mode="inline" defaultSelectedKeys={['dashboard']} onClick={handleClickMenu}>
              <Menu.Item key="dashboard" icon={<AppstoreFilled style={{ fontSize: '18px'}}/>}>
                <Link  to='/body'>
                  Dashboard
                </Link>
              </Menu.Item>

              <Menu.Item key="user" icon={<TeamOutlined style={{ fontSize: '18px'}}/>}>
                <Link  to='/body/users'>
                  Users
                </Link>
              </Menu.Item>

              <Menu.Item key="orders" icon={<ShoppingCartOutlined style={{ fontSize: '18px'}}/>}>
                <Link  to='/body/orders'>
                  Orders
                </Link>
              </Menu.Item>

              <Menu.Item key="product" icon={<DropboxOutlined style={{ fontSize: '18px'}}/>}>
                <Link  to='/body/product'>
                Products
                </Link>
              </Menu.Item>

              <Menu.Item key="slides" icon={<TeamOutlined style={{ fontSize: '18px'}}/>}>
                <Link  to='/body/slides'>
                  Slides
                </Link>
              </Menu.Item>
              <Menu.Item key="warehouse" icon={<TeamOutlined style={{ fontSize: '18px'}}/>}>
                <Link  to='/body/warehouse'>
                  Warehouse
                </Link>
              </Menu.Item>
              <Menu.Item key="listPosts" icon={<TeamOutlined style={{ fontSize: '18px'}}/>}>
                <Link  to='/body/listPosts'>
                  Posts
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }}>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: toggle,
              })}

              <div className="accountUser">
                <div className="accountUser-img">
                  <Avatar
                    src={accountUser.img === '' ? 'https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg' : accountUser.img}
                    alt=""
                  />
                  <span>{accountUser.name}</span>
                </div>
                <div className="accountUser-logout">
                  <span onClick={logout}> Logout {'>>'}</span>
                  <span onClick={Profile}> profile Admin </span>
                </div>
              </div>
            </Header>
            <Content
              className="site-layout-background"
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
              }}
            >
              <Switch>
                {
                  router.map((item, index) => {
                    const {Component} = item
                    return (
                      <Route path={item.path} exact={item.exact} key={index}>
                        <Component typeID={item.typeID}/>
                      </Route>
                    )
                  })
                }
              </Switch>
            </Content>
          </Layout>
        </Layout>
    </div>
  );
}

export default Body;
