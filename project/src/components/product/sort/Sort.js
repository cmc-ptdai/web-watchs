import React from 'react'
import { Menu, Dropdown, Button} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './sort.scss'

const Sort = (props) => {
  function handleMenuClick(e) {
    props.sortProduct(e.key)
  }
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">
        giá từ phấp đến cao
      </Menu.Item>
      <Menu.Item key="2">
        giá từ cao đến thấp
      </Menu.Item>
      <Menu.Item key="3">
        Từ A - Z
      </Menu.Item>
      <Menu.Item key="4">
        Từ Z - A
      </Menu.Item>
    </Menu>
  )
  return (

    <>
      <Dropdown overlay={menu} >
      <Button>
        Sắp xếp <DownOutlined />
      </Button>
      </Dropdown>
    </>
  )
}

export default Sort
