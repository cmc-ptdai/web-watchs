import axiosClient from '../api/axiosClient'

const Slides = {
  getNewComment: () => {
    const url = '/newComment'
    return axiosClient.get(url)
  },
  deleteNewComment: (id) => {
    const url = `/newComment/${id}`
    return axiosClient.delete(url)
  },
  addNewComment: (data) => {
    const url = '/newComment'
    return axiosClient.post(url, data)
  },
}

export default Slides
