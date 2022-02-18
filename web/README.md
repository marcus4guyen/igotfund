# Front-end

You can find all the interactions with the smart contract at **`redux/actions/contract`**.

```ts
/**
 * @returns
 */
export const initFundContract = () => async (dispatch) => {}

/**
 * @param wallet
 * @param nearConfig
 * @param projectIdentifiers
 * @returns
 */
export const initProjectContracts = ({ wallet, nearConfig, projectIdentifiers = [] }) => (dispatch) => {}

/**
 * @param contract
 * @param offset
 * @param limit
 * @returns
 */
export const fetchProjectsFromFund = ({ contract, offset, limit }) => (dispatch) => {}

/**
 * @param contract
 * @param identifier
 * @param title
 * @param description
 * @param imageUrl
 * @param amount
 * @returns
 */
export const createNewProject = ({ contract, identifier, title, description, imageUrl, amount }) => (dispatch) => {}

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
export const _getDonations = ({ contract, offset, limit }) => contract.get_donation_list({ offset, limit })

/**
 * @param contract
 * @param offset
 * @param limit
 * @returns
 */
export const _getComments = ({ contract, offset, limit }) => contract.get_comment_list({ offset, limit })

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
export const _donate = ({ contract, amount }) => contract.donate({}, BASIC_GAS, ONE_NEAR.mul(amount).toFixed())

/**
 * @param contract
 * @param newComment
 * @returns
 */
export const _addComment = ({ contract, newComment }) => contract.add_comment({ text: newComment }, BASIC_GAS)

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
export const _releaseDonations = ({ contract, identifier }) => contract.release_donations({ identifier }, BASIC_GAS)
```
