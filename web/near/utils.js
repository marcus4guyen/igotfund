import Big from 'big.js'

export const ONE_NEAR = Big('1000000000000000000000000')
export const BASIC_GAS = Big('300000000000000').toFixed()

export const formatDate = (blockTimestamp) =>
  new Date(blockTimestamp / 1000000).toLocaleString()

export const asNear = (amount) => {
  console.log(amount)
  if (amount) {
    return Big(amount).div(ONE_NEAR).toFixed() + ' NEAR'
  }

  return ''
}
