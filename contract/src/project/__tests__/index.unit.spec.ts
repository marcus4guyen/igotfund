import { u128, VMContext } from 'near-sdk-as'
import * as util from '../../utils'
import * as contract from '../assembly'

const FUND_ACCOUNT_ID = 'fund'
const OWNER_ACCOUNT_ID = 'alice'
const DONOR1_ACCOUNT_ID = 'bob'
const DONOR2_ACCOUNT_ID = 'john'
const PROJECT_IDENTIFIER = 'defi'
const PROJECT_TITLE = 'defi'
const PROJECT_DESCRIPTION = 'awesome project'
const PROJECT_IMAGE = 'https://url-to-image'

const useFundAsPredecessor = (): void => {
  VMContext.setPredecessor_account_id(FUND_ACCOUNT_ID)
}

const attachMinBalance = (): void => {
  VMContext.setAttached_deposit(util.MIN_ATTACHED_DEPOSIT)
}

const doInitialize = (): void => {
  attachMinBalance()
  useFundAsPredecessor()
  contract.init(
    PROJECT_IDENTIFIER,
    PROJECT_TITLE,
    PROJECT_DESCRIPTION,
    PROJECT_IMAGE
  )
}

describe('project initialization', () => {
  beforeEach(useFundAsPredecessor)

  it('should create project with proper metadata', () => {
    VMContext.setSigner_account_id(OWNER_ACCOUNT_ID)
    attachMinBalance()

    contract.init(
      PROJECT_IDENTIFIER,
      PROJECT_TITLE,
      PROJECT_DESCRIPTION,
      PROJECT_IMAGE
    )

    const project = contract.get()

    expect(project.owner).toStrictEqual(OWNER_ACCOUNT_ID)
    expect(project.title).toStrictEqual(PROJECT_TITLE)
    expect(project.description).toStrictEqual(PROJECT_DESCRIPTION)
    expect(project.image).toStrictEqual(PROJECT_IMAGE)
    expect(project.total_donations).toStrictEqual(u128.Zero)
  })

  it('should prevent double initialization', () => {
    VMContext.setSigner_account_id(OWNER_ACCOUNT_ID)
    attachMinBalance()

    contract.init(
      PROJECT_IDENTIFIER,
      PROJECT_TITLE,
      PROJECT_DESCRIPTION,
      PROJECT_IMAGE
    )

    expect((): void => {
      contract.init(
        PROJECT_IDENTIFIER,
        PROJECT_TITLE,
        PROJECT_DESCRIPTION,
        PROJECT_IMAGE
      )
    }).toThrow('Contract is already initialized.')
  })

  it('should require title not to be blank', () => {
    VMContext.setSigner_account_id(OWNER_ACCOUNT_ID)
    attachMinBalance()

    expect((): void => {
      contract.init(PROJECT_IDENTIFIER, '', PROJECT_DESCRIPTION, PROJECT_IMAGE)
    }).toThrow('Project title must not be blank.')
  })

  it('should require minimum balance', () => {
    VMContext.setSigner_account_id(OWNER_ACCOUNT_ID)

    expect((): void => {
      contract.init(
        PROJECT_IDENTIFIER,
        PROJECT_TITLE,
        PROJECT_DESCRIPTION,
        PROJECT_IMAGE
      )
    }).toThrow('You must deposit at least 10 NEAR to initialize this contract.')
  })
})

describe('project donations', () => {
  beforeEach(doInitialize)

  it('should capture donations', () => {
    VMContext.setSigner_account_id(DONOR1_ACCOUNT_ID)
    VMContext.setPredecessor_account_id(DONOR1_ACCOUNT_ID)

    contract.donate()

    expect(contract.get().total_donations).toStrictEqual(
      util.MIN_ATTACHED_DEPOSIT
    )
  })

  describe('captures donations', () => {
    beforeEach(() => {
      VMContext.setAttached_deposit(util.MIN_ATTACHED_DEPOSIT)

      VMContext.setSigner_account_id(DONOR1_ACCOUNT_ID)
      VMContext.setPredecessor_account_id(DONOR1_ACCOUNT_ID)
      contract.donate()

      VMContext.setSigner_account_id(DONOR2_ACCOUNT_ID)
      VMContext.setPredecessor_account_id(DONOR2_ACCOUNT_ID)
      contract.donate()
    })

    it('should calculate a running donations total properly', () => {
      const twice_attached_deposit = u128.mul(
        util.MIN_ATTACHED_DEPOSIT,
        u128.from(2)
      )
      expect(contract.get_total_donations()).toBe(twice_attached_deposit)
    })

    it('should return a list of donations', () => {
      expect(contract.get_donation_list(0).length).toBe(2)
    })

    it('should return a count of donations', () => {
      expect(contract.get_donation_count()).toBe(2)
    })
  })
})

describe('project comments', () => {
  beforeEach(doInitialize)

  beforeEach(() => {
    VMContext.setSigner_account_id(DONOR1_ACCOUNT_ID)
    VMContext.setPredecessor_account_id(DONOR1_ACCOUNT_ID)
  })

  it('should capture comments', () => {
    contract.add_comment('awesome project')

    expect(contract.get_comment_list(0)[0].text).toStrictEqual(
      'awesome project'
    )
  })

  it('should reject comments that are too long', () => {
    expect((): void => {
      const LONG_TEXT =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tempus velit nibh, ornare ultrices elit tempus at. Etiam tristique mattis semper.Vestibulum vehicula elit sed justo consequat malesuada. In ut tincidunt risus. Phasellus eu volutpat leo, vitae mattis ipsum. Aliquam sed sapien id mi venenatis fringilla. Nam in nisl ut purus pharetra facilisis id quis felis. Nullam bibendum ipsum ut tortor molestie pharetra. Nam gravida consectetur enim. Vestibulum egestas sit amet lorem id varius. Nullam lacus est, pulvinar sed pulvinar cursus, aliquet nec ipsum.'

      contract.add_comment(LONG_TEXT)
    }).toThrow(
      'Comment is too long, must be less than ' +
        util.MAX_COMMENT_LENGTH.toString()
    )
  })

  it('should capture multiple comments', () => {
    VMContext.setSigner_account_id(DONOR1_ACCOUNT_ID)
    VMContext.setPredecessor_account_id(DONOR1_ACCOUNT_ID)
    contract.add_comment('awesome project')

    VMContext.setSigner_account_id(DONOR2_ACCOUNT_ID)
    VMContext.setPredecessor_account_id(DONOR2_ACCOUNT_ID)
    contract.add_comment('great idea')

    expect(contract.get_comment_list(0).length).toBe(2)
    expect(contract.get_comment_count()).toBe(2)
  })
})

describe('project likes', () => {
  beforeEach(doInitialize)

  beforeEach(() => {
    VMContext.setSigner_account_id(DONOR1_ACCOUNT_ID)
    VMContext.setPredecessor_account_id(DONOR1_ACCOUNT_ID)
  })

  it('should capture likes', () => {
    contract.like()
    expect(contract.get_like_count()).toBe(1)
  })

  it('should capture multiple likes', () => {
    VMContext.setSigner_account_id(DONOR1_ACCOUNT_ID)
    VMContext.setPredecessor_account_id(DONOR1_ACCOUNT_ID)
    contract.like()

    VMContext.setSigner_account_id(DONOR2_ACCOUNT_ID)
    VMContext.setPredecessor_account_id(DONOR2_ACCOUNT_ID)
    contract.like()

    expect(contract.get_like_count()).toBe(2)
  })

  it('should count multiple likes from the same sender as 1', () => {
    VMContext.setSigner_account_id(DONOR1_ACCOUNT_ID)
    VMContext.setPredecessor_account_id(DONOR1_ACCOUNT_ID)
    contract.like()

    VMContext.setSigner_account_id(DONOR2_ACCOUNT_ID)
    VMContext.setPredecessor_account_id(DONOR2_ACCOUNT_ID)
    contract.like()

    VMContext.setSigner_account_id(DONOR1_ACCOUNT_ID)
    VMContext.setPredecessor_account_id(DONOR1_ACCOUNT_ID)
    contract.like()

    expect(contract.get_like_count()).toBe(2)
  })
})
