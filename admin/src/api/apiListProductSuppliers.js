import axiosClient from './axiosCline'

const ApiListProductSuppliers = {
  getAllSuppliers: () => {
    const url = '/listImportProductSuppliers'
    return axiosClient.get(url)
  },
  deleteSuppliersAction: (id) => {
    const url = `/listImportProductSuppliers/${id}`
    return axiosClient.delete(url)
  },
  addSuppliersAction: (data) => {
    const url = `/listImportProductSuppliers`
    return axiosClient.post(url,data)
  },
  editSuppliersAction: (id,data) => {
    const url = `/listImportProductSuppliers/${id}`
    return axiosClient.put(url,data)
  }

}

export default ApiListProductSuppliers;
