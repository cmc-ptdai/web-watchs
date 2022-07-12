import {
  GET_TRADEMARK
} from '../actionType'


const initialState = []

const trademarkReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TRADEMARK: {
      state = action.payload
      return state
    }

    default: {
      return state
    }
  }
};

export default trademarkReducer
