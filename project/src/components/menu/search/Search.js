import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './search.scss'
import {keyWordSearch as keyWordSearchAction} from './../../../redux/actions/search'
import { Link } from 'react-router-dom'

const Search = () => {
  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  const listProduct = useSelector(store => store.productReducer)

  const setNameSearch = event => {
    setSearch(event.target.value)
  }
  const onSearch = () => {
    const newSort = listProduct.filter(item => item.name.toLowerCase().indexOf(search) !== -1)
    dispatch(keyWordSearchAction(newSort))
    setSearch('')
  }

  return (
    <div className="search">
      <input type="text" name="search" placeholder="tên sản phẩm ..." onChange={setNameSearch} value={search} />
      <Link to='/searchProducts' onClick={onSearch}><i className="fas fa-search"></i></Link>
    </div>
  )
}

export default Search
