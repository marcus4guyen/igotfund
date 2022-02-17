import { context, storage, u128, ContractPromiseBatch } from 'near-sdk-as'
import {
  PROJECT_KEY,
  MIN_ATTACHED_DEPOSIT,
  PAGE_SIZE,
  MAX_STRING_LENGTH,
  asNEAR,
  MIN_RELEASED_DONATION,
  MIN_LIKED_COUNT,
  XCC_GAS,
  FIVE_NEAR,
} from '../../utils'
import { Comment, Donation, Project } from './models'

// In order to keep the contract working, at least 10 NEAR will be needed for deposit.

// Conditions:
//  - Contract is not initialized yet.
//  - title must not be blank.
//  - description must be less than 500 characters.
//  - imageUrl must start with https://.
export function init(
  identifier: string,
  title: string,
  description: string,
  imageUrl: string
): void {
  assert(!is_initialized(), 'Contract is already initialized.')

  assert(
    u128.ge(context.attachedDeposit, MIN_ATTACHED_DEPOSIT),
    'You must deposit at least ' +
      asNEAR(MIN_ATTACHED_DEPOSIT) +
      ' NEAR to initialize this contract.'
  )

  assert(title.length > 0, 'Title must not be blank.')

  assert(
    description.length < MAX_STRING_LENGTH,
    'Description must be less than ' +
      MAX_STRING_LENGTH.toString() +
      ' characters.'
  )

  assert(
    imageUrl.startsWith('https://'),
    'Your URL is not valid, and must start with "https://".'
  )

  Project.create(context.sender, identifier, title, description, imageUrl)
}

export function get(): Project {
  assert_contract_is_initialized()

  return Project.get()
}

// =====================
// ======DONATIONS======
// =====================

// One of the most interesting features about the donation system is the opportunity for users to donate directly to projects they find interesting.
// When enough funds are collected from the community, project owners can release the donations fund.

// Conditions:
//  - User will have to donate directly.
//  - They will have to attach some money.
//  - The project is currently in the funding phase.
export function donate(): void {
  assert_contract_is_initialized()

  assert(context.sender == context.predecessor, 'User must donate directly.')

  assert(context.attachedDeposit > u128.Zero, 'User must attach some money.')

  assert(
    Project.get().funding == true,
    'The project is not actively seeking crowdfunding at this time. For more information, please contact the project owner.'
  )

  Project.add_donation()
}

// Get a list of donors who have generously donated to the project.
export function get_donation_list(
  offset: u32,
  limit: u32 = PAGE_SIZE
): Donation[] {
  assert_contract_is_initialized()

  return Project.get_donation_list(offset, limit)
}

// Get the total number of donations in this project.
export function get_donation_count(): u32 {
  return Project.get_donation_count()
}

// Get the current donations fund of this project.
export function get_total_donations(): u128 {
  return Project.get().total_donations
}

// In order to release the donations fund, the project must receive at least 100 NEAR tokens or 10 likes from the community.
// All donations will be transferred directly to the project owner's wallet immediately,
// but the initial deposit for launching the project (10 NEAR) will be kept to pay for the contract owner (5 NEAR) and for the storage staking (5 NEAR).
// IMPORTANT:
// Releasing the funds will mark the project as complete, meaning you won't be able to receive further donations from the community.
// If you want to continue raising money, you'll need to create a new one.

// Conditions:
//  - This method can be invoked by the contract owner (i.e., the person who created the contract)
//    only with the signature of the project owner (i.e., the person who owns the project).
//  - The project must receive at least 100 NEAR tokens or 10 likes from the community.
export function release_donations(): void {
  assert_contract_is_initialized()

  assert_project_owner(
    'Only the person who launched this project can release the donations.'
  )

  assert_contract_owner(
    'Funds donated to this project can be released only by the owner of this contract.'
  )

  assert(
    can_release_donations_fund(),
    'Need at least ' +
      asNEAR(MIN_RELEASED_DONATION) +
      ' NEAR or ' +
      MIN_LIKED_COUNT.toString() +
      ' likes from the community.'
  )

  ContractPromiseBatch.create(context.sender)
    .transfer(Project.get().total_donations)
    .then(context.predecessor)
    .transfer(FIVE_NEAR)
    .then(context.contractName)
    .function_call('on_donations_released', '{}', u128.Zero, XCC_GAS)
}

// A callback function from the ContractPromiseBatch.
export function on_donations_released(): void {
  // Mark the project as complete, meaning you won't be able to receive further donations from the community.
  Project.release_donations()
}
// ====================

// ====================
// ======COMMENTS======
// ====================

// Conditions:
//  - User will have to comment directly.
//  - text is required.
//  - text must be less than 500 characters.
export function add_comment(text: string): void {
  assert_contract_is_initialized()

  assert(context.sender == context.predecessor, 'User must comment directly.')

  assert(text.length > 0, 'Comment text is required.')

  assert(
    text.length < MAX_STRING_LENGTH,
    'Comment text is too long. Please keep it under ' +
      MAX_STRING_LENGTH.toString() +
      ' characters.'
  )

  Project.add_comment(text)
}

// Use the Offset-based Pagination to get the comments.
export function get_comment_list(
  offset: u32,
  limit: u32 = PAGE_SIZE
): Comment[] {
  assert_contract_is_initialized()

  return Project.get_comment_list(offset, limit)
}

// Get the total number of comments in this project.
export function get_comment_count(): u32 {
  assert_contract_is_initialized()

  return Project.get_comment_count()
}
// ====================

// ====================
// =======LIKES========
// ====================

// Conditions:
// - User will have to like directly.
export function like(): void {
  assert_contract_is_initialized()

  assert(context.sender == context.predecessor, 'User must like directly.')

  Project.like()
}

// Get the total number of likes in this project.
export function get_like_count(): u32 {
  assert_contract_is_initialized()

  return Project.get_like_count()
}
// ===========================

// ===========================
// =====PRIVATE FUNCTIONS=====
// ===========================
function is_initialized(): bool {
  return storage.hasKey(PROJECT_KEY)
}

function can_release_donations_fund(): bool {
  return (
    u128.ge(Project.get().total_donations, MIN_RELEASED_DONATION) ||
    Project.get_like_count() >= MIN_LIKED_COUNT
  )
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
