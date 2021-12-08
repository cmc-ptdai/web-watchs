import React, { useState, useEffect } from 'react';
import { CKEditor } from 'ckeditor4-react'
import { useParams } from 'react-router-dom'
import apiPosts from '../../../api/apiPosts'
import { v4 as uuidv4 } from 'uuid';
import { Input, Button, notification } from 'antd';
import './style.scss'

const openNotification = (item) => {
  notification.open({
    message: '',
    description:<p style={{ marginLeft: '10px'}}>{item}</p>,
    icon: <i className="fab fa-optin-monster" style={{fontSize: "40px", color: '#fe9705'}}></i>,
  });
};

const EditPost = () => {
  const param = useParams()
  const [value, setValue] = useState(null)
  const [img, setImg] = useState('')
  const [title, setTitle] = useState('')
  const [dataBlog, setDataBlog] = useState(null)

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async () => {
    const newData = await apiPosts.getPostsById(param.id)
    setTitle(newData.title)
    setImg(newData.img)
    setValue(newData.content)
    setDataBlog(newData)
  }


  const createBlog = () => {
    if (value === '' || img === '' || title === '') {
      openNotification('Bạn đang nhập thiếu một số trường nào đấy hãy nhập đủ hết các trường')
    } else {
      let i = 0
      const a = `"`
      const b = `'`
      let dfValue = value
      while (i <= value.length) {
        const index = dfValue.indexOf(a)
        dfValue = dfValue.replace(a, b)
        if (index === -1) {
          break;
        }
        i++;
      }
      const newData = {
      id: uuidv4(),
      date: new Date(),
      title: title,
      img: img,
      content: dfValue
      }
      apiPosts.addPosts(newData)
      setTitle('')
      setImg('')
      setTimeout(() => {
        setValue('')
      }, 300);
    }
  }

  const onchangeInputTitle = (e) => {
    setTitle(e.target.value);
  }
  const onchangeInputImg = (e) => {
    setImg(e.target.value);
  }

  return (
    <>
      {
        dataBlog && (
          <>
            <h2>Tạo bài viết</h2>

            <label>Tiêu đề:</label>
            <Input
              placeholder="Nhập vào tiêu đề vào biết"
              style={{marginBottom: '10px'}}
              value={title}
              onChange={onchangeInputTitle}
            />

            <label>Ảnh bài viết</label>
            <Input
              placeholder="nhập vào link ảnh"
              style={{marginBottom: '10px'}}
              value={img}
              onChange={onchangeInputImg}
            />

            <div className="ckEditor">
              <CKEditor
                data={dataBlog.content}
                onChange={ evt => setValue(evt.editor.getData())}
              />
            </div>
            <Button
              onClick={createBlog}
              type="primary"
              style={{marginTop: '10px'}}
            >
              tạo bài viết
            </Button>
          </>
        )
      }
    </>
  );
}

export default EditPost;
