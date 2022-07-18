import EvaluateApi from '../../api/apiEvaluates'

import {
  GET_PRODUCT,
  SET_EVALUATE,
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

    default:
      return state
  };
}

export default productReducer
