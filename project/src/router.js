import Home from './components/product/Home'
import NotFound from './components/product/NotFound'
import Cart from './components/product/Cart'
import Product from './components/product/ProfileProduct'
import Products from './components/product/Products'
import searchProduct from './components/menu/search/SearchProductByName'
import Login from './components/login/index'
import SignUp from './components/signUp/index'
import Concat from './components/product/contact/index'
import Introduce from './components/product/introduce/index'
import ProfileUser from './components/profileUser/ProfileUser'
import Orders from './components/listOrderUser/index'
import Posts from './components/Posts/Posts'
import DetailedPosts from './components/Posts/DetailedPosts'
import Trademark from './components/trademark/index'
import TrademarkType from './components/trademark/trademarkType'

const router = [
  {path: '/', exact: true, Component: Home},
  {path: '/products', exact: true,  gender: '', Component: Products},
  {path: '/nam', exact: true, gender: 'nam', Component: Products},
  {path: '/nu', exact: true, gender: 'nu', Component: Products},
  {path: '/doi', exact: true, gender: 'doi', Component: Products},
  {path: '/cart', exact: true, Component: Cart},
  {path: '/products/:id', exact: true, Component: Product},
  {path: '/searchProducts', exact: true, Component: searchProduct},
  {path: '/trademark', exact: true, Component: Trademark},
  {path: '/trademark/:id', exact: true, Component: TrademarkType},
  {path: '/login', exact: true, Component: Login},
  {path: '/signup', exact: true, Component: SignUp},
  {path: '/concat', exact: true, Component: Concat},
  {path: '/posts', exact: true, Component: Posts},
  {path: '/detailedPosts/:id', exact: true, Component: DetailedPosts},
  {path: '/introduce', exact: true, Component: Introduce},
  {path: '/profileUser', exact: true, Component: ProfileUser},
  {path: '/orderInformation', exact: true, Component: Orders},
  {path: '', exact: true, Component: NotFound},
]

export default router
