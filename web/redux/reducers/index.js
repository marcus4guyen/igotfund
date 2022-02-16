import { combineReducers } from 'redux'
import { contractReducer } from './contract'

const reducers = {
  near: contractReducer,
}

export default combineReducers(reducers)
