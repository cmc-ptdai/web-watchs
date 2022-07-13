import { useState, useEffect } from 'react';
import './style.scss';
import CompareProductItem from './CompareProductItem';
import apiTrademarks from '../../../api/tradermark';

const CompareProduct = ({ data }) => {
  const [brand, setBrand] = useState('');

  useEffect(() => {
    fetchTrademarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTrademarks = async () => {
    const listData = await apiTrademarks.gettTademark();
    for (let i = 0; i < listData.length; i++) {
      if (listData[i].id === data.brand) {
        setBrand(listData[i].name);
        break;
      }
    }
  };
  return (
    <>
      {brand && (
        <div className="compareProduct">
          <div className="compareProductItem">
            <img src={data.img} alt="" />
            <div className="compareProductItem__parameter">
              <p>Thương hiệu: {brand}</p>
              <p>Xuất xứ: {data.country}</p>
              <p>
                Giới tính: {data.gender === 'nam' ? 'Nam' : data.gender === 'nu' ? 'Nữ' : 'Đôi'}
              </p>
              <p>Kiểu máy: {data.model}</p>
              <p>Chất liệu vỏ: {data.shellMaterial}</p>
              <p>Chất liệu dây: {data.ropeMaterial}</p>
              <p>Chất liệu kính: {data.glassMaterial}</p>
              <p>Độ chịu nước: {data.waterResistance}</p>
              {data.type === 'single' ? (
                <p>kích thước (mm): {data.size}</p>
              ) : (
                <>
                  <p>kích thước nam (mm): {data.sizeNam}</p>
                  <p>kích thước nữ (mm): {data.sizeNu}</p>
                </>
              )}
              <p>Bảo hiểm: {data.Insurance} năm</p>
              <p>Bảo hành quốc tế: {data.internationalWarranty} năm</p>
              <p>Tính năng khác: {data.other}</p>
            </div>
          </div>
          <CompareProductItem />
        </div>
      )}
    </>
  );
};

export default CompareProduct;
