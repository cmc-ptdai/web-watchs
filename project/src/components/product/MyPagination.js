import React, { useState } from 'react';
import JwPagination from 'jw-react-pagination';
import CardItem from './CardItem';

const MyPagination = ({ listSort }) => {
  const [pageOfItems, setPageOfItems] = useState([]);

  const onChangePage = (data) => {
    window.scrollTo(0, 0)
    setPageOfItems(data);
  };

  return (
    <>
      {pageOfItems.map((item, index) => (
        <div className="col-4 item" key={index} style={{marginBottom: "20px"}}>
          <CardItem item={item} />
        </div>
      ))}
      {
        pageOfItems.length === 0 && (
          <div>
            <img src='https://store.vtctelecom.com.vn/Content/images/no-data.png' alt='No data'/>
          </div>
        )
      }
      <div className="col-12 product__pagination">
        <JwPagination items={listSort} onChangePage={onChangePage} pageSize={6} maxPages={5} />
      </div>
    </>
  );
};

export default MyPagination;
