import React, { useState } from 'react'
import './style.scss'

const SearchProduct = (props) => {
  const [country, setCountry] = useState([
    {
      type: 'viet nam',
      status: false,
      name: 'Việt Nam',
    },
    {
      type: 'uc',
      status: false,
      name: 'Úc',
    },
    {
      type: 'trung quoc',
      name: 'Trung Quốc',
      status: false,
    },
    {
      type: 'khac',
      name: 'khác',
      status: false,
    }
  ])
  const[typeProduct, setTypeProduct] = useState([
    {
      type: 'rau',
      status: false,
      name: 'Rau xanh',
    },
    {
      type: 'cu',
      status: false,
      name: 'Các loại củ',
    },
    {
      type: 'qua',
      status: false,
      name: 'Hoá quả tươi',
    },
    {
      type: 'nam',
      status: false,
      name: 'Các loại nấm',
    }
  ])
  const [prices, setPrices] = useState([
    {
      price1: 0,
      status: false,
      price2: 100000
    },
    {
      price1: 100000,
      status: false,
      price2: 200000
    },
    {
      price1: 200000,
      status: false,
      price2: 300000
    },
    {
      price1: 300000,
      status: false,
      price2: 500000
    },
    {
      price1: 500000,
      status: false,
      price2: 1000000
    },
    {
      price1: 1000000,
      status: false,
      price2: 9999999999999
    }
  ])

  const searchByPrice = (item) => {
    const newData = [...prices]
    newData.forEach((elem,index) => {
      if (elem.price1 === item.price1 && elem.price2 === item.price2 && elem.status === true) {
        newData[index] = {
          ...newData[index],
          status: false
        }
        return
      }
      if (elem.price1 === item.price1 && elem.price2 === item.price2) {
        newData[index] = {
          ...newData[index],
          status: true
        }
      } else {
        newData[index] = {
          ...newData[index],
          status: false
        }
      }
    })
    setPrices(newData)
    props.searchByPrice(item)
  }

  const searchByCountry = (item) => {
    const newData = [...country]
    newData.forEach((elem,index) => {
      if (elem.type === item.type && elem.status === true) {
        newData[index] = {
          ...newData[index],
          status: false
        }
        return
      }
      if (elem.type === item.type) {
        newData[index] = {
          ...newData[index],
          status: true
        }
      } else {
        newData[index] = {
          ...newData[index],
          status: false
        }
      }
    })
    setCountry(newData)
    props.searchByCountry(item.type)
  }

  const searchByType = (item) => {
    const newData = [...typeProduct]
    newData.forEach((elem,index) => {
      if (elem.type === item.type && elem.status === true) {
        newData[index] = {
          ...newData[index],
          status: false
        }
        return
      }
      if (elem.type === item.type) {
        newData[index] = {
          ...newData[index],
          status: true
        }
      } else {
        newData[index] = {
          ...newData[index],
          status: false
        }
      }
    })
    setTypeProduct(newData)
    props.searchByType(item.type)
  }

  return (
    <div className="search">
      <div className="box">
        <div className="search__title">
          <p>Loại sản phẩm</p>
        </div>
        <div className="search__content">
          <ul>
            {
              typeProduct.map((item, index) => {
                return (
                  <li
                    className={item.status === true ? 'active' : ''}
                    key={index}
                    onClick={() => searchByType(item)}
                  >
                    {item.name}
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
      <div className= "box" >
        <div className="search__title">
          <p>GIÁ SẢN PHẨM</p>
        </div>
        <div className="search__content">
          <ul>
            {
              prices.map((item, index) => {
                return (
                  <li
                    className={item.status === true ? 'active' : ''}
                    key={index}
                    onClick={() => searchByPrice(item)}
                  >
                    <p>
                      {item.price1 === 0 ? 'Dưới ' : item.price1 === 1000000 ? 'Trên' : item.price1 + ' -> '}
                      {item.price2 === 9999999999999 ? ' 1000000' : item.price2}
                    </p>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
      <div className= "box" >
        <div className="search__title">
          <p>quốc gia</p>
        </div>
        <div className="search__content">
          <ul>
            {
              country.map((item, index) => {
                return (
                  <li
                    className={item.status === true ? 'active' : ''}
                    key={index}
                    onClick={() => searchByCountry(item)}
                  >
                    {item.name}
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SearchProduct
