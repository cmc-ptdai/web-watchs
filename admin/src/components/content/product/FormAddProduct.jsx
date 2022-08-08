import { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Select, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, getProduct } from "../../../redux/action/productAction";
import productApi from "../../../api/apiProduct";
import "./product.scss";
import { v4 as uuidv4 } from "uuid";
import apiComment from "../../../api/apiComment";
import apiEvaluate from "../../../api/apiEvaluates";
import apiWarehouse from "../../../api/apiWarehouse";
import apiTrademarks from "../../../api/apiTrademark";
import apiCountry from "../../../api/apiCountry.js";
import apiSuppliers from "../../../api/apiSuppliers";
import ApiListImportProductSuppliers from '../../../api/apiListProductSuppliers';

const { Option } = Select;

const FromAddProduct = (props) => {
  const dataProduct = useSelector((store) => store.productReducer);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [typeWatch, setTypeWatch] = useState("single");
  const [typeModel, setTypeModel] = useState("1");
  const [imgInput, setImgInput] = useState("");
  const [listTrademark, setListTrademark] = useState();
  const [listCountry, setListCountry] = useState();
  const [listSuppliers, setListSuppliers] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const list = await apiTrademarks.getAllTrademark();
    const listCountry = await apiCountry.getAllCountry();
    const listSuppliers = await apiSuppliers.getAllSuppliers();
    setListTrademark(list);
    setListCountry(listCountry);
    setListSuppliers(listSuppliers)
  };
  const changeType = (e) => {
    setTypeWatch(e);
  };

  const onFinish = (value) => {
    const newValue = {
      ...value,
      supplier: props.typeSuppliers,
      id: uuidv4(),
      img: imgInput,
      status: true,
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
          numberProduct: Number(value.countPay),
        },
      ],
    };

    const newSuppliers = {
      idSuppliers: props.typeSuppliers,
      idProduct: newValue.id,
      dateInput :new Date(),
      numberInput: newValue.countPay
    }

    apiComment.addComment(comment);
    apiEvaluate.addEvaluates(evaluate);
    apiWarehouse.addWarehouse(warehouse);
    ApiListImportProductSuppliers.addSuppliersAction(newSuppliers)
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

  const inputFile = async (e) => {
    const file = e.target.files[0];
    const fileBase64 = await converterBase64(file);
    setImgInput(fileBase64);
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
  const changeModel = (e) => {
    setTypeModel(e);
  };

  const checkSupplier = () => {
    if (listSuppliers) {
      const newList = listSuppliers.filter(supplier => supplier.id === props.typeSuppliers)
      return newList[0].name
    }
  }
  return (
    <div>
      {listTrademark && listCountry && (
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
                      (item) => item.name.toLowerCase().replace(/\s/g, '') === value.toLowerCase().replace(/\s/g, '')
                    );
                    if (value.length > 150) {
                      return Promise.reject("Tối đa 150 kí tự");
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
            {/* <Form.Item
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
            </Form.Item> */}
            <p style={{ marginBottom: '10px'}}>{checkSupplier()}</p>

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
              <Input type="number" min={1}/>
            </Form.Item>

            <label>Nguồn gốc:</label>
            <Form.Item
              name="country"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <Select placeholder="Chọn nguồn gốc" allowClear name="country">
                {listCountry.map((item) => {
                  return (
                    <Option value={item.type} key={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>

            <label>Kiểu máy:</label>
            <Form.Item
              name="model"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <Select
                placeholder="Chọn kiểu máy"
                onChange={changeModel}
                allowClear
                name="model"
              >
                <Option value="1">Quartz (pin)</Option>
                <Option value="2">Automatic (cơ)</Option>
                <Option value="3">Solar (năng lương ánh sáng)</Option>
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
                {listTrademark.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
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
                <label>kích cỡ mặt(mm):</label>
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
                <label>kích cỡ mặt nam (mm):</label>
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
                <label>kích cỡ mặt nữ (mm):</label>
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

            {typeModel === "1" ? (
              <>
                <label>Thời gian sử dụng pin (năm):</label>
                <Form.Item name="batteryLife">
                  <Input type="number" min="1" max="80"/>
                </Form.Item>
              </>
            ) : (
              <>
                <label>Thời gian giữ cót (ngày):</label>
                <Form.Item name="keepPower">
                  <Input type="number" min="1"/>
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

            <label>Màu mặt:</label>
            <Form.Item
              name="faceColor"
              rules={[
                {
                  required: true,
                  message: "Please input face color!",
                },
              ]}
            >
              <Input value="" />
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
              <Input value="" />
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

            <label>Bảo hành quốc tế:</label>
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
              <Input
                type="file"
                onChange={inputFile}
                accept=".jpg, .jpeg, .png"
              />
            </Form.Item>

            {imgInput && (
              <div className="form__edit__img">
                <img src={imgInput ? imgInput : ""} alt="" />
              </div>
            )}
            <label>Mô tả và giới thiệu sản phẩm:</label>
            <Form.Item
              name="content"
              rules={[
                {
                  required: true,
                  message: "Please input your content product!",
                },
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
      )}
    </div>
  );
};

export default FromAddProduct;
