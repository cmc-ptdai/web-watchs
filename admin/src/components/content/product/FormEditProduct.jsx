import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Select, Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { editProduct, getProduct } from "../../../redux/action/productAction";
import userProduct from "../../../api/apiProduct";
import "./product.scss";
import apiSuppliers from "../../../api/apiSuppliers";

const { Option } = Select;

const FromEditProduct = (props) => {
  const dataProduct = useSelector((store) => store.productReducer);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [data, setData] = useState({ ...props.data});
  const [imgEdit, setImgEdit] = useState(data.img);
  const [listSuppliers, setListSuppliers] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const listSuppliers = await apiSuppliers.getAllSuppliers();
    setListSuppliers(listSuppliers)
  };

  const onFinish = (values) => {
    const newData = {
      ...values,
      id: data.id,
      img: imgEdit,
      quantityPurchased: data.quantityPurchased,
      dateAdd: data.dateAdd,
      dateUpdate: new Date(),
      type: data.type,
    };
    dispatch(editProduct(newData));
    setTimeout(async () => {
      try {
        const listProduct = await userProduct.getAllProduct();
        dispatch(getProduct(listProduct));
      } catch (error) {
        console.log(error);
      }
    }, 500);
    handleCancel();
  };
  const handleCancel = () => {
    props.editStatusFrom(false);
  };

  const inputFile = async (e) => {
    const file = e.target.files[0];
    const fileBase64 = await converterBase64(file);
    setImgEdit(fileBase64);
    setData({
      ...data,
      img: fileBase64,
    });
  };

  const converterBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (err) => {
        reject(err);
      };
    });
  };

  return (
    <>
      <Modal
        className="form__edit"
        visible={true}
        title="Chỉnh sửa sản phẩm"
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          form={form}
          initialValues={{
            name: data.name,
            price: data.price,
            sale: data.sale,
            countPay: data.countPay,
            country: data.country,
            model: data.model,
            brand: data.brand,
            gender: data.gender,
            size: data.size,
            sizeNam: data.sizeNam,
            sizeNu: data.sizeNu,
            shellMaterial: data.shellMaterial,
            ropeMaterial: data.ropeMaterial,
            glassMaterial: data.glassMaterial,
            waterResistance: data.waterResistance,
            other: data.other,
            Insurance: data.Insurance,
            internationalWarranty: data.internationalWarranty,
            img: data.img,
            content: data.content,
            supplier: data.supplier,
            wireWidth: data.wireWidth,
            strapColor: data.strapColor,
            faceThickness: data.faceThickness,
            batteryLife: data.batteryLife,
            keepPower: data.keepPower,
            faceType: data.faceType,
            faceShape: data.faceShape,
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
                    (item) => item.name.toLowerCase() === value.toLowerCase() && item.id !== data.id
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

          <label>Nhà cung câp:</label>
            <Form.Item
              name="supplier"
              rules={[{ required: true, message: "Please input your type!" }]}
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
            <p>{data.countPay}</p>
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
          {/* <Form.Item
            name="model"
            rules={[{ required: true, message: "Please input your type!" }]}
          >
            <Select placeholder="Chọn kiểu máy" allowClear name="model">
              <Option value="1">Quartz</Option>
              <Option value="2">Automatic</Option>
              <Option value="3">Quartz/pin</Option>
            </Select>
          </Form.Item> */}
          <p style={{ marginBottom: '10px'}}>
            {data.model === '1' ? "Quartz (pin)" : data.model === '2' ? "Automatic (cơ)" : "Solar (năng lương ánh sáng)"}
          </p>

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
          <Form.Item name="type">
            <p>{data.type === "single" ? "Đồng hồ đơn" : "Đồng hồ đôi"}</p>
          </Form.Item>
          {data.type === "single" ? (
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

          <label>Độ rộng dây (mm):</label>
            <Form.Item
              name="wireWidth"
              rules={[
                {
                  required: true,
                  message: "Please input your number sale of product!",
                },
              ]}
            >
              <Input type="number" min="10" max="80" />
            </Form.Item>

          <label>Màu giây:</label>
          <Form.Item
            name="strapColor"
            rules={[{ required: true, message: "Please input your type!" }]}
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

          <label>Độ dày mặt (mm):</label>
          <Form.Item
            name="faceThickness"
            rules={[
              {
                required: true,
                message: "Please input your number sale of product!",
              },
            ]}
          >
            <Input type="number" min="5" max="80" />
          </Form.Item>

          {data.model === "1" ? (
              <>
                <label>Thời gian sử dụng pin (năm):</label>
                <Form.Item name="batteryLife">
                  <Input type="number" min="5" max="80"/>
                </Form.Item>
              </>
            ) : (
              <>
                <label>Thời gian giữ cót (ngày):</label>
                <Form.Item name="keepPower">
                  <Input type="number" min="5"/>
                </Form.Item>
              </>
            )}

          <label>Loại mặt số:</label>
          <Form.Item
            name="faceType"
            rules={[{ required: true, message: "Please input your type!" }]}
          >
            <Select placeholder="chọn loại mặt số" allowClear name="faceType">
              <Option value="analog">Kim (Analog)</Option>
              <Option value="digital">Điện tử (Digital)</Option>
              <Option value="anaDigi">Kim - Điện tử(Analog - Digital)</Option>
            </Select>
          </Form.Item>

          <label>Hình dáng mặt:</label>
          <Form.Item
            name="faceShape"
            rules={[{ required: true, message: "Please input your type!" }]}
          >
            <Select
              placeholder="chọn hình dáng mặt"
              allowClear
              name="faceShape"
            >
              <Option value="circle">Hình tròn</Option>
              <Option value="square">Hình vuông</Option>
              <Option value="rectangle">Hình chữ nhật</Option>
              <Option value="other">Khác</Option>
            </Select>
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
          <input type="file" onChange={inputFile} accept=".jpg, .jpeg, .png"/>
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
              Chỉnh sửa
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FromEditProduct;
