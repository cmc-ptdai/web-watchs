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
  editEvaluates: (id,data) => {
    const url = `/evaluates/${id}`
    return axiosClient.put(url,data)
  }

}

export default ApiEvaluates;
