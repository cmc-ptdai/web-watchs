import { combineReducers } from 'redux'
import productReducer from './productReducer'
import userReducer from './userReducer'
import orderReducer from './orderReducer'
import accLoginReducer from './accLoginReducer'

const rootReduce = combineReducers({
  productReducer,
  userReducer,
  orderReducer,
  accLoginReducer
})

export default rootReduce
