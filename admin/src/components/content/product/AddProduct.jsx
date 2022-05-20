import React, { useEffect, useState } from 'react'
import { Button, Input, Modal } from "antd";
import { editProduct, getProduct } from "../../../redux/action/productAction";
import apiWarehouse from "../../../api/apiWarehouse";
import userProduct from "../../../api/apiProduct";
import { useDispatch } from "react-redux";
import "./product.scss";

const AddProduct = (props) => {
  const [warehouse, setWarehouse] = useState(null);
  const dispatch = useDispatch();
  const [numberInput, setNumberInput] = useState(null);
  useEffect(() => {
    fetchWarehouse();
  }, []);
  const fetchWarehouse = async () => {
    const warehouses = await apiWarehouse.getWarehouseById(props.data.id);
    setWarehouse(warehouses);
  };
  const fetchProduct = async () => {
    const listProduct = await userProduct.getAllProduct();
    dispatch(getProduct(listProduct));
  };
  const changeInputNumber = (e) => {
    setNumberInput(e.target.value)
  }
  const handleSubmit = () => {
    if (Number(numberInput) > 0) {
      const newData = {
        ...props.data,
        countPay: Number(props.data.countPay) + Number(numberInput)
      }
      dispatch(editProduct(newData));
      const newWarehouse = {
        dateInput: new Date(),
        numberProduct: Number(numberInput),
      };
      warehouse.listWarehouse.push(newWarehouse);
      apiWarehouse.editWarehouse(warehouse.id, warehouse);
      fetchProduct()
    }
    handleCancel()
  }
  const handleCancel = () => {
    props.editStatusFromAdd(false);
  }
  return (
    <>
      <Modal
        className="form__editAdd"
        visible={true}
        title="Chỉnh sửa sản phẩm"
        onCancel={handleCancel}
      >
        <label>nhập sô lượng sản phẩm:</label>
        <input type="number" onChange={changeInputNumber} defaultValue={numberInput}/>
        <div className='group-button'>
          <Button
            className="btnSubmit"
            type="primary"
            danger
            onClick={handleCancel}
          >
            Huỷ
          </Button>
          <Button
            className="btnSubmit"
            type="primary"
            onClick={handleSubmit}
          >
            Thêm
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default AddProduct
