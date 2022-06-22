import productApi from '../../api/productApi'
import EvaluateApi from '../../api/apiEvaluates'

import {
  GET_PRODUCT,
  SET_EVALUATE,
  DELETE_ITEM_BY_PAY_CART,
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
        action.payload.forEach( async (elem) => {
          if (item.id === elem.id) {
            const newCount = Number(item.countPay) - Number(elem.count)
            const newQuantityPurchased = Number(item.quantityPurchased) + Number(elem.count)
            const newElem = {
              ...item,
              countPay: newCount,
              quantityPurchased: newQuantityPurchased
            }
            await productApi.updateProduct(item.id, newElem)
          }
        })
      })
      return state
    }

    default:
      return state
  };
}

export default productReducer
