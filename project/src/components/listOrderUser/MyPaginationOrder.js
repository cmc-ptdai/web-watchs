import React, { useState } from 'react';
import JwPagination from 'jw-react-pagination';
import OrderItem from './OrderItem'

const MyPaginationOrder = ({ listSort }) => {
  const [pageOfItems, setPageOfItems] = useState([]);

  const onChangePage = (data) => {
    setPageOfItems(data);
  };

  return (
    <>
      {pageOfItems.map((item, index) => (
        <OrderItem dataOrder={item} key={index}/>
      ))}
      <div className="col-12 product__pagination">
        <JwPagination items={listSort} onChangePage={onChangePage} pageSize={6} maxPages={5} />
      </div>
    </>
  );
};

export default MyPaginationOrder;
