import axiosClient from '../api/axiosClient'

const Slides = {
  getSlides: () => {
    const url = '/slides/'
    return axiosClient.get(url)
  }
}

export default Slides
