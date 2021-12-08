import { applyMiddleware, compose, createStore } from "redux"
import RootReducer from './reducer/index'
import thunk from 'redux-thunk'

const myMiddleware = applyMiddleware(thunk)

const myCompose = compose(
  myMiddleware,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const store = createStore(
  RootReducer,
  myCompose
)

export default store
