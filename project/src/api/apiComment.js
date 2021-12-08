import axiosClient from './axiosClient';

const ApiComments = {
  getAllApiComments: (params) => {
    const url = '/comments'
    return axiosClient.get(url)
  },
  deleteApiComments: (id) => {
    const url = `/comments/${id}`
    return axiosClient.delete(url)
  },
  addApiComments: (data) => {
    const url = `/comments`
    return axiosClient.post(url,data)
  },
  editApiComments: (id,data) => {
    const url = `/comments/${id}`
    return axiosClient.put(url,data)
  }

}

export default ApiComments;
