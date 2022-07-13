import axiosClient from './axiosCline';

const apiCountry = {
  getAllCountry: () => {
    const url = '/country'
    return axiosClient.get(url)
  },
  addComment: (data) => {
    const url = '/country'
    return axiosClient.post(url, data)
  },
  editCountry: (id,data) => {
    const url = `/country/${id}`
    return axiosClient.put(url,data)
  },
  deleteCountry: (id) => {
    const url = `/country/${id}`
    return axiosClient.delete(url)
  }

}

export default apiCountry;
