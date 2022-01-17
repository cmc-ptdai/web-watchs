import axiosClient from './axiosClient'

const Country = {
  getCountry: () => {
    const url = '/country/'
    return axiosClient.get(url)
  }
}

export default Country
