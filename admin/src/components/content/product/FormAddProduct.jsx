import React, { useState } from 'react';
import { Button, Form, Input, Modal, Select, message  } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, getProduct } from '../../../redux/action/productAction'
import productApi from '../../../api/apiProduct';
import './product.scss';
import { v4 as uuidv4 } from 'uuid';
import ApiComment from '../../../api/apiComment'
import ApiEvaluate from '../../../api/apiEvaluates'
import apiWarehouse from '../../../api/apiWarehouse';

const { Option } = Select;

const FromAddProduct = (props) => {
  const dataProduct = useSelector(store => store.productReducer)
  const dispatch = useDispatch()
  const [form] = Form.useForm();
  const [imgEdit, setImgEdit] = useState('');

  const onFinish = (value) => {
    const newValue = {
      ...value,
      id : uuidv4(),
      dateUpdate: new Date(),
    }
    const evaluate = {
      id: newValue.id,
      evaluates: []
    }
    const comment = {
      id: newValue.id,
      comments: []
    }

    const warehouse = {
      id: newValue.id,
      children: []
    }
    apiWarehouse.addWarehouse(warehouse)
    ApiComment.addApiComments(comment)
    ApiEvaluate.addEvaluates(evaluate)
    dispatch(addProduct(newValue))

    setTimeout( async () => {
      try {
        const listProduct = await productApi.getAllProduct()
        dispatch(getProduct(listProduct))
      } catch (error) {
        console.log(error);
      }
    }, 500);
    message.success('Thêm sản phẩm thành công');
    handleCancel()
  }

  const handleCancel =  () => {
    props.editStatusFrom(false)
    form.resetFields();
  }

  const imgChange = (e) => {
    setImgEdit(e.target.value)
  }

  return (
    <div>
      <Modal
        className="form__add"
        visible={true}
        title="Chỉnh sửa sản phẩm"
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          form={form}
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
        >
          <label>Tên sản phẩm:</label>
          <Form.Item
            name="name"
            rules={[ { required: true, message: 'Please input your name of product!' },
              ({ getFieldValue }) => ({
                validator(rule, value = "") {
                  const userProduct = dataProduct.filter(item => item.name.toLowerCase() === value.toLowerCase())
                  if (value.length > 25) {
                    return Promise.reject("Tối đa 25 kí tự");
                  } else if (userProduct.length > 0){
                    return Promise.reject("tên sản phẩm đã tồn tại");
                  } else {
                    return Promise.resolve();
                  }
                }
              })
            ]}
          >
            <Input />
          </Form.Item>
          <label>giá tiền:</label>
          <Form.Item
            name="price"
            rules={[{ required: true, message: 'Please input your price of product!' } ]}
          >
            <Input type="number"/>
          </Form.Item>
          <label>giảm giá (%):</label>
          <Form.Item
            name="sale"
            rules={[{ required: true, message: 'Please input your number sale of product!' } ]}
          >
            <Input type="number"/>
          </Form.Item>

          <label>Đơn vị tính:</label>
          <Form.Item
            name="unit"
            rules={[{ required: true, message: 'Please input your unit!' } ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              allowClear
            >
              <Option value="gam">Gam</Option>
              <Option value="kg">kg</Option>
            </Select>
          </Form.Item>

          <label>Số lượng sản phẩm:</label>
          <Form.Item
            name="countPay"
            rules={[{ required: true, message: 'Please input your number of product!' } ]}
          >
            <Input type="number"/>
          </Form.Item>

          <label>Hạn sử dụng:</label>
          <Form.Item
            name="endDate"
            rules={[{ required: true, message: 'Please input your end date of product!' } ]}
          >
            <Input type="date"/>
          </Form.Item>

          <label>Ảnh mô tả sản phẩm:</label>
          <Form.Item
            name="img"
            rules={[{ required: true, message: 'Please input your link image!' } ]}
          >
            <Input
              onChange={imgChange}
            />
          </Form.Item>

          {
            imgEdit && <div className="form__edit__img">
                <img src={imgEdit ? imgEdit : ''} alt="link ảnh của bạn không đúng hoặc không tồn tại" />
            </div>
          }

          <label>Loại sản phảm:</label>
          <Form.Item
            name="typeID"
            rules={[{ required: true, message: 'Please input your type!' } ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              allowClear
            >
              <Option value="rau">Rau</Option>
              <Option value="cu">Củ</Option>
              <Option value="qua">Quả</Option>
              <Option value="nam">Nấm</Option>
            </Select>
          </Form.Item>

          <label>kiểu sản phẩm:</label>
          <Form.Item
            name="species"
            rules={[{ required: true, message: 'Please input your species!' } ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              allowClear
            >
              <Option value="tuoi">Tươi</Option>
              <Option value="kho">khô</Option>
            </Select>
          </Form.Item>

          <label>Xuất xứ sản phẩm:</label>
          <Form.Item
            name="country"
            rules={[{ required: true, message: 'Please input your link image!' } ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              allowClear
            >
              <Option value="viet nam">Việt Nam</Option>
              <Option value="uc">Úc</Option>
              <Option value="my">Mỹ</Option>
              <Option value="trung quoc">trung quoc</Option>
              <Option value="khac">Khác</Option>
            </Select>
          </Form.Item>

          <label>Mô tả và giới thiệu sản phẩm:</label>
          <Form.Item
            name="content"
            rules={[{ required: true, message: 'Please input your content product!' },
              ({ getFieldValue }) => ({
                validator(rule, value = "") {
                  if (value.length > 500) {
                    return Promise.reject("tối đa 500 kí tự");
                  } else {
                    return Promise.resolve();
                  }
                }
              })
            ]}
          >
            <Input.TextArea rows={4} maxLength={500}/>
          </Form.Item>

          <Form.Item  className="groupButton">
            <Button className="btnSubmit" type="primary" danger onClick={handleCancel}>
              Huỷ
            </Button>
            <Button className="btnSubmit" type="primary" htmlType="submit" >
              Thêm
            </Button>
          </Form.Item>
        </Form>

      </Modal>
    </div>
  )
}

export default FromAddProduct;
