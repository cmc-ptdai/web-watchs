import {
  GET_COMMENT
} from '../actionType'

const initialState = []

const listComponent = (state = initialState, action) => {
  switch(action.type) {
    case GET_COMMENT: {
      return state = action.payload
    }
    default:
      return state
  }
}

export default listComponent
