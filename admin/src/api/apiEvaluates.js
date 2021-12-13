import axiosClient from './axiosCline';

const ApiEvaluates = {
  getAllEvaluates: (params) => {
    const url = '/evaluates'
    return axiosClient.get(url)
  },
  getEvaluateById: (id) => {
    const url = `/evaluates/${id}`
    return axiosClient.get(url)
  },
  addEvaluates: (data) => {
    const url = '/evaluates'
    return axiosClient.post(url, data)
  },
  editEvaluates: (id,data) => {
    const url = `/evaluates/${id}`
    return axiosClient.put(url,data)
  },
  deleteEvaluates: (id) => {
    const url = `/evaluates/${id}`
    return axiosClient.delete(url)
  }

}

export default ApiEvaluates;
