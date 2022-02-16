import * as types from './types'

export const signIn =
  ({ wallet, nearConfig }) =>
  (dispatch) => {
    wallet.requestSignIn(nearConfig.contractName, 'igotfund')

    dispatch({
      type: types.LOG_IN,
      payload: {},
    })
  }

export const signOut =
  ({ wallet }) =>
  (dispatch) => {
    wallet.signOut()

    dispatch({
      type: types.LOG_OUT,
      payload: {},
    })
  }
