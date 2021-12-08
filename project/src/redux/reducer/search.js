import {KEYWORD_SEARCH} from '../actionType'

const initialState = []

const searchProduct = (state = initialState, action) => {
  switch(action.type) {
    case KEYWORD_SEARCH: {
      return state = action.payload
    }
    default:
      return state
  }
}

export default searchProduct
