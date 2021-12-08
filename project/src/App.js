import React, { useEffect } from 'react'
import 'antd/dist/antd.css'
import Header from './components/header/Header'
import './App.scss'
import Menu from './components/menu/index'
import { Row, Col, BackTop} from 'antd';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import router from './router'
import { useDispatch } from 'react-redux';
import ProductApi from './api/productApi'
import UserApi from './api/userApi'
import {getProduct as getProductAction} from './redux/actions/products'
import {getUser as getUserAction} from './redux/actions/userAction';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ScrollToTop from './ScrollToTop';
import ListBanner from './components/product/listBanner/index'
import Footer from './components/footer/Footer'

const style = {
  height: 40,
  width: 40,
  lineHeight: '40px',
  borderRadius: 4,
  backgroundColor: '#fe9705',
  color: '#fff',
  textAlign: 'center',
  fontSize: 14,
};

const App = () => {
  const dispatch = useDispatch()
  const fetchProducts = async () => {
    try {
      const listProduct = await ProductApi.getAll()
      dispatch(getProductAction(listProduct))
      if(localStorage.getItem('userID')) {
        const id = atob(localStorage.getItem('userID'))
        const user = await UserApi.getUserById(id)
        dispatch(getUserAction(user))
      } else {
        const cartLocal = JSON.parse(localStorage.getItem('cart'));
        let user = {}
        if (cartLocal) {
          user = {
            cart: cartLocal
          }
        } else {
          user = {
            cart: []
          }
        }
        dispatch(getUserAction(user))
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Router>
        <ScrollToTop/>
        <Header/>
        <Row>
          <Col span={24} className="menu">
            <Menu/>
          </Col>
          <div className="content">
            <Col span={24}>
              <Switch>
                {
                  router.map((item, index) => {
                    const {Component} = item
                    return (
                      <Route path={item.path} exact={item.exact} key={index}>
                        <Component typeID={item.type} species1={item.species1}/>
                      </Route>
                    )
                  })
                }
              </Switch>
            </Col>
          </div>
        </Row>
        <ListBanner />
        <Footer />
      </Router>
      <BackTop >
        <div style={style}><i className="fas fa-arrow-up"></i></div>
      </BackTop>
    </>
  );
}

export default App;
