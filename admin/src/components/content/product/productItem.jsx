import React, { useState } from 'react';
import './productItem.scss'
import { useDispatch } from 'react-redux';
import FormEditProduct from './FormEditProduct'
import { deleteProduct as deleteProductAction ,getProduct } from '../../../redux/action/productAction'
import ApiProduct from '../../../api/apiProduct'
import apiComment from "../../../api/apiComment";
import apiEvaluate from "../../../api/apiEvaluates";
import apiWarehouse from "../../../api/apiWarehouse";
import { Popconfirm } from 'antd'
import {Link} from 'react-router-dom'

const ProductItem = ({data}) => {
  const dispatch = useDispatch()
  const [statusFrom, setStatusFrom] = useState(false)

  const editStatusFrom = (children) => {
    setStatusFrom(children)
  }
  const showFromEdit = () => {
    setStatusFrom(true)
  }
  const deleteProduct = () => {
    apiComment.deleteComments(data.id);
    apiEvaluate.deleteEvaluates(data.id);
    apiWarehouse.deleteWarehouse(data.id);
    dispatch(deleteProductAction(data.id))
    setTimeout( async () => {
      try {
        const listProduct = await ApiProduct.getAllProduct()
        dispatch(getProduct(listProduct))
      } catch (error) {
        console.log(error);
      }
    }, 500);
  }

  const cancel = () => {

  }

  return (
    <>
      <div className="productItem">
        <div className="productItem__countPay">
          {data.countPay <= 0 ? 'Hết Hàng' : data.countPay }
        </div>
        {
          data.sale > 0 &&
          (
            <div className="productItem__sale">
              {data.sale}%
            </div>
          )
        }
        <div className="productItem__img">
          <img src={data.img} alt="" />
        </div>
        <div className="productItem__info">
          <div className="productItem__info__left">
            <p className="productItem__info__left--name">{data.name}</p>
            {
              data.sale > 0 &&  <p className="productItem__info__left--sale">{(data.price - (data.price * data.sale / 100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND </p>
            }
            <p className={data.sale > 0 ? "productItem__info__left--real price-sale" : "productItem__info__left--real"}>{data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND </p>
          </div>
          <div className="productItem__info__right">
            <Link to={`/body/comments/${data.id}`}>
              <button><i className="fas fa-comments-alt" /></button>
            </Link>
            <Link to={`/body/evaluates/${data.id}`}>
              <button><i className="fas fa-stars" /></button>
            </Link>
            <button
              onClick={showFromEdit}
            >
              <i className="fas fa-edit"></i>
            </button>
            <Popconfirm
              title="Bạn có muốn xoá sản phẩm này không?"
              onConfirm={deleteProduct}
              onCancel={cancel}
              okText="Xoá"
              cancelText="Không"
            >
              <button>
                <i className="fas fa-trash-alt"></i>
              </button>
            </Popconfirm>
          </div>
        </div>
      </div>
      {
        statusFrom && <FormEditProduct data={data} editStatusFrom={editStatusFrom} />
      }
    </>
  )
}

export default ProductItem;
