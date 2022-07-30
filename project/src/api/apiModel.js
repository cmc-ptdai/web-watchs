import axiosClient from './axiosClient'

const Models = {
  getModels: () => {
    const url = '/models'
    return axiosClient.get(url)
  }
}

export default Models
