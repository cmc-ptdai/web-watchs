import userApi from '../../api/userApi';
import orderApi from '../../api/order';
import { v4 as uuidv4 } from 'uuid';

import {
  GET_USERS,
  ADD_CART,
  INCREMENT_PROJECT,
  DECREMENT_PROJECT,
  DELETE_ITEM_CART,
  NUMBER_INPUT,
  DELETE_LIST_ITEM_CART,
  PAY_CART,
  ADD_CART_BY_PROFILE,
  PAY_CART_NO_USER,
  ADD_CART_NO_USER,
  ADD_CART_BY_PROFILE_NO_USER,
  ADD_ORDER_NO_USER,
  INCREMENT_PROJECT_NO_USER,
  DECREMENT_PROJECT_NO_USER,
  DELETE_ITEM_CART_NO_USER,
  DELETE_LIST_ITEM_CART_NO_USER,
  NUMBER_INPUT_NO_USER,
  PUSH_CART_LOCAL_IN_CART_USER,
  ADD_USER,
  EDIT_USER,
  EDIT_USER_IMG,
  EDIT_USER_PW
} from '../actionType'

const initialState = {
  user: {
    cart: [],
  }
}

const useReducer  = (state = initialState, action) => {
  const user = {...state.user}
  let cart = user.cart
  const order = user.order
  const idUser = user.id

  switch (action.type) {
    case GET_USERS:{
      return {
        ...state,
        user: action.payload
      }
    }

    case ADD_CART: {
      let cartAction = user.cart
      let newUser = {}
      const index = cartAction.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        const newData = {
          ...cartAction[index],
          count: cartAction[index].count + 1,
        }

        cartAction.splice(index, 1 , newData)
        newUser = {
          ...user,
          cart: cartAction
        }

        userApi.addCart(user.id, newUser)
      } else {
        const newData = {
          id: action.payload.id,
          name: action.payload.name,
          img: action.payload.img,
          price: action.payload.price,
          sale: action.payload.sale,
          countPay: action.payload.countPay,
          count: 1,
        }
        cartAction.push(newData)
        newUser = {
          ...user,
          cart: cartAction
        }

        userApi.addCart(user.id, newUser)
      }
      return {
        ...state,
        user: newUser
      }
    }
    /* falls through */

    case ADD_CART_BY_PROFILE: {
      let cartAction = user.cart
      let newData = {}
      let newUser = {}
      const index = cartAction.findIndex(item => item.id === action.payload.product.id)
      if (index !== -1) {
        newData = {
          ...cartAction[index],
          count: cartAction[index].count + action.payload.number,
        }

        cartAction.splice(index, 1 , newData)
        newUser = {
          ...user,
          cart: cartAction
        }
        userApi.addCart(user.id, newUser)
      } else {
        newData = {
          id: action.payload.product.id,
          name: action.payload.product.name,
          img: action.payload.product.img,
          price: action.payload.product.price,
          count: action.payload.number,
          sale: action.payload.product.sale,
          countPay: action.payload.product.countPay
        }
        cartAction.push(newData)
        newUser = {
          ...user,
          cart: cartAction
        }
        userApi.addCart(user.id, newUser)
      }
      return {
        ...state,
        user: newUser
      }
    }

    case INCREMENT_PROJECT:{
      const index = cart.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          const number = cart[index].count + 1;
          if (number >= action.payload.max) {
            if (action.payload.max === 0) {
              cart[index].count = 1
            } else {
              cart[index].count = action.payload.max
            }
          } else {
            cart[index].count = number
          }
        }
        userApi.addCart(user.id, user)
        return {
          ...state,
          user: user
        }
    }

    case DECREMENT_PROJECT:{
      const index = cart.findIndex(item => item.id === action.payload)
        if (index !== -1) {
          if (cart[index].count  - 1 === 0 ) {
            cart[index].count = 1
          }
          else {
            cart[index].count = cart[index].count  - 1
          }

        }

      userApi.addCart(user.id, user)
      return {
        ...state,
        user: user
      }
    }

    case NUMBER_INPUT: {
      const index = cart.findIndex(item => item.id === action.payload.id)
      if(isNaN(action.payload.value) || action.payload.value <= 0) {
          cart[index].count = 1
          userApi.addCart(user.id, user)
          return {
            ...state,
            user: user
          }
      } else {
        if (Number(action.payload.value) > action.payload.max) {
          cart[index].count = action.payload.max
        } else {
          cart[index].count = Number(action.payload.value)
        }

        userApi.addCart(user.id, user)
        return {
          ...state,
          user: user
        }
      }
    }

    case DELETE_ITEM_CART: {
      user.cart = user.cart.filter(item => item.id !== action.payload)
      userApi.addCart(user.id, user)
      return {
        ...state,
        user: user
      }
    }

    case DELETE_LIST_ITEM_CART: {
      action.payload.forEach(elem => {
        user.cart = user.cart.filter(item => item.id !== elem)
      });
      userApi.addCart(user.id, user)
      return {
        ...state,
        user: user
      }
    }

    case PAY_CART: {
      const listProduct = []
      let money = 0
      action.payload.data.forEach(item => {
        cart.forEach(elem => {
          if (item.id === elem.id) {
            listProduct.push(elem)
            money = money + ((Number(elem.price) * Number(elem.count)) - ((Number(elem.price) * Number(elem.count)*Number(elem.sale))/100))
          }
        })
      })
      if (action.payload.transport === "fastShipping") {
        money += 30000
      }
      if (action.payload.transport === "normalShipping") {
        money += 15000
      }
      const newOder = {
        id: uuidv4(),
        idUser: idUser,
        listProduct: listProduct,
        money: money,
        status: "pending",
        transportFee: action.payload.transport,
        payments: action.payload.payments,
        username: user.userName,
        phone: user.phone,
        address: user.address,
        dateCreate: new Date(),
        dateUpdate: new Date()
      }
      order.push(newOder.id)

      orderApi.addOrder(newOder)

      userApi.addCart(idUser, user)
      return state
    }

    case ADD_ORDER_NO_USER: {
      let money = 0
      action.payload.listId.forEach(item => {
        user.cart.forEach(elem => {
          if (item.id === elem.id ) {
            money = money + ((Number(elem.price) * Number(elem.count)) - ((Number(elem.price) * Number(elem.count)*Number(elem.sale))/100))
          }
        })
      })
      if (action.payload.transport === "fastShipping") {
        money += 30000
      } else {
        money += 15000
      }
      const newOder = {
        id: uuidv4(),
        idUser: "",
        listProduct: action.payload.listId,
        address: action.payload.profile.address,
        email: action.payload.profile.email,
        phone: action.payload.profile.phone,
        username: action.payload.profile.username,
        transportFee: action.payload.transport,
        money: money,
        payments: 'off',
        status: "pending",
        dateCreate: new Date(),
        dateUpdate: new Date()
      }

      orderApi.addOrder(newOder)
      return state
    }

    case PAY_CART_NO_USER: {
      action.payload.listId.forEach(elem => {
        user.cart = user.cart.filter(item => item.id !== elem.id)
      })
      localStorage.setItem('cart', JSON.stringify(user.cart))
      return {
        ...state,
        user: user
      }
    }

    case ADD_CART_NO_USER: {
      const cartLocal = localStorage.getItem('cart')
      if(cartLocal.length > 0) {
        let newCartLocal = JSON.parse(cartLocal)
        const index = newCartLocal.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          const newData = {
            ...newCartLocal[index],
            count: newCartLocal[index].count + 1,
          }

          newCartLocal.splice(index, 1 , newData)
        } else {
          const newData = {
            id: action.payload.id,
            name: action.payload.name,
            img: action.payload.img,
            price: action.payload.price,
            sale: action.payload.sale,
            countPay: action.payload.countPay,
            count: 1,
          }
          newCartLocal.push(newData)
        }
        localStorage.setItem('cart', JSON.stringify(newCartLocal))
        const newUser = {
          ...user,
          cart: newCartLocal
        }
        return {
          ...state,
          user: newUser
        }
      } else {
        const cartLocal = []
        const newData = {
          id: action.payload.id,
          name: action.payload.name,
          img: action.payload.img,
          sale: action.payload.sale,
          price: action.payload.price,
          countPay: action.payload.countPay,
          count: 1,
        }
        cartLocal.push(newData)
        localStorage.setItem('cart', JSON.stringify(cartLocal))
        const newUser = {
          ...user,
          cart: cartLocal
        }
        return {
          ...state,
          user: newUser
        }
      }
    }

    case ADD_CART_BY_PROFILE_NO_USER: {
      let cartLocal = JSON.parse(localStorage.getItem('cart'))
      let newData = {}
        const index = cartLocal.findIndex(item => item.id === action.payload.product.id)
        if (index !== -1) {
          newData = {
            ...cartLocal[index],
            count: cartLocal[index].count + action.payload.number,
          }

          cartLocal.splice(index, 1 , newData)
          localStorage.setItem('cart', JSON.stringify(cartLocal))
        } else {
          newData = {
            id: action.payload.product.id,
            name: action.payload.product.name,
            img: action.payload.product.img,
            sale: action.payload.sale,
            price: action.payload.product.price,
            count: action.payload.number,
          }
          cartLocal.push(newData)
          localStorage.setItem('cart', JSON.stringify(cartLocal))
        }
        const newUser = {
          ...user,
          cart: cartLocal
        }
        return {
          ...state,
          user: newUser
        }
    }

    case INCREMENT_PROJECT_NO_USER: {
      const index = cart.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        const number = cart[index].count + 1;
        if (number >= cart[index].countPay) {
          if (action.payload.max === 0) {
            cart[index].count = 1
          } else {
            cart[index].count = action.payload.max
          }
        } else {
          cart[index].count = number
        }
      }

      localStorage.setItem('cart', JSON.stringify(cart))
      return {
        ...state,
        user: user
      }
    }

    case DECREMENT_PROJECT_NO_USER: {
      const index = cart.findIndex(item => item.id === action.payload)
      if (index !== -1) {
        if (cart[index].count  - 1 === 0 ) {
          cart[index].count = 1
        }
        else {
          cart[index].count = cart[index].count  - 1
        }
      }

      localStorage.setItem('cart', JSON.stringify(cart))
      return {
        ...state,
        user: user
      }
    }

    case DELETE_ITEM_CART_NO_USER: {
      user.cart = user.cart.filter(item => item.id !== action.payload)
      localStorage.setItem('cart', JSON.stringify(user.cart))
      return {
        ...state,
        user: user
      }
    }

    case DELETE_LIST_ITEM_CART_NO_USER: {
      action.payload.forEach(elem => {
        user.cart = user.cart.filter(item => item.id !== elem)
      });
      localStorage.setItem('cart', JSON.stringify(user.cart))
      return {
        ...state,
        user: user
      }
    }

    case NUMBER_INPUT_NO_USER: {
      const index = cart.findIndex(item => item.id === action.payload.id)
      if(isNaN(action.payload.value) || action.payload.value <= 0) {
          cart[index].count = 1
          localStorage.setItem('cart', JSON.stringify(cart))
          return {
            ...state,
            user: user
          }
      } else {
        if (Number(action.payload.value) > Number(cart[index].countPay)) {
          cart[index].count = cart[index].countPay
        } else {
          cart[index].count = Number(action.payload.value)
        }

        localStorage.setItem('cart', JSON.stringify(cart))
        return {
          ...state,
          user: user
        }
      }
    }

    case PUSH_CART_LOCAL_IN_CART_USER: {
      let newUser = action.payload.user
      let cartLocal = action.payload.cartLocal
      cartLocal.forEach(item => {
        const index = newUser.cart.findIndex(elem => elem.id === item.id)
        if (index !== -1) {
          const newData = {
            ...newUser.cart[index],
            count: newUser.cart[index].count + item.count,
          }
          newUser.cart.splice(index, 1 , newData)
        } else {
          newUser.cart.push(item)
        }
      })
      userApi.addCart(newUser.id, newUser)
      return state
    }

    case ADD_USER: {
      const newUser = {
        ...action.payload,
        img: "",
        role: 'user',
        cart: [],
        order: [],
        dateCreate: new Date(),
        dateUpdate: new Date(),
      }
      delete newUser.Confirm

      userApi.addUser(newUser)
      return state
    }

    case EDIT_USER: {
      const newUser = {
        ...state.user,
        ...action.payload,
        dateUpdate: new Date()
      }
      userApi.addCart(newUser.id, newUser)

      return state
    }

    case EDIT_USER_IMG: {
      const newUser = {
        ...state.user,
        img: action.payload,
        dateUpdate: new Date()
      }
      userApi.addCart(newUser.id, newUser)
      return state = {
        ...state,
        user: newUser
      }
    }

    case EDIT_USER_PW: {
      const newUser = {
        ...state.user,
        password: action.payload.passwordNew,
        dateUpdate: new Date()
      }
      userApi.addCart(newUser.id, newUser)
      return state
    }
    default:
      return state
  }
}

export default useReducer
