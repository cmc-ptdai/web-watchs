import React, { useEffect, useState } from 'react';
import { Table, Popconfirm, Button, Modal, Input, Form } from 'antd';
import apiComment from '../../../api/apiComment'
import apiProduct from '../../../api/apiProduct'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid';
import './comment.scss'

const ReplyNewComments = () => {
  const param = useParams()
  const [form] = Form.useForm();
  const [commentProduct, setCommentProduct] = useState()
  const [replyComment, setReplyComment] = useState(null)
  const [product, setProduct] = useState(null)
  const [sttFetchData, setSttFetchData] = useState(false)
  const [showFormReply, setShowFormReply] = useState(false)
  const accountAdmin = useSelector(store => store.accLoginReducer)

  useEffect(() => {
    fetchComment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param, sttFetchData])

  const fetchComment = async () => {
    const newArr = []
    const product = await apiProduct.getProductsById(param.id)
    const commentLocal = await apiComment.getCommentsById(param.id)
    newArr.push(product)
    const newComment = commentLocal.comments.filter(item => item.id === param.idComment)
    setCommentProduct(commentLocal);
    setReplyComment(newComment)
    setProduct(newArr);
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'comment',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: 'date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => (
        <p>{text.slice(0,10)}</p>
      )
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 210,
      render: (text, record) => (
        <div className="tableUser__button">
            <Button
              type="primary"
              style={{marginRight: '5px'}}
              className="btn-replyComment"
              onClick={() => replyCommentTable(record)}
            >
              Reply
            </Button>
          <Popconfirm
            title="Bạn có muốn xóa người dùng này không?"
            onConfirm={() => handleOk(record)}
            onCancel={handleCancel}
          >
            <Button
              danger
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    }
  ];

  const columnsProduct = [
    {
      title: 'Ảnh',
      dataIndex: 'img',
      key: 'img',
      render: text => {
        return (
          <div>
            <img src={text} alt="" style={{width: '200px', height: '160px'}}/>
          </div>
        )
      }
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      key: 'price',
      render: text => {
        return (
          <div>
            <p>{text.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND</p>
          </div>
        )
      }
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Sale (%)',
      dataIndex: 'sale',
      key: 'sale',
    },
    {
      title: 'Hạn',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'còn lại',
      dataIndex: 'quantityPurchased',
      key: 'quantityPurchased',
    }
  ];

  const handleOk = (record) => {

    const a = record?.children
    if (a) {
      for (let i = 0; i < commentProduct.comments.length; i++) {
        if (commentProduct.comments[i].id === record.id) {
          const newListComment = commentProduct.comments.filter(item => item.id !== record.id)
          commentProduct.comments = newListComment
          break;
        }
      }
    } else {
      for (let i = 0; i < commentProduct.comments.length; i++) {
        let status = false
        for (let j = 0; j < commentProduct.comments[i].children.length; j++) {
          if (commentProduct.comments[i].children[j].id === record.id) {
            const newListComment = commentProduct.comments[i].children.filter(item => item.id !== record.id)
            commentProduct.comments[i].children = newListComment
            status = true
            break;
          }
        }
        if (status) {
          break;
        }
      }
    }
    apiComment.editComments(commentProduct.id, commentProduct)
    setSttFetchData(!sttFetchData)
  }

  const replyCommentTable = () => {
    setShowFormReply(true)
  }

  const onFinish = (value) => {
    const newComment = {
      id: uuidv4(),
      idUser: accountAdmin.id,
      date: new Date(),
      name: accountAdmin.name,
      comment: value.comment
    }
    for (let i = 0; i < commentProduct.comments.length; i++) {
      if (commentProduct.comments[i].id === param.idComment) {
        commentProduct.comments[i].children.push(newComment)
        break
      }
    }
    apiComment.editComments(commentProduct.id, commentProduct)
    fetchComment()
    handleCancelForm()
  }
  const handleCancel = () => {}

  const handleCancelForm = () => {
    setShowFormReply(false)
    form.resetFields();
  }

  return (
    <>
    {
      product && (
        <Table
          columns={columnsProduct}
          dataSource={product}
          pagination={false}
          rowKey="id"
        />
      )
    }
    <h3 style={{marginTop: '30px'}}>comment product</h3>
     {
       replyComment && (
        <Table
          columns={columns}
          dataSource={replyComment}
          rowKey="id"
          className="table-commentProduct"
        />
       )
     }
     <Modal
        className="form__add"
        visible={showFormReply}
        title="trả lời comment"
        onCancel={handleCancelForm}
      >
        <Form
          name="basic"
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            name="comment"
            rules={[{ required: true, message: 'Please input your comment!' } ]}
          >
            <Input />
          </Form.Item>

          <Form.Item  className="groupButton">
            <Button className="btnSubmit" type="primary" danger onClick={handleCancelForm}>
              Huỷ
            </Button>
            <Button className="btnSubmit" type="primary" htmlType="submit" >
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ReplyNewComments
