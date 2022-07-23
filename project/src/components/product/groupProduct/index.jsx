import React from 'react';
import './style.scss';
import CardItem from '../CardItem';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';

const settings = {
  className: 'center',
  centerMode: true,
  infinite: true,
  slidesToShow: 3,
  speed: 500,
  autoplaySpeed: 1000,
  centerPadding: '60px',
};

const GroupProduct = ({ title, products, type }) => {
  const fetchProduct = () => {
    const newList = [...products];
    newList.sort((a, b) => {
      return b.quantityPurchased - a.quantityPurchased;
    });
    return newList;
  };
  return (
    <>
      {products.length > 0 && (
        <div className="group-product">
          <div className="group-product__title">
            <p>{title}</p>
          </div>
          {type === 'productHot' ? (
            <div className="group-product__product">
              <Slider {...settings}>
                {fetchProduct().map((item, index) => {
                  if (index < 10) {
                    return (
                      <div className="item" key={index}>
                        <CardItem item={item} />
                      </div>
                    );
                  } else {
                    return false
                  }
                })}
              </Slider>
            </div>
          ) : (
            <div className="group-product__product">
              <Slider {...settings}>
                {products.map((item, index) => {
                  if (item.gender === type) {
                    return (
                      <div className="item" key={index}>
                        <CardItem item={item} />
                      </div>
                    );
                  }
                  return 0;
                })}
              </Slider>
            </div>
          )}
          <div className="group-product__seeMore">
            <Link to={'/' + type}>
              xem thêm <i className="fad fa-chevron-double-right"></i>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupProduct;
