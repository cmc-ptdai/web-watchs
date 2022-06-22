import { useState, useEffect } from 'react';
import './style.scss';
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Modal, Input } from 'antd';
import productApi from '../../../api/productApi';

export default function CompareProductItem() {
  const [data, setData] = useState(null);
  const [dataSearch, setDataSearch] = useState(null);
  const [dataProduct, setDataProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [value, setValue] = useState('');
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const listData = await productApi.getAll();
    setDataProduct(listData);
  };
  const SearchProduct = (e) => {
    setValue(e.target.value);
    const listData = dataProduct.filter(
      (item) => item.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
    );
    setDataSearch(listData);
  };
  const setProduct = (elem) => {
    setData(elem)
    handleCancelModal()
  }
  const changeStatusShow = () => {
    setShowModal(true);
  };
  const handleCancelModal = () => {
    setShowModal(false);
    setValue('');
    setDataSearch(null)
  };
  const deleteDataSearch = () => {
    setData(null)
  }
  return (
    <div className="compareProductItem">
      {data != null ? (
        <>
          <div className="compareProductItem__parameter">
            <div className="compareProductItem__parameter--iconClose" onClick={() => deleteDataSearch()}>
              <CloseCircleOutlined style={{ fontSize: '28px'}} />
            </div>
            <img src={data.img} alt="" />
            <p>Thương hiệu: {data.brand}</p>
            <p>Xuất xứ: {data.country}</p>
            <p>Giới tính: {data.gender === 'nam' ? 'Nam' : data.gender === 'nu' ? 'Nữ' : 'Đôi'}</p>
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
        </>
      ) : (
        <div className="compareProductItem__nodata" onClick={changeStatusShow}>
          <PlusCircleOutlined style={{ fontSize: '32px' }} /> <span>so sánh</span>
        </div>
      )}
      <Modal
        className="form__search"
        visible={showModal}
        title="Chọn sản phẩm cần so sánh"
        onCancel={handleCancelModal}
      >
        <Input onChange={SearchProduct} value={value} />
        {dataSearch &&
          dataSearch.map((elem, index) => {
            return (
              <div className="compareProductItem__itemModal" key={index} onClick={() => setProduct(elem)}>
                <img src={elem.img} alt=""/>
                <span>{elem.name}</span>
              </div>
            );
          })}
      </Modal>
    </div>
  );
}
