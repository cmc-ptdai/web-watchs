import {
  GET_ORDER,
  ADD_ORDER,
  EDIT_ORDER,
  DELETE_ORDER
} from '../actionType'


export const getOrder = (payload) => {
  return {
    type: GET_ORDER,
    payload
  }
}

export const editOrder = (payload) => {
  return {
    type: EDIT_ORDER,
    payload
  }
}

export const deleteOrder = (payload) => {
  return {
    type: DELETE_ORDER,
    payload
  }
}

export const addOrder = (payload) => {
  return {
    type: ADD_ORDER,
    payload
  }
}
