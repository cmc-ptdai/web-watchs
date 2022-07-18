import React, {useState, useEffect} from 'react'
import ApiTrademark from '../../api/tradermark'
import {Link} from 'react-router-dom'
import "./style.scss"

const Trademark = () => {
  const [trademarks, setTrademarks] = useState(null)

  useEffect(() => {
    fetchApi()
  }, []);
  const fetchApi = async () => {
    try {
      const listTrademarks = await ApiTrademark.gettTademark()
      setTrademarks(listTrademarks)
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="trademark">
      {
        trademarks && trademarks.map((item) => {
          return (
            <Link to={`/trademark/${item.id}`} className="trademark__item" key={item.id}>
              <img src={item.img}  alt=""/>
            </Link>
          )
        })
      }
    </div>
  )
}

export default Trademark;
