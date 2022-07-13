import axiosClient from './axiosCline'

const ApiTrademark = {
  getAllTrademark: () => {
    const url = '/trademark'
    return axiosClient.get(url)
  },
  deleteTrademark: (id) => {
    const url = `/trademark/${id}`
    return axiosClient.delete(url)
  },
  addTrademark: (data) => {
    const url = `/trademark`
    return axiosClient.post(url,data)
  },
  editTrademark: (id,data) => {
    const url = `/trademark/${id}`
    return axiosClient.put(url,data)
  }

}

export default ApiTrademark;
