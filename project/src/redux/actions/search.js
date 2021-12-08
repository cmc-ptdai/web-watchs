import {KEYWORD_SEARCH} from '../actionType'

export const keyWordSearch = (payload) => {
  return {
    type: KEYWORD_SEARCH,
    payload
  }
}
