import React, { useState, useEffect } from 'react';
import {Button,  Comment, Avatar, Form, Input, Popconfirm, Modal } from 'antd';
import { useDispatch, useSelector }  from 'react-redux'
import './styleComment.scss'
import {
  deleteNewComment,
  replyCommentProduct,
  deleteComment as deleteCommentAction,
  deleteCommentReply as deleteCommentReplyAction
} from '../../../redux/actions/products'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import apiNewComment from '../../../api/apiNewComment'
import apiComment from '../../../api/apiComment'

const { TextArea } = Input;

const CommentProduct = ({dataComment, dataProduct, listUser, data, changeStatus}) => {

  const [form] = Form.useForm();
  const user = useSelector(store => store.userReducer.user)
  const dispatch = useDispatch()
  const dataLocal = {...dataComment}

  const [valueComment, setValueComment] = useState('')
  const [showInputComment ,setShowInputComment] = useState(false)
  const [commentEdit, setCommentEdit] = useState(null)
  const [listNewComment, setListNewComment] = useState(null)

  useEffect(() => {
    fetchNewComment()
  }, [])

  const fetchNewComment = async () => {
    const listData = await apiNewComment.getNewComment()
    setListNewComment(listData)
  }

  const handleChangeComment = (e) => {
    setValueComment(e.target.value);
  }

  const fetchImg = (id) => {
    let img = ''
    for (let i = 0; i < listUser.length ; i++) {
      if (listUser[i].id === id) {
        img = listUser[i].img;
        break;
      }
    }
    return img;
  }

  const deleteComment = (id) => {
    const commentNew = listNewComment.filter(item => item.idComment === id)
    if (commentNew.length > 0) {
      dispatch(deleteNewComment(commentNew[0]))
    }
    const newListComment = data.comments.filter(comment => comment.id !== id)
    const newComment = {
      ...data,
      comments: newListComment
    }
    dispatch(deleteCommentAction(newComment))
    changeStatus(uuidv4())
  }

  const deleteReplyComment = (id) => {
    const data1 = {...data}
    const commentNew = listNewComment.filter(item => item.idComment === id)
    if (commentNew.length > 0) {
      dispatch(deleteNewComment(commentNew[0]))
    }
    const newReplyComment = dataLocal.children.filter(comment => comment.id !== id)
    for (let i = 0; i < data1.comments.length; i++) {
      if (data1.comments[i].id === dataLocal.id) {
        data1.comments[i].children = newReplyComment
      }
    }
    dispatch(deleteCommentReplyAction(data1))
    changeStatus(uuidv4())
  }

  const handleSubmitComment =  () => {
    if (valueComment) {
      let newId = ''
      data.comments.forEach((item, index) => {
        if (item.id === dataComment.id) {
          const newDate = new Date()
          const newData = {
            id: uuidv4(),
            idUser: user.id,
            name: user.name,
            comment: valueComment,
            date: newDate
          }
          newId = newData.id
          data.comments[index].children.push(newData);
        }
      })
      const newComment = {
        id : uuidv4(),
        idProduct: data.id,
        idComment: newId,
        idUser: user.id,
        date: new Date(),
        name: user.name,
        comment: valueComment
      }
      apiNewComment.addNewComment(newComment)
      setTimeout(() => {
        dispatch(replyCommentProduct({newData: data, dataProduct: dataProduct.id}))
      }, 200);
      setShowInputComment(false);
      setValueComment('')
    }
  }

  const submitReplyComment = () => {
    setShowInputComment(!showInputComment);
  }

  const  handleCancel =  () => {
    setShowInputComment(false);
  }

  const editComment = (comment) => {
    setCommentEdit(comment);
  }


  const handleCancelFrom = () => {
    setCommentEdit(null)
    form.resetFields();
  }
  const submitEditComment = (value) => {
    if (commentEdit.children) {
      const newData = {...data}
      for (let index = 0; index < newData.comments.length; index++) {
        if (newData.comments[index].id === commentEdit.id) {
          newData.comments[index] = {
            ...newData.comments[index],
            comment: value.comment,
          }
          break
        }
      }
      apiComment.editApiComments(newData.id, newData)
      changeStatus(uuidv4())
    } else {
      const data1 = {...data}
      for (let i = 0; i < dataLocal.children.length; i++) {
        if (dataLocal.children[i].id === commentEdit.id) {
          dataLocal.children[i] = {
            ...dataLocal.children[i],
            comment: value.comment,
          }
          break
        }
      }
      for (let i = 0; i < data1.comments.length; i++) {
        if (data1.comments[i].id === dataLocal.id) {
          data1.comments[i] = dataLocal
          break
        }
      }
      apiComment.editApiComments(data1.id, data1)
    }
    handleCancelFrom()
  }
  const cancel = () => {}
  return (
    <>
      <Comment
        className="comment"
        actions={[
          <span onClick={submitReplyComment} key="comment-basic-reply-to">Reply to</span>,
          <span
            onClick={() => editComment(dataLocal)}
            key="comment-basic-edit"
            className={dataLocal.idUser !== user.id ? 'display-none' : ''}
          >
            edit
          </span>,
          <Popconfirm
            title="Bạn muốn xoá bình luận này chứ?"
            onConfirm={() => deleteComment(dataLocal.id)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <span
              key="comment-basic-delete"
              className={dataLocal.idUser !== user.id ? 'display-none' : ''}
            >
              Delete
            </span>
          </Popconfirm>,
          <span key="comment-basic-date"></span>
        ]}
        author={<span>{dataLocal.name}</span>}
        avatar={
          <Avatar
            src={fetchImg(dataComment.idUser) === '' ? 'https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg' :  fetchImg(dataComment.idUser)}
            alt=""
          />
        }
        content={
          <p>
            {dataLocal.comment}
          </p>
        }
      >
        { dataLocal.children && (
          dataLocal.children.map((item, index) => {
            return (
              <Comment
                key={index}
                actions={[
                  <span
                    onClick={() => editComment(item)}
                    key="comment-basic-edit"
                    className={item.idUser !== user.id ? 'display-none' : ''}
                  >
                    edit
                  </span>,
                  <Popconfirm
                    title="Bạn muốn xoá bình luận này chứ?"
                    onConfirm={() => deleteReplyComment(item.id)}
                    onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                  >
                  <span
                    key="comment-basic-delete"
                    className={item.idUser !== user.id ? 'display-none' : ''}
                  >
                    Delete
                  </span>
                  </Popconfirm>,
                  <span key="comment-basic-date"></span>
                ]}
                className="comment"
                author={<span>{item.name}</span>}
                avatar={
                  <Avatar
                    src={fetchImg(item.idUser) === '' ? 'https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg' : fetchImg(item.idUser)}
                    alt=''
                  />
                }
                content={
                  <p>
                    {item.comment}
                  </p>
                }
              />
            )
          })
        )}
      </Comment>
      {
        showInputComment && (
          user.id ? (
            <Comment
              className="replyComment"
              avatar={
                <Avatar
                  src={user.img === '' ? 'https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg' : user.img}
                  alt={user.userName}
                />
              }
              content={
                <div>
                  <Form.Item>
                    <TextArea rows={2} onChange={handleChangeComment} />
                  </Form.Item>
                  <Form.Item>
                    <Button htmlType="submit" onClick={handleSubmitComment} type="primary">
                      reply
                    </Button>
                    <Button onClick={handleCancel} danger >
                      Cancel
                    </Button>
                  </Form.Item>
                </div>
              }
            />
          ) : (
            <div className="notification-login">
              <p>( đăng nhâp để có quyền bình luân <Link to='/login'>Đăng nhập tại đây</Link> )</p>
            </div>
          )
        )
      }
      {
        commentEdit?.id && (
          <Modal
            className="form__add"
            visible={true}
            title="Chỉnh sửa bình luận"
            onCancel={handleCancelFrom}
          >
            <Form
              name="basic1212"
              form={form}
              fields={[
                {
                  name: ["comment"],
                  value: commentEdit.comment,
                },
              ]}
              onFinish={submitEditComment}
            >
              <Form.Item
                name="comment"
                rules={[{ required: true, message: 'Please input your comment!' } ]}
              >
                <Input />
              </Form.Item>
              <Form.Item  className="groupButton">
                <Button className="btnSubmit" type="primary" danger onClick={handleCancelFrom}>
                  Huỷ
                </Button>
                <Button className="btnSubmit" type="primary" htmlType="submit" >
                  Thêm
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        )
      }
  </>
  );
};

export default CommentProduct
