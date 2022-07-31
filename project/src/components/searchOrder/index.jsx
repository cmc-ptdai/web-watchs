import { useState, useEffect } from 'react';
import './style.scss';
import { Input, Button, Popconfirm, Steps } from 'antd';
import ApiOrder from '../../api/order';
import { SmileOutlined } from '@ant-design/icons';

const { Step } = Steps;

const SearchORder = () => {
  const [idSearch, setIdSearch] = useState(null);
  const [listOrder, setListOrder] = useState(null);
  const [orderSearch, setOrderSearch] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const listOrder = await ApiOrder.getOder();
    setListOrder(listOrder);
  };
  const changeInputSearch = (e) => {
    setIdSearch(e.target.value);
  };

  const searchOrder = () => {
    const newList = listOrder.filter((item) => item.id === idSearch);
    setOrderSearch(newList[0]);
  };

  const cancel = () => {};

  const cancelOrder = () => {
    const newData = {...orderSearch}
    newData.status = 'cancelled';
    setOrderSearch(newData)
    ApiOrder.editOrder(newData.id, newData)
  };

  const checkStatus = () => {
    let stt = 0
    if (orderSearch) {
      if (orderSearch.status  === 'delivery') {
        stt = 1
      }
      if (orderSearch.status  === 'delivered') {
        stt = 2
      }
    }
    return stt
  }
  return (
    <div className="searchOrder">
      <div className="searchOrder__search">
        <Input
          type="text"
          onChange={changeInputSearch}
          value={idSearch}
          placeholder="Nhập vào mã hoá đơn bạn cần tìm"
        />
        <Button type="primary" onClick={searchOrder}>
          Tim
        </Button>
      </div>
      <div style={{ marginTop: '10px' }}>
      {orderSearch && (
        orderSearch.status !== 'cancelled' ? (
          <Steps size="small" current={checkStatus()}>
            <Step title="Đang chẩn bị" />
            <Step title="Đang giao hàng" />
            <Step title="Đã giao hàng" icon={<SmileOutlined />}/>
          </Steps>
      ) : (
        <p style={{fontSize: '18px', color: 'red', fontWeight: 'bold'}}>Đơn hàng đã bị huỷ</p>
      )
      )}
      </div>
      {orderSearch && (
        <div className="Order">
          {orderSearch.listProduct.map((item, index) => {
            return (
              <div className="Order-item" key={index}>
                <div className="Order-item-img">
                  <img src={item.img} alt="" />
                </div>
                <div className="Order-item-name">
                  <p>{item.name}</p>
                </div>
                <div className="Order-item-count">
                  <p>x {item.count}</p>
                </div>
                <div className="Order-item-sale">
                  <p>{item.sale} %</p>
                </div>
                <div className="Order-item-price">
                  <p>
                    {(item.price * item.count - (item.price * item.count * item.sale) / 100)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                    VND
                  </p>
                </div>
              </div>
            );
          })}
          <div className="Order-footer">
            <p>
              <i className="fad fa-usd-circle" />
              Tổng số tiền:
              <span>{orderSearch.payments === 'online' ? 0 : orderSearch.money} VND</span>
            </p>
            {orderSearch.status === 'pending' && (
              <Popconfirm
                title="Bạn muốn huỷ đơn hàng này chứ?"
                onConfirm={cancel}
                onCancel={() => cancelOrder()}
                okText="Giữ lại"
                cancelText="Huỷ đơn"
              >
                <Button type="primary">Huỷ đơn</Button>
              </Popconfirm>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchORder;
