import React, { useEffect, useState } from 'react';
import apiPosts from '../../api/apiPosts'
import { useParams } from 'react-router';

const DetailedPosts = () => {

  const param = useParams()
  const [dataPosts, setDataPost] = useState(null)

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async () => {
    const newData = await apiPosts.getPostsById(param.id)
    setDataPost(newData)
  }
  return (
    <>
      {
        dataPosts && (
          <div className="detailedPost">
            <div dangerouslySetInnerHTML={ { __html: dataPosts.content } }></div>
          </div>
        )
      }
    </>
  )
}

export default DetailedPosts
