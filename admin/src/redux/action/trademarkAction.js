import { GET_TRADEMARK } from '../actionType'
import ApiTrademark from '../../api/apiTrademark'

export const getTradeMark = () => async (dispatch) => {
  const listTrademark = await ApiTrademark.getAllTrademark()
  dispatch({
    type: GET_TRADEMARK,
    payload: listTrademark,
  })
}
