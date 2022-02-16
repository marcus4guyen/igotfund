import { u128, math, RNG } from 'near-sdk-as'

export const ONE_NEAR = u128.from('1000000000000000000000000')
export const XCC_GAS = 20000000000000
export const MIN_ATTACHED_DEPOSIT = u128.mul(ONE_NEAR, u128.from(10))
export const MIN_RELEASED_DONATION = u128.mul(ONE_NEAR, u128.from(100))

export const FUND_KEY = 'fund'
export const PROJECT_KEY = 'project'

export const PAGE_SIZE = 10
export const MAX_COMMENT_LENGTH = 500

export type AccountId = string

export function key_for(name: string): u32 {
  return math.hash32<string>(name)
}

export function asNEAR(amount: u128): string {
  return u128.div(amount, ONE_NEAR).toString()
}

export function random(): u32 {
  const rng = new RNG<u32>(1, u32.MAX_VALUE)
  return rng.next()
}
