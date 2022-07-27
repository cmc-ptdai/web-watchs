import {
  GET_SUPPLIERS
} from '../actionType'


const initialState = []

const suppliersReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SUPPLIERS: {
      state = action.payload
      return state
    }

    default: {
      return state
    }
  }
};

export default suppliersReducer
