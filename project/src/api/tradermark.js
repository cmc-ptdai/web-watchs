import axiosClient from './axiosClient'

const Trademark = {
  gettTademark: () => {
    const url = '/trademark/'
    return axiosClient.get(url)
  }
}

export default Trademark
