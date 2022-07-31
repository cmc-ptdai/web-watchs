import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Modal, Select, notification } from 'antd';
import './cart.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
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
  deleteVoucherUser as deleteVoucherUserAction,
  deleteVoucherAdmin as deleteVoucherAdminAction,
  editVoucherAdmin as editVoucherAdminAction,
} from '../../redux/actions/userAction';
import { deleteItemByPayCart as deleteItemByPayCartAction } from './../../redux/actions/products';
import ProductApi from '../../api/productApi';
import Paypal from './Paypal';
import { v4 as uuidv4 } from 'uuid';
import ApiVoucher from '../../api/apiVoucher';

const { Option } = Select;
const openNotification = (text) => {
  notification.open({
    message: '',
    description: <span>{text}</span>,
    icon: <i className="fab fa-optin-monster" style={{ fontSize: '40px', color: '#fe9705' }}></i>,
  });
};

const Cart = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const user = useSelector((store) => store.userReducer.user);
  const dataProducts = useSelector((store) => store.userReducer.user.cart);
  const [products, setProducts] = useState(dataProducts);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [totalMoney, setTotalMoney] = useState(0);
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [checkPaypal, setCheckPaypal] = useState(false);
  const [transportFee, setTransportFee] = useState(null);
  const [moneyPayOl, setMoneyPayOl] = useState(0);
  const [listProduct, setListProduct] = useState(null);
  const [status, setStatus] = useState(true);
  const [visibleAlertPay, setVisibleAlertPay] = useState(false);
  const [idOrder, setIdOrder] = useState(null);
  const [listVoucher, setListVoucher] = useState(null);
  const [listVouchers, setListVouchers] = useState(null);
  const [statusListVoucher, setShowListVoucher] = useState(false);
  const [voucher, setVoucher] = useState(null);
  const [valueSearchVoucher, setValueSearchVoucher] = useState('');
  const [statusCheckUser, setStatusCheckUser] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [addressEdit, setAddressEdit] = useState(null);
  const [useAddress, setUseAddress]  = useState(false);

  useEffect(() => {
    setProducts(dataProducts);
    fetchApiProduct();
    fetchApiVoucher();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, status]);

  useEffect(() => {
    sumOfMoney()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[voucher, transportFee])

  const sumOfMoney = () => {
    let price = 0;
    selectedRowKeys.forEach((item) => {
      const index = dataProducts.findIndex((elem) => elem.id === item);
      price =
        price +
        (dataProducts[index].count * dataProducts[index].price -
          (dataProducts[index].count * dataProducts[index].price * dataProducts[index].sale) / 100);
    });
    if (voucher) {
      price = price - (price * Number(voucher.sale)) / 100;
    }
    if (transportFee) {
      if (transportFee === 'fastShipping') {
        price = price + 30000;
      }
      if (transportFee === 'normalShipping') {
        price = price + 15000;
      }
    }

    setTotalMoney(price);
  }

  const fetchApiVoucher = async () => {
    const newList = await ApiVoucher.getAllVoucher();
    sortVoucher(newList);
    setListVouchers(newList);
  };

  const sortVoucher = (newList) => {
    const newListVouchers = [];
    if (user.vouchers && newList) {
      user.vouchers.forEach((item) => {
        for (let i = 0; i < newList.length; i++) {
          if (item === newList[i].id) {
            newListVouchers.push(newList[i]);
            break;
          }
        }
      });
    }
    setListVoucher(newListVouchers);
  };

  const fetchApiProduct = async () => {
    try {
      const listProductApi = await ProductApi.getAll();
      setListProduct(listProductApi);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'img',
      render: (text) => {
        return (
          <div className="cart__box-img">
            <img src={text} alt="" />
          </div>
        );
      },
    },
    {
      title: 'Tên Sản Phẩm',
      dataIndex: 'name',
      render: (text) => {
        return (
          <div className="cart__box-text">
            <p>{text}</p>
          </div>
        );
      },
    },
    {
      title: 'Giá sản phẩm',
      dataIndex: 'price',
      render: (text) => {
        return (
          <div className="cart__box-text">
            <p>{text.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VND</p>
          </div>
        );
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'count',
      render: (text, record) => {
        return (
          <div className="cart__box-count">
            <button
              className="cart__box-text--minus"
              onClick={() => decrement(record.id)}
              disabled={record.count === 1 ? true : false}
            >
              -
            </button>
            <input type="text" value={text} onChange={getNumberInput} id={record.id} />
            <button
              className="cart__box-text--plus"
              onClick={() => increment(record.id)}
              disabled={record.count > record.countPay ? true : false}
            >
              +
            </button>
          </div>
        );
      },
    },
    {
      title: 'Sale (%)',
      dataIndex: 'sale',
      render: (text) => {
        return <div>{text}(%)</div>;
      },
    },
    {
      title: 'Thành tiền',
      dataIndex: 'thanhtien',
      render: (text, record) => {
        return (
          <div className="cart__box-text">
            <p>
              {(record.price * record.count - (record.price * record.count * record.sale) / 100)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
              VND
            </p>
          </div>
        );
      },
    },
    {
      title: 'Xoá',
      dataIndex: 'delete',
      render: (text, record) => {
        return (
          <div className="cart__box--delete">
            <Button danger onClick={() => deleteItem(record.id)}>
              Xoá
            </Button>
            <div id={`${record.id}delete`}></div>
          </div>
        );
      },
    },
  ];

  const onSelectChange = (selectedRowKeys) => {
    let newSelect = [...selectedRowKeys];
    let price = 0;
    let status = false;
    if (user.id) {
      for (let key = 0; key < selectedRowKeys.length; key++) {
        for (let ad = 0; ad < products.length; ad++) {
          if (products[ad].id === selectedRowKeys[key]) {
            const index = listProduct.findIndex((a) => a.id === products[ad].id);
            if (listProduct[index].countPay < products[ad].count) {
              status = true;
              newSelect = newSelect.filter((a) => a !== selectedRowKeys[key]);
            }
          }
        }
      }
    }
    setSelectedRowKeys(newSelect);
    setVisibleAlert(status);

    newSelect.forEach((item) => {
      const index = dataProducts.findIndex((elem) => elem.id === item);
      price =
        price +
        (dataProducts[index].count * dataProducts[index].price -
          (dataProducts[index].count * dataProducts[index].price * dataProducts[index].sale) / 100);
    });
    setTotalMoney(price);

    dataProducts.forEach((item) => {
      const index = newSelect.findIndex((elem) => elem === item.id);
      const buttonDelete = document.getElementById(`${item.id}delete`);
      if (index !== -1) {
        buttonDelete.classList.add('overlay');
      } else {
        if (buttonDelete != null) {
          buttonDelete.classList.remove('overlay');
        }
      }
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const getNumberInput = (event) => {
    const { value, id } = event.target;
    const index = listProduct.findIndex((item) => item.id === id);
    const [...newData] = products;
    const abc = newData.map((item) => {
      if (item.id === Number(id)) {
        return {
          ...item,
          count: Number(value),
        };
      }
      return item;
    });
    setProducts(abc);
    const newNumber = {
      value: value,
      id: id,
      max: listProduct[index].countPay,
    };

    setTimeout(() => {
      if (user.id) {
        dispatch(dispatch(numberInputProjectAction(newNumber)));
      } else {
        dispatch(numberInputProjectNoUserAction(newNumber));
      }
    }, 100);
  };

  // const sumOfMoney = (transportFee1) => {
  //   let price = 0;
  //   selectedRowKeys.forEach((item) => {
  //     const index = dataProducts.findIndex((elem) => elem.id === item);
  //     price =
  //       price +
  //       (dataProducts[index].count * dataProducts[index].price -
  //         (dataProducts[index].count * dataProducts[index].price * dataProducts[index].sale) / 100);
  //   });
  //   if (transportFee1) {
  //     if (transportFee1 === 'fastShipping') {
  //       if (voucher) {
  //         price = price - (price * Number(voucher.sale)) / 100;
  //       }
  //       price = price + 30000;
  //     }
  //     if (transportFee1 === 'normalShipping') {
  //       if (voucher) {
  //         price = price - (price * Number(voucher.sale)) / 100;
  //       }
  //       price = price + 15000;
  //     }
  //     if (transportFee1?.sale) {
  //       price = price - (price * Number(transportFee1.sale)) / 100;
  //       if (transportFee === 'fastShipping') {
  //         price = price + 30000;
  //       }
  //       if (transportFee === 'normalShipping') {
  //         price = price + 15000;
  //       }
  //     }
  //   } else if (transportFee1 === undefined) {
  //     if (voucher) {
  //       price = price - (price * Number(voucher.sale)) / 100;
  //     }
  //   } else if (transportFee1 === 'deleteVoucher') {
  //     if (transportFee === 'fastShipping') {
  //       price = price + 30000;
  //     }
  //     if (transportFee === 'normalShipping') {
  //       price = price + 15000;
  //     }
  //   } else {
  //     if (voucher) {
  //       price = price - (price * Number(voucher.sale)) / 100;
  //     }
  //     if (transportFee === 'fastShipping') {
  //       price = price + 30000;
  //     }
  //     if (transportFee === 'normalShipping') {
  //       price = price + 15000;
  //     }
  //   }
  //   setTotalMoney(price);
  // };

  const increment = (id) => {
    const index = listProduct.findIndex((item) => item.id === id);
    if (user.id) {
      dispatch(incrementProjectAction({ id: id, max: listProduct[index].countPay }));
    } else {
      dispatch(incrementProjectNoUserAction({ id: id, max: listProduct[index].countPay }));
    }
    sumOfMoney();
  };

  const decrement = (id) => {
    if (user.id) {
      dispatch(decrementProjectAction(id));
    } else {
      dispatch(decrementProjectNoUserAction(id));
    }
    sumOfMoney();
  };

  const deleteItem = (id) => {
    if (user.id) {
      dispatch(deleteItemCartAction(id));
    } else {
      dispatch(deleteItemCartNoUserAction(id));
    }
    setStatus(!status);
  };

  const deleteListItem = () => {
    setLoading(true);
    if (user.id) {
      dispatch(deleteListItemCartAction(selectedRowKeys));
    } else {
      dispatch(deleteListItemCartNoUserAction(selectedRowKeys));
    }
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 200);
    setStatus(!status);
  };

  const handleCancel = () => {
    setVisibleAlert(false);
  };

  //pay cart no user
  const onFinish = async (values) => {
    if (
      values.username !== undefined &&
      values.phone !== undefined &&
      values.email !== undefined &&
      values.address !== undefined
    ) {
      const listPayCart = [];
      const newListKey = [];

      selectedRowKeys.forEach((item) => {
        for (let ad = 0; ad < products.length; ad++) {
          if (products[ad].id === item) {
            const index = listProduct.findIndex((a) => a.id === products[ad].id);
            if (listProduct[index].countPay >= products[ad].count) {
              newListKey.push(item);
              listPayCart.push(products[ad]);
            }
            break;
          }
        }
      });
      const ojb = {
        id: uuidv4(),
        listId: listPayCart,
        profile: values,
        transport: transportFee,
        money: totalMoney,
      };
      if (listPayCart.length > 0) {
        dispatch(addOrderNoUserAction(ojb));
        setTimeout(() => {
          dispatch(payCartNoUserAction(ojb));
          dispatch(deleteItemByPayCartAction(listPayCart));
        }, 100);
      }
      setIdOrder(ojb.id);
      openNotification('Đơn hàng của bạn đã đươc đặt thành công');
      setTransportFee(null);
      onReset();
      onSelectChange([]);
      setSelectedRowKeys([]);
      setStatus(!status);
      setVisibleAlertPay(true);
    }
  };

  // pay cart user
  const PayCart = async () => {
    if (checkProfileUser() !== '') {
      setStatusCheckUser(true)
      return;
    }
    if (transportFee === null) {
      openNotification('Hãy chọn hình thức vận chuyển cho hoá đơn của bạn');
      return;
    }

    if (user.id) {
      const listPayCart = [];
      const newListKey = [];

      selectedRowKeys.forEach((item) => {
        for (let ad = 0; ad < products.length; ad++) {
          if (products[ad].id === item) {
            const index = listProduct.findIndex((a) => a.id === products[ad].id);
            if (listProduct[index].countPay >= products[ad].count) {
              newListKey.push(item);
              listPayCart.push(products[ad]);
            }
            break;
          }
        }
      });
      dispatch(
        payCartAction({
          data: listPayCart,
          payments: 'off',
          transport: transportFee,
          money: totalMoney,
          newAddress: addressEdit
        })
      );
      openNotification('Đơn hàng của bạn đã đươc đặt thành công');
      dispatch(deleteItemByPayCartAction(listPayCart));
      dispatch(deleteListItemCartAction(newListKey));
      onSelectChange([]);
      setTotalMoney(0);
      setSelectedRowKeys([]);
      setTransportFee(null);
      if (voucher) {
        if (voucher.proviso === 'single') {
          setTimeout(() => {
            dispatch(deleteVoucherAdminAction(voucher));
          }, 500);
        } else {
          setTimeout(() => {
            deleteVoucher(voucher);
            editVoucherAdmin(voucher);
          }, 500);
        }
      }
      setVoucher(null);
    } else {
      setVisible(true);
    }
    setStatus(!status);
  };

  const PayCartOnline = async () => {
    if (checkProfileUser() !== '') {
      setStatusCheckUser(true)
      return;
    }
    setStatus(!status);
    if (user.id) {
      let money = 0;
      selectedRowKeys.forEach((item) => {
        products.forEach((elem) => {
          if (item === elem.id) {
            money = money + (elem.price * elem.count - (elem.price * elem.count * elem.sale) / 100);
          }
        });
      });
      money = (money / 22758).toFixed(2);
      setMoneyPayOl(money);
    }
    setCheckPaypal(true);
  };

  const paySuccess = async (status1) => {
    setStatus(!status);
    if (status1) {
      const listPayCart = [];
      const newListKey = [];

      selectedRowKeys.forEach((item) => {
        for (let ad = 0; ad < products.length; ad++) {
          if (products[ad].id === item) {
            const index = listProduct.findIndex((a) => a.id === products[ad].id);
            if (listProduct[index].countPay >= products[ad].count) {
              newListKey.push(item);
              listPayCart.push(products[ad]);
            }
            break;
          }
        }
      });

      dispatch(
        payCartAction({
          data: listPayCart,
          payments: 'online',
          transport: 'free',
          money: totalMoney,
          newAddress: addressEdit
        })
      );
      setTimeout(() => {
        dispatch(deleteListItemCartAction(newListKey));
        dispatch(deleteItemByPayCartAction(listPayCart));
      }, 200);
      setSelectedRowKeys([]);
      setTransportFee(null);
      onSelectChange([]);
      setTotalMoney(0);
      if (voucher) {
        if (voucher.proviso === 'single') {
          setTimeout(() => {
            dispatch(deleteVoucherAdminAction(voucher));
          }, 500);
        } else {
          setTimeout(() => {
            deleteVoucher(voucher);
            editVoucherAdmin(voucher);
          }, 500);
        }
      }
      setVoucher(null);
    }
    openNotification('Đơn hàng của bạn đã đươc đặt thành công');
    setCheckPaypal(false);
  };

  const onchangeShip = (e) => {
    setTransportFee(e);
  };

  const hasSelected = selectedRowKeys.length > 0;

  const onReset = () => {
    form.resetFields();
    setVisible(false);
  };

  const handleCancelAlertOrder = () => {
    setIdOrder(null);
    setVisibleAlertPay(false);
  };

  const showListVoucher = () => {
    setShowListVoucher(true);
  };

  const handleCancelListVoucher = () => {
    setShowListVoucher(false);
    setValueSearchVoucher('');
  };

  const addVoucher = (item) => {
    setVoucher(item);
    setShowListVoucher(false);
  };

  const deleteVoucher = (item) => {
    if (item.proviso === 'single') {
    } else {
      dispatch(deleteVoucherUserAction({ voucher: item, user: user }));
    }
  };

  const editVoucherAdmin = (item) => {
    const newData = { ...item };
    newData.listUserAddCode.push(user.id);
    dispatch(editVoucherAdminAction(newData));
  };

  const checkDate = (value) => {
    const date = new Date();
    const dateVoucher = new Date(value.dateEnd);
    if (date.getTime() > dateVoucher.getTime()) {
      return true;
    }
  };
  const changeInputVoucher = (e) => {
    setValueSearchVoucher(e.target.value);
  };

  const searchVoucher = () => {
    const newList = [];
    for (let i = 0; i < listVouchers.length; i++) {
      if (listVouchers[i].code === valueSearchVoucher) {
        newList.push(listVouchers[i]);
        break;
      }
    }
    setListVoucher(newList);
  };

  const deleteSearchVoucher = () => {
    sortVoucher();
    setValueSearchVoucher('');
  };

  const handleCancelEditAddress = () => {
    setEditAddress(false)
  }

  const checkUseNumber = (item) => {
    if (Number(item.useNumber) === Number(item.listUserAddCode.length)) {
      return true;
    } else {
      return false;
    }
  };

  const handleCancelCheckUser = () => {
    setStatusCheckUser(false)
  }

  const checkProfileUser = () => {
    let c = ''
    if (user.phone === '') {
      c = c + "Tài khoản của bạn chưa có số điện thoại"
    }
    if (user.address === '') {
      c = c + ' và địa chỉ'
    }
    return c
  }

  const changeInputEditAddress = (e) => {
    setAddressEdit(e.target.value)
  }

  const useAddressNew = () =>{
    setUseAddress(true)
    setEditAddress(false)
  }

  const deleteChoseVoucher = () => {
    setVoucher(null)
  }
  return (
    <div className="cart">
      {products.length > 0 && (
        <Table rowKey="id" rowSelection={rowSelection} columns={columns} dataSource={products} />
      )}

      {selectedRowKeys.length > 0 && (
        <div className="ship">
          <p className="ship-text">Chọn hình thức vận chuyển :</p>
          <Select placeholder="chọn hình thức thanh toán" allowClear onChange={onchangeShip}>
            <Option value="fastShipping">vận chuyển siêu tốc : 30,000 VND</Option>
            <Option value="normalShipping">vận chuyển thương : 15,000 VND</Option>
          </Select>
        </div>
      )}

      <h2>
        Tổng tiền: <span>{totalMoney.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span> VND
      </h2>
      {user.id && (
        <>
          <div className="cart__voucher">
            {voucher && selectedRowKeys.length > 0 && (
              <div className="voucher__item">
                <p>
                  {voucher.content} sale {voucher.sale} %
                </p>
                <span onClick={deleteChoseVoucher}>x</span>
              </div>
            )}
            {selectedRowKeys.length > 0 && (
              <Button type="primary" onClick={showListVoucher}>
                Chọn mã
              </Button>
            )}
            <span style={{ marginLeft: '10px', color: '#fe9705' }}>
              ( Free ship khi thanh toán online )
            </span>
          </div>
        </>
      )}

      {
        user.id && selectedRowKeys.length > 0 && (
          <div
            style={{ textAlign: 'right', marginBottom: '10px'}}
          >
            <b>Địa chỉ giao hàng: </b>
            {
              useAddress && addressEdit ? (
                <span>{addressEdit}</span>
              ) : (
                <span>{user.address}</span>
              )
            }
            <Button type="primary" onClick={() => setEditAddress(true)} style={{marginLeft: '10px'}}>
              Thay đổi
            </Button>
          </div>
        )
      }
      <div className="cart__button">
        <Button
          type="primary"
          danger
          onClick={deleteListItem}
          disabled={!hasSelected}
          loading={loading}
        >
          Xoá
        </Button>

        <Button
          className="cart__button--pay"
          type="primary"
          onClick={PayCart}
          disabled={!hasSelected}
          loading={loading}
          style={{ marginLeft: '10px' }}
        >
          Thanh toán trực tiếp
        </Button>

        {user.id && (
          <Button
            className="cart__button--pay"
            type="primary"
            onClick={PayCartOnline}
            disabled={!hasSelected}
            loading={loading}
          >
            Thanh toán online
          </Button>
        )}
      </div>
      <div className="paypal">
        {checkPaypal && <Paypal paySuccess={paySuccess} moneyPayOl={moneyPayOl} />}
      </div>
      <div className="cart__mymodel">
        <div className="cart__mymodal__body">
          <Modal visible={visible} title="Điền thông tin" onCancel={onReset} className="modalCart">
            <Form
              name="basic"
              form={form}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <label>Họ tên:</label>
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Please input your username!' },
                  ({ getFieldValue }) => ({
                    validator(rule, value = '') {
                      if (value.length > 20) {
                        return Promise.reject('Minimum 20 characters');
                      } else {
                        return Promise.resolve();
                      }
                    },
                  }),
                ]}
              >
                <Input />
              </Form.Item>
              <label>Số điện thoại:</label>
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: '' },
                  ({ getFieldValue }) => ({
                    validator(rule, value = '') {
                      const re = /((09|03|07|08|05)+([0-9]{8})\b)/g;
                      if (!re.test(value)) {
                        return Promise.reject('vui lòng nhập đúng định dạng số điện thoại');
                      } else {
                        return Promise.resolve();
                      }
                    },
                  }),
                ]}
              >
                <Input />
              </Form.Item>
              <label>Email:</label>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  ({ getFieldValue }) => ({
                    validator(rule, value = '') {
                      //eslint-disable-next-line
                      const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                      if (value.length > 0 && !re.test(value)) {
                        return Promise.reject('email chưa đúng đinh dạng');
                      } else {
                        return Promise.resolve();
                      }
                    },
                  }),
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

              <Form.Item className="groupButton">
                <Button className="btnSubmit" type="primary" danger onClick={onReset}>
                  Huỷ
                </Button>
                <Button className="btnSubmit" type="primary" htmlType="submit">
                  Đăt hàng
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
        <div className="cart__mymodel__alert">
          <Modal title="Thông báo" visible={visibleAlert} onCancel={handleCancel}>
            <p>Bạn đang có một vài sản phẩm vượt quá số lượng</p>
            <p>bạn có thể giảm số lượng đi và tiếp tục mua hàng!</p>
            <div className="cart__mymodel__alert-btn">
              <Button type="primary" onClick={handleCancel}>
                Đồng ý
              </Button>
            </div>
          </Modal>
          {idOrder && (
            <>
              <Modal
                title="Thông báo đặt hàng thành công"
                visible={visibleAlertPay}
                onCancel={handleCancelAlertOrder}
              >
                <p>Đơn hàng của bạn đã được đặt thành công</p>
                <p>Đây là mã đơn hàng của bạn: <b>{idOrder}</b></p>
                <p>
                  Bạn có thắc mắc gì về đơn hàng có thể liên hệ đến số điện thoại 0963310336 để được
                  tư vấn
                </p>
                <div className="cart__mymodel__alert-btn">
                  <Button type="primary" onClick={handleCancelAlertOrder}>
                    Đồng ý
                  </Button>
                </div>
              </Modal>
            </>
          )}
        </div>
      </div>
      <div className="cart__mymodel">
        <div className="cart__mymodel__alert">
          {listVoucher && listVouchers && (
            <>
              <Modal
                title="Danh sách voucher của bạn"
                visible={statusListVoucher}
                onCancel={handleCancelListVoucher}
              >
                <div>
                  <label>Nhập mã của bạn: </label>
                  <input
                    value={valueSearchVoucher}
                    onChange={changeInputVoucher}
                    style={{ margin: '0px 10px', height: '30px' }}
                  />
                  <Button type="primary" onClick={searchVoucher}>
                    Tìm
                  </Button>
                  <Button
                    type="primary"
                    danger
                    style={{ marginLeft: '10px' }}
                    onClick={deleteSearchVoucher}
                  >
                    Huỷ
                  </Button>
                </div>
                {listVoucher.length > 0 &&
                  listVoucher.map((item) => {
                    return (
                      <div className="voucherItem" key={item.id} style={{ marginBottom: '10px' }}>
                        {checkDate(item) ? (
                          <div className="voucherItem__hidden">
                            <p>Đã hết hạn</p>
                          </div>
                        ) : checkUseNumber(item) ? (
                          <div className="voucherItem__hidden">
                            <p>Đã lượt sử dụng</p>
                          </div>
                        ) : (
                          <></>
                        )}
                        <div className="voucherItem__number" style={{ textAlign: 'center' }}>
                          {item.sale}%
                        </div>
                        <div className="voucherItem__content">
                          <span>{item.content}</span>
                          <div className="voucherItem__content__date">
                            <span>{item.dateStart.slice(0, 10)}</span> đến
                            <span>{item.dateEnd.slice(0, 10)}</span>
                          </div>
                        </div>
                        <div className="voucherItem__button">
                          <Button
                            onClick={() => deleteVoucher(item)}
                            style={{ bottom: '50px', zIndex: '10' }}
                          >
                            Xoá
                          </Button>
                          <Button onClick={() => addVoucher(item)}>Dùng</Button>
                        </div>
                      </div>
                    );
                  })}
              </Modal>
            </>
          )}
        </div>
      </div>
      <div className="cart__mymodel">
        <div className="cart__mymodel__alert">
          <Modal
            title="Thông báo"
            visible={statusCheckUser}
            onCancel={handleCancelCheckUser}
          >
            <div>
              <div>
                <p>{checkProfileUser()} hãy thêm để thực hiện thanh toán</p>
              </div>
              <div className="cart__mymodel__alert-btn">
                  <Link to="/profileUser">
                    <Button type="primary" style={{marginRight: '10px'}}>
                      Đồng ý
                    </Button>
                  </Link>
                  <Button danger type="primary" onClick={handleCancelCheckUser}>
                    Huỷ
                  </Button>
                </div>
            </div>
          </Modal>
        </div>
      </div>
      <div className="cart__mymodel">
        <div className="cart__mymodel__alert">
          <Modal
            title="Thay đổi địa chỉ gia hàng"
            visible={editAddress}
            onCancel={handleCancelEditAddress}
          >
            <div>
              <p>Nhập địa chỉ bạn muốn chúng tôi gửi hàng đến:</p>
              <Input type="text" onChange={changeInputEditAddress} value={addressEdit}/>
              <div className="cart__mymodel__alert-btn" style={{marginTop: '10px'}}>
                  <Button type="primary" onClick={useAddressNew} style={{marginRight: '10px',}}>
                    sử dụng
                  </Button>
                  <Button danger type="primary" onClick={handleCancelEditAddress}>
                    Huỷ
                  </Button>
                </div>
            </div>
          </Modal>
          </div>
      </div>
    </div>
  );
};

export default Cart;
