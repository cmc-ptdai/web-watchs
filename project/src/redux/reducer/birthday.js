import { SET_NOTIFICATION_BIRTH_DAY } from '../actionType'

const initialState = {
  notification: false,
}
const Birthday = (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTIFICATION_BIRTH_DAY: {
      state.notification = true;
      return state
    }
    default:
      return state
  }
}

export default Birthday
