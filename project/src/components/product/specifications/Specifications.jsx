import { useState, useEffect } from 'react';
import './style.scss';
import apiTrademarks from '../../../api/tradermark';

export default function Specifications({ data }) {
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
        <div className="row">
          <div className="col-xl-6">
            <p><b>Thương hiệu:</b> {brand}</p>
            <p><b>Xuất xứ:</b> {data.country}</p>
            <p><b>Nhà cung cấp:</b> {data.supplier}</p>
            <p><b>Giới tính:</b> {data.gender === 'nam' ? 'Nam' : data.gender === 'nu' ? 'Nữ' : 'Đôi'}</p>
            <p><b>Kiểu máy:</b> {data.model}</p>
            {
              data.model === '1' ? (
                <p><b>Thời gian sử dụng pin (năm):</b> {data.batteryLife}</p>
              ) : (
                <p><b>Thời gian giữ cót (ngày):</b> {data.keepPower}</p>
              )
            }
            <p><b>Chất liệu vỏ:</b> {data.shellMaterial}</p>
            <p><b>Chất liệu dây:</b> {data.ropeMaterial}</p>
            <p><b>Độ rộng dây (mm):</b> {data.wireWidth}</p>
            <p><b>Màu dây:</b> {data.strapColor}</p>
          </div>
          <div className="col-xl-6">
            <p><b>Chất liệu mặt:</b> {data.glassMaterial}</p>
            {data.type === 'single' ? (
              <p><b>kích thước mặt (mm):</b> {data.size}</p>
            ) : (
              <>
                <p><b>kích thước mặt nam (mm):</b> {data.sizeNam}</p>
                <p><b>kích thước mặt nữ (mm):</b> {data.sizeNu}</p>
              </>
            )}
            <p><b>Độ dày mặt:</b> {data.faceThickness}</p>
            <p><b>Kiểu mặt:</b> {data.faceType}</p>
            <p><b>Hình dáng mặt:</b> {data.faceShape}</p>
            <p><b>Độ chịu nước:</b> {data.waterResistance}</p>
            <p><b>Bảo hiểm:</b> {data.Insurance} năm</p>
            <p><b>Bảo hành quốc tế:</b> {data.internationalWarranty} năm</p>
            <p><b>Tính năng khác:</b> {data.other}</p>
          </div>
        </div>
      )}
    </>
  );
}
