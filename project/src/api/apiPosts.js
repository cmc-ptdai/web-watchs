import axiosClient from './axiosClient';;

const fetchPosts = {
  getAllPosts: (params) => {
    const url = '/posts'
    return axiosClient.get(url)
  },
  getPostsById: (id) => {
    const url = `/posts/${id}`
    return axiosClient.get(url)
  },
  deletePosts: (id) => {
    const url = `/posts/${id}`
    return axiosClient.delete(url)
  },
  addPosts: (data) => {
    const url = `/posts`
    return axiosClient.post(url,data)
  },
  editPosts: (id,data) => {
    const url = `/posts/${id}`
    return axiosClient.put(url,data)
  }
}

export default fetchPosts;
