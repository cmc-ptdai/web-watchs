import React, { useState, useEffect} from 'react'
import { Table, Button, Popconfirm, Input, Modal, Form } from 'antd';
import apiSlide from '../../../api/slides'
import './slides.scss'

const  Slide = () => {

  const [form] = Form.useForm();
  const [listSlides, setListSlide] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imgEdit, setImgEdit] = useState('');
  const [status, setStatus] = useState(false);

  useEffect(() => {
    fetchSlide()
  }, [status])

  const fetchSlide = async () => {
    const newData = await apiSlide.getSlides()
    setListSlide(newData)
  }

  const columns = [
    {
      title: 'Id slide',
      dataIndex: 'id',
      key: 'id',
      width: 180,
    },
    {
      title: 'slide',
      dataIndex: 'img',
      key: 'img',
      width: 600,
      render: (text, record) => (
        <img className="table__slide-img" src={text} alt="" />
      )
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
          <div className="tableUser__button">
            <Popconfirm
              title="Bạn có muốn xóa người dùng này không?"
              onConfirm={() => deleteSlide(record.id)}
              onCancel={handleCancelButton}
            >
              <Button danger >
                Delete
              </Button>
            </Popconfirm>
          </div>
      ),
    },
  ];

  const handleCancelButton = () => {}

  const handleCancel = () => {
    setShowModal(false);
    setImgEdit('')
    form.resetFields();
  }

  const deleteSlide = (id) => {
    apiSlide.deleteSlides(id)
    setStatus(!status)
  }

  const addSlide = () => {
    setShowModal(true);
  }

  const onFinish = (value) => {
    apiSlide.addSlides(value)
    setStatus(!status)
  }

  const imgChange = (e) => {
    setImgEdit(e.target.value)
  }

  return (
    <div className="table__slide">
      <Button
        type="primary"
        onClick={addSlide}
        style={{ marginBottom: '20px'}}
      >
        Add Slide
      </Button>
      {
        listSlides && (<Table dataSource={listSlides} columns={columns} rowKey="id"/>)
      }
       <Modal
        className="form__add"
        visible={showModal}
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
          <label>Slide:</label>
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

export default Slide;
