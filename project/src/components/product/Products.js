import React, { useEffect, useState } from 'react'
import SearchProduct from './search/SearchProduct'
import productApi from '../../api/productApi'
import Sort from './sort/Sort'
import './products.scss'
import { Link } from 'react-router-dom'
import MyPagination from './MyPagination'
import { Breadcrumb } from 'antd'

const Products = ({gender}) => {
  const [products, setProducts] = useState([])
  const [listSort, setListSort] = useState(null)
  const [listKeySort, setListKeySort] = useState({})

  const fetchProducts = async () => {
    try {
      let response = []
      if (gender === '') {
        response = await productApi.getAll()
      } else {
        const params = {
          gender: gender
        }
        response = await productApi.getAll(params)
      }
      setProducts(response)
      setListSort(response)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    sortListKey()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listKeySort])

  const sortListKey = () => {
    const lengthKey = Object.keys(listKeySort)
    let newArr = [...products]
    if (lengthKey.length > 0) {
      for (const key in listKeySort) {
        if (key === 'price') {
          newArr = newArr.filter((element) => Number(element[key]) >= listKeySort.price.price1 && Number(element[key]) < listKeySort.price.price2)
        } else {
          newArr = newArr.filter((element) => element[key] === listKeySort[key] )
        }
      }
      setListSort(newArr);
    } else {
      setListSort(products)
    }
  }


  const searchByPrice1 = value => {
    let newList = {}
    if (listKeySort?.price) {
      if (listKeySort.price.price1 === value.price1 && listKeySort.price.price2 === value.price2) {
        delete listKeySort.price;
        newList = {...listKeySort}
      } else {
        newList = {
          ...listKeySort,
          price: value
        }
      }
    } else {
      newList = {
        ...listKeySort,
        price: value
      }
    }
    setListKeySort(newList)
  }

  const searchByType= (type) => {
    let newList = {}
    if (listKeySort?.type) {
      if (listKeySort.type === type) {
        delete listKeySort.type;
        newList = {...listKeySort}
      } else {
        newList = {
          ...listKeySort,
          brand: type
        }
      }
    } else {
      newList = {
        ...listKeySort,
        brand: type
      }
    }
    setListKeySort(newList)
  }

  const searchByCountry= (country) => {
    let newList = {}
    if (listKeySort?.country) {
      if (listKeySort.country === country) {
        delete listKeySort.country;
        newList = {...listKeySort}
      } else {
        newList = {
          ...listKeySort,
          country: country
        }
      }
    } else {
      newList = {
        ...listKeySort,
        country: country
      }
    }
    setListKeySort(newList)
  }

  const sortProduct1 = key => {
    if (key === "1") {
      const newArr = [...listSort]
      newArr.sort((a, b) => {
        if (a.price < b.price) {
          return -1;
        } else {
          return 0
        }
      })
      setListSort(newArr)
    }
    if (key === '2') {
      const newArr = [...listSort]
      newArr.sort((a,b) => {
        if (a.price > b.price) {
          return -1;
        } else {
          return 0
        }
      })
      setListSort(newArr)
    }
    if (key === '3') {
      const newArr = [...listSort]
      newArr.sort((a,b) => {
        if (a.name < b.name) {
          return -1;
        } else {
          return 0
        }
      })
      setListSort(newArr)
    }
    if (key === '4') {
      const newArr = [...listSort]
      newArr.sort((a,b) => {
        if (a.name > b.name) {
          return -1;
        } else {
          return 0
        }
      })
      setListSort(newArr)
    }
  }

  return (
    <div className="products">

      <div className="col-12">
        <div className="row">
          <div className="col-9">
            <span>
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
              </Breadcrumb>
            </span>
          </div>
          <div className="col-3 sort">
            <Sort sortProduct={sortProduct1}/>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-3">
          <SearchProduct
            searchByPrice={searchByPrice1}
            searchByType={searchByType}
            searchByCountry={searchByCountry}
          />
        </div>

        <div className="col-lg-9 products__content">
          <div className="row">
            <MyPagination listSort={listSort}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
