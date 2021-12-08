import axiosClient from './axiosClient'

const userApi = {
  getUser: () => {
    const url = '/users'
    return axiosClient.get(url)
  },

  getUserById: (id) => {
    const url = `/users/${id}`
    return axiosClient.get(url)
  },

  addCart: (id, data) => {
    const url = `/users/${id}`
    return axiosClient.put(url, data)
  },

  addUser: (data) => {
    const url = `/users`
    return axiosClient.post(url,data)
  },
}
export default userApi
