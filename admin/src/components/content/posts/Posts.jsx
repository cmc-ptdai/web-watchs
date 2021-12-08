import React, { useState } from 'react';
import { CKEditor } from 'ckeditor4-react';
import apiPosts from '../../../api/apiPosts'
import { v4 as uuidv4 } from 'uuid';
import { Input, Button, notification } from 'antd';
import { useHistory } from "react-router-dom"
import './style.scss'

const openNotification = (item) => {
  notification.open({
    message: '',
    description:<p style={{ marginLeft: '10px'}}>{item}</p>,
    icon: <i className="fab fa-optin-monster" style={{fontSize: "40px", color: '#fe9705'}}></i>,
  });
};

const Posts = () => {
  const history = useHistory()
  const [value, setValue] = useState('')
  const [img, setImg] = useState('')
  const [title, setTitle] = useState('')

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
        history.push({ pathname: `/body/listPosts` })
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
          data={value}
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
  );
}

export default Posts;
