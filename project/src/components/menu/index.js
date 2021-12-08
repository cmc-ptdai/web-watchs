import React, { useState } from 'react'
import './style.scss'
import MenuItem from './MenuItem'
import { useSelector } from 'react-redux'
import Search from './search/Search'
import { Affix } from 'antd';
import { Link } from 'react-router-dom'



const MyMenu = () => {
  const [isAffix, setIsAffix] = useState(false)
  const myUser = useSelector(store => store.userReducer.user)


  const menu = [
    {
      title: 'Trang chủ',
      path: '/'
    },
    {
      title: 'Sản Phẩm',
      path: '/products',
      children: [
        {
          title: 'Rau xanh',
          path: '/vegetable'
        },
        {
          title: 'Củ',
          path: '/tubers',
          children: [
            {
              title: 'Quả tươi',
              path: '/tubers/fresh'
            },
            {
              title: 'Quả khô',
              path: '/tubers/dried'
            }
          ]
        },
        {
          title: 'Quả',
          path: '/fruit',
          children: [
            {
              title: 'Quả tươi',
              path: '/fruit/fresh'
            },
            {
              title: 'Quả khô',
              path: '/fruit/dried'
            }
          ]
        },
        {
          title: 'Nấm',
          path: '/mushroom',
          children: [
            {
              title: 'Quả tươi',
              path: '/mushroom/fresh'
            },
            {
              title: 'Quả khô',
              path: '/mushroom/dried'
            }
          ]
        },
      ]
    },
    {
      title: 'Giới thiệu',
      path: '/introduce'
    },
    {
      title: 'Tin tức',
      path: '/posts'
    },
    {
      title: 'Liên hệ',
      path: '/concat'
    }
  ]
  return (
    <>
      <Affix offsetTop={0}  onChange={(affixed) => setIsAffix(affixed)}>
        <div className="list__menu">
          <div className="row">
            <div className="col-1">
            </div>

            <div className="col-4 col-sm-4 col-xl-8">
              <nav className="navbar navbar-expand-lg navbar-light ">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                  <i className="fas fa-bars"></i>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="nav">
                    <MenuItem dataChildren={menu} />
                  </ul>
                </div>
              </nav>
              </div>
            <div className="col-56 col-sm-6 col-xl-2"> <Search/> </div>
            <div className="col-1">
              <div className="cart">
                {
                  isAffix &&
                  <Link to="/cart">
                    <i className="fab fa-opencart">
                      {
                        myUser && (<span>{myUser.cart.length > 50 ? '50+' : myUser.cart.length}</span>)
                      }
                    </i>
                  </Link>
                }
              </div>
            </div>
          </div>
        </div>
      </Affix>
    </>
  )
}

export default MyMenu;
