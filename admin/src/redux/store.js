import { applyMiddleware, createStore } from "redux"
import RootReducer from './Reducer/index'
import thunk from 'redux-thunk'

// const myMiddleware = applyMiddleware(thunk)

// const myCompose = compose(
//   myMiddleware,
//   // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// )

const store = createStore(
  RootReducer,
  applyMiddleware(thunk)
)

export default store

