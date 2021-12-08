import userApi from '../../api/apiUser'

import {
  GET_USERS,
  EDIT_USER,
  DELETE_USER,
  ADD_USER
} from '../actionType'

const initialState = []

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS: {
      state = action.payload
      return state
    }

    case ADD_USER: {
      const newData = {
        ...action.payload,
        cart: [],
        order: [],
        dateCreate: new Date(),
        dateUpdate: new Date(),
      }
      userApi.addUser(newData)
      return state
    }

    case EDIT_USER: {
      const newData= {
        ...action.payload.dataUser,
        name: action.payload.valueForm.username,
        phone: action.payload.valueForm.phone,
        email: action.payload.valueForm.email,
        address: action.payload.valueForm.address,
        dateUpdate: new Date()
      }
      userApi.editUser(newData.id,newData)
      return state
    }
    case DELETE_USER: {
      userApi.deleteUser(action.payload)
      return state
    }
    default:
      return state
  };
}

export default userReducer;
