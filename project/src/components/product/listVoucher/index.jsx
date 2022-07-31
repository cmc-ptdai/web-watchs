import { useState, useEffect } from 'react';
import './style.scss';
import ApiVoucher from '../../../api/apiVoucher';
import VoucherItem from './voucherItem';
import ApiOrder from '../../../api/order';
import { useSelector } from 'react-redux';

const ListVoucher = () => {
  const [listVoucher, setListVoucher] = useState(null);
  const userReducer = useSelector((store) => store.userReducer);
  const [totalMoney, setTotalMoney] = useState(null);
  useEffect(() => {
    fetchVoucher();
    fetchOder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userReducer]);

  const fetchOder = async () => {
    const newList = await ApiOrder.getOder();
    let totalCount = 0;
    newList.forEach((item) => {
      if (item.idUser === userReducer.user.id && item.status !== 'cancelled') {
        totalCount = totalCount + item.money;
      }
    });
    setTotalMoney(totalCount);
  };

  const fetchVoucher = async () => {
    const newData = await ApiVoucher.getAllVoucher();
    const dataFil = newData.filter((item) => {
      const newDate = new Date(item.dateStart);
      const newDate2 = new Date(item.dateEnd);
      // const c = newDate.getFullYear().toString() + '/' + (newDate.getMonth() + 1).toString() + '/' + newDate.getDate().toString()
      // console.log(c);
      //const date = new Date()
      // const e = date.getFullYear().toString() + '/' + (date.getMonth() + 1).toString() + '/' + date.getDate().toString()
      // console.log(e);

      //console.log('hết',item);
      //console.log(date.getTime() , newDate.getTime() ,item.proviso);
      if (
        newDate.getTime() <= new Date().getTime() &&
        new Date().getTime() <= newDate2.getTime() &&
        item.proviso !== 'single'
      ) {
        return true;
      } else {
        return false;
      }
    });
    setListVoucher(dataFil);
  };
  return (
    <>
      {listVoucher && (
        <div className="listVoucher">
          {listVoucher.map((item, index) => {
            return (
              <div className="listVoucher__item" key={index}>
                <VoucherItem
                  item={item}
                  userReducer={userReducer}
                  totalMoney={totalMoney}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ListVoucher;
