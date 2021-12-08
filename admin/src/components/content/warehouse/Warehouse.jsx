import React, { useEffect, useState} from 'react';
import { Table, Button, DatePicker,Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import apiProduct from '../../../api/apiProduct'
import apiWarehouse from '../../../api/apiWarehouse'
import './warehouse.scss'

const { RangePicker } = DatePicker;

const Warehouse = () => {

  const [listProduct, setListProduct] = useState(null)
  const [warehouses, setWarehouses] = useState(null)
  const [status, setStatus] = useState(false)
  const [inputSearch, setInputSearch] = useState(null)
  const [dateSearch, setDateSearch] = useState([])
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')

  useEffect(() => {
    fetchProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(() => {
    fetchWarehouse()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[status])

  const fetchProduct = async () => {
    const newData = await apiProduct.getAllProduct()
    setListProduct(newData)
  }

  const fetchWarehouse = async () => {
    const listWarehouse = await apiWarehouse.getWarehouse()
    setWarehouses(listWarehouse)
    setDateSearch(listWarehouse)
    if (inputSearch !== null) {
      searchProductDate()
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
      title: 'Id product',
      dataIndex: 'id',
      key: 'id',
      width: 530,
      ...getColumnSearchProps('id'),
    },
    {
      title: 'Name product',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => (
        <p>{ fetchNameProduct(text)}</p>
      )
    },
  ];

  const fetchNameProduct = (id) => {
    const a = listProduct.filter(item => item.id === id);
    if (a.length > 0) {
      return a[0].name
    }
    return false
  }

  const deleteWarehouseItem = (id, index) => {
    dateSearch.forEach((elem,index2) => {
      if (elem.id === id) {
        for (let i = 0; i < elem.listWarehouse.length; i++) {
          if (i === index) {
            const newList =  elem.listWarehouse.filter((item,index1)=> index1 !== index)
            const newItem = {
              id: elem.id,
              listWarehouse: newList
            }
            dateSearch[index2].listWarehouse = newList
            apiWarehouse.editWarehouse(elem.id, newItem)
            setStatus(!status)
            break
          }
        }
      }
    });
  }

  const onChangeInput = (date, dateString) => {
    setInputSearch(dateString)
  }

  const searchProductDate = () => {
    const listWarehouseSearch = []
    dateSearch.forEach((elem,index2) => {
      for (let i = 0; i < elem.listWarehouse.length; i++) {
        if (elem.listWarehouse[i].dateInput.slice(0,10) >= inputSearch[0] && elem.listWarehouse[i].dateInput.slice(0,10) <= inputSearch[1]) {
          listWarehouseSearch.push(elem)
          break
        }
      }
    });
    setWarehouses(listWarehouseSearch);
  }

  const resetSearch = () => {
    setInputSearch(null)

    setStatus(!status)
  }
  return (
    <>
      <div className="search-order-date">
        <RangePicker  onChange={onChangeInput}/>
        <div className="search-order-date-button">
          <Button
            onClick={searchProductDate}
            type="primary"
          >
            Tim Kiếm
          </Button>

          <Button
            onClick={resetSearch}
            danger
          >
            Reset
          </Button>
        </div>
      </div>
      {
        listProduct && warehouses && (
          <Table
            className="components-table-demo-nested"
            columns={columns}
            expandable={{
              expandedRowRender: (record) => (
                record.listWarehouse.map((item, index) => {
                  return (
                    <div key={index}>
                      <div className="children-warehouse">
                        {
                          index === 0 && (
                            <>
                              <div className="title">ngày nhập</div>
                              <div className="title"> số lượng nhâp</div>
                              <div className="title"> số lượng bán</div>
                              <div className="title">action</div>
                            </>
                          )
                        }
                      </div>
                      <div className="children-warehouse">
                        <p>ngày nhập: {item.dateInput.slice(0,10).split('-').reverse().join('-')}</p>
                        <p>số lượng nhâp: {item.numberProduct}</p>
                        <p>số lượng bán: {item.numberCount}</p>
                        <div className="button1">
                          <Button
                            onClick={() => deleteWarehouseItem(record.id, index)}
                            danger>
                            delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                }
                )
              ),
            }}
            dataSource={warehouses}
            rowKey="id"
          />
        )
      }
    </>
  );
}

export default Warehouse;
