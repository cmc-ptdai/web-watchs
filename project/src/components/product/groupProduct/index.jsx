import React from 'react';
import './style.scss';
import CardItem from '../CardItem';
import Slider from "react-slick";
import { Link } from 'react-router-dom'

const settings = {
  className: "center",
  centerMode: true,
  infinite: true,
  slidesToShow: 3,
  speed: 500,
  autoplaySpeed: 1000,
  centerPadding: "60px",

};

const GroupProduct = ({title, products, loai, species}) => {
  return (
    <div className="group-product">
      {
        products && (
          <>
            <div className="group-product__title">
              <p>{title}</p>
            </div>
            <div className="group-product__product">
              <Slider {...settings}>
                {
                    products.map((item, index) => {
                      if(item.typeID === loai || item.species === species) {
                        return (
                          <div className="item"  key={index}>
                            <CardItem item={item}/>
                          </div>
                        )
                      }
                      return 0;
                    })
                  }
              </Slider>
            </div>
            <div className="group-product__seeMore">
              <Link to="/vegetable">xem thêm <i className="fad fa-chevron-double-right"></i></Link>
            </div>
          </>
        )
      }
    </div>
  )
}

export default GroupProduct;
