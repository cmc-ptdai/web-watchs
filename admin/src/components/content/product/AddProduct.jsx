import React, { useEffect, useState } from 'react'
import { Button, Modal, Input, Form, Select } from "antd";
import { editProduct, getProduct } from "../../../redux/action/productAction";
import apiWarehouse from "../../../api/apiWarehouse";
import userProduct from "../../../api/apiProduct";
import { useDispatch } from "react-redux";
import "./product.scss";
import ApiListImportProductSuppliers from '../../../api/apiListProductSuppliers';
import ApiSuppliers from '../../../api/apiSuppliers';

const { Option } = Select;

const AddProduct = (props) => {
  console.log(props);
  const [form] = Form.useForm();
  const [warehouse, setWarehouse] = useState(null);
  const [listSuppliers, setListSuppliers] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    fetchWarehouse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchWarehouse = async () => {
    const warehouses = await apiWarehouse.getWarehouseById(props.data.id);
    const listSuppliers = await ApiSuppliers.getAllSuppliers()
    setListSuppliers(listSuppliers)
    setWarehouse(warehouses);
  };
  const fetchProduct = async () => {
    const listProduct = await userProduct.getAllProduct();
    dispatch(getProduct(listProduct));
  };
  const handleSubmit = (value) => {
    const newData = {
      ...props.data,
      countPay: Number(props.data.countPay) + Number(value.number),
    }
    dispatch(editProduct(newData));
    const newWarehouse = {
      dateInput: new Date(),
      numberProduct: Number(value.number),
    };
    const newSuppliers = {
      idSuppliers: value.suppliers,
      idProduct: props.data.id,
      dateInput :new Date(),
      numberInput: value.number
    }
    warehouse.listWarehouse.push(newWarehouse);
    apiWarehouse.editWarehouse(warehouse.id, warehouse);
    ApiListImportProductSuppliers.addSuppliersAction(newSuppliers)
    setTimeout(() => {
      fetchProduct()
    }, 100);
    handleCancel()
  }
  const handleCancel = () => {
    props.editStatusFromAdd(false);
    form.resetFields();
  }
  return (
    <>
      <Modal
        className="form__editAdd"
        visible={true}
        title="Chỉnh sửa sản phẩm"
        onCancel={handleCancel}
      >
        <Form
            name="basic123123"
            form={form}
            onFinish={handleSubmit}
          >
            <label>Tên nhà cung cấp :</label>
            <Form.Item
              name="suppliers"
              rules={[
                {
                  required: true,
                  message: "Please input your name suppliers!",
                },
              ]}
            >
              <Select placeholder="Chọn nhà cung cấp" allowClear name="model">
                {
                  listSuppliers && (
                    listSuppliers.map(item => {
                      return (
                        <Option value={item.id} key={item.id}>{item.name}</Option>
                      )
                    })
                  )
                }
              </Select>
            </Form.Item>
            <label>Số lượng :</label>
            <Form.Item
              name="number"
              rules={[
                {
                  required: true,
                  message: "Please input your name trademark!",
                },
              ]}
            >
              <Input type="number" min="1"/>
            </Form.Item>

            <Form.Item className="groupButton">
              <Button
                className="btnSubmit"
                type="primary"
                danger
                onClick={handleCancel}
              >
                Huỷ
              </Button>
              <Button className="btnSubmit" type="primary" htmlType="submit">
                Thêm
              </Button>
            </Form.Item>
          </Form>
      </Modal>
    </>
  )
}

export default AddProduct
