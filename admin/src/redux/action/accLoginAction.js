import {
  GET_ACCOUNT,
  EDIT_ACCOUNT,
} from '../actionType'

export const getAccount = (payload) => {
  return {
    type: GET_ACCOUNT,
    payload
  }
}

export const editAccount = (payload) => {
  return {
    type: EDIT_ACCOUNT,
    payload
  }
}
