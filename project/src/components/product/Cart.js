
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
import userApi from '../../api/userApi'
import ProductApi from '../../api/productApi'
import WarehouseApi from '../../api/apiWarehouse';
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
  const [listWarehouse, setListWarehouse] = useState(null)
  const [transportFee, setTransportFee] = useState(null)
  const [moneyPayOl, setMoneyPayOl] = useState(0)
  const [listProduct, setListProduct] = useState(null)

  const [status, setStatus] = useState(true)

  useEffect(() => {
    if(user.id) {
      fetchApi()
    } else {
      setProducts(dataProducts)
    }
    fetchApiProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[user, status])

  const columns = [
    {
      title: 'S???n ph???m',
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
      title: 'T??n S???n Ph???m',
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
      title: 'Gi?? s???n ph???m',
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
      title: 'S??? l?????ng',
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
      title: 'Th??nh ti???n',
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
      title: 'Xo??',
      dataIndex: 'delete',
      render: (text, record) => {
        return (
          <div className = "cart__box--delete">
            <Button
              danger
              onClick={() => deleteItem(record.id)}
            >
              Xo??
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

  const fetchApi = async () => {
    try {
      const response = await userApi.getUserById(user.id)
      const Warehouses = await WarehouseApi.getWarehouse()
      setListWarehouse(Warehouses);
      setProducts(response.cart)
    } catch (error) {
      console.log(error);
    }
  }

  const fetchApiProduct = async () => {
    try {
      const listProductApi = await ProductApi.getAll()
      setListProduct(listProductApi)
    } catch (error) {
      console.log(error);
    }
  }

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

  const sumOfMoney = () => {
    let price = 0
    selectedRowKeys.forEach(item => {
      const index = dataProducts.findIndex(elem => elem.id === item)
      price = price + ((dataProducts[index].count * dataProducts[index].price) - ((dataProducts[index].count * dataProducts[index].price) * dataProducts[index].sale / 100))
    })
    
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
      setStatus(!status)
     }, 500);
  };

  const handleCancel = () => {
    setVisibleAlert(false)
  }

  //pay cart no user
  const onFinish = async (values) => {
    if (values.username !== undefined && values.phone !== undefined && values.email !== undefined && values.address !== undefined) {
      const listPayCart = []
      const newListKey = []
      //const listWarehouse1 = await WarehouseApi.getWarehouse()

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

        // for (let index = 0; index < listWarehouse1.length; index++) {
        //   if (listWarehouse1[index].id === item) {
        //     const indexProductCart = products.findIndex(a => a.id === listWarehouse1[index].id)
        //     const lth = listWarehouse1[index].listWarehouse
        //     lth[lth.length - 1].numberCount = lth[lth.length - 1].numberCount + products[indexProductCart].count
        //     WarehouseApi.editWarehouse(listWarehouse1[index].id, listWarehouse1[index])
        //     break
        //   }
        // }

      })
      const ojb = {
        listId : listPayCart,
        profile: values,
        transport: transportFee
      }
      if (listPayCart.length > 0) {
        dispatch(addOrderNoUserAction(ojb))
        setTimeout(() => {
          dispatch(payCartNoUserAction(ojb))
          dispatch(deleteItemByPayCartAction(listPayCart))
        }, 100);
      }
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
      openNotification('H??y ch???n h??nh th???c v???n chuy???n cho ho?? ????n c???a b???n')
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

        // for (let index = 0; index < listWarehouse.length; index++) {
        //   if (listWarehouse[index].id === item) {
        //     const indexProductCart = products.findIndex(a => a.id === listWarehouse[index].id)
        //     const lth = listWarehouse[index].listWarehouse
        //     lth[lth.length - 1].numberCount = lth[lth.length - 1].numberCount + products[indexProductCart].count
        //     WarehouseApi.editWarehouse(listWarehouse[index].id, listWarehouse[index])
        //     break
        //   }
        // }

      })
      onSelectChange([])
      setTotalMoney(0)
       setTimeout(() => {
        dispatch(deleteItemByPayCartAction(listPayCart))
        dispatch(deleteListItemCartAction(newListKey))
        setSelectedRowKeys([])
      }, 100)
       setTransportFee(null)
       dispatch(payCartAction({data:listPayCart, payments: 'off', transport: transportFee}))
       //openNotification("????n h??ng c???a b???n ???? ??????c ?????t th??nh c??ng")
    } else {
      setVisible(true)
    }
    setStatus(!status)
  };

  const onReset = () => {
    form.resetFields();
    setVisible(false)
  };

  const PayCartOnline = async () => {
    setStatus(!status)
    if (user.id) {
      const listPayCart = []
      let money = 0
      selectedRowKeys.forEach(item => {
        products.forEach(elem => {
          if (item === elem.id) {
            const index = listProduct.findIndex(a => a.id === elem.id)
            if (listProduct[index].countPay > elem.count ) {
              listPayCart.push(elem);
              if (Number(elem.sale) > 0 ) {
                money = money + ((elem.price * elem.count) - ((elem.price * elem.count)*elem.sale)/100)
              } else {
                money = money + (Number(elem.price) * Number(elem.count))
              }
            }
          }
        });
      })
      money = (money /22758).toFixed(2)
      setMoneyPayOl(money)
    }
    setCheckPaypal(true)
  }
  const hasSelected = selectedRowKeys.length > 0;

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

        // for (let index = 0; index < listWarehouse.length; index++) {
        //   if (listWarehouse[index].id === item) {
        //     const indexProductCart = products.findIndex(a => a.id === listWarehouse[index].id)
        //     const lth = listWarehouse[index].listWarehouse
        //     lth[lth.length - 1].numberCount = lth[lth.length - 1].numberCount + products[indexProductCart].count
        //     WarehouseApi.editWarehouse(listWarehouse[index].id, listWarehouse[index])
        //     break
        //   }
        // }

      })

      dispatch(payCartAction({data:listPayCart, payments: 'online', transport: 'free'}))
      setTransportFee(null)
      onSelectChange([])
      setTotalMoney(0)
      setTimeout(() => {
        dispatch(deleteListItemCartAction(newListKey))
        dispatch(deleteItemByPayCartAction(listPayCart))
        setSelectedRowKeys([])
      }, 500)
    }
    //openNotification("????n h??ng c???a b???n ???? ??????c ?????t th??nh c??ng")
    setCheckPaypal(false)
  }

  const onchangeShip = (e) => {
    // if (transportFee === 'fastShipping') {
    //   setTotalMoney(totalMoney - 30000)
    // }
    // if (transportFee === 'normalShipping') {
    //   setTotalMoney(totalMoney - 15000)
    // }
    // console.log(totalMoney);

    // if (e === 'fastShipping') {
    //   setTotalMoney(totalMoney + 30000)
    // } 
    // if (e === 'normalShipping') {
    //   setTotalMoney(totalMoney + 15000)
    // }
    // console.log(totalMoney);
    setTransportFee(e)
    //console.log(e);
  }
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
            <p className="ship-text">Ch???n h??nh th???c v???n chuy???n :</p>
            <Select
              placeholder="ch???n h??nh th???c thanh to??n"
              allowClear
              onChange={onchangeShip}
            >
              <Option value="fastShipping">v???n chuy???n si??u t???c : 30,000 VND</Option>
              <Option value="normalShipping">v???n chuy???n th????ng : 15,000 VND</Option>
            </Select>
          </div>
          )
      }

      <h2>T???ng ti???n: <span>{totalMoney.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span> VND</h2>
      {
        user.id && <p style={{ textAlign: 'right' , color: '#fe9705'}}> ( Free ship khi thanh to??n online  ) </p>
      }
      <div className="cart__button">
        <Button
          type="primary"
          danger
          onClick={deleteListItem}
          disabled={!hasSelected}
          loading={loading} >
          Xo??
        </Button>

        <Button
          className="cart__button--pay"
          type="primary"
          onClick={PayCart}
          disabled={!hasSelected}
          loading={loading}
          >
          Thanh to??n tr???c ti???p
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
              Thanh to??n online
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
            title="??i???n th??ng tin"
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
              <label>H??? t??n:</label>
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
              <label>S??? ??i???n tho???i:</label>
              <Form.Item
                name="phone"
                rules={[{ required: true, message: '' },
                  ({ getFieldValue }) => ({
                    validator(rule, value = "") {
                      const re = /((09|03|07|08|05)+([0-9]{8})\b)/g;
                      if (!re.test(value)){
                        return Promise.reject("vui l??ng nh???p ????ng ?????nh d???ng s??? ??i???n tho???i");
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
                        return Promise.reject("email ch??a ????ng ??inh d???ng");
                      } else {
                        return Promise.resolve();
                      }
                    }
                  })
                ]}
              >
                <Input />
              </Form.Item>
              <label>?????a ch???:</label>
              <Form.Item
                name="address"
                rules={[{ required: true, message: 'Please input your address!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item  className="groupButton">
                <Button className="btnSubmit" type="primary" danger onClick={onReset}>
                  Hu???
                </Button>
                <Button className="btnSubmit" type="primary" htmlType="submit" >
                  ????t h??ng
                </Button>

              </Form.Item>
            </Form>
          </Modal>
        </div>
        <div className="cart__mymodel__alert">
        <Modal
          title="Th??ng b??o"
          visible={visibleAlert}
          onCancel={handleCancel}
        >
          <p>B???n ??ang c?? m???t v??i s???n ph???m v?????t qu?? s??? l?????ng</p>
          <p>b???n c?? th??? gi???m s??? l?????ng ??i v?? ti???p t???c mua h??ng!</p>
          <div className="cart__mymodel__alert-btn">
            <Button type="primary" onClick={handleCancel}>
              ?????ng ??
            </Button>
          </div>
        </Modal>
        </div>
      </div>
    </div>
  )
}

export default Cart
