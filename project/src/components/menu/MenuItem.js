import React from 'react'
import './style.scss'
import { NavLink } from 'react-router-dom'

const MenuItem = ({dataChildren}) => {
  return (
    <>
      {
        dataChildren.map((item, index) => {
          return (
            <li className="nav-item" key={index}>
              <NavLink activeClassName="active" exact = {item.path === '/' ? true : false} className="nav-link" to={item.path}>{item.title}
                &nbsp;
                {item.children && (<i className="fas fa-chevron-right"></i>)}
              </NavLink>
              {item.children && <ul className="list__menu__children animate__fadeInUp" ><MenuItem dataChildren={item.children} /></ul>}
            </li>
          )
        })
      }
    </>
  )
}

export default MenuItem;
