import {
  storage,
  u128,
  context,
  env,
  ContractPromiseBatch,
  ContractPromise,
  base58,
  logging,
} from 'near-sdk-as'
import {
  AccountId,
  FUND_KEY,
  MIN_ATTACHED_DEPOSIT,
  PAGE_SIZE,
  XCC_GAS,
} from '../../utils'
import { Fund, ProjectInitArgs, ProjectAsArgs, Project } from './model'

const CODE = includeBytes('../../../build/release/project.wasm')

// In order to keep the contract working, at least 10 NEAR will be needed for deposit.

// Conditions:
//  - Contract is not initialized yet.
//  - Need at least 10 NEAR tokens in order to initialize this contract.
export function init(): void {
  assert(!is_contract_initialized(), 'Contract is already initialized.')

  assert(
    u128.ge(context.attachedDeposit, MIN_ATTACHED_DEPOSIT),
    'You must stake at least 10 NEAR tokens in order to initialize this contract.'
  )

  Fund.create()
}

// To create a new project on our platform, you'll need at least 10 NEAR.
// After you've received enough support from our community and raised 100 NEAR, you can release the funds for your project.
// All donations will be transferred directly to your wallet immediately,
// but the initial deposit (10 NEAR) for creating your project will be paid for the contract owner.

// Conditions:
//  - Need at least 10 NEAR tokens in order to create a new project.
//  - Project identifier must be a valid NEAR account name.
//  - Project identifier must be unique.
export function add_project(
  identifier: string,
  title: string,
  description: string,
  imageUrl: string
): void {
  assert_contract_is_initialized()

  assert(
    u128.ge(context.attachedDeposit, MIN_ATTACHED_DEPOSIT),
    'You must stake at least 10 NEAR tokens in order to create a new project.'
  )

  const projectAccountId = full_account_for(identifier)

  assert(
    env.isValidAccountID(projectAccountId),
    'Your project identifier must be a valid NEAR account name.'
  )

  assert(
    !Fund.has_project(identifier),
    'Oops! It seems you are trying to create an account with the same name as an existing account. That is not allowed.'
  )

  // Create a sub-account for the project,
  let promise = ContractPromiseBatch.create(projectAccountId)
    .create_account()
    .deploy_contract(Uint8Array.wrap(changetype<ArrayBuffer>(CODE)))
    .add_full_access_key(base58.decode(context.senderPublicKey))

  // Initialize the project by making a cross contract call,
  promise.function_call(
    'init',
    new ProjectInitArgs(identifier, title, description, imageUrl),
    context.attachedDeposit,
    XCC_GAS
  )

  // And wait for the result from the call.
  promise
    .then(context.contractName)
    .function_call(
      'on_project_created',
      new ProjectAsArgs(context.sender, identifier),
      u128.Zero,
      XCC_GAS
    )
}

// A callback function for the cross contract call.
export function on_project_created(owner: AccountId, identifier: string): void {
  const results = ContractPromise.getResults()
  const projectCreated = results[0]

  switch (projectCreated.status) {
    case 0:
      logging.log(
        'Project creation for [ ' +
          full_account_for(identifier) +
          ' ] is pending.'
      )
      break
    case 1:
      logging.log(
        'Project creation for [ ' +
          full_account_for(identifier) +
          ' ] succeeded.'
      )

      Fund.create_project(owner, identifier)
      break
    case 2:
      logging.log(
        'Project creation for [ ' + full_account_for(identifier) + ' ] failed.'
      )
      break
    default:
      logging.log(
        'Unexpected value for promise result [' +
          projectCreated.status.toString() +
          '].'
      )
      break
  }
}

// Once the project has reached 100 NEAR in funding or 10 Likes, the project owner can release the donation funds.

// Conditions:
//  - Only the project owner can release the donation funds.
//  - Releasing the funds will mark the project as complete, meaning you won't be able to receive further donations from the community.
export function release_donations(identifier: string): void {
  assert_contract_is_initialized()

  assert(
    is_project_owner(identifier),
    'Only the project owner can release the donation funds.'
  )

  const promise = ContractPromise.create(
    full_account_for(identifier),
    'release_donations',
    '',
    XCC_GAS,
    u128.Zero
  )

  promise.then(
    context.contractName,
    'on_donations_released',
    new ProjectAsArgs(context.sender, identifier),
    XCC_GAS,
    u128.Zero
  )
}

// A callback function for the cross contract call.
export function on_donations_released(
  owner: AccountId,
  identifier: string
): void {
  const results = ContractPromise.getResults()
  const donationsReleased = results[0]

  switch (donationsReleased.status) {
    case 0:
      logging.log(
        'Donations released for [ ' +
          full_account_for(identifier) +
          ' ] is pending.'
      )
      break
    case 1:
      logging.log(
        'Donations released for [ ' +
          full_account_for(identifier) +
          ' ] succeeded.'
      )

      // Fund.remove_project(identifier)
      break
    case 2:
      logging.log(
        'Donations released for [ ' +
          full_account_for(identifier) +
          ' ] failed.'
      )
      break
    default:
      logging.log(
        'Unexpected value for promise result [' +
          donationsReleased.status.toString() +
          '].'
      )
      break
  }
}

// Use the Offset-based Pagination to get the projects.
export function get_project_list(
  offset: u32,
  limit: u32 = PAGE_SIZE
): Project[] {
  assert_contract_is_initialized()

  return Fund.get_project_list(offset, limit)
}

// Get the total number of projects in this contract.
export function get_project_count(): u32 {
  assert_contract_is_initialized()

  return Fund.get_project_count()
}

// ===========================
// =====PRIVATE FUNCTIONS=====
// ===========================
function is_contract_initialized(): bool {
  return storage.hasKey(FUND_KEY)
}

function is_project_owner(identifier: string): bool {
  return Fund.get_project(identifier).owner == context.sender
}

function full_account_for(identifier: string): string {
  return identifier + '.' + context.contractName
}

function assert_contract_is_initialized(): void {
  assert(is_contract_initialized(), 'Contract must be initialzed first.')
}
