import React, { useEffect, useState } from 'react';
import './home.scss';
import { useDispatch, useSelector } from 'react-redux';
import Slide from '../Slide/Slide';
import GroupProduct from './groupProduct/index';
import UserApi from '../../api/userApi';
import { getUser as getUserAction,
  setNotificationBirthDay as setNotificationBirthDayAction } from '../../redux/actions/userAction';
//import ListBannerHeader from './listBannerheader/index'
import ScrollToTop from '../../ScrollToTop';
import ListVoucher from './listVoucher/index';
import { Modal, Button } from 'antd'

const Home = () => {
  const products = useSelector((store) => store);
  const [visibleAlert, setVisibleAlert] = useState(false);
  //const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const fetchUserById = async () => {
    const baseId = localStorage.getItem('userID');
    if (baseId) {
      const id = atob(baseId);
      const response = await UserApi.getUserById(id);
      dispatch(getUserAction(response));
      checkBirthDay(response)
    }
  };

  useEffect(() => {
    fetchUserById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkBirthDay = (value) => {
    const date = new Date();
    const date2 = new Date(value.birthday)
    const c =  date.getDate().toString() + '/' + (date.getMonth() + 1).toString()
    const e =  date2.getDate().toString() + '/' + (date2.getMonth() + 1).toString()
    if (c === e && products.birthday.notification === false) {
      dispatch(setNotificationBirthDayAction())
      setVisibleAlert(true)
    }

  };
  const handleCancel = () => {
    setVisibleAlert(false);
  };
  return (
    <div className="product">
      <Modal title="Thông báo" visible={visibleAlert} onCancel={handleCancel}>
        <p>Chúc mừng sinh nhật bạn</p>
        <p>chúc bạn có một sinh nhật vui vẻ và tràn đầy niềm vui hạnh phúc!</p>
        <div className="cart__mymodel__alert-btn">
          <Button type="primary" onClick={handleCancel}>
            Tắt
          </Button>
        </div>
      </Modal>
      <ScrollToTop />
      <div className="row mt-2">
        <div className="col-12">
          <Slide />
        </div>
        <ListVoucher />
        <GroupProduct title="Sản phẩm nổi bật" type="productHot" products={products.productReducer} />
        <GroupProduct title="Đồng hồ nam" type="nam" products={products.productReducer} />
        <GroupProduct title="Đồng hồ nữ" type="nu" products={products.productReducer} />
        <GroupProduct title="Đồng hồ đôi" type="doi" products={products.productReducer} />
      </div>
    </div>
  );
};

export default Home;
