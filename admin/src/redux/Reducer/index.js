import { combineReducers } from 'redux'
import productReducer from './productReducer'
import userReducer from './userReducer'
import orderReducer from './orderReducer'
import accLoginReducer from './accLoginReducer'
import trademarkReducer from './trademarkReducer'
import suppliersReducer from './suppliersReducer'

const rootReduce = combineReducers({
  productReducer,
  userReducer,
  orderReducer,
  accLoginReducer,
  trademarkReducer,
  suppliersReducer
})

export default rootReduce
