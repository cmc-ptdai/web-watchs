import React, { useState, useEffect } from 'react'
import ApiCountry from '../../../api/country'
import ApiTrandermark from '../../../api/tradermark'
import './style.scss'

const SearchProduct = (props) => {
  const [country, setCountry] = useState(null)
  const[typeProduct, setTypeProduct] = useState(null)
  const [prices, setPrices] = useState([
    {
      price1: 0,
      status: false,
      price2: 2000000
    },
    {
      price1: 2000000,
      status: false,
      price2: 4000000
    },
    {
      price1: 4000000,
      status: false,
      price2: 6000000
    },
    {
      price1: 6000000,
      status: false,
      price2: 8000000
    },
    {
      price1: 8000000,
      status: false,
      price2: 10000000
    },
    {
      price1: 10000000,
      status: false,
      price2: 9999999999999
    }
  ])

  useEffect(() => {
    fetchApi()
  }, []);

  const  fetchApi = async () => {
    try {
     const newList = await ApiCountry.getCountry()
     const newListTrandermark = await ApiTrandermark.gettTademark()
     setTypeProduct(newListTrandermark)
     setCountry(newList); 
    } catch (error) {
      console.log(error);
    }
  }

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
          <p>Thương hiệu</p>
        </div>
        <div className="search__content">
          <ul>
            {
              typeProduct && typeProduct.map((item, index) => {
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
          <p>khoảng giá</p>
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
                      {item.price1 === 0 ? 'Dưới ' : item.price1 === 10000000 ? 'Trên' : item.price1 + ' -> '}
                      {item.price2 === 9999999999999 ? '10000000' : item.price2}
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
          <p>Xuất xứ</p>
        </div>
        <div className="search__content">
          <ul>
            {
              country && country.map((item, index) => {
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
