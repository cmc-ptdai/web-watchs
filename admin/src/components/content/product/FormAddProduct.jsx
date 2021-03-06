import React, { useState } from "react";
import { Button, Form, Input, Modal, Select, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, getProduct } from "../../../redux/action/productAction";
import productApi from "../../../api/apiProduct";
import "./product.scss";
import { v4 as uuidv4 } from "uuid";
import apiComment from "../../../api/apiComment";
import apiEvaluate from "../../../api/apiEvaluates";
import apiWarehouse from "../../../api/apiWarehouse";

const { Option } = Select;

const FromAddProduct = (props) => {
  const dataProduct = useSelector((store) => store.productReducer);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [imgEdit, setImgEdit] = useState("");
  const [typeWatch, setTypeWatch] = useState("single");

  const changeType = (e) => {
    setTypeWatch(e);
  };

  const onFinish = (value) => {
    const newValue = {
      ...value,
      id: uuidv4(),
      dateAdd: new Date(),
      dateUpdate: new Date(),
    };
    const evaluate = {
      id: newValue.id,
      evaluates: [],
    };
    const comment = {
      id: newValue.id,
      comments: [],
    };

    const warehouse = {
      id: newValue.id,
      name: newValue.name,
      listWarehouse: [
        {
          dateInput: new Date(),
          numberCount: 0,
          numberProduct: value.countPay,
        },
      ],
    };
    apiComment.addComment(comment);
    apiEvaluate.addEvaluates(evaluate);
    apiWarehouse.addWarehouse(warehouse);
    dispatch(addProduct(newValue));

    setTimeout(async () => {
      try {
        const listProduct = await productApi.getAllProduct();
        dispatch(getProduct(listProduct));
      } catch (error) {
        console.log(error);
      }
    }, 500);
    message.success("Thêm sản phẩm thành công");
    handleCancel();
  };

  const handleCancel = () => {
    props.editStatusFrom(false);
    form.resetFields();
  };

  const imgChange = (e) => {
    setImgEdit(e.target.value);
  };

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
            remember: true,
          }}
          onFinish={onFinish}
        >
          <label>Tên sản phẩm:</label>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name of product!",
              },
              ({ getFieldValue }) => ({
                validator(rule, value = "") {
                  const userProduct = dataProduct.filter(
                    (item) => item.name.toLowerCase() === value.toLowerCase()
                  );
                  if (value.length > 50) {
                    return Promise.reject("Tối đa 50 kí tự");
                  } else if (userProduct.length > 0) {
                    return Promise.reject("tên sản phẩm đã tồn tại");
                  } else {
                    return Promise.resolve();
                  }
                },
              }),
            ]}
          >
            <Input />
          </Form.Item>
          <label>giá tiền:</label>
          <Form.Item
            name="price"
            rules={[
              {
                required: true,
                message: "Please input your price of product!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <label>giảm giá (%):</label>
          <Form.Item
            name="sale"
            rules={[
              {
                required: true,
                message: "Please input your number sale of product!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <label>Số lượng sản phẩm:</label>
          <Form.Item
            name="countPay"
            rules={[
              {
                required: true,
                message: "Please input your number of product!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <label>Nguồn gốc:</label>
          <Form.Item
            name="country"
            rules={[{ required: true, message: "Please input your type!" }]}
          >
            <Select placeholder="Chọn nguồn gốc" allowClear name="country">
              <Option value="japan">Nhật Bản</Option>
              <Option value="switzerland">Thuỵ sỹ</Option>
            </Select>
          </Form.Item>
          <label>Kiểu máy:</label>
          <Form.Item
            name="model"
            rules={[{ required: true, message: "Please input your type!" }]}
          >
            <Select placeholder="Chọn kiểu máy" allowClear name="model">
              <Option value="quartz">Quartz</Option>
              <Option value="automatic">Automatic</Option>
              <Option value="quartzpin">Quartz/pin</Option>
            </Select>
          </Form.Item>
          <label>Thương hiệu:</label>
          <Form.Item
            name="brand"
            rules={[{ required: true, message: "Please input your type!" }]}
          >
            <Select
              placeholder="Chọn thương hiệu của máy"
              allowClear
              name="brand"
            >
              <Option value="olympianus">Olym Pianus</Option>
              <Option value="Ogival">Ogival</Option>
              <Option value="SRWatch">SRWatch</Option>
              <Option value="Orient">Orient</Option>
              <Option value="ogival">Ogival</Option>
              <Option value="casio">casio</Option>
            </Select>
          </Form.Item>
          <label>Giới tính:</label>
          <Form.Item
            name="gender"
            rules={[{ required: true, message: "Please input your type!" }]}
          >
            <Select
              placeholder="Chọn giới tính phù hợp với máy"
              allowClear
              name="gender"
            >
              <Option value="nam">Nam</Option>
              <Option value="nu">nữ</Option>
              <Option value="doi">cả hai</Option>
            </Select>
          </Form.Item>
          <label>kiểu (đơn, đôi):</label>
          <Form.Item
            name="type"
            rules={[{ required: true, message: "Please input your type!" }]}
          >
            <Select
              placeholder="Chọn kiểu máy"
              allowClear
              name="type"
              onChange={changeType}
            >
              <Option value="single">Đồng hồ đơn</Option>
              <Option value="pair">Đồng hồ đôi</Option>
            </Select>
          </Form.Item>
          {typeWatch === "single" ? (
            <>
              <label>kích cỡ (mm):</label>
              <Form.Item
                name="size"
                rules={[
                  {
                    required: true,
                    message: "Please input your number sale of product!",
                  },
                ]}
              >
                <Input type="number" min="10" max="80" />
              </Form.Item>
            </>
          ) : (
            <>
              <label>kích cỡ nam (mm):</label>
              <Form.Item
                name="sizeNam"
                rules={[
                  {
                    required: true,
                    message: "Please input your number sale of product!",
                  },
                ]}
              >
                <Input type="number" min="10" max="80" />
              </Form.Item>
              <label>kích cỡ nữ (mm):</label>
              <Form.Item
                name="sizeNu"
                rules={[
                  {
                    required: true,
                    message: "Please input your number sale of product!",
                  },
                ]}
              >
                <Input type="number" min="10" max="80" />
              </Form.Item>
            </>
          )}

          <label>Chất liệu vỏ:</label>
          <Form.Item
            name="shellMaterial"
            rules={[
              {
                required: true,
                message: "Please input your number of product!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <label>Chất liệu dây:</label>
          <Form.Item
            name="ropeMaterial"
            rules={[
              {
                required: true,
                message: "Please input your number of product!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <label>Chất liệu mặt:</label>
          <Form.Item
            name="glassMaterial"
            rules={[
              {
                required: true,
                message: "Please input your number of product!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <label>Độ chịu nước (m):</label>
          <Form.Item
            name="waterResistance"
            rules={[
              {
                required: true,
                message: "Please input your number of product!",
              },
            ]}
          >
            <Input type="number" min="5" />
          </Form.Item>
          <label>Chức năng khác:</label>
          <Form.Item
            name="other"
            rules={[
              {
                required: true,
                message: "Please input other!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <label>Bảo hành:</label>
          <Form.Item
            name="Insurance"
            rules={[
              {
                required: true,
                message: "Please input insurance!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <label>Bảo hành toàn quốc:</label>
          <Form.Item
            name="internationalWarranty"
            rules={[
              {
                required: true,
                message: "Please input international warranty!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <label>Ảnh mô tả sản phẩm:</label>
          <Form.Item
            name="img"
            rules={[
              { required: true, message: "Please input your link image!" },
            ]}
          >
            <Input onChange={imgChange} />
          </Form.Item>

          {imgEdit && (
            <div className="form__edit__img">
              <img
                src={imgEdit ? imgEdit : ""}
                alt="link ảnh của bạn không đúng hoặc không tồn tại"
              />
            </div>
          )}
          <label>Mô tả và giới thiệu sản phẩm:</label>
          <Form.Item
            name="content"
            rules={[
              { required: true, message: "Please input your content product!" },
              ({ getFieldValue }) => ({
                validator(rule, value = "") {
                  if (value.length > 500) {
                    return Promise.reject("tối đa 500 kí tự");
                  } else {
                    return Promise.resolve();
                  }
                },
              }),
            ]}
          >
            <Input.TextArea rows={4} maxLength={500} />
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
    </div>
  );
};

export default FromAddProduct;
