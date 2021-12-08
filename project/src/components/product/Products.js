import React, { useEffect, useState } from 'react'
import SearchProduct from './search/SearchProduct'
import productApi from '../../api/productApi'
import Sort from './sort/Sort'
import './products.scss'
import { Link } from 'react-router-dom'
import MyPagination from './MyPagination'
import { Breadcrumb } from 'antd'

const Products = ({typeID, species1}) => {
  const [products, setProducts] = useState(null)
  const [listSort, setListSort] = useState(null)
  const [listKeySort, setListKeySort] = useState({})

  const fetchProducts = async () => {
    const params = {
      typeID: ''
    }
    if(typeID !== '' && species1 !== '') {
      params.typeID = typeID
      params.species = species1
    } else {
      params.typeID = typeID
    }
    try {
      let response = []
      if (params.typeID === '') {
        response = await productApi.getAll()
      } else {
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
    const newArr = []
    const lengthKey = Object.keys(listKeySort)
    if (lengthKey.length > 0) {
      products.forEach(item => {
        let count = 0
        for (let key in listKeySort) {
          if (key === 'price') {
            if (item.price >= listKeySort[key].price1 && item.price <= listKeySort[key].price2) {
              count = count + 1
            }
          }
          if (key === 'type') {
            if (item.typeID === listKeySort[key]) {
              count = count + 1
            }
          }
          if (key === 'country') {
            if (listKeySort[key] === 'khac') {
              if (item.country !== 'viet nam' && item.country !== 'uc' && item.country !== 'trung quoc') {
                count = count + 1
              }
            } else {
              if (item.country === listKeySort[key]) {
                count = count + 1
              }
            }
          }
        }
        if (lengthKey.length === count) {
          newArr.push(item)
        }
      })
    }
    setListSort(newArr)
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
          type: type
        }
      }
    } else {
      newList = {
        ...listKeySort,
        type: type
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
