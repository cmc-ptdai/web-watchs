import {
  GET_ACCOUNT,
  EDIT_ACCOUNT
} from '../actionType'

const initialState = {}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT: {
      state = action.payload
      return state
    }
    case EDIT_ACCOUNT: {
      return state
    }
    default:
      return state
  };
}

export default userReducer;
