import React, {useState , useEffect} from 'react';
import {useHistory} from 'react-router-dom'
import apiPosts from '../../api/apiPosts'
import './style.scss'

const Posts = () => {
  const history = useHistory()
  const [listPosts, setListPosts] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const newData = await apiPosts.getAllPosts()
    setListPosts(newData)
  }

  const ShowPosts = (id) => {
    history.push(`/detailedPosts/${id}`)
  }
  return (
    <>
      <div className="listPosts">
        {
          listPosts && (
            listPosts.map((item,index) => {
              return (
                <div className="listPosts__item" key={index}>
                  <div className="listPosts__item--img" onClick={() => ShowPosts(item.id)}>
                    <img src={item.img} alt="" />
                  </div>
                  <div className="listPosts__item--title" onClick={() => ShowPosts(item.id)}>
                    <h3>{item.title}</h3>
                    <p>{item.date.slice(0,10).split('-').reverse().join('-')}</p>
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

export default Posts
