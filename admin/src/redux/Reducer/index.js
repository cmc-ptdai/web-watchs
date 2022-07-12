import { combineReducers } from 'redux'
import productReducer from './productReducer'
import userReducer from './userReducer'
import orderReducer from './orderReducer'
import accLoginReducer from './accLoginReducer'
import trademarkReducer from './trademarkReducer'

const rootReduce = combineReducers({
  productReducer,
  userReducer,
  orderReducer,
  accLoginReducer,
  trademarkReducer
})

export default rootReduce
