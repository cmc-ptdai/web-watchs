import React, {useState, useEffect} from 'react'
import ApiTrademark from '../../api/tradermark';
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
    <>
      <div className=" row">
        {
          trademarks && trademarks.map((item) => {
            return (
              <>
                <img src={item.img} />
              </>
            )
          })
        }
      </div>
    </>
  )
}

export default Trademark;
