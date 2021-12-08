import Home from './components/product/Home'
import NotFound from './components/product/NotFound'
import Cart from './components/product/Cart'
import Product from './components/product/ProfileProduct'
import Products from './components/product/Products'
import searchProduct from './components/menu/search/SearchProductByName'
import Login from './components/login/index'
import SingUp from './components/signUp/index'
import Concat from './components/product/contact/index'
import Introduce from './components/product/introduce/index'
import ProfileUser from './components/profileUser/ProfileUser'
import Orders from './components/listOrderUser/index'
import Posts from './components/Posts/Posts'
import DetailedPosts from './components/Posts/DetailedPosts'

const router = [
  {path: '/', exact: true, Component: Home},
  {path: '/vegetable', exact: true, type:'rau', species1: '', Component: Products},
  {path: '/tubers', exact: true, type:'cu', species1: '', Component: Products},
  {path: '/mushroom', exact: true, type:'nam', species1: '', Component: Products},
  {path: '/fruit', exact: true, type:'qua', species1: '', Component: Products},

  {path: '/vegetable/fresh', exact: true, type:'rau', species1: 'tuoi', Component: Products},
  {path: '/tubers/fresh', exact: true, type:'cu', species1: 'tuoi', Component: Products},
  {path: '/mushroom/fresh', exact: true, type:'nam', species1: 'tuoi', Component: Products},
  {path: '/fruit/fresh', exact: true, type:'qua', species1: 'tuoi', Component: Products},

  {path: '/vegetable/dried', exact: true, type:'rau', species1: 'kho', Component: Products},
  {path: '/tubers/dried', exact: true, type:'cu', species1: 'kho', Component: Products},
  {path: '/mushroom/dried', exact: true, type:'nam', species1: 'kho', Component: Products},
  {path: '/fruit/dried', exact: true, type:'qua', species1: 'kho', Component: Products},

  {path: '/cart', exact: true, Component: Cart},
  {path: '/products/:id', exact: true, Component: Product},
  {path: '/products', exact: true, type: '', Component: Products},
  {path: '/searchProducts', exact: true, type: '', Component: searchProduct},
  {path: '/login', exact: true, type: '', Component: Login},
  {path: '/singup', exact: true, type: '', Component: SingUp},
  {path: '/concat', exact: true, type: '', Component: Concat},
  {path: '/posts', exact: true, Component: Posts},
  {path: '/detailedPosts/:id', exact: true, Component: DetailedPosts},
  {path: '/introduce', exact: true, Component: Introduce},
  {path: '/profileUser', exact: true, Component: ProfileUser},
  {path: '/orderInformation', exact: true, Component: Orders},
  {path: '', exact: true, Component: NotFound},
]

export default router
