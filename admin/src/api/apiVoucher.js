import axiosClient from './axiosCline'

const ApiVoucher = {
  getAllVoucher: () => {
    const url = '/vouchers'
    return axiosClient.get(url)
  },
  deleteVoucher: (id) => {
    const url = `/vouchers/${id}`
    return axiosClient.delete(url)
  },
  addVoucher: (data) => {
    const url = `/vouchers`
    return axiosClient.post(url,data)
  },
  editVoucher: (id,data) => {
    const url = `/vouchers/${id}`
    return axiosClient.put(url,data)
  }

}

export default ApiVoucher;
