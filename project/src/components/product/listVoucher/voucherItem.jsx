import React from 'react';
import './voucher.scss';
import { Button, notification } from 'antd';
import { useDispatch } from 'react-redux';
import { addVoucherUser as addVoucherUserAction } from '../../../redux/actions/userAction';
const openNotification = (text) => {
  notification.open({
    message: '',
    description: <span>{text}</span>,
    icon: <i className="fab fa-optin-monster" style={{ fontSize: '40px', color: '#fe9705' }}></i>,
  });
};

const VoucherItem = ({ item, userReducer, totalMoney }) => {
  const dispatch = useDispatch();

  const addVoucherUser = () => {
    if (userReducer.user.id) {
      const newData = {
        idUser: userReducer.user.id,
        idVoucher: item.id,
      };
      dispatch(addVoucherUserAction(newData));
      openNotification('Thêm thành công');
    } else {
      openNotification('Bạn cần đăng nhập để thêm mã giảm giá');
    }
  };

  const checkExist = () => {
    if (userReducer.user.vouchers) {
      const a = userReducer.user.vouchers.filter((elem) => elem === item.id);
      if (a.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  };
  const checkProviso = () => {
    if (item.proviso === 'all') {
      return false;
    }

    let rankUser = '';
    if (totalMoney <= 20000000) {
      rankUser = 'silver';
    }
    if (totalMoney > 20000000 && totalMoney <= 50000000) {
      rankUser = 'gold';
    }
    if (totalMoney > 50000000) {
      rankUser = 'diamond';
    }
    if (rankUser === item.proviso) {
      return false;
    } else {
      return true;
    }
  };

  const checkUsed = () => {
    if (item) {
      for (let i = 0; i < item.listUserAddCode.length; i++) {
        if (item.listUserAddCode[i] === userReducer.user.id) {
          return true;
        }
      }
    }
  };

  const checkUseNumber = () => {
    if (Number(item.useNumber) === Number(item.listUserAddCode.length)) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <>
      <div className="voucherItem">
        {checkExist() ? (
          <div className="voucherItem__hidden">
            <p>Đã có</p>
          </div>
        ) : checkUsed() ? (
          <div className="voucherItem__hidden">
            <p>Đã dùng</p>
          </div>
        ) : checkUseNumber() ? (
          <div className="voucherItem__hidden">
            <p>Đã hết lượt</p>
          </div>
        ) : checkProviso() ? (
          <div className="voucherItem__hidden">
            <p>Không đủ điều kiện</p>
          </div>
        ) : (
          <></>
        )}
        <div className="voucherItem__number">{item.sale}%</div>
        <div className="voucherItem__content">
          <span>{item.content}</span>
          <div className="voucherItem__content__date">
            <span>{item.dateStart.slice(0, 10)}</span> đến
            <span>{item.dateEnd.slice(0, 10)}</span>
          </div>
        </div>
        <div className="voucherItem__button">
          <Button onClick={addVoucherUser}>Thêm</Button>
        </div>
      </div>
    </>
  );
};

export default VoucherItem;
