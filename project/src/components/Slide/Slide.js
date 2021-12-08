import React, { useEffect, useState } from 'react'
import ProductApi from '../../api/productApi'
import './slide.scss'

const Slide = () => {
  const [slides, setSlides] = useState([])

  const fetchApi = async () => {
    try {
      const response = await ProductApi.getSlide()
      setSlides(response)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchApi()
  }, [])
  return (
    <div className="list-slide">
      <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
        <div className="carousel-inner">
          {
            slides.map(item => {
              return (
                <div className={item.id === "1" ? 'carousel-item active' : 'carousel-item'}  key={item.id} >
                  <img className="d-block" src={item.img} alt="First slide" />
                </div>
              )
            })
          }
        </div>
        <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="sr-only">Previous</span>
        </a>
        <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="sr-only">Next</span>
        </a>
      </div>
    </div>
  )
}

export default Slide
