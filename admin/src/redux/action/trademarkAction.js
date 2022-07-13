import {
  GET_TRADEMARK
} from '../actionType'
import ApiTrademark from '../../api/apiTrademark'

export const getTradeMark = () => async (dispatch) => {
  const listTrademark = await ApiTrademark.getAllTrademark()
  dispatch({
    type: GET_TRADEMARK,
    payload: listTrademark,
  })
}

export const getTradeMarkEdit = (payload) => async (dispatch) => {
  await ApiTrademark.editTrademark(payload.id, payload)
  const listTrademark = await ApiTrademark.getAllTrademark()
  dispatch({
    type: GET_TRADEMARK,
    payload: listTrademark,
  })
}

export const addTradeMark = (payload) => async (dispatch) => {
  await ApiTrademark.addTrademark(payload)
  const listTrademark = await ApiTrademark.getAllTrademark()
  dispatch({
    type: GET_TRADEMARK,
    payload: listTrademark,
  })
}
export const deleteTradeMark = (payload) => async (dispatch) => {
  await ApiTrademark.deleteTrademark(payload)
  const listTrademark = await ApiTrademark.getAllTrademark()
  dispatch({
    type: GET_TRADEMARK,
    payload: listTrademark,
  })
}

