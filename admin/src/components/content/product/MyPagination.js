import React, { useState } from 'react';
import JwPagination from 'jw-react-pagination';
import ProductItem from './productItem';
import './product.scss'

const MyPagination = ({ listSort }) => {
  const [pageOfItems, setPageOfItems] = useState([]);

  const onChangePage = (data) => {
    setPageOfItems(data);
  };

  return (
    <>
      {pageOfItems.map((item, index) => (
        <ProductItem data={item} key={index} />
      ))}
      <div className="product__pagination">
        <JwPagination items={listSort} onChangePage={onChangePage} pageSize={8} maxPages={5} />
      </div>
    </>
  );
};

export default MyPagination;
