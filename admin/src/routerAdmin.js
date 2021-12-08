import Login from './components/content/login/Login'
import Body from './components/index'

const router = [
  {path: '/', exact: true, Component: Login},
  {path: '/body', exact: false, Component: Body},
  {path: '*', exact: false, Component: Login},
]

export default router;
