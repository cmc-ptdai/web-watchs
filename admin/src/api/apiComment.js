import axiosClient from './axiosCline';

const ApiComments = {
  getAllComments: (params) => {
    const url = '/comments'
    return axiosClient.get(url)
  },
  getCommentsById: (id) => {
    const url = `/comments/${id}`
    return axiosClient.get(url)
  },
  editComments: (id,data) => {
    const url = `/comments/${id}`
    return axiosClient.put(url,data)
  }

}

export default ApiComments;
