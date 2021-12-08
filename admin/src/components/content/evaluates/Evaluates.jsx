import React, { useEffect, useState } from 'react';
import { Table, Popconfirm, Button } from 'antd';
import apiEvaluate from '../../../api/apiEvaluates'
import apiUser from '../../../api/apiUser'
import { useParams } from 'react-router-dom'


const Evaluates = () => {

  const param = useParams()
  const [evaluateProduct, setEvaluateProduct] = useState()
  const [ lisUser, setListUser] = useState()

  useEffect(() => {
    fetchComment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param])

  const fetchComment = async () => {
    const evaluateLocal = await apiEvaluate.getEvaluateById(param.id)
    const lisComment = await apiUser.getAllUser()
    setListUser(lisComment)
    setEvaluateProduct(evaluateLocal);
  }
  const fetchUser = (id) => {
    const userLocal = lisUser.filter(item => item.id === id);
    return userLocal[0].name;
  }

  const columns = [
    {
      title: 'name',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => (
        <span> {fetchUser(record.id)} </span>
      )
    },
    {
      title: 'Điểm',
      dataIndex: 'point',
      key: 'point',
    },
    {
      title: 'bình luận kèm',
      dataIndex: 'text',
      key: 'text',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <div className="tableUser__button">
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

  const handleOk = (record) => {
    const newEvaluate = evaluateProduct.evaluates.filter(item => item.id !== record.id)
    const newE = {
      ...evaluateProduct,
      evaluates: newEvaluate
    }
    setEvaluateProduct(newE)
    apiEvaluate.editEvaluates(evaluateProduct.id, newE)
  }
  const handleCancel = () => {

  }

  return (
    <>
      {
        evaluateProduct && (
          <Table
            columns={columns}
            dataSource={evaluateProduct.evaluates}
            rowKey="id"
          />
        )
      }
    </>
  )
}

export default Evaluates;
