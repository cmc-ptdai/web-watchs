import { combineReducers } from 'redux'
import productReducer from './products'
import userReducer from './user'
import searchProduct from './search'
import listComponent from './listComment'
import birthday from './birthday'

const rootReduce = combineReducers({
  productReducer,
  userReducer,
  searchProduct,
  listComponent,
  birthday
})

export default rootReduce
