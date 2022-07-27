import React, { useEffect, useState } from "react";
import { Table, Button, DatePicker, Input, Space, Popconfirm } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
//import apiProduct from '../../../api/apiProduct'
//import apiWarehouse from '../../../api/apiWarehouse'
import { useParams } from "react-router-dom";
import ApiListProductSuppliers from "../../../api/apiListProductSuppliers";
import { useSelector } from "react-redux";

const { RangePicker } = DatePicker;

const Suppliers = () => {
  //const [listProduct, setListProduct] = useState(null)
  const param = useParams();
  const products = useSelector((store) => store.productReducer);
  const [status, setStatus] = useState(false);
  const [inputSearch, setInputSearch] = useState(null);
  const [dateSearch, setDateSearch] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [listProductSupplies, setListProductSupplies] = useState(null);
  const [ListDataSort, setListDataSort] = useState(null);

  // useEffect(() => {
  //   fetchProduct()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // },[])

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    sortList();
  }, [listProductSupplies, products]);
  const fetchList = async () => {
    const newData = await ApiListProductSuppliers.getAllSuppliers();
    setListProductSupplies(newData);
  };

  // const fetchProduct = async () => {
  //   const newData = await apiProduct.getAllProduct()
  //   setListProduct(newData)
  // }

  // const fetchWarehouse = async () => {
  //   const listWarehouse = await apiWarehouse.getWarehouse()
  //   setWarehouses(listWarehouse)
  //   setDateSearch(listWarehouse)
  //   if (inputSearch !== null) {
  //     searchProductDate()
  //   }
  // }

  const sortList = () => {
    const newProduct = [];
    if (listProductSupplies) {
      listProductSupplies.forEach((item) => {
        if (item.idSuppliers === param.id) {
          newProduct.push(item);
        }
      });
    }

    if (products) {
      const listData = [];
      products.forEach((item) => {
        const newList = {
          id: item.id,
          name: item.name,
          listNumberAdd: [],
        };
        newProduct.forEach((elem) => {
          if (item.id === elem.idProduct) {
            newList.listNumberAdd.push(elem);
          }
        });
        if (newList.listNumberAdd.length > 0) {
          listData.push(newList);
        }
      });
      setDateSearch(listData);
      setListDataSort(listData);
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
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
              handleReset(clearFilters);
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
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",

    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const columns = [
    {
      title: "Id product",
      dataIndex: "id",
      key: "id",
      width: 530,
      ...getColumnSearchProps("id"),
    },
    {
      title: "Name product",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        // <p>{ fetchNameProduct(text)}</p>
        <p>{text}</p>
      ),
    },
  ];

  // const fetchNameProduct = (id) => {
  //   const a = listProduct.filter(item => item.id === id);
  //   if (a.length > 0) {
  //     return a[0].name
  //   }
  //   return false
  // }

  const deleteWarehouseItem = (item) => {
    ApiListProductSuppliers.deleteSuppliersAction(item.id)
    fetchList()
    setStatus(!status)
    // dateSearch.forEach((elem,index2) => {
    //   if (elem.id === id) {
    //     for (let i = 0; i < elem.listWarehouse.length; i++) {
    //       if (i === index) {
    //         const newList =  elem.listWarehouse.filter((item,index1)=> index1 !== index)
    //         const newItem = {
    //           id: elem.id,
    //           name: elem.name,
    //           listWarehouse: newList
    //         }
    //         dateSearch[index2].listWarehouse = newList
    //         apiWarehouse.editWarehouse(elem.id, newItem)
    //         setStatus(!status)
    //         break
    //       }
    //     }
    //   }
    // });
  };

  const onChangeInput = (date, dateString) => {
    setInputSearch(dateString);
  };

  const searchProductDate = () => {
    const listSearch = [];
    ListDataSort.forEach((elem, index2) => {
      for (let i = 0; i < elem.listNumberAdd.length; i++) {
        const date = new Date(elem.listNumberAdd[i].dateInput);
        const month =
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1).toString()
            : (date.getMonth() + 1).toString();
        const c =
          date.getFullYear().toString() +
          "-" +
          month +
          "-" +
          date.getDate().toString();
        const dateTime = new Date(c).getTime();
        const dateTime1 = new Date(inputSearch[0]).getTime();
        const dateTime2 = new Date(inputSearch[1]).getTime();
        if (dateTime >= dateTime1 && dateTime <= dateTime2) {
          listSearch.push(elem);
        }
      }
    });
    setDateSearch(listSearch);
  };

  const resetSearch = () => {
    setInputSearch(null);
    setStatus(!status);
  };

  const handleCancelButton = () => {};

  const formatDate = (dateInput) => {
    const date = new Date(dateInput);
    const month =date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
    const c = date.getFullYear().toString() + "-" + month + "-" + date.getDate().toString();
    return c
  }
  return (
    <>
      <div className="search-order-date">
        <RangePicker onChange={onChangeInput} />
        <div className="search-order-date-button">
          <Button onClick={searchProductDate} type="primary">
            Tim Kiếm
          </Button>

          <Button onClick={resetSearch} danger>
            Reset
          </Button>
        </div>
      </div>
      {dateSearch && (
        <Table
          className="components-table-demo-nested"
          columns={columns}
          expandable={{
            expandedRowRender: (record) =>
              record.listNumberAdd.map((item, index) => {
                return (
                  <div key={index}>
                    <div className="children-warehouse">
                      {index === 0 && (
                        <>
                          <div className="title">ngày nhập</div>
                          <div className="title"> số lượng nhâp</div>
                          <div className="title">action</div>
                        </>
                      )}
                    </div>
                    <div className="children-warehouse">
                      <p>
                        ngày nhập: {formatDate(item.dateInput)}
                      </p>
                      <p>số lượng nhâp: {item.numberInput}</p>
                      <div className="button1">
                        <Popconfirm
                          title="Bạn có muốn lượt nhập hàng này không?"
                          onConfirm={() => deleteWarehouseItem(item)}
                          onCancel={handleCancelButton}
                        >
                          <Button danger>Delete</Button>
                        </Popconfirm>
                      </div>
                    </div>
                  </div>
                );
              }),
          }}
          dataSource={dateSearch}
          rowKey="id"
        />
      )}
    </>
  );
};

export default Suppliers;
