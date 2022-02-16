import { context, storage, u128, ContractPromiseBatch } from 'near-sdk-as'
import {
  PROJECT_KEY,
  MIN_ATTACHED_DEPOSIT,
  PAGE_SIZE,
  MAX_COMMENT_LENGTH,
  asNEAR,
  MIN_RELEASED_DONATION,
} from '../../utils'
import { Comment, Donation, Project } from './models'

export function init(
  identifier: string,
  title: string,
  description: string,
  image: string
): void {
  assert(!is_initialized(), 'Contract is already initialized.')

  assert(
    u128.ge(context.attachedDeposit, MIN_ATTACHED_DEPOSIT),
    'You must deposit at least 10 NEAR to initialize this contract.'
  )

  assert(title.length > 0, 'Title must not be blank.')

  Project.create(context.sender, identifier, title, description, image)
}

export function get(): Project {
  assert_contract_is_initialized()

  return Project.get()
}

// ====================
// ======DONATIONS=====
// ====================
export function donate(): void {
  assert_contract_is_initialized()
  assert(context.sender == context.predecessor, 'User must donate directly.')
  assert(context.attachedDeposit > u128.Zero, 'User must attach some money.')

  Project.add_donation()
}

export function get_donation_list(
  offset: u32,
  limit: u32 = PAGE_SIZE
): Donation[] {
  assert_contract_is_initialized()

  return Project.get_donation_list(offset, limit)
}

export function get_total_donations(): u128 {
  return Project.get_total_donations()
}

export function get_donation_count(): u32 {
  assert_contract_is_initialized()

  return Project.get_donation_count()
}

// This method is only called from the contract owner, with the signature from the project owner
// Transfer the totoal_donations for the project owner, transfer the initial amount for the contract owner
export function release_donations(): void {
  assert_contract_is_initialized()
  assert_project_owner('Only owner of this project can release the donations.')
  assert_contract_owner(
    'Only owner of this contract can release the donations.'
  )
  assert(
    Project.get().total_donations >= MIN_RELEASED_DONATION ||
      Project.get_like_count() >= 10,
    'Need at least ' +
      asNEAR(MIN_RELEASED_DONATION) +
      ' or 10 likes to release the donations.'
  )

  ContractPromiseBatch.create(context.sender)
    .transfer(Project.get().total_donations)
    .then(context.contractName)
    .delete_account(context.predecessor)
  // .function_call('on_donations_released', '{}', u128.Zero, XCC_GAS)
}

export function on_donations_released(): void {
  Project.release_donations()
}

// ====================
// ======COMMENTS======
// ====================
export function add_comment(text: string): void {
  assert_contract_is_initialized()
  assert(context.sender == context.predecessor, 'User must comment directly.')
  assert(text.length > 0, 'Comment must not be empty.')
  assert(
    text.length < MAX_COMMENT_LENGTH,
    'Comment is too long, must be less than ' + MAX_COMMENT_LENGTH.toString()
  )

  Project.add_comment(text)
}

export function get_comment_list(
  offset: u32,
  limit: u32 = PAGE_SIZE
): Comment[] {
  assert_contract_is_initialized()

  return Project.get_comment_list(offset, limit)
}

export function get_comment_count(): u32 {
  assert_contract_is_initialized()

  return Project.get_comment_count()
}

// ====================
// =======LIKES========
// ====================
export function like(): void {
  assert_contract_is_initialized()
  assert(context.sender == context.predecessor, 'User must like directly.')

  Project.like()
}

export function get_like_count(): u32 {
  assert_contract_is_initialized()

  return Project.get_like_count()
}

// Private functions
function is_initialized(): bool {
  return storage.hasKey(PROJECT_KEY)
}

function assert_contract_is_initialized(): void {
  assert(is_initialized(), 'Contract must be initialied first.')
}

function assert_project_owner(message: string): void {
  assert(context.sender == Project.get().owner, message)
}

function assert_contract_owner(message: string): void {
  assert(context.predecessor == Project.get().contract_owner, message)
}
