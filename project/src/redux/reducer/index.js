import { combineReducers } from 'redux'
import productReducer from './products'
import userReducer from './user'
import searchProduct from './search'

const rootReduce = combineReducers({
  productReducer,
  userReducer,
  searchProduct
})

export default rootReduce
