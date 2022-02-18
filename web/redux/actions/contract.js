import * as nearAPI from 'near-api-js'
import getConfig from '../../near/config'
import { BASIC_GAS, ONE_NEAR } from '../../near/utils'
import * as types from './types'

/**
 * @returns
 */
export const initFundContract = () => async (dispatch) => {
  const nearConfig = getConfig(process.env.NODE_ENV || 'testnet')

  // Initializing connection to the NEAR TestNet
  const near = await nearAPI.connect({
    deps: {
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
    },
    ...nearConfig,
  })

  const walletConnection = new nearAPI.WalletConnection(near)

  // Load in account data
  let currentUser

  if (walletConnection.getAccountId()) {
    const accountState = await walletConnection.account().state()

    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: accountState.amount,
    }
  }

  // Initializing the contract APIs by contract name and configuration
  const contract = await new nearAPI.Contract(
    walletConnection.account(),
    nearConfig.contractName,
    {
      // View methods are read-only – they don't modify the state, but usually return some value
      viewMethods: ['get_project_list', 'get_project_count'],
      // Change methods can modify the state, but you don't receive the returned value when called
      changeMethods: ['add_project', 'release_donations'],
      // Sender is the account ID to initialize transactions.
      sender: walletConnection.getAccountId(),
    }
  )

  dispatch({
    type: types.INIT_FUND_CONTRACT,
    payload: { contract, currentUser, nearConfig, walletConnection },
  })
}

/**
 * @param wallet
 * @param nearConfig
 * @param projectIdentifiers
 * @returns
 */
export const initProjectContracts =
  ({ wallet, nearConfig, projectIdentifiers = [] }) =>
  (dispatch) => {
    const contractsPromises = []

    projectIdentifiers.forEach((identifier) => {
      contractsPromises.push(
        _initProjectContract({
          wallet,
          nearConfig,
          identifier,
        })
      )
    })

    Promise.all(contractsPromises).then((contracts) => {
      const projectsPromises = []

      contracts.forEach((contract) => {
        projectsPromises.push(contract.get())
      })

      Promise.all(projectsPromises).then((projects) =>
        dispatch({
          type: types.INIT_PROJECT_CONTRACTS,
          payload: { projects },
        })
      )
    })
  }

/**
 * @param contract
 * @param offset
 * @param limit
 * @returns
 */
export const fetchProjectsFromFund =
  ({ contract, offset, limit }) =>
  (dispatch) => {
    contract.get_project_list({ offset, limit }).then((projects) =>
      dispatch({
        type: types.FETCH_PROJECT_FROM_FUND,
        payload: { projects },
      })
    )
  }

/**
 * @param contract
 * @param identifier
 * @param title
 * @param description
 * @param imageUrl
 * @param amount
 * @returns
 */
export const createNewProject =
  ({ contract, identifier, title, description, imageUrl, amount }) =>
  (dispatch) => {
    contract
      .add_project(
        {
          identifier,
          title,
          description,
          imageUrl,
        },
        BASIC_GAS,
        ONE_NEAR.mul(amount).toFixed()
      )
      .then(() =>
        dispatch({
          type: types.ADD_NEW_PROJECT,
          payload: {},
        })
      )
  }

// -----------------------------------------
// funtions that do not modify global states
// -----------------------------------------
/**
 * @param wallet
 * @param nearConfig
 * @param identifier
 * @returns
 */
export const _initProjectContract = ({ wallet, nearConfig, identifier }) => {
  const fullContractName = identifier + '.' + nearConfig.contractName

  // Initializing the contract APIs by contract name and configuration
  return new nearAPI.Contract(wallet.account(), fullContractName, {
    // View methods are read-only – they don't modify the state, but usually return some value
    viewMethods: [
      'get',
      'get_donation_list',
      'get_comment_list',
      'get_like_count',
    ],
    // Change methods can modify the state, but you don't receive the returned value when called
    changeMethods: ['donate', 'add_comment', 'like'],
    // Sender is the account ID to initialize transactions.
    sender: wallet.getAccountId(),
  })
}

// View Methods
/**
 * @param contract
 * @returns
 */
export const _getProject = ({ contract }) => contract.get()

/**
 * @param contract
 * @param offset
 * @param limit
 * @returns
 */
export const _getDonations = ({ contract, offset, limit }) =>
  contract.get_donation_list({ offset, limit })

/**
 * @param contract
 * @param offset
 * @param limit
 * @returns
 */
export const _getComments = ({ contract, offset, limit }) =>
  contract.get_comment_list({ offset, limit })

/**
 * @param contract
 * @returns
 */
export const _getLikeCount = ({ contract }) => contract.get_like_count()

// Change Methods
/**
 * @param contract
 * @param amount
 * @returns
 */
export const _donate = ({ contract, amount }) =>
  contract.donate({}, BASIC_GAS, ONE_NEAR.mul(amount).toFixed())

/**
 * @param contract
 * @param newComment
 * @returns
 */
export const _addComment = ({ contract, newComment }) =>
  contract.add_comment({ text: newComment }, BASIC_GAS)

/**
 * @param contract
 * @returns
 */
export const _like = ({ contract }) => contract.like({}, BASIC_GAS)

/**
 * @param contract
 * @param identifier
 * @returns
 */
export const _releaseDonations = ({ contract, identifier }) =>
  contract.release_donations({ identifier }, BASIC_GAS)
