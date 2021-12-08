import orderApi from '../../api/apiOrders'

import {
  GET_ORDER,
  EDIT_ORDER,
  DELETE_ORDER
} from '../actionType'

const initialState = []

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ORDER: {
      state = action.payload;
      return state
    }
    case EDIT_ORDER: {
      orderApi.editOrders(action.payload.id, action.payload)
      return state
    }
    case DELETE_ORDER: {
      orderApi.deleteOrders(action.payload)
      return state
    }
    default:
      return state
  };
}

export default orderReducer
