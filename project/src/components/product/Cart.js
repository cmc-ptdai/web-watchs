
import React, { useState, useEffect } from 'react'
import { Table, Button, Form, Input, Modal, Select, notification } from 'antd';
import './cart.scss'
import { useDispatch, useSelector } from 'react-redux'
import {
  incrementProject as incrementProjectAction,
  decrementProject as decrementProjectAction,
  deleteItemCart as deleteItemCartAction,
  numberInputProject as numberInputProjectAction,
  deleteListItemCart as deleteListItemCartAction,
  payCart as payCartAction,
  payCartNoUser as payCartNoUserAction,
  addOrderNoUser as addOrderNoUserAction,
  incrementProjectNoUser as incrementProjectNoUserAction,
  decrementProjectNoUser as decrementProjectNoUserAction,
  numberInputProjectNoUser as numberInputProjectNoUserAction,
  deleteItemCartNoUser as deleteItemCartNoUserAction,
  deleteListItemCartNoUser as deleteListItemCartNoUserAction,
} from '../../redux/actions/userAction'
import {
  deleteItemByPayCart as deleteItemByPayCartAction
} from './../../redux/actions/products'
import ProductApi from '../../api/productApi'
import Paypal from './Paypal'

const { Option } = Select;
const openNotification = (text) => {
  notification.open({
    message: '',
    description:<span>{text}</span>,
    icon: <i className="fab fa-optin-monster" style={{fontSize: "40px", color: '#fe9705'}}></i>,
  });
};

const Cart = () => {
  const dispatch = useDispatch()
  const [form] = Form.useForm();
  const user = useSelector(store => store.userReducer.user)
  const dataProducts =  useSelector(store => store.userReducer.user.cart)
  const [products, setProducts] = useState(dataProducts)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [totalMoney, setTotalMoney] = useState(0)
  const [visibleAlert , setVisibleAlert] = useState(false)
  const [checkPaypal, setCheckPaypal] = useState(false)
  const [transportFee, setTransportFee] = useState(null)
  const [moneyPayOl, setMoneyPayOl] = useState(0)
  const [listProduct, setListProduct] = useState(null)
  const [status, setStatus] = useState(true)

  useEffect(() => {
    setProducts(dataProducts)
    fetchApiProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[user, status])

  const fetchApiProduct = async () => {
    try {
      const listProductApi = await ProductApi.getAll()
      setListProduct(listProductApi)
    } catch (error) {
      console.log(error);
    }
  }

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'img',
      render: text => {
        return (
          <div className = "cart__box-img">
            <img src={text} alt=""/>
          </div>
        )
      }
    },
    {
      title: 'Tên Sản Phẩm',
      dataIndex: 'name',
      render: text => {
        return (
          <div className = "cart__box-text">
            <p>{text}</p>
          </div>
        )
      }
    },
    {
      title: 'Giá sản phẩm',
      dataIndex: 'price',
      render: text => {
        return (
          <div className = "cart__box-text">
            <p>{text.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND</p>
          </div>
        )
      }
    },
    {
      title: 'Số lượng',
      dataIndex: 'count',
      render: (text, record) => {
        return (
          <div className = "cart__box-count">
            <button
              className="cart__box-text--minus"
              onClick={() => decrement(record.id)}
              disabled = {record.count === 1  ? true : false}
            >-</button>
              <input type="text" value={text} onChange={getNumberInput} id={record.id}/>
            <button
              className="cart__box-text--plus"
              onClick={() => increment(record.id)}
              disabled = {record.count > record.countPay  ? true : false}
            >+</button>
          </div>
        )
      }
    },
    {
      title: 'Sale (%)',
      dataIndex: 'sale',
      render: text => {
        return (
          <div>
            {text}(%)
          </div>
        )
      }
    },
    {
      title: 'Thành tiền',
      dataIndex: 'thanhtien',
      render: (text, record) => {
        return (
          <div className = "cart__box-text">
            <p>{((record.price * record.count)- (((record.price * record.count)*record.sale)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND</p>
          </div>
        )
      }
    },
    {
      title: 'Xoá',
      dataIndex: 'delete',
      render: (text, record) => {
        return (
          <div className = "cart__box--delete">
            <Button
              danger
              onClick={() => deleteItem(record.id)}
            >
              Xoá
            </Button>
            <div id={`${record.id}delete`}></div>
          </div>
        )
      }
    },
  ];

  const onSelectChange = (selectedRowKeys) => {
    let newSelect = [...selectedRowKeys]
    let price = 0
    let status = false
    if (user.id) {
      for (let key = 0; key < selectedRowKeys.length; key++) {
        for (let ad = 0; ad < products.length; ad++) {
          if (products[ad].id === selectedRowKeys[key]) {
            const index = listProduct.findIndex(a => a.id === products[ad].id)
            if (listProduct[index].countPay < products[ad].count ) {
              status = true
              newSelect = newSelect.filter(a => a !== selectedRowKeys[key])
            }
          }
        }
      }
    }
    setSelectedRowKeys(newSelect);
    setVisibleAlert(status)

    newSelect.forEach(item => {
      const index = dataProducts.findIndex(elem => elem.id === item)
      price = price + ((dataProducts[index].count * dataProducts[index].price) - ((dataProducts[index].count * dataProducts[index].price) * dataProducts[index].sale / 100))
    })
    setTotalMoney(price)

    dataProducts.forEach(item => {
      const index = newSelect.findIndex(elem => elem === item.id)
      const buttonDelete = document.getElementById(`${item.id}delete`)
      if (index !== -1) {
        buttonDelete.classList.add("overlay");
      } else {
        if (buttonDelete != null) {
          buttonDelete.classList.remove("overlay");
        }
      }
    })
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const getNumberInput = (event) => {
    const { value, id } = event.target
    const index = listProduct.findIndex(item => item.id === id)
    const [...newData] = products
     const abc = newData.map(item => {
      if (item.id === Number(id)) {
        return {
          ...item,
          count: Number(value)
        }
      }
      return item
    })
    setProducts(abc)
    const newNumber = {
      value: value,
      id: id,
      max: listProduct[index].countPay
    }

    setTimeout(() => {
      if (user.id) {
        dispatch(dispatch(numberInputProjectAction(newNumber)))
       } else {
         dispatch(numberInputProjectNoUserAction(newNumber))
       }
    }, 100);
  }

  const sumOfMoney = (transportFee1) => {
    let price = 0
    selectedRowKeys.forEach(item => {
      const index = dataProducts.findIndex(elem => elem.id === item)
      price = price + ((dataProducts[index].count * dataProducts[index].price) - ((dataProducts[index].count * dataProducts[index].price) * dataProducts[index].sale / 100))
    })
    console.log(transportFee1);
    if (transportFee1 === 'fastShipping') {
      price= price + 30000
    }
    if (transportFee1 === 'normalShipping') {
      price= price + 15000
    }
    setTotalMoney(price)
  }

  const increment = (id) => {
    const index = listProduct.findIndex(item => item.id === id)
     if (user.id) {
      dispatch(incrementProjectAction({id: id, max: listProduct[index].countPay}))
     } else {
       dispatch(incrementProjectNoUserAction({id: id, max: listProduct[index].countPay}))
     }
     sumOfMoney()
  }

  const decrement = (id) => {
    if (user.id) {
      dispatch(decrementProjectAction(id))
     } else {
       dispatch(decrementProjectNoUserAction(id))
     }
    sumOfMoney()
  }

  const deleteItem = (id) => {
    if (user.id) {
      dispatch(deleteItemCartAction(id))
     } else {
       dispatch(deleteItemCartNoUserAction(id))
     }
     setStatus(!status)
  }

  const deleteListItem = () => {
    setLoading(true)
    if (user.id) {
      dispatch(deleteListItemCartAction(selectedRowKeys))
     } else {
       dispatch(deleteListItemCartNoUserAction(selectedRowKeys))
     }
    setTimeout(() => {
      setSelectedRowKeys([])
      setLoading(false)
     }, 200);
     setStatus(!status)
  };

  const handleCancel = () => {
    setVisibleAlert(false)
  }

  //pay cart no user
  const onFinish = async (values) => {
    if (values.username !== undefined && values.phone !== undefined && values.email !== undefined && values.address !== undefined) {
      const listPayCart = []
      const newListKey = []

      selectedRowKeys.forEach(item => {
        for (let ad = 0; ad < products.length; ad++) {
          if (products[ad].id === item) {
            const index = listProduct.findIndex(a => a.id === products[ad].id)
            if (listProduct[index].countPay >= products[ad].count ) {
              newListKey.push(item)
              listPayCart.push(products[ad]);
            }
            break;
          }
        }

      })
      const ojb = {
        listId : listPayCart,
        profile: values,
        transport: transportFee,
        money: totalMoney
      }
      if (listPayCart.length > 0) {
        dispatch(addOrderNoUserAction(ojb))
        setTimeout(() => {
          dispatch(payCartNoUserAction(ojb))
          dispatch(deleteItemByPayCartAction(listPayCart))
        }, 100);
      }
      openNotification("Đơn hàng của bạn đã đươc đặt thành công")
      setTransportFee(null)
      onReset()
      onSelectChange([])
      setSelectedRowKeys([])
      setStatus(!status)
    }
  };

  // pay cart user
  const PayCart = async () => {
    if (transportFee === null) {
      openNotification('Hãy chọn hình thức vận chuyển cho hoá đơn của bạn')
      return;
    }
    if (user.id) {
      const listPayCart = []
      const newListKey = []

      selectedRowKeys.forEach(item => {
        for (let ad = 0; ad < products.length; ad++) {
          if (products[ad].id === item) {
            const index = listProduct.findIndex(a => a.id === products[ad].id)
            if (listProduct[index].countPay >= products[ad].count ) {
              newListKey.push(item)
              listPayCart.push(products[ad]);
            }
            break
          }
        }

      })
       //setTimeout(() => {

      // }, 100)
      dispatch(payCartAction({data:listPayCart, payments: 'off', transport: transportFee, money: totalMoney}))
      openNotification("Đơn hàng của bạn đã đươc đặt thành công")
      dispatch(deleteItemByPayCartAction(listPayCart))
      dispatch(deleteListItemCartAction(newListKey))
      onSelectChange([])
      setTotalMoney(0)
      setSelectedRowKeys([])
      setTransportFee(null)
    } else {
      setVisible(true)
    }
    setStatus(!status)
  };

  const PayCartOnline = async () => {
    setStatus(!status)
    if (user.id) {
      let money = 0
      selectedRowKeys.forEach(item => {
        products.forEach(elem => {
          if (item === elem.id) {
            money = money + ((elem.price * elem.count) - ((elem.price * elem.count)*elem.sale)/100)
          }
        });
      })
      console.log(money, totalMoney);
      money = (money /22758).toFixed(2)
      setMoneyPayOl(money)
    }
    setCheckPaypal(true)
  }

  const paySuccess = async (status1) => {
    setStatus(!status)
    if (status1) {
      const listPayCart = []
      const newListKey = []

      selectedRowKeys.forEach(item => {
        for (let ad = 0; ad < products.length; ad++) {
          if (products[ad].id === item) {
            const index = listProduct.findIndex(a => a.id === products[ad].id)
            if (listProduct[index].countPay >= products[ad].count ) {
              newListKey.push(item)
              listPayCart.push(products[ad]);
            }
            break
          }
        }

      })

      dispatch(payCartAction({data:listPayCart, payments: 'online', transport: 'free', money: totalMoney}))
      setTimeout(() => {
        dispatch(deleteListItemCartAction(newListKey))
        dispatch(deleteItemByPayCartAction(listPayCart))
        openNotification("Đơn hàng của bạn đã đươc đặt thành công")
      }, 200)
      setSelectedRowKeys([])
      setTransportFee(null)
      onSelectChange([])
      setTotalMoney(0)
    }
    //openNotification("Đơn hàng của bạn đã đươc đặt thành công")
    setCheckPaypal(false)
  }

  const onchangeShip = (e) => {
    setTransportFee(e)
    sumOfMoney(e)
  }

  const hasSelected = selectedRowKeys.length > 0;

  const onReset = () => {
    form.resetFields();
    setVisible(false)
  };

  return (
    <div className="cart">
      {
        products.length > 0 && (
          <Table
            rowKey="id"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={products}
          />
        )
      }

      {
        selectedRowKeys.length > 0 && (
          <div className="ship">
            <p className="ship-text">Chọn hình thức vận chuyển :</p>
            <Select
              placeholder="chọn hình thức thanh toán"
              allowClear
              onChange={onchangeShip}
            >
              <Option value="fastShipping">vận chuyển siêu tốc : 30,000 VND</Option>
              <Option value="normalShipping">vận chuyển thương : 15,000 VND</Option>
            </Select>
          </div>
          )
      }

      <h2>Tổng tiền: <span>{totalMoney.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span> VND</h2>
      {
        user.id && <p style={{ textAlign: 'right' , color: '#fe9705'}}> ( Free ship khi thanh toán online  ) </p>
      }
      <div className="cart__button">
        <Button
          type="primary"
          danger
          onClick={deleteListItem}
          disabled={!hasSelected}
          loading={loading} >
          Xoá
        </Button>

        <Button
          className="cart__button--pay"
          type="primary"
          onClick={PayCart}
          disabled={!hasSelected}
          loading={loading}
          >
          Thanh toán trực tiếp
        </Button>

        {
          user.id && (
            <Button
              className="cart__button--pay"
              type="primary"
              onClick={PayCartOnline}
              disabled={!hasSelected}
              loading={loading}
              >
              Thanh toán online
            </Button>
          )
        }
      </div>
      <div className="paypal">
        {
          checkPaypal && (
            <Paypal paySuccess= {paySuccess} moneyPayOl={moneyPayOl}/>
          )
        }
      </div>
      <div className="cart__mymodel">
        <div className="cart__mymodal__body">
          <Modal
            visible={visible}
            title="Điền thông tin"
            onCancel={onReset}
            className="modalCart"
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
                name="username"
                rules={[{ required: true, message: 'Please input your username!' },
                  ({ getFieldValue }) => ({
                    validator(rule, value = "") {
                      if (value.length > 20) {
                        return Promise.reject("Minimum 20 characters");
                      } else {
                        return Promise.resolve();
                      }
                    }
                  })
                ]}
              >
                <Input />
              </Form.Item>
              <label>Số điện thoại:</label>
              <Form.Item
                name="phone"
                rules={[{ required: true, message: '' },
                  ({ getFieldValue }) => ({
                    validator(rule, value = "") {
                      const re = /((09|03|07|08|05)+([0-9]{8})\b)/g;
                      if (!re.test(value)){
                        return Promise.reject("vui lòng nhập đúng định dạng số điện thoại");
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
                rules={[{ required: true, message: 'Please input your email!' },
                  ({ getFieldValue }) => ({
                    validator(rule, value = "") {
                      //eslint-disable-next-line
                      const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                      if (value.length > 0 && !re.test(value)) {
                        return Promise.reject("email chưa đúng đinh dạng");
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
                rules={[{ required: true, message: 'Please input your address!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item  className="groupButton">
                <Button className="btnSubmit" type="primary" danger onClick={onReset}>
                  Huỷ
                </Button>
                <Button className="btnSubmit" type="primary" htmlType="submit" >
                  Đăt hàng
                </Button>

              </Form.Item>
            </Form>
          </Modal>
        </div>
        <div className="cart__mymodel__alert">
        <Modal
          title="Thông báo"
          visible={visibleAlert}
          onCancel={handleCancel}
        >
          <p>Bạn đang có một vài sản phẩm vượt quá số lượng</p>
          <p>bạn có thể giảm số lượng đi và tiếp tục mua hàng!</p>
          <div className="cart__mymodel__alert-btn">
            <Button type="primary" onClick={handleCancel}>
              Đồng ý
            </Button>
          </div>
        </Modal>
        </div>
      </div>
    </div>
  )
}

export default Cart
