import React, {useEffect, useState} from 'react'
import { Rate, Modal, Button, Input, Comment, Avatar } from 'antd'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  setEvaluate as setEvaluateAction
} from "../../../redux/actions/products";
import EvaluateApi from '../../../api/apiEvaluates';
import apiUser from '../../../api/userApi'

const Evaluate = ({data}) => {
  const dispatch = useDispatch()
  const user = useSelector(store => store.userReducer.user)
  const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  const [evaluateDefault, setEvaluateDefault] = useState(null)
  const [listUser, setListUser] = useState(null)
  const [valueInputEvaluate, setValueInputEvaluate] = useState('')
  const [evaluate, setEvaluate] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  useEffect(() => {
    fetchEvaluate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])
  const fetchEvaluate = async () => {
    const listEvaluate = await EvaluateApi.getAllEvaluates()
    const litUser = await apiUser.getUser()
    setListUser(litUser)
    for (let i=0 ; i < listEvaluate.length; i++) {
      if (listEvaluate[i].id === data.id) {
        setEvaluateDefault(listEvaluate[i]);
        break
      }
    }
  }

  const totalCount = (number) => {
    let count = 0
    evaluateDefault.evaluates.forEach(item => {
      if (item.point === number) {
        count += 1
      }
    })
    return count
  }

  const changeInputEvaluate = (e) => {
    setValueInputEvaluate(e.target.value)
  }

  const handleCancel = () => {
    setIsModalVisible(false);
    setShowEdit(false)
    setValueInputEvaluate('')
    setEvaluate(0)
  };

  const handleChange = (evaluate) => {
    setEvaluate(evaluate)
  }
  const showModal = () => {
    setIsModalVisible(true);
  };
  const submitEvaluate = () => {
    if ( evaluateDefault.evaluates.length > 0) {
      let a = 0;
      for (let i = 0; i < evaluateDefault.evaluates.length; i++) {
        if (evaluateDefault.evaluates[i].id === user.id ) {
          a += 1
          evaluateDefault.evaluates[i] = {
            ...evaluateDefault.evaluates[i],
            point: evaluate,
            text: valueInputEvaluate
          }
          break
        }
      }
      if (a === 0) {
        evaluateDefault.evaluates.push(
          {
            id: user.id,
            point: evaluate,
            text: valueInputEvaluate
          }
        )
      }
    } else {
      evaluateDefault.evaluates.push(
        {
          id: user.id,
          point: evaluate,
          text: valueInputEvaluate
        }
      )
    }
    dispatch(setEvaluateAction(evaluateDefault))
    setIsModalVisible(false);
    setShowEdit(false)
    setValueInputEvaluate('')
    setEvaluate(0)
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

  const fetchName = (id) => {
    let name = ''
    for (let i = 0; i < listUser.length ; i++) {
      if (listUser[i].id === id) {
        name = listUser[i].userName;
        break;
      }
    }
    return name;
  }

  const fetchPointDefault = (id) => {
    let dataLocal = null
    for (let i = 0; i < evaluateDefault.evaluates.length ; i++) {
      if (evaluateDefault.evaluates[i].id === id) {
        dataLocal = evaluateDefault.evaluates[i];
        break;
      }
    }
    return dataLocal
  }
  const handleEdit = () => {
    setShowEdit(true)
    setValueInputEvaluate('')
    setEvaluate(0)
  }
  return (
    <>
      <p className="evaluate-title">Đánh giá sản phẩm <span>( {evaluateDefault ? evaluateDefault.evaluates.length : 0} đánh giá)</span> </p>
      {
        evaluateDefault !== null && (
          <>
          <div className="evaluate-content">
            <div className="evaluate-content-rate">
              <div>
                <Rate
                  disabled
                  tooltips={desc}
                  value={5}
                />
                  <span className="ant-rate-text">{desc[4]}&nbsp;( {totalCount(5)} )</span>
              </div>
              <div>
                <Rate
                  disabled
                  tooltips={desc}
                  value={4}
                />
                  <span className="ant-rate-text">{desc[3]}&nbsp;( {totalCount(4)} )</span>
              </div>
              <div>
                <Rate
                  disabled
                  tooltips={desc}
                  value={3}
                />
                  <span className="ant-rate-text">{desc[2]} &nbsp;( {totalCount(3)} )</span>
              </div>
              <div>
                <Rate
                  disabled
                  tooltips={desc}
                  value={2}
                />
                  <span className="ant-rate-text">{desc[1]} &nbsp;( {totalCount(2)} )</span>
              </div>
              <div>
                <Rate
                  disabled
                  tooltips={desc}
                  value={1}
                />
                  <span className="ant-rate-text">{desc[0]} &nbsp;( {totalCount(1)} )</span>
              </div>
              <div className="evaluate-content-rate-groupButton">
                <span className={ user && (user.id === undefined ? "evaluateDisable" :  "evaluate" )}>
                  <button onClick={showModal} disabled={user && (user.id === undefined ? true : false)}>Đánh giá sản phẩm</button>
                  <span style={{display: user && (user.id === undefined ? 'block' : 'none')}}>( Đăng nhập để gửi đánh giá của bạn <Link to='/login'>Đăng nhập tại đây</Link>)</span>
                </span>
              </div>
            </div>
            <div className="evaluate-content-right">
              {
                evaluateDefault.evaluates && (
                  evaluateDefault.evaluates.map((item, index) => {
                    return (
                      <Comment
                        key={index}
                        className="comment"
                        author={<span>{fetchName(item.id)}</span>}
                        avatar={
                          <Avatar
                            src={fetchImg(item.id) === '' ? 'https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg' :  fetchImg(item.id)}
                            alt=""
                          />
                        }
                        content={
                          <>
                            <Rate
                              disabled
                              tooltips={desc}
                              value={item.point}
                            />
                            <p>
                              {item.text}
                            </p>
                          </>
                        }
                      />
                    )
                  })
                )
              }
            </div>
          </div>
          <div className="fromEvaluate">
            <Modal
              visible={isModalVisible}
              title="Đánh giá sản phẩm"
              style = {{marginTop: "150px"}}
              onCancel={handleCancel}
            >
              <span>Đánh giá của bạn về sản phẩm: </span>
              {
                fetchPointDefault(user.id) && !showEdit ? (
                  <>
                    <Rate
                      disabled
                      value={ fetchPointDefault(user.id).point}
                    />
                    <p style={{marginTop: '10px'}}>
                     Bình luận đi kèm: { fetchPointDefault(user.id).text }
                    </p>
                  </>
                ) : (
                  <>
                    <Rate
                      onChange={handleChange}
                      value={evaluate}
                    />
                    <Input
                      placeholder="nhập đánh giá của ban (nếu có)"
                      onChange={changeInputEvaluate}
                      style={{marginTop: '10px'}}
                      value={valueInputEvaluate}
                    />
                  </>
                )
              }
              <div className="fromEvaluate__btn">
                <Button
                  key="submit"
                  type="primary"
                  onClick={submitEvaluate}
                  disabled={fetchPointDefault(user.id) && evaluate === 0 }
                >
                  Gửi đánh giá
                </Button>

                {
                  fetchPointDefault(user.id) && !showEdit ? (
                    <Button key="edit" danger  onClick={handleEdit}>
                      sửa đánh giá
                    </Button>
                  ) : ''
                }

                <Button key="cancel" danger  onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </Modal>
          </div>
          </>
        )
      }
    </>
  )
}

export default Evaluate;
