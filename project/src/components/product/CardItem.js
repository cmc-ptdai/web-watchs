import React from 'react'
import { Card, notification } from 'antd'
import {Link} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addCart as addCartAction,
  addCartNoUser as addCartNoUserAction
 } from '../../redux/actions/userAction'
 import './CartItem.scss'

const openNotification = (item) => {
  notification.open({
    message: '',
    description:<span>Bạn đã thêm thành công một sản phẩm <b>{item.name}</b> vào giỏ hàng</span>,
    icon: <i className="fab fa-optin-monster" style={{fontSize: "50px", color: '#fe9705'}}></i>,
  });
};

const CardItem = ({item}) => {
  const dispatch = useDispatch()
  const addToCart = async () => {
    const id = localStorage.getItem('userID')
    if(id) {
      await dispatch(addCartAction(item))
      setTimeout(() => {
        openNotification(item)
      }, 100);

    } else {
      dispatch(addCartNoUserAction(item))
      setTimeout(() => {
        openNotification(item)
      }, 100);
    }

  }

  const expiredProduct = () => {
    const myDate = new Date();
    const time = myDate.getTime();
    const endDate = new Date(item.endDate)
    const timeDate = endDate.getTime()
    if (time - timeDate >  0 || item.countPay <= 0 ) {
      return true
    } else {
      return false
    }
  }

  return (
    <>
      <Card
        className="item__card"
        hoverable
        cover={<img alt="example" src={item.img}/>}
      >
        {
          item.sale > 0 && (<div className="item__card__sale">{item.sale}%</div>)
        }
        <p className="item__card__name">{item.name}</p >
        <div className="item__card__groupPrice">
          {
            item.sale > 0 && (
              <span className="item__card--priceSale">{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND</span>
            )
          }
          <span className="item__card--price">{(item.price - (item.price * item.sale / 100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND</span>
        </div>
        <Link to={`/products/${item.id}`}>
          <button className="item__card--seeMore">Xem thêm</button>
        </Link>
          <button
            className={expiredProduct() ? "item__card--disabledBuy" : "item__card--buy"}
            disabled = {expiredProduct()}
            onClick={addToCart}
          >Mua Ngay</button>
      </Card>
    </>
  )
}

export default CardItem
