import axiosClient from './axiosCline';

const ApiUser = {
  getAllUser: (params) => {
    const url = '/users'
    return axiosClient.get(url)
  },
  deleteUser: (id) => {
    const url = `/users/${id}`
    return axiosClient.delete(url)
  },
  getUserById: (id) => {
    const url = `/users/${id}`
    return axiosClient.get(url)
  },
  addUser: (data) => {
    const url = `/users`
    return axiosClient.post(url,data)
  },
  editUser: (id,data) => {
    const url = `/users/${id}`
    return axiosClient.put(url,data)
  }

}

export default ApiUser;
