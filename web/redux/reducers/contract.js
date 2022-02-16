import * as types from '../actions/types'

const initialContractState = {
  currentUser: null,
  walletConnection: null,
  contract: null,
  config: null,
  projectNames: [],
  projects: [],
}

export const contractReducer = (
  state = initialContractState,
  { type, payload }
) => {
  switch (type) {
    case types.INIT_FUND_CONTRACT: {
      return {
        ...state,
        currentUser: payload.currentUser,
        walletConnection: payload.walletConnection,
        contract: payload.contract,
        nearConfig: payload.nearConfig,
      }
    }
    case types.INIT_PROJECT_CONTRACTS: {
      return {
        ...state,
        projects: payload.projects,
      }
    }
    case types.FETCH_PROJECT_FROM_FUND: {
      return {
        ...state,
        projectNames: payload.projects,
      }
    }
    default:
      return state
  }
}
