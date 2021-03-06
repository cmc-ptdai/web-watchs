import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, DatePicker, Popconfirm} from 'antd';
import { useDispatch } from 'react-redux';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import './orders.scss'
import orderApi from '../../../api/apiOrders'
import apiProduct from '../../../api/apiProduct'
import FormEditOrder from './FormEditOrder';
import {deleteOrder}  from '../../../redux/action/orderAction'
import { incrementProduct } from '../../../redux/action/productAction'
import ExportToExcel  from '../ExportToExcel';

const { RangePicker } = DatePicker;

const Pending = (props) => {
  const dispatch = useDispatch()

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [dataOrder, setDataOrder] = useState([])
  const [statusFrom, setStatusFrom] = useState(null)
  const [dataEditOrder, setDataEditOrder] = useState({})
  const [dateSearch, setDateSearch] = useState([])
  const [listProduct, setListProduct] = useState(null)

  useEffect(() => {
    setTimeout(() => {
      fetchData()
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.statusProps,statusFrom])

  const fetchData = async () => {
    try {
      const newData = await apiProduct.getAllProduct()
      const listOrder = await orderApi.getAllOrders()
      const newListOrders = listOrder.filter(item => item.status === props.statusProps)
      setDataOrder(newListOrders);
      setListProduct(newData)
    } catch (error) {
      console.log(error);
    }
  }

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>

          <Button
            onClick={() => {
              handleReset(clearFilters)
              //fetchData()
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>

          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button> */}
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',

    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('')
  };

  const columns = [
    {
      title: 'T??n ng?????i mua',
      dataIndex: 'username',
      key: 'username',
      fixed: 'left',
      width: 150,
      ...getColumnSearchProps('username'),
    },
    {
      title: 'S??? ??i???n tho???i',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      ...getColumnSearchProps('phone'),
    },
    {
      title: '?????a ch???',
      dataIndex: 'address',
      key: 'address',
      width: 300,
      ...getColumnSearchProps('address'),
    },
    {
      title: 'Danh s??ch m???t h??ng',
      key: 'listProduct',
      fixed: 'listProduct',
      width: 170,
      render: (text, record) => (
          <>
            <ul>
            {
              record.listProduct.map((item, index) => {
                return (
                  <li key={index}>{item.name},</li>
                )
              })
            }
            </ul>
          </>
      ),
    },
    {
      title: 'H??nh th???c giao h??ng',
      dataIndex: 'transportFee',
      key: 'transportFee',
      width: 150,
      render: (text, record) => (
          <>
            <p>{text}</p>
          </>
      ),
    },
    {
      title: 'T???ng ti???n',
      dataIndex: 'money',
      key: 'money',
      width: 120,
      sorter: (a, b) => a.money.length - b.money.length,
      render: (text, record) => (
        <>
          <span>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND</span>
        </>
      ),
    },
    {
      title: 'H??nh th???c thanh to??n',
      dataIndex: 'payments',
      key: 'payments',
      width: 120
    },
    {
      title: 'Ng??y t???o',
      dataIndex: 'dateCreate',
      key: 'dateCreate',
      width: 200,
      sorter: (a, b) => moment(a.dateCreate).format('x') - moment(b.dateCreate).format('x'),
      render: (text) => (
        <p>{text.slice(0,10)}</p>
      )
    },
    {
      title: 'Ng??y s???a',
      dataIndex: 'dateUpdate',
      key: 'dateUpdate',
      width: 200,
      sorter: (a, b) => moment(a.dateCreate).format('x') - moment(b.dateCreate).format('x'),
      render: (text) => (
        <p>{text.slice(0,10)}</p>
      )
    },
    {
      title: 'status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      fixed: 'right',
    },
    {
      title: 'Thao t??c',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
        <div className="tableUser__button">
          <Button
            type="primary"
            onClick={() => editOrder(record)}
          >
            Edit</Button>
          <Popconfirm
              title="B???n c?? mu???n x??a ????n h??ng n??y kh??ng?"
              onConfirm={() => deleteOrderTable(record)}
              onCancel={handleCancel}
            >
              <Button
                danger
              >
                Delete
              </Button>
            </Popconfirm>
        </div>
      ),
    },
  ];


  const handleCancel = () => {

  }

  const editStatusFrom = (childData) => {
    setStatusFrom(childData)
  };

  const deleteOrderTable = (record) => {
    const newData = {
      ...record,
      dateUpdate: new Date(),
    }
    dispatch(deleteOrder(record.id))
    dispatch(incrementProduct({ dataOrder :newData, product: listProduct}))
    setTimeout(() => {
      fetchData()
    }, 500);
  }

  const editOrder = (record) => {
    setDataEditOrder(record)
    setStatusFrom(true)
  }

  const onChange = (date, dateString) => {
    setDateSearch(dateString)
  }

  const searchProductDate = () => {
    if (props.statusProps === 'pending') {
      const newList =  dataOrder.filter(item => (item.dateCreate.slice(0,10) >= dateSearch[0] && item.dateCreate.slice(0,10) <= dateSearch[1]))
      setDataOrder(newList)
    } else {
      const newList =  dataOrder.filter(item => (item.dateUpdate.slice(0,10) >= dateSearch[0] && item.dateUpdate.slice(0,10) <= dateSearch[1]))
      setDataOrder(newList)
    }
  }

  const resetSearch = () => {
    setDateSearch([])
    fetchData()
  }

  const headers = [
    { label: "T??n ng?????i mua", key: "username" },
    { label: "S??? ??i???n tho???i", key: "phone" },
    { label: "?????a ch???", key: "address" },
    { label: "T???ng ti???n", key: "money" },
    { label: "H??nh th???c thanh to??n", key: "payments" },
    { label: "Ng??y t???o", key: "dateCreate" },
    { label: "Ng??y s???a", key: "dateUpdate" }
  ]

  const fileName1 = "order-"  + props.statusProps + ".csv"
  return (
    <>
    <div className="search-order-date">
      <RangePicker  onChange={onChange}/>
      <div className="search-order-date-button">
        <Button
          onClick={searchProductDate}
          type="primary"
        >
          Tim Ki???m
        </Button>

        <Button
          onClick={resetSearch}
          danger
        >
          Reset
        </Button>

        <ExportToExcel csvData={dataOrder} headers={headers} fileName1={fileName1}/>
      </div>
    </div>
    {
      statusFrom && <FormEditOrder data={dataEditOrder} editStatusFrom= {editStatusFrom} statusOrder = {props.statusProps}/>
    }
    {
      dataOrder && <Table columns={columns} scroll={{ x: 1500}} dataSource={dataOrder} rowKey="id"/>
    }
    </>
  )
}

export default Pending
