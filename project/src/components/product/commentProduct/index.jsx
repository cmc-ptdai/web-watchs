import React, { useEffect, useState } from 'react';
import CommentProduct from './CommentProduct';
import { useDispatch, useSelector }  from 'react-redux'
import { Button,  Comment,Avatar,Form, Input } from 'antd';
import { commentProduct } from '../../../redux/actions/products'
import { v4 as createId } from 'uuid';
import './styleComment.scss'
import { Link } from 'react-router-dom'
import apiComment from '../../../api/apiComment'
import apiUser from '../../../api/userApi'
import apiNewComment from '../../../api/apiNewComment'

const { TextArea } = Input;

const ShowComment = ({data}) => {
  const user = useSelector(store => store.userReducer.user)

  const [dataComments, setDataComment] = useState(null)
  const [listUsers, setListUsers] = useState(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetchComment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[data,status])

  const fetchComment = async () => {
    const listComments = await apiComment.getAllApiComments()
    const listUsers = await apiUser.getUser()
    setListUsers(listUsers)
    for (let i=0 ; i < listComments.length; i++) {
      if (listComments[i].id === data.id) {
        setDataComment(listComments[i])
        break
      }
    }
  }

  const dispatch = useDispatch()
  const [valueComment, setValueComment] = useState('')

  const handleChangeComment = (e) => {
    setValueComment(e.target.value)
  }

  const handleSubmitComment = () => {
    if (valueComment) {
      const newData = {
        id: createId(),
        idUser: user.id,
        name: user.name,
        comment: valueComment,
        date: new Date(),
        children: []
      }

      const newComment = {
        id : createId(),
        idProduct: dataComments.id,
        idComment: newData.id,
        idUser: user.id,
        date: new Date(),
        name: user.name,
        comment: valueComment
      }

      dataComments.comments.push(newData)
      apiNewComment.addNewComment(newComment)
      dispatch(commentProduct({newData: dataComments, dataProduct: data.id}))
      setValueComment('')
      setStatus(newData.id);
    }
  }

  const changeStatus1 = (status1) => {
    setStatus(status1);
  }
  return (
    <>
      {
        dataComments !== null &&
        dataComments.comments.map((item, index) => {
          return (
          <CommentProduct
            dataComment={item}
            dataProduct={data}
            listUser={listUsers}
            data={dataComments}
            key={index}
            changeStatus={changeStatus1}
          />
          )
        })
      }
      <Comment
        avatar={
          user.id && <Avatar
          src={user.img === '' ? 'https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg' : user.img}
          alt={user.userName}
        />
        }
        content={
          <>
            {
              user.id ? (
                <div>
                  <Form.Item>
                    <TextArea rows={3} onChange={handleChangeComment} value={valueComment}/>
                  </Form.Item>
                  <Form.Item>
                    <Button htmlType="submit" onClick={handleSubmitComment} type="primary">
                      Add Comment
                    </Button>
                  </Form.Item>
                </div>
              ) : (
                <div className="notification-login">
                  <p>( đăng nhâp để có quyền bình luân <Link to='/login'>Đăng nhập tại đây</Link>)</p>
                </div>
              )
            }
          </>
        }
      />
    </>
  )
}

export default ShowComment;
