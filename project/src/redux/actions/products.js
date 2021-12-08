import {
  GET_PRODUCT,
  SET_EVALUATE,
  DELETE_ITEM_BY_PAY_CART,
  COMMENT_PRODUCT,
  REPLY_COMMENT_PRODUCT,
  DELETE_COMMENT,
  DELETE_COMMENT_REPLY,
  DELETE_NEW_COMMENT,
  INCREMENT_PROJECT_DELETE_ORDER
} from '../actionType'

export const getProduct = (payload) => {
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


export const commentProduct = (payload) => {
  return {
    type: COMMENT_PRODUCT,
    payload
  }
}

export const replyCommentProduct = (payload) => {
  return {
    type: REPLY_COMMENT_PRODUCT,
    payload
  }
}

export const deleteComment = (payload) => {
  return {
    type: DELETE_COMMENT,
    payload
  }
}

export const deleteCommentReply = (payload) => {
  return {
    type: DELETE_COMMENT_REPLY,
    payload
  }
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

