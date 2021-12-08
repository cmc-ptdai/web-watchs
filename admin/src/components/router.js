import Products from './content/product/index'
import user from './content/users/index'
import Dashboard from './content/Dashboard/index'
import Orders from './content/Orders/Orders'
import Comments from './content/comments/Comments'
import Evaluates from './content/evaluates/Evaluates'
import Warehouse from './content/warehouse/Warehouse'
import Notfound from './content/Notfound'
import Slides from './content/slides/Slide'
import ReplyNewComment from './content/comments/ReplyNewComments'
import ProfileAdmin from './content/profileAdmin/ProfileAdmin'
import AddPosts from './content/posts/Posts'
import EditPosts from './content/posts/EditPost'
import ListPosts from './content/posts/ListPosts'

const router = [
  {path: '/body', exact: true, Component: Dashboard},
  {path: '/body/users', exact: true, Component: user},
  {path: '/body/listPosts', exact: true, Component: ListPosts},
  {path: '/body/AddPosts', exact: true, Component: AddPosts},
  {path: '/body/EditPosts/:id', exact: true, Component: EditPosts},
  {path: '/body/profileAdmin', exact: true, Component: ProfileAdmin},
  {path: '/body/slides', exact: true, Component: Slides},
  {path: '/body/product', exact: true, Component: Products},
  {path: '/body/orders', exact: true, Component: Orders},
  {path: '/body/warehouse', exact: true, Component: Warehouse},
  {path: '/body/evaluates/:id', exact: true, Component: Evaluates},
  {path: '/body/comments/:id', exact: true, Component: Comments},
  {path: '/body/comments/:id/:idComment', exact: true, Component: ReplyNewComment},
  {path: '*', exact: true, Component: Notfound},
]

export default router;
