import React, {useEffect,useState} from "react";
import { Select, Input, Modal, Table, Button } from 'antd';
import './orders.scss'
import { useDispatch } from 'react-redux';
import { editOrder } from '../../../redux/action/orderAction'
import { countProduct, incrementProduct } from '../../../redux/action/productAction'
import apiProduct from '../../../api/apiProduct'
import apiOrders from '../../../api/apiOrders'

const { Option } = Select;
const FromEditOrder = (props) => {

  const dispatch = useDispatch()
  const [dataForm, setDataForm] = useState({...props.data})
  const [dataLocal ,setDataLocal] = useState(null)
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [listProduct, setListProduct] = useState(null)

  useEffect(() => {
    setDataTotal()
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  const fetchData = async () => {
    const newData = await apiProduct.getAllProduct()
    const newOrders= await apiOrders.getOrdersById(props.data.id)
    setDataLocal(newOrders)
    setListProduct(newData)
  }
  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => (
        <p>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND</p>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'count',
      key: 'count',
      render: (text, record) => (
        <div className="table__order__groupCount">
          <button
            className={dataForm.status === "pending" ? "table__order__groupCount--minus" : "display-none"}
            onClick={() => decrement(record.id)}
            disabled = {record.count === 1  ? true : false}
          >-</button>
          {
            dataForm.status === "pending" ?
              (<input type="text" value={text} onChange={getNumberInput} id={record.id}/>) :
              (<p style={{ textAlign: 'center', width: '100%' }}>{text}</p>)
          }
          <button
            className={dataForm.status === "pending" ? "table__order__groupCount--plus" : "display-none"}
            onClick={() => increment(record.id)}
            disabled = {record.count > record.countPay  ? true : false}
          >+</button>
        </div>
      ),
    },
    {
      title: 'Giảm giá  (%)',
      dataIndex: 'sale',
      key: 'sale',
    },
    {
      title: 'Tổng tiền',
      dataIndex: '',
      key: '',
      render: (text, record) => (
        <p>{((record.price * record.count) - (((record.price * record.count)*record.sale)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND</p>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 140,
      render: (text, record) => (
          <div className= {(dataForm.status === 'pending' && dataForm.listProduct.length > 1) ? 'tableUser__button' : 'display-none'}>
            <Button
              type="primary"
              onClick={() => deleteProductByOrder(record)}
              danger
            >
              Delete</Button>
          </div>
      ),
    },
  ];
  const increment = (id) => {
    const newData = {...dataForm}
    const indexProduct = listProduct.findIndex(item => item.id === id)
    const index = newData.listProduct.findIndex(item => item.id === id)
    if (listProduct[indexProduct].countPay - 1 < 0) {
      return
    } else {
      newData.listProduct[index].count = newData.listProduct[index].count + 1
      listProduct[indexProduct].countPay = listProduct[indexProduct].countPay - 1
    }
    setDataForm(newData);
    setDataTotal()
  }
  const decrement = (id) => {
    const newData = {...dataForm}
    const indexProduct = listProduct.findIndex(item => item.id === id)
    const index = newData.listProduct.findIndex(item => item.id === id)
        if (newData.listProduct[index].count - 1 <= 0 ) {
          newData.listProduct[index].count = 1
        } else {
          newData.listProduct[index].count = newData.listProduct[index].count - 1
          listProduct[indexProduct].countPay = listProduct[indexProduct].countPay + 1
        }
    setDataForm(newData);
    setDataTotal()
  }
  const getNumberInput = (e) => {
    const newData = {...dataForm}
    const indexProduct = listProduct.findIndex(item => item.id === e.target.id)
    const index = newData.listProduct.findIndex(item => item.id === e.target.id)
    if(isNaN(e.target.value)) {
      return
    } else {
      if (Number(e.target.value) > (listProduct[indexProduct].countPay + newData.listProduct[index].count)) {
        newData.listProduct[index].count = listProduct[indexProduct].countPay + newData.listProduct[index].count
        listProduct[indexProduct].countPay = 0
      } else {
        if (Number(e.target.value) <= 0) {
          listProduct[indexProduct].countPay = listProduct[indexProduct].countPay + (newData.listProduct[index].count - 1)
          newData.listProduct[index].count = 1
          return
        } else {
          listProduct[indexProduct].countPay = listProduct[indexProduct].countPay + (newData.listProduct[index].count - Number(e.target.value))
          newData.listProduct[index].count = Number(e.target.value)
        }
      }
    }
    setDataForm(newData);
    setDataTotal()
  }

  const deleteProductByOrder = (record) => {
    for (let i = 0; i < dataForm.listProduct.length; i++) {
      if (dataForm.listProduct[i].id === record.id) {
        dataForm.listProduct = dataForm.listProduct.filter(item => item.id !== record.id)
        break
      }
    }
    setDataForm(dataForm);
    setDataTotal()
  }

  const setDataTotal = () => {
    let newDta1 = 0
    let newDta2 = 0
    dataForm.listProduct.forEach(item => {
      newDta1 = newDta1 + Number(item.price * item.count) - (((item.price * item.count)*item.sale)/100)
      newDta2 = newDta2 + Number(item.count)
    })
    setTotalPrice(newDta1);
    setTotalCount(newDta2);
  }

  const handleCancel =  () => {
    props.editStatusFrom(false)
  }

  const onchangeStatus = (e) => {
    const newData = {
      ...dataForm,
      status: e,
    }
    setDataForm(newData);
  }

  const onchangeInputName = (e) => {
    const newData = {
      ...dataForm,
      username: e.target.value,
    }
    setDataForm(newData);
  }

  const onchangeInputPhone = (e) => {
    const newData = {
      ...dataForm,
      phone: e.target.value,
    }
    setDataForm(newData);
  }

  const onchangeInputAddress = (e) => {
    const newData = {
      ...dataForm,
      phone: e.target.value,
    }
    setDataForm(newData);
  }

  const onFinish = () => {
    const newData = {
      ...dataForm,
      dateUpdate: new Date(),
    }

    if (dataForm.status === "cancelled") {
      dispatch(incrementProduct({ dataOrder :newData, product: listProduct}))
    }
    if (props.data.status === "pending") {
      const listDataDelete = []
      dataLocal.listProduct.forEach((item, index) => {
        let a = 0
        for (let i = 0; i < dataForm.listProduct.length; i++) {
          if (item.id === dataForm.listProduct[i].id) {
            if (item.count !== dataForm.listProduct[i].count) {
              const newOrder = {
                id: item.id,
                count: item.count - dataForm.listProduct[i].count
              }
              listDataDelete.push(newOrder)
              a = a + 1
            }
            return
          }
        }
        if (a === 0) {
          listDataDelete.push(item);
        }
      })
      dispatch(countProduct({listAdd: listDataDelete, Product: listProduct}))
    }
    dispatch(editOrder(newData))
    handleCancel()
  }
  return (
    <>
      <Modal
        className="form__edit"
        visible={true}
        title="Chi tiết đơn hàng"
        onCancel={handleCancel}
      >
        <label>Ngày tạo đơn: {dataForm.dateCreate}</label>
        <label>Ngày tạo sửa đơn: {dataForm.dateUpdate}</label>
        <br/>
        {
          (props.statusOrder === 'pending' || props.statusOrder === 'delivery') && (
            <>
              <label>Trạng thái đơn hàng:</label>
              <Select
                placeholder="Select a option and change input text above"
                allowClear
                defaultValue={dataForm.status}
                onChange={onchangeStatus}
              >
                {
                  props.statusOrder === 'pending' && <Option value="pending">Pending</Option>
                }
                <Option value="delivery">Delivery</Option>
                {
                  props.statusOrder === 'delivery' && <Option value="delivered">Delivered</Option>
                }

                {
                  props.statusOrder === 'pending' && <Option value="cancelled">Cancelled</Option>
                }
              </Select>
            </>
          )
        }

        <label>Tên người mua:</label>
        <Input
          name="name"
          onChange={onchangeInputName}
          defaultValue={dataForm.username}
        />
        <label>Số điện thoại:</label>
        <Input
          name="phone"
          onChange={onchangeInputPhone}
          defaultValue={dataForm.phone}
        />
        <label>Địa chỉ:</label>
        <Input
          name="address"
          onChange={onchangeInputAddress}
          defaultValue={dataForm.address}
        />

        <h3>Danh sách sản phẩm</h3>
        <Table
          className="table__order"
          columns={columns}
          dataSource={dataForm.listProduct}
          rowKey="id"
        />

        <h3>Tổng chi phí hoá đơn</h3>
        <ul className="form__edit__totals">
          <li>
            <div>Tổng số lượng sản phẩm:</div>
            <div>
              {
                totalCount
              }
            </div>
          </li>
          <li>
            <div>Tổng tiền:</div>
            <div>{totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND</div>
          </li>
        </ul>
        <div className="groupButton">
          <Button className="btnSubmit" type="primary" onClick={onFinish} >
            save
          </Button>
          <Button className="btnSubmit" type="primary" danger onClick={handleCancel}>
            close
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default FromEditOrder;
