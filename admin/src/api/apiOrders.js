import axiosClient from './axiosCline';;

const fetchOrder = {
  getAllOrders: (params) => {
    const url = '/order'
    return axiosClient.get(url)
  },
  deleteOrders: (id) => {
    const url = `/order/${id}`
    return axiosClient.delete(url)
  },
  getOrdersById: (id) => {
    const url = `/order/${id}`
    return axiosClient.get(url)
  },
  addOrders: (data) => {
    const url = `/order`
    return axiosClient.post(url,data)
  },
  editOrders: (id,data) => {
    const url = `/order/${id}`
    return axiosClient.put(url,data)
  }
}

export default fetchOrder;
