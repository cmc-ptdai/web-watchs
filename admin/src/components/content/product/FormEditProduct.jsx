import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select } from 'antd';
import { useDispatch } from 'react-redux';
import { editProduct, getProduct } from '../../../redux/action/productAction'
import userProduct from '../../../api/apiProduct'
import './product.scss';
import apiWarehouse from '../../../api/apiWarehouse';

const { Option } = Select;

const FromEditProduct = (props) => {
  const dispatch = useDispatch()
  const [data, setData] = useState({...props.data})
  const [imgEdit, setImgEdit] = useState('')
  const [warehouse, setWarehouse] = useState(null)

  useEffect(() => {
    fetchWarehouse()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const fetchWarehouse = async () => {
    const warehouse = await apiWarehouse.getWarehouseById(data.id)
    setWarehouse(warehouse);
  }

  const onFinish = () => {
    if (props.data.countPay !== data.countPay) {
      const newWarehouse = {
        dateInput: new Date(),
        numberCount: 0,
        numberProduct: data.countPay
      }
      warehouse.listWarehouse.push(newWarehouse)

      apiWarehouse.editWarehouse(warehouse.id, warehouse)
    }
    dispatch(editProduct(data))
    setTimeout( async () => {
      try {
        const listProduct = await userProduct.getAllProduct()
        dispatch(getProduct(listProduct))
      } catch (error) {
        console.log(error);
      }
    }, 500);
    handleCancel()
  }
  const handleCancel =  () => {
    props.editStatusFrom(false)
  }
  const onchangeInputName = (e) => {
    setData({
      ...data,
      name: e.target.value,
    })
  }
  const onchangeInputPrice = (e) => {
    setData({
      ...data,
      price: e.target.value,
    })
  }
  const onchangeInputCountPay = (e) => {
    setData({
      ...data,
      countPay: e.target.value,
    })
  }
  const onchangeInputSale = (e) => {
    if (e.target.value >= 100) {
      setData({
        ...data,
        sale: 99,
      })
    } else if (e.target.value < 0 || e.target.value === '' ){
      setData({
        ...data,
        sale: 0,
      })
    } else {
      setData({
        ...data,
        sale: e.target.value,
      })
    }
  }
  const onchangeInputContent = (e) => {
    setData({
      ...data,
      content: e.target.value,
    })
  }
  const imgChange = (e) => {
    setImgEdit(e.target.value)
    setData({
      ...data,
      img: e.target.value,
    })
  }
  const onchangeCountry = (e) => {
    setData({
      ...data,
      country: e,
    })
  }
  const onchangeModel = (e) => {
    setData({
      ...data,
      model: e,
    })
  }
  const onchangeBrand = (e) => {
    setData({
      ...data,
      brand: e,
    })
  }
  const onchangeType = (e) => {
    setData({
      ...data,
      type: e,
    })
  }
  const onchangeGender = (e) => {
    setData({
      ...data,
      gender: e,
    })
  }
  const onchangeInputSize = (e) => {
    setData({
      ...data,
      size: e,
    })
  }
  const onchangeInputSizeNu = (e) => {
    setData({
      ...data,
      sizeNam: e,
    })
  }
  const onchangeInputSizeNam = (e) => {
    setData({
      ...data,
      sizeNu: e,
    })
  }
  const onchangeInputShellMaterial = (e) => {
    setData({
      ...data,
      shellMaterial: e,
    })
  }
  const onchangeInputRopeMaterial = (e) => {
    setData({
      ...data,
      ropeMaterial: e,
    })
  }
  const onchangeInputWaterResistance = (e) => {
    setData({
      ...data,
      waterResistance: e,
    })
  }
  const onchangeInputOtherFunction = (e) => {
    setData({
      ...data,
      otherFunction: e,
    })
  }
  const onchangeInputInsurance = (e) => {
    setData({
      ...data,
      Insurance: e,
    })
  }
  const onchangeInputInternationalWarranty = (e) => {
    setData({
      ...data,
      internationalWarranty: e,
    })
  }
  const onchangeInputGlassMaterial = (e) => {
    setData({
      ...data,
      glassMaterial: e,
    })
  }

  return (
    <div>
      <Modal
       className="form__edit"
        visible={true}
        title="Chỉnh sửa sản phẩm"
        onCancel={handleCancel}
      >
        <div className="row">
          <div className="col-lg-6">
            <label>Tên sản phẩm:</label>
            <Input
              name="name"
              onChange={onchangeInputName}
              defaultValue={data.name}
            />

            <label>giá sản phẩm:</label>
            <Input
              name="price"
              onChange={onchangeInputPrice}
              defaultValue={data.price}
              type="number"
            />

            <label>giảm giá (%):</label>
            <Input
              name="sale"
              onChange={onchangeInputSale}
              type="number"
              max="99"
              defaultValue={data.sale}
            />

            <label>Số lượng sản phẩm:</label>
            <Input
              name="countPay"
              onChange={onchangeInputCountPay}
              type="number"
              defaultValue={data.countPay}
            />

             <label>Nguồn gốc:</label>
            <Select
              placeholder="Chọn nguồn gốc"
              defaultValue={data.country}
              allowClear
              onChange={onchangeCountry}
              name="country"
            >
              <Option value="japan">Nhật Bản</Option>
              <Option value="switzerland">Thuỵ sỹ</Option>
            </Select>

            <label>Kiểu máy:</label>
            <Select
              placeholder="Chọn kiểu máy"
              defaultValue={data.model}
              allowClear
              onChange={onchangeModel}
              name="model"
            >
              <Option value="quartz">Quartz</Option>
              <Option value="automatic">Automatic</Option>
            </Select>

            <label>Thương hiệu:</label>
            <Select
              placeholder="Chọn thương hiệu của máy"
              defaultValue={data.brand}
              allowClear
              onChange={onchangeBrand}
              name="brand"
            >
              <Option value="olympianus">Olym Pianus</Option>
              <Option value="Ogival">Ogival</Option>
              <Option value="SRWatch">SRWatch</Option>
              <Option value="Orient">Orient</Option>
              <Option value="ogival">Ogival</Option>
            </Select>

            <label>kiểu (đơn, đôi):</label>
            <Select
              placeholder="Chọn kiểu máy"
              defaultValue={data.type}
              allowClear
              onChange={onchangeType}
              name="type"
            >
              <Option value="single">Đồng hồ đơn</Option>
              <Option value="pair">Đồng hồ đôi</Option>
            </Select>

            <label>Giới tính:</label>
            <Select
              placeholder="Chọn giới tính phù hợp với máy"
              defaultValue={data.gender}
              allowClear
              onChange={onchangeGender}
              name="gender"
            >
              <Option value="nam">Nam</Option>
              <Option value="nu">nữ</Option>
              <Option value="doi">cả hai</Option>
            </Select>

          </div>

          <div className="col-lg-6">
          {
              data?.size ? (
                <>
                  <label>kích cỡ (mm):</label>
                  <Input
                    name="size"
                    onChange={onchangeInputSize}
                    type="number"
                    min="10"
                    max="80"
                    defaultValue={data.size}
                  />
                </>
              ) : (
                <>
                  <label>kích cỡ nam  (mm):</label>
                  <Input
                    name="sizeNam"
                    onChange={onchangeInputSizeNam}
                    type="number"
                    min="10"
                    max="80"
                    defaultValue={data.sizeNam}
                  />

                  <label>kích cỡ nữ  (mm):</label>
                  <Input
                    name="sizeNu"
                    onChange={onchangeInputSizeNu}
                    type="number"
                    min="10"
                    max="80"
                    defaultValue={data.sizeNu}
                  />
                </>
              )
            }

            <label>Chất liệu vỏ:</label>
            <Input
              name="shellMaterial"
              onChange={onchangeInputShellMaterial}
              type="text"
              defaultValue={data.shellMaterial}
            />
            <label>Chất liệu dây:</label>
            <Input
              name="ropeMaterial"
              onChange={onchangeInputRopeMaterial}
              type="text"
              defaultValue={data.ropeMaterial}
            />

            <label>Chất liệu mặt:</label>
            <Input
              name="glassMaterial"
              onChange={onchangeInputGlassMaterial}
              type="text"
              defaultValue={data.glassMaterial}
            />

            <label>Độ chịu nước (m):</label>
            <Input
              name="waterResistance"
              onChange={onchangeInputWaterResistance}
              type="number"
              min="5"
              defaultValue={data.waterResistance}
            />
            <label>Chức năng khác:</label>
            <Input
              name="otherFunction"
              onChange={onchangeInputOtherFunction}
              type="text"
              defaultValue={data.otherFunction}
            />

            <label>Bảo hành:</label>
            <Input
              name="Insurance"
              onChange={onchangeInputInsurance}
              type="text"
              defaultValue={data.Insurance}
            />

            <label>Bảo hành toàn quốc:</label>
            <Input
              name="internationalWarranty"
              onChange={onchangeInputInternationalWarranty}
              type="text"
              defaultValue={data.internationalWarranty}
            />
          </div>
        </div>


        <label>Ảnh mô tả sản phẩm:</label>
        <Input
          onChange={imgChange}
          name="img"
          value={data.img}
        />

        <div className="form__edit__img">
            <img src={imgEdit ? imgEdit : data.img} alt="img-product" />
        </div>

        <label>Mô tả sản phẩm:</label>
          <Input.TextArea
            name="content"
            onChange={onchangeInputContent}
            rows={4}
            maxLength={500}
            defaultValue={data.content}
          />

        <div className="groupButton">
          <Button className="btnSubmit" type="primary" danger onClick={handleCancel}>
            Huỷ
          </Button>
          {/* <Button className="btnSubmit" type="primary" onClick={onFinish} >
            Chỉnh sửa
          </Button> */}
        </div>
      </Modal>
    </div>
  )
}

export default FromEditProduct;
