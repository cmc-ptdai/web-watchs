import { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
} from "antd";
import { useDispatch } from 'react-redux'
import { getTradeMarkEdit } from '../../../redux/action/trademarkAction'

const EditTrademark = ({ dataEdit, setStatusEditByModal }) => {

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [imgChange, setImgChange] = useState(dataEdit.img);

  const onFinish = (value) => {
    const newValue = {
      ...dataEdit,
      type: value.name.toLowerCase().replace(/\s/g, ''),
      name: value.name,
      img: imgChange,
    };
    dispatch(getTradeMarkEdit(newValue));
    handleCancelModal()
  }

  const changeEditImg = (e) => {
    setImgChange(e.target.value);
  };

  const handleCancelForm = () => {
    setStatusEditByModal(false)
    form.resetFields();
  };

  const handleCancelModal = () => {
    handleCancelForm()
  };
  return (
    <>
      <Modal
        className="form__add"
        visible={true}
        title="Chỉnh sửa sản phẩm"
        onCancel={handleCancelModal}
      >
        {dataEdit && (
          <Form
            name="basic"
            form={form}
            initialValues={{ name: dataEdit.name, img: dataEdit.img }}
            onFinish={onFinish}
          >
            <label>Tên thương hiệu :</label>
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name trademark!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <label>Ảnh thương hiệu:</label>
            <Form.Item
              name="img"
              rules={[
                { required: true, message: "Please input your link image!" },
              ]}
            >
              <Input onChange={changeEditImg} />
            </Form.Item>

            {imgChange && (
              <div className="form__edit__img">
                <img
                  style={{ width: "200px", height: "100px" }}
                  src={imgChange ? imgChange : " "}
                  alt="link ảnh của bạn không đúng hoặc không tồn tại"
                />
              </div>
            )}
            <Form.Item className="groupButton">
              <Button
                className="btnSubmit"
                type="primary"
                danger
                onClick={handleCancelForm}
              >
                Huỷ
              </Button>
              <Button className="btnSubmit" type="primary" htmlType="submit">
                Thêm
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default EditTrademark;
