import ApiSuppliers from '../../api/apiSuppliers'

import {GET_SUPPLIERS} from '../actionType'

export const getSuppliers = () => async (dispatch) => {
  const listSuppliers = await ApiSuppliers.getAllSuppliers()
  dispatch({
    type: GET_SUPPLIERS,
    payload: listSuppliers,
  })
}

export const addSuppliers = (payload) => async (dispatch) => {
  await ApiSuppliers.addSuppliersAction(payload)
  const listSuppliers = await ApiSuppliers.getAllSuppliers()
  dispatch({
    type: GET_SUPPLIERS,
    payload: listSuppliers,
  })
}

export const editSuppliers = (payload) => async (dispatch) => {
  await ApiSuppliers.editSuppliersAction(payload.id, payload)
  const listSuppliers = await ApiSuppliers.getAllSuppliers()
  dispatch({
    type: GET_SUPPLIERS,
    payload: listSuppliers,
  })
}

export const deleteSuppliers = (payload) => async (dispatch) => {
  await ApiSuppliers.deleteSuppliersAction(payload)
  const listSuppliers = await ApiSuppliers.getAllSuppliers()
  dispatch({
    type: GET_SUPPLIERS,
    payload: listSuppliers,
  })
}
