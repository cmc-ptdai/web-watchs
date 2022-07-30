import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button,  Input } from 'antd';
import FormAddProduct from './FormAddProduct'
import MyPagination from './MyPagination';
import './product.scss'
import { useParams } from 'react-router-dom'

const Product = () => {
  const param = useParams()
  const product = useSelector(store => store.productReducer)
  const [listProducts, setListProducts] = useState([])
  const [inputSearch, setInputSearch] = useState('')
  const [statusFromAdd, setEditStatusFrom] = useState(false)
  const [dataDf, setDataDf] = useState([])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[product, param])

  const fetchData = () => {
    const newList = product.filter(elem => elem.supplier === param.id)
    setDataDf(newList)
    setListProducts(newList)
  }

  const searchProduct = () => {
    if (inputSearch === "") {
      setListProducts(dataDf)
    } else {
      const arrSearch = listProducts.filter(item => (item.name.toLowerCase().indexOf(inputSearch.toLowerCase()) !== -1 ))
      setListProducts(arrSearch)
    }
  }

  const changeInputSearch = (e) => {
    setInputSearch(e.target.value)
  }
  const AddProduct = () => {
    setEditStatusFrom(true)
  }

  const editStatusFrom = (setToForm) => {
    setEditStatusFrom(setToForm)
  }

  return (
    <>
      {
        statusFromAdd && <FormAddProduct editStatusFrom={editStatusFrom} typeSuppliers={param.id}/>
      }
      <div className="tableUser">
        <div className="tableUser__action" style={{width: '90%'}}>
          <div className="tableUser__action--search" style={{width: '45%'}}>
            <Input type="text" name="search" placeholder="Tim kiếm...." onChange={changeInputSearch} value={inputSearch}/>
            <i className="fas fa-search" onClick={searchProduct}></i>
          </div>
          <div className="tableUser__action--addUser" style={{width: '55%'}}>
            <Button
              type="primary"
              onClick={AddProduct}
            >
              Add Product
            </Button>
          </div>
        </div>
      </div>
      <div className="listProduct">
        <MyPagination  listSort={listProducts}/>
      </div>
    </>
  )
}

export default Product;
