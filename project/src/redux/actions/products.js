import apiComment from '../../api/apiComment';
import apiProduct from '../../api/productApi';
import NewCommentApi from '../../api/apiNewComment';

import {
  GET_PRODUCT,
  SET_EVALUATE,
  GET_COMMENT
} from '../actionType';

export const getProduct = () => async (dispatch) => {
  const data = await apiProduct.getAll();
  dispatch({
    type: GET_PRODUCT,
    payload: data,
  });
};

export const incrementProjectDeleteOrder = (payload) => async (dispatch) => {
  payload.dataOrder.listProduct.forEach(async (item) => {
    for (let i = 0; i < payload.product.length; i++) {
      if (item.id === payload.product[i].id) {
        const newProduct = {
          ...payload.product[i],
          countPay: payload.product[i].countPay + item.count,
          quantityPurchased: payload.product[i].quantityPurchased - item.count,
        };
        await apiProduct.updateProduct(newProduct.id, newProduct);
        return;
      }
    }
  });
};

export const setEvaluate = (payload) => {
  return {
    type: SET_EVALUATE,
    payload,
  };
};

export const deleteItemByPayCart = (payload) => async (dispatch) =>{
  const newArr = await apiProduct.getAll();
  // newArr.forEach(item => {
  //   payload.forEach( async (elem) => {
  //     if (item.id === elem.id) {
  //       const newProductPending = Number(item.productPending) + Number(elem.count)
  //       const newElem = {
  //         ...item,
  //         productPending: newProductPending
  //       }
  //       await apiProduct.updateProduct(item.id, newElem)
  //     }
  //   })
  // })
  newArr.forEach(item => {
    payload.forEach( async (elem) => {
      if (item.id === elem.id) {
        const newCount = Number(item.countPay) - Number(elem.count)
        //const newQuantityPurchased = Number(item.quantityPurchased) + Number(elem.count)
        const newProductPending = Number(item.productPending) + Number(elem.count)
        const newElem = {
          ...item,
          countPay: newCount,
          //quantityPurchased: newQuantityPurchased,
          productPending: newProductPending
        }
        await apiProduct.updateProduct(item.id, newElem)
      }
    })
  })
  const data = await apiProduct.getAll();
  dispatch({
    type: GET_PRODUCT,
    payload: data,
  });
};

export const getComment = () => async (dispatch) => {
  const data = await apiComment.getAllApiComments();
  dispatch({
    type: GET_COMMENT,
    payload: data,
  });
};

export const commentProduct = (payload) => async (dispatch) => {
  await apiComment.editApiComments(payload.dataProduct, payload.newData);
  const data = await apiComment.getAllApiComments();
  dispatch({
    type: GET_COMMENT,
    payload: data,
  });
};

export const deleteComment = (payload) => async (dispatch) => {
  await apiComment.editApiComments(payload.id, payload);
  const data = await apiComment.getAllApiComments();
  dispatch({
    type: GET_COMMENT,
    payload: data,
  });
};

export const replyCommentProduct = (payload) => async (dispatch) => {
  await apiComment.editApiComments(payload.dataProduct, payload.newData);
  const data = await apiComment.getAllApiComments();
  dispatch({
    type: GET_COMMENT,
    payload: data,
  });
};

export const deleteCommentReply = (payload) => async (dispatch) => {
  await apiComment.editApiComments(payload.id, payload);
  const data = await apiComment.getAllApiComments();
  dispatch({
    type: GET_COMMENT,
    payload: data,
  });
};

export const deleteNewComment = (payload) => async (dispatch) => {
  const listNewComment = await NewCommentApi.getNewComment();
  const commentNew1 = listNewComment.filter((item) => item.idComment === payload);
  if (commentNew1.length > 0) {
    await NewCommentApi.deleteNewComment(commentNew1[0].id);
  }
};

export const deleteListNewComment = (payload) => async (dispatch) => {
  const listNewComment = await NewCommentApi.getNewComment();
  payload.forEach(async (item) => {
    const c = listNewComment.filter((elem) => elem.idComment === item.id);
    if (c.length > 0) {
      await NewCommentApi.deleteNewComment(c[0].id);
    }
  });
};

export const editNewComment = (payload) => async (dispatch) => {
  const listNewComment = await NewCommentApi.getNewComment();
  const commentNew1 = listNewComment.filter((item) => item.idComment === payload.id);
  if (commentNew1.length > 0) {
    const newData = {
      ...commentNew1[0],
      comment: payload.comment,
    };
    await NewCommentApi.editNewComment(newData.id, newData);
  }
};
