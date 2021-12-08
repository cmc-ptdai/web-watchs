import axiosClient from './axiosClient';

const apiWarehouse = {
  getWarehouse: (params) => {
    const url = '/warehouse'
    return axiosClient.get(url)
  },
  deleteWarehouse: (id) => {
    const url = `/warehouse/${id}`
    return axiosClient.delete(url)
  },
  getWarehouseById: (id) => {
    const url = `/warehouse/${id}`
    return axiosClient.get(url)
  },
  addWarehouse: (data) => {
    const url = `/warehouse`
    return axiosClient.post(url,data)
  },
  editWarehouse: (id,data) => {
    const url = `/warehouse/${id}`
    return axiosClient.put(url,data)
  }

}

export default apiWarehouse;
