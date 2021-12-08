import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import productApi from '../../api/productApi'
import './ProfileProduct.scss'
import {
  addCartByProfile as addCartByProfileAction,
  addCartByProfileNoUser as addCartByProfileNoUserAction,
  getUser as getUserAction
} from '../../redux/actions/userAction'
import { Tabs, notification, Breadcrumb } from 'antd';
import ShowComment from './commentProduct/index'
import Evaluate from './evaluateProduct/Evaluate'
import UserApi from '../../api/userApi'

const { TabPane } = Tabs;
const openNotification = (item) => {
  notification.open({
    message: '',
    description:<span>Bạn đã thêm thành công một sản phẩm <b>{item.name}</b> vào giỏ hàng</span>,
    icon: <i className="fab fa-optin-monster" style={{fontSize: "40px", color: '#fe9705'}}></i>,
  });
};


const ProfileProduct = () => {
  const param = useParams()
  const dispatch = useDispatch()

  const user = useSelector(store => store.userReducer.user)
  const listProduct = useSelector(store => store.productReducer)

  const [product, setProduct] = useState(null)
  const [number, setNumber] = useState(1)
  const [keyDf, setKeyDf] = useState(1)

  useEffect(() => {
    fetchProduct()
    window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param])

  const fetchProduct = async () => {
    const baseId =  localStorage.getItem('userID')
    if(baseId) {
      const id = atob(baseId)
      const response = await UserApi.getUserById(id)
      dispatch(getUserAction(response))
    }
    try {
      const response = await productApi.getById(param.id)
      setProduct(response)
      setKeyDf(1)
    } catch (error) {
      console.log(error);
    }
  }

  const increment = () => {
    if (number + 1 >=  product.countPay) {
      setNumber(product.countPay)
    } else {
      setNumber(number + 1)
    }
  }

  const decrement = () => {
    if (number - 1 <= 0 ) {
      setNumber(1)
    } else {
      setNumber(number - 1)
    }
  }

  const getNumberInput = e => {
    const { value } = e.target

    if(isNaN(value) || value === "" || value < 0) {
      setNumber(1)
      return
    }
    if (value > product.countPay) {
      setNumber(product.countPay)
    } else {
      setNumber(value)
    }
  }

  const buyProduct = () => {
    const data = {
      product: product,
      number: number
    }
    if (user.id) {
      dispatch(addCartByProfileAction(data))
    } else {
      dispatch(addCartByProfileNoUserAction(data))
    }
    setNumber(1)
    openNotification(product)
  }

  let outstanding = []
  if ( listProduct ) {
    const newArr = [...listProduct]
    newArr.sort((a, b) => {
      if (a.quantityPurchased > b.quantityPurchased) {
        return -1;
      } else {
        return 0
      }
    })
    const listOutstanding = []
    for (let index = 0; index < 9; index++) {
      listOutstanding.push(newArr[index])
    }
    outstanding = [...listOutstanding];
  }

  return (
    <>
      {
        product &&
        <div>
          <div className="row">
            <div className="col-12 directional">
              <Breadcrumb>
                <Breadcrumb.Item>
                  <Link to="/">
                    trang chủ
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to="/products">
                    sản phẩm
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <span>{ product.name }</span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="col-lg-3">
              <div className="box" >
                <div className="search__title">
                  <p>SẢN PHẨM NỔI BẬT</p>
                </div>
                <div className="search__content boxOutstanding">
                  {
                    listProduct.length > 0 && (
                      outstanding.map((item, index) => {
                        return (
                          <Link to={`/products/${item.id}` } key={index}>
                            <div className="item__outstanding">
                              <div className="item__outstanding__img">
                                <img src={item.img} alt="img"/>
                              </div>
                              <div className="item__outstanding__information">
                                <p className="item__outstanding__information-name">
                                  {item.name}
                                </p>
                                <p className="item__outstanding__information-price">
                                  {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND
                                </p>
                              </div>
                            </div>
                          </Link>
                        )
                      })
                    )
                  }

                </div>
              </div>
            </div>
            <div className="col-lg-9 profile">
              <div className="row">

                <div className="col-md-7">
                  <img src={product.img} alt="img"/>
                </div>

                <div className="col-md-5 profile__content">

                  <h2 className="title">{product.name}</h2>

                  <p className="status"><b>Trạng Thái:</b>
                    { product.countPay > 0 ? (
                      <span className="status--stocking"> <i className="fas fa-check"></i> Còn hàng</span>
                    ) : (
                      <span className="status--OutOfStock"> <i className="fas fa-times"></i> Hết hàng</span>
                    )}
                  </p>
                  <p><b>Hạn sử dụng đến ngày: </b> {product.endDate} </p>
                  <div className="price">
                    {
                      product.sale > 0 && (
                        <div className="price__sale">
                          <span className="price__sale-text"><b>Giá gốc:</b></span>
                          <span className="price__sale-number">{product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND</span>
                          <span className="price__sale-numberSale">(-{product.sale}%)</span>
                        </div>
                      )
                    }
                     <div className="price__sale">
                        <span className="price__sale-text"><b>Chỉ còn:</b></span>
                      <span className="price__real ">
                        {(product.price - (product.price * product.sale / 100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND
                      </span>
                      </div>
                  </div>

                  <div className="nutrition">
                  <textarea
                    className="content-product"
                    readOnly
                    defaultValue={product.content}
                  />
                  </div>

                  <div className="profile__addCart">
                    <label>Số lượng: </label>

                    <div className="addNumber">
                      <button className="minus" onClick={decrement}>-</button>
                      <input type="text" value={number} onChange={getNumberInput} />
                      <button className="plus" onClick={increment}>+</button>
                    </div>

                    <button className={product.countPay > 0 ? "buy" : "disabledBuy"} onClick={buyProduct} disabled = {product.countPay > 0 ? false : true}>Mua hàng</button>

                  </div>
                  <p className="address"><span style={{fontWeight: 'bold'}}>Địa chỉ: </span>18T1 The Godel An Khánh, An Khánh, Hoài Đức, Hà Nội</p>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultActiveKey={keyDf} type="card">
            <TabPane tab="Thông tin chung về sản phẩm" key="1">
              <textarea
                className="content-product"
                readOnly
                value={product.content}
              />
            </TabPane>
            <TabPane tab="Đánh giá" key="2">
              <Evaluate data={product}/>
            </TabPane>

            <TabPane tab="Bình luận" key="3">
              <ShowComment  data={product}/>
            </TabPane>
          </Tabs>
        </div>
      }
    </>
  )
}

export default ProfileProduct
