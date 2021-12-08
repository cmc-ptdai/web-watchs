import React, { useState} from 'react';
import { Table, Input, Button, Space, Popconfirm, message } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import FormEdit from './FormEdit'
import {
  deleteUser,
  getUser
} from '../../../redux/action/userAction';
import { useDispatch } from 'react-redux';
import userApi from '../../../api/apiUser'


const MyTable = ({dataTable}) => {
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [userEdit, setUserEdit] = useState(null)
  const [statusFrom, setStatusFrom] = useState(false)

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>

          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>

          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',

    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('')
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 250,
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'id',
      width: 80,
      render: (text, record) => (
        <span>{text === 'nam' ? 'Nam' : 'Nữ'}</span>
      )
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ...getColumnSearchProps('userName'),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
      ...getColumnSearchProps('phone'),
    },
    {
      title: 'UserName',
      key: 'username',
      dataIndex: 'userName',
      width: 150,
      ...getColumnSearchProps('userName'),
    },
    {
      title: 'Date create',
      key: 'dateCreate',
      dataIndex: 'dateCreate',
      defaultSortOrder: 'addsendring',
      sorter: (a, b) => moment(a.dateCreate).format('x') - moment(b.dateCreate).format('x'),
      render: (text) => (
        <p>{text.slice(0,10)}</p>
      )
    },
    {
      title: 'Date update',
      key: 'dateUpdate',
      dataIndex: 'dateUpdate',
      defaultSortOrder: 'addsendring',
      sorter: (a, b) => moment(a.dateCreate).format('x') - moment(b.dateCreate).format('x'),
      render: (text) => (
        <p>{text.slice(0,10)}</p>
      )
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
          <div className="tableUser__button">
            <Button type="primary" onClick={() => editUser(record)}>Edit</Button>
            <Popconfirm
              title="Bạn có muốn xóa người dùng này không?"
              onConfirm={() => handleOk(record.id)}
              onCancel={handleCancel}
            >
              <Button
                type="primary"
                danger
              >
                Delete
              </Button>
            </Popconfirm>
          </div>
      ),
    },
  ];

  const handleOk =  (id) => {
    dispatch(deleteUser(id))
    setTimeout( async () => {
        try {
          const listUser = await userApi.getAllUser()
          dispatch(getUser(listUser))
        } catch (error) {
          console.log(error);
        }
    }, 500);
    message.info('đã xoá user',);
  };

  const handleCancel = () => {
    message.info('Clicked on No.');
  };

  const editStatusFrom = (childData) => {
    setStatusFrom(childData)
  };

  const editUser = (record) => {
    setUserEdit(record)
    setStatusFrom(true)
  }

  return (
    <>
      {
        statusFrom && <FormEdit dataUser={userEdit} editStatusFrom={editStatusFrom}/>
      }
      {
        dataTable && <Table className="table__user" columns={columns} dataSource={dataTable} rowKey="id" scroll={{ x: 1500}}/>
      }
    </>
  )
}

export default MyTable;
