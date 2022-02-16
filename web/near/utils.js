export const ONE_NEAR = BigInt('1000000000000000000000000')
export const XCC_GAS = 300000000000000

export const formatDate = (blockTimestamp) =>
  new Date(blockTimestamp / 1000000).toLocaleString()

export const asNear = (amount) => {
  if (amount) {
    return BigInt(amount) / ONE_NEAR + ' NEAR'
  }

  return ''
}
