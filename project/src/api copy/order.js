import axiosClient from './axiosClient'

const orderApi = {
  getOder: () => {
    const url = '/order'
    return axiosClient.get(url)
  },

  getOderById: (id) => {
    const url = `/order/${id}`
    return axiosClient.get(url)
  },

  addOrder: (data) => {
    const url = `/order`
    return axiosClient.post(url, data)
  }
}
export default orderApi
