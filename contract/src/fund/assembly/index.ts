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
  ONE_NEAR,
  PAGE_SIZE,
  XCC_GAS,
} from '../../utils'
import { Fund, ProjectInitArgs, ProjectAsArgs, Project } from './model'

const CODE = includeBytes('../../../build/release/project.wasm')

export function init(): void {
  assert(!is_initialized(), 'Contract is already initialized.')
  // requires at least 10 NEAR for storage staking
  assert(
    u128.ge(context.attachedDeposit, MIN_ATTACHED_DEPOSIT),
    'You must deposit at least 10 NEAR to initialize this contract.'
  )

  Fund.create()
}

export function add_project(
  project: string,
  title: string,
  description: string,
  image: string
): void {
  assert_contract_is_initialized()
  assert(
    u128.ge(context.attachedDeposit, MIN_ATTACHED_DEPOSIT),
    'You must deposit at least 10 NEAR to create a new project.'
  )

  const projectAccountId = full_account_for(project)

  assert(
    env.isValidAccountID(projectAccountId),
    'Project name must be a valid NEAR account name.'
  )
  assert(!Fund.has_project(project), 'Project name already exists.')

  let promise = ContractPromiseBatch.create(projectAccountId)
    .create_account()
    .deploy_contract(Uint8Array.wrap(changetype<ArrayBuffer>(CODE)))
    .add_full_access_key(base58.decode(context.senderPublicKey))

  promise.function_call(
    'init',
    new ProjectInitArgs(project, title, description, image),
    context.attachedDeposit,
    XCC_GAS
  )

  promise
    .then(context.contractName)
    .function_call(
      'on_project_created',
      new ProjectAsArgs(context.sender, project),
      u128.Zero,
      XCC_GAS
    )
}

export function on_project_created(owner: AccountId, project: string): void {
  const results = ContractPromise.getResults()
  const projectCreated = results[0]

  switch (projectCreated.status) {
    case 0:
      logging.log(
        'Project creation for [ ' + full_account_for(project) + ' ] is pending'
      )
      break
    case 1:
      logging.log(
        'Project creation for [ ' + full_account_for(project) + ' ] succeeded'
      )
      Fund.create_project(owner, project)
      break
    case 2:
      logging.log(
        'Project creation for [ ' + full_account_for(project) + ' ] failed'
      )
      break
    default:
      logging.log(
        'Unexpected value for promise result [' +
          projectCreated.status.toString() +
          ']'
      )
      break
  }
}

// release donations will also delete the project
export function release_donations(project: string): void {
  assert_contract_is_initialized()
  assert(
    is_owner(project),
    'Only owner of the project can release the donations.'
  )

  const promise = ContractPromise.create(
    full_account_for(project),
    'release_donations',
    '',
    XCC_GAS,
    u128.Zero
  )

  promise.then(
    context.contractName,
    'on_donations_released',
    new ProjectAsArgs(context.sender, project),
    XCC_GAS,
    u128.Zero
  )
}

export function on_donations_released(owner: AccountId, project: string): void {
  const results = ContractPromise.getResults()
  const donationsReleased = results[0]

  switch (donationsReleased.status) {
    case 0:
      logging.log(
        'Donations released for [ ' +
          full_account_for(project) +
          ' ] is pending'
      )
      break
    case 1:
      logging.log(
        'Donations released for [ ' + full_account_for(project) + ' ] succeeded'
      )
      Fund.remove_project(project)
      break
    case 2:
      logging.log(
        'Donations released for [ ' + full_account_for(project) + ' ] failed'
      )
      break
    default:
      logging.log(
        'Unexpected value for promise result [' +
          donationsReleased.status.toString() +
          ']'
      )
      break
  }
}

export function get_project_list(
  offset: u32,
  limit: u32 = PAGE_SIZE
): Project[] {
  assert_contract_is_initialized()

  return Fund.get_project_list(offset, limit)
}

export function get_project_count(): u32 {
  assert_contract_is_initialized()

  return Fund.get_project_count()
}

// =====PRIVATE FUNCTIONS=====
function is_initialized(): bool {
  return storage.hasKey(FUND_KEY)
}

function is_owner(project: string): bool {
  return Fund.get_project(project).owner == context.sender
}

function full_account_for(project: string): string {
  return project + '.' + context.contractName
}

function assert_contract_is_initialized(): void {
  assert(is_initialized(), 'Contract must be initialzed first.')
}
