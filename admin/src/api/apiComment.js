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
  addComment: (data) => {
    const url = '/comments'
    return axiosClient.post(url, data)
  },
  editComments: (id,data) => {
    const url = `/comments/${id}`
    return axiosClient.put(url,data)
  },
  deleteComments: (id) => {
    const url = `/comments/${id}`
    return axiosClient.delete(url)
  }

}

export default ApiComments;
