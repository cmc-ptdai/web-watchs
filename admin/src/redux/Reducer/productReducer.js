import productApi from '../../api/apiProduct'

import {
  GET_PRODUCT,
  ADD_PRODUCT,
  DELETE_PRODUCT,
  EDIT_PRODUCT,
  COUNT_PRODUCT,
  INCREMENT_PROJECT
} from '../actionType'

const initialState = []

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCT: {
      state = action.payload
      return state
    }
    case ADD_PRODUCT: {
      const newData = {
        ...action.payload,
        countPay: Number(action.payload.countPay),
        quantityPurchased: 0
      }
      productApi.addProducts(newData)
      return state
    }
    case DELETE_PRODUCT: {
      productApi.deleteProducts(action.payload)
      return state
    }
    case EDIT_PRODUCT: {
      const newData = {
        ...action.payload,
        countPay: Number(action.payload.countPay),
      }
      productApi.editProducts(action.payload.id, newData)
      return state
    }

    case COUNT_PRODUCT: {
      action.payload.listAdd.forEach(item => {
        for (let i = 0; i < action.payload.Product.length; i++) {
          if (item.id === action.payload.Product[i].id) {
            const newProduct = {
              ...action.payload.Product[i],
              countPay: action.payload.Product[i].countPay + item.count
            }
            productApi.editProducts(newProduct.id, newProduct)
            return
          }
        }
      })
      return state
    }

    case INCREMENT_PROJECT: {
      action.payload.dataOrder.listProduct.forEach(item => {
        for (let i = 0; i < action.payload.product.length; i++) {
          if (item.id === action.payload.product[i].id) {
            const newProduct = {
              ...action.payload.product[i],
              countPay: action.payload.product[i].countPay + item.count
            }
            productApi.editProducts(newProduct.id, newProduct)
            return
          }
        }
      })
      return state
    }

    default:
      return state
  };
}

export default productReducer
