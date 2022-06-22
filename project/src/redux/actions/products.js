import apiComment from '../../api/apiComment'
import apiProduct from '../../api/productApi'

import {
  GET_PRODUCT,
  SET_EVALUATE,
  DELETE_ITEM_BY_PAY_CART,
  DELETE_NEW_COMMENT,
  INCREMENT_PROJECT_DELETE_ORDER,
  GET_COMMENT
} from '../actionType'

export const getProduct = (payload) => async (dispatch) => {
  return {
    type: GET_PRODUCT,
    payload
  }
}

export const setEvaluate = (payload) => {
  return {
    type: SET_EVALUATE,
    payload
  }
}

export const deleteItemByPayCart = (payload) => {
  return {
    type: DELETE_ITEM_BY_PAY_CART,
    payload
  }
}

export const getComment = () => async (dispatch) => {
  const data = await apiComment.getAllApiComments()
  dispatch({
    type: GET_COMMENT,
    payload: data
  })
}

export const commentProduct = (payload) => async (dispatch) => {
  await apiComment.editApiComments(payload.dataProduct, payload.newData)
  const data = await apiComment.getAllApiComments()
  dispatch({
    type: GET_COMMENT,
    payload: data
  })
}

export const deleteComment = (payload) => async (dispatch) => {
  await apiComment.editApiComments(payload.id, payload)
  const data = await apiComment.getAllApiComments()
  dispatch({
    type: GET_COMMENT,
    payload: data
  })
}

export const replyCommentProduct = (payload) => async (dispatch) => {
  await apiComment.editApiComments(payload.dataProduct, payload.newData)
  const data = await apiComment.getAllApiComments()
  dispatch({
    type: GET_COMMENT,
    payload: data
  })
}

export const deleteCommentReply = (payload) => async (dispatch) => {
  await apiComment.editApiComments(payload.id, payload)
  const data = await apiComment.getAllApiComments()
  dispatch({
    type: GET_COMMENT,
    payload: data
  })
}

export const deleteNewComment = (payload) => {
  return {
    type: DELETE_NEW_COMMENT,
    payload
  }
}

export const incrementProjectDeleteOrder = (payload) => {
  return {
    type: INCREMENT_PROJECT_DELETE_ORDER,
    payload
  }
}

