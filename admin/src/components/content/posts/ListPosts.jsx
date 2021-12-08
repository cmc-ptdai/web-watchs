import React , {useEffect, useState} from 'react';
import { Button, notification, Popconfirm } from 'antd';
import apiPosts from '../../../api/apiPosts'
import { useHistory } from "react-router-dom"
import './style.scss'


const openNotification = (item) => {
  notification.open({
    message: '',
    description:<p style={{ marginLeft: '10px'}}>{item}</p>,
    icon: <i className="fab fa-optin-monster" style={{fontSize: "40px", color: '#fe9705'}}></i>,
  });
};


const ListPosts = () => {
  const [listPosts, setListPosts] = useState(null)
  const history = useHistory()
  const [status, setStatus] = useState(true)

  useEffect(() => {
    fetchData()
  }, [status])

  const fetchData = async () => {
    const newData = await apiPosts.getAllPosts()
    setListPosts(newData)
  }

  const editBlog = (id) => {
    return history.push({ pathname: `/body/EditPosts/${id}` })
  }

  const addBlog = (id) => {

    return history.push({ pathname: `/body/AddPosts` })
  }

  function confirm(id) {
    apiPosts.deletePosts(id)
    setStatus(!status)
    openNotification("Bạn đã xoá bài viết thành công bạn có thể tạo mới bài viết khác")
  }

  function cancel(e) {}

  return (
    <>
      <div>
        <Button
          onClick={addBlog}
          type="primary"
          style={{
            marginBottom: '20px',
            borderRadius: '10px'
          }}
        >
          Thêm bài viết
        </Button>
      </div>
      <div className="listPosts">
        {
          listPosts && (
            listPosts.map((item, index) => {
              return (
                <div className="listPosts-item" key={index}>
                  <div className="listPosts-item--img">
                    <img src={item.img} alt="" />
                  </div>
                  <div className="listPosts-item--title">
                    <span>{item.title}</span>
                  </div>
                  <div className="listPosts-item--action">
                    <Button
                      type="primary"
                      onClick={() => editBlog(item.id)}
                    >
                      Edit
                    </Button>
                    <Popconfirm
                      title="Bạn muốn xoá bài viết này chứ?"
                      onConfirm={() => confirm(item.id)}
                      onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        danger
                      >
                        Delete
                      </Button>
                    </Popconfirm>

                  </div>
                </div>
              )
            })
          )
        }
      </div>
    </>
  )
}

export default ListPosts;
