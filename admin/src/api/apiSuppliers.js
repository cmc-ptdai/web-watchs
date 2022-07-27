import axiosClient from './axiosCline'

const ApiSuppliers = {
  getAllSuppliers: () => {
    const url = '/suppliers'
    return axiosClient.get(url)
  },
  deleteSuppliersAction: (id) => {
    const url = `/suppliers/${id}`
    return axiosClient.delete(url)
  },
  addSuppliersAction: (data) => {
    const url = `/suppliers`
    return axiosClient.post(url,data)
  },
  editSuppliersAction: (id,data) => {
    const url = `/suppliers/${id}`
    return axiosClient.put(url,data)
  }

}

export default ApiSuppliers;
