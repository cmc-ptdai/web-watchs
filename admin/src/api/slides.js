import axiosClient from '../api/axiosCline'

const Slides = {
  getSlides: () => {
    const url = '/slide'
    return axiosClient.get(url)
  },
  addSlides: (data) => {
    const url = '/slide'
    return axiosClient.post(url, data)
  },
  deleteSlides: (id) => {
    const url = `/slide/${id}`
    return axiosClient.delete(url)
  }
}

export default Slides
