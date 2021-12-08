import axiosClient from '../api/axiosCline'

const Slides = {
  getNewComment: () => {
    const url = '/newComment'
    return axiosClient.get(url)
  },
  addNewComment: (data) => {
    const url = '/newComment'
    return axiosClient.post(url, data)
  },
  deleteNewComment: (id) => {
    const url = `/newComment/${id}`
    return axiosClient.delete(url)
  }
}

export default Slides
