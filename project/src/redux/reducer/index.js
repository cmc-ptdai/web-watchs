import { combineReducers } from 'redux'
import productReducer from './products'
import userReducer from './user'
import searchProduct from './search'
import listComponent from './listComment'

const rootReduce = combineReducers({
  productReducer,
  userReducer,
  searchProduct,
  listComponent
})

export default rootReduce
