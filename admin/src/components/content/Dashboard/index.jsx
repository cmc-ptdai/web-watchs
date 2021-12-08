import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { Button } from 'antd'
import apiNewComment from '../../../api/apiNewComment'
import apiOrders from '../../../api/apiOrders'
import './style.scss'

const Dashboard = () => {

  const history = useHistory()
  const store = useSelector(store => store)
  const [listNewComment, setNewListComment] = useState(null)
  const [status, setStatus] = useState(false)
  const [data , setData] = useState(
    {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      datasets: [
        {
          label: 'Tổng doanh thu',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          // data: [500, 600, 850, 460, 280, 223, 268,330, 450, 570, 610, 240],
          fill: true,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.3,
        },
        {
          label: 'tổng số đơn hang',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          //data: [200, 300, 250, 160, 180, 123, 168,230, 250, 270, 210, 140],
          fill: true,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3,
        },
      ]

    }
  )

  useEffect(() => {
    fetchNewComment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const fetchNewComment = async () => {
    const newData = {...data}
    newData.datasets[0].data= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    newData.datasets[1].data= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    const date = new Date()
    const year1 = date.getFullYear()
    const newList = await apiNewComment.getNewComment()
    const newListOrders = await apiOrders.getAllOrders()
    newListOrders.forEach(item => {
      const yearProduct = item.dateCreate.slice(0, 4)
      if (year1.toString() === yearProduct) {
        const monthProduct = item.dateCreate.slice(5, 7)
        newData.datasets[0].data[monthProduct - 1] = newData.datasets[0].data[monthProduct - 1] +  (item.money/230000)
        newData.datasets[1].data[monthProduct - 1] = newData.datasets[1].data[monthProduct - 1] +  1
      }
    })
    setData(newData);
    setNewListComment(newList)
  }

  const money = () => {
    let a = 0
    store.orderReducer.forEach(item => {
      a = a + Number(item.money)
    })
    return a
  }
  const options = {
    maintainAspectRatio: true,
  }

  const skipNewComment = (comment) => {
    apiNewComment.deleteNewComment(comment.id)
    setStatus(!status)
  }
  const replyNewComment = (comment) => {
    skipNewComment(comment)
    return history.push({ pathname: `/body/comments/${comment.idProduct}/${comment.idComment}`})
  }

  return (
    <div className="dashboard">
      <div className="dashboard-status">
        <div className="dashboard-status-item">
          <div className="dashboard-status-item-icon">
          <i className="far fa-usd-circle"></i>
          </div>
          <div className="dashboard-status-item-info">
            <h3>Total money</h3>
            <p>
              {
                money().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              &nbsp;
              VND
            </p>
          </div>
        </div>

        <Link
          to='/orders'
          className="dashboard-status-item"
        >
          <div className="dashboard-status-item-icon">
          <i className="fad fa-shopping-cart"></i>
          </div>
          <div className="dashboard-status-item-info">
            <h3>Order</h3>
            <p>{store.orderReducer.length}</p>
          </div>
        </Link>

        <Link
          to='/users'
          className="dashboard-status-item"
        >
          <div className="dashboard-status-item-icon">
          <i className="fad fa-users"></i>
          </div>
          <div className="dashboard-status-item-info">
            <h3>user</h3>
            <p>{store.userReducer.length}</p>
          </div>
        </Link>

        <Link
          to='/vegetable'
          className="dashboard-status-item"
        >
          <div className="dashboard-status-item-icon">
          <i className="fad fa-boxes"></i>
          </div>
          <div className="dashboard-status-item-info">
            <h3>Product</h3>
            <p>{store.productReducer.length}</p>
          </div>
        </Link>
      </div>
      <div className="dashboard-chart">
        <div className="dashboard-chart-line">
          <Line
            data={data}
            options= {options}
          />
        </div>
        <div className="dashboard-chart-comment">
          <Link
            to='/users'
            className="dashboard-chart-comment-item"
          >
            <div className="dashboard-chart-comment-item-icon">
            <i className="fad fa-users"></i>
            </div>
            <div className="dashboard-chart-comment-item-info">
              <h3>New comment</h3>
              {
                listNewComment && (
                  <p>{listNewComment.length}</p>
                )
              }

            </div>
          </Link>
          {
            (listNewComment !== null && listNewComment.length > 0 ) && (
              <div className="dashboard-chart-comment-list">
                {
                  listNewComment && (
                    listNewComment.map((item, index) => {
                      return (
                        <div
                          className="dashboard-chart-comment-list-item"
                          key={index}
                        >
                          <p
                            className="dashboard-chart-comment-list-item-name"
                          >
                            {item.name}
                          </p>
                          <p>{item.comment}</p>
                          <div className='dashboard-chart-comment-list-item-button'>
                            <Button
                              danger
                              onClick={() => skipNewComment(item)}
                            >
                              skip
                            </Button>
                            <Button
                              type="primary"
                              onClick={() => replyNewComment(item)}
                            >
                              reply
                            </Button>
                          </div>
                        </div>
                      )
                    })
                  )
                }
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
