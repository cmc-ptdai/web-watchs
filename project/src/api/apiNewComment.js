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
  editNewComment: (id, data) => {
    const url = `/newComment/${id}`
    return axiosClient.put(url,data)
  }
}

export default Slides
