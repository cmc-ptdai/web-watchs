import productApi from '../../api/productApi'
import commentApi from '../../api/apiComment'
import EvaluateApi from '../../api/apiEvaluates'
import NewCommentApi from '../../api/apiNewComment'

import {
  GET_PRODUCT,
  COMMENT_PRODUCT,
  REPLY_COMMENT_PRODUCT,
  SET_EVALUATE,
  DELETE_ITEM_BY_PAY_CART,
  DELETE_COMMENT,
  DELETE_COMMENT_REPLY,
  DELETE_NEW_COMMENT,
  INCREMENT_PROJECT_DELETE_ORDER
} from '../actionType'

const initialState = []

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCT:
      return state = action.payload

    case SET_EVALUATE: {
      EvaluateApi.editEvaluates(action.payload.id, action.payload)
      return state
    }

    case DELETE_ITEM_BY_PAY_CART: {
      const newArr = [...state]
      newArr.forEach(item => {
        action.payload.forEach( (elem) => {
          if (item.id === elem.id) {
            const newCount = Number(item.countPay) - Number(elem.count)
            const newQuantityPurchased = Number(item.quantityPurchased) + Number(elem.count)
            const newElem = {
              ...item,
              countPay: newCount,
              quantityPurchased: newQuantityPurchased
            }
            productApi.updateProduct(item.id, newElem)
          }
        })
      })
      return state
    }

    case INCREMENT_PROJECT_DELETE_ORDER: {
      action.payload.dataOrder.listProduct.forEach(item => {
        for (let i = 0; i < action.payload.product.length; i++) {
          if (item.id === action.payload.product[i].id) {
            const newProduct = {
              ...action.payload.product[i],
              countPay: action.payload.product[i].countPay + item.count
            }
            productApi.updateProduct(newProduct.id, newProduct)
            return
          }
        }
      })
      return state
    }

    case REPLY_COMMENT_PRODUCT: {
      commentApi.editApiComments(action.payload.dataProduct, action.payload.newData)
      return state
    }

    case COMMENT_PRODUCT: {
      commentApi.editApiComments(action.payload.dataProduct, action.payload.newData)
      return state
    }

    case DELETE_COMMENT: {
      commentApi.editApiComments(action.payload.id, action.payload)
      return state
    }

    case DELETE_COMMENT_REPLY: {
      commentApi.editApiComments(action.payload.id, action.payload)
      return state
    }

    case DELETE_NEW_COMMENT: {
      NewCommentApi.deleteNewComment(action.payload.id)
      return state
    }

    default:
      return state
  };
}

export default productReducer
