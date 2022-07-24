import React, { useEffect } from 'react'
import './home.scss'
import { useDispatch, useSelector } from 'react-redux';
import Slide from '../Slide/Slide'
import GroupProduct from './groupProduct/index';
import UserApi from '../../api/userApi'
import {getUser as getUserAction} from '../../redux/actions/userAction'
//import ListBannerHeader from './listBannerheader/index'
import ScrollToTop from '../../ScrollToTop';
import ListVoucher from './listVoucher/index'

const Home = () => {
  const products = useSelector(store => store.productReducer)
  const dispatch = useDispatch()
  const fetchUserById = async () => {
    const baseId =  localStorage.getItem('userID')
    if(baseId) {
      const id = atob(baseId)
      const response = await UserApi.getUserById(id)
      dispatch(getUserAction(response))
    }
  }

  useEffect(() => {
    fetchUserById()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="product">
      <ScrollToTop/>
      <div className="row mt-2">
        <div className="col-12">
          <Slide />
        </div>
        <ListVoucher/>
        <GroupProduct title="Sản phẩm nổi bật" type="productHot" products={products}/>
        <GroupProduct title="Đồng hồ nam" type="nam" products={products}/>
        <GroupProduct title="Đồng hồ nữ" type="nu" products={products}/>
        <GroupProduct title="Đồng hồ đôi" type="doi" products={products}/>
      </div>
    </div>
  )
}

export default Home
