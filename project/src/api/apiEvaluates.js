import axiosClient from './axiosClient';

const ApiEvaluates = {
  getAllEvaluates: (params) => {
    const url = '/evaluates'
    return axiosClient.get(url)
  },
  deleteEvaluates: (id) => {
    const url = `/evaluates/${id}`
    return axiosClient.delete(url)
  },
  addEvaluates: (data) => {
    const url = `/evaluates`
    return axiosClient.post(url,data)
  },
  editEvaluates: (id,data) => {
    const url = `/evaluates/${id}`
    return axiosClient.put(url,data)
  }

}

export default ApiEvaluates;
