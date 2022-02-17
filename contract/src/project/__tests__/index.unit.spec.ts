import { u128, VMContext } from 'near-sdk-as'
import * as util from '../../utils'
import * as contract from '../assembly'
import { Project } from '../assembly/models'

const CONTRACT_ACCOUNT_ID = 'fund'
const OWNER_ACCOUNT_ID = 'alice'
const DONOR1_ACCOUNT_ID = 'bob'
const DONOR2_ACCOUNT_ID = 'john'
const PROJECT_IDENTIFIER = 'defi'
const PROJECT_TITLE = 'Decentralized Finance'
const PROJECT_DESCRIPTION = 'This is an awesome project.'
const LONG_TEXT =
  'Pariatur sit deserunt cillum magna ea. Labore laboris nulla nisi enim dolore in cupidatat duis minim. Aliquip occaecat commodo sit deserunt ut aute qui exercitation ad aute sunt ea cupidatat cupidatat duis. Culpa ea velit cillum aliqua nulla elit enim dolore et magna officia occaecat eu culpa occaecat. Aute adipisicing veniam culpa magna incididunt enim laboris tempor reprehenderit mollit ea duis Lorem. Commodo pariatur mollit sint do consequat id eu amet fugiat. Velit velit officia reprehenderit laborum sit officia dolore irure cillum ullamco irure anim incididunt magna.'
const PROJECT_IMAGE_URL = 'https://url-to-image'
const COMMENT_TEXT = 'I love this project.'

const useContractAsPredecessor = (): void => {
  VMContext.setPredecessor_account_id(CONTRACT_ACCOUNT_ID)
}

const useProjectOwnerAsSigner = (): void => {
  VMContext.setSigner_account_id(OWNER_ACCOUNT_ID)
}

const attachMinBalance = (): void => {
  VMContext.setAttached_deposit(util.MIN_ATTACHED_DEPOSIT)
}

const doInitialize = (): void => {
  attachMinBalance()

  useContractAsPredecessor()

  useProjectOwnerAsSigner()

  contract.init(
    PROJECT_IDENTIFIER,
    PROJECT_TITLE,
    PROJECT_DESCRIPTION,
    PROJECT_IMAGE_URL
  )
}

const doDonate = (donorAccountId: string): void => {
  VMContext.setAttached_deposit(util.MIN_ATTACHED_DEPOSIT)

  VMContext.setSigner_account_id(donorAccountId)

  VMContext.setPredecessor_account_id(donorAccountId)

  contract.donate()
}

const doReleaseDonations = (): void => {
  useContractAsPredecessor()

  useProjectOwnerAsSigner()

  contract.release_donations()
}

const doComment = (accountId: string): void => {
  VMContext.setSigner_account_id(accountId)

  VMContext.setPredecessor_account_id(accountId)

  contract.add_comment(COMMENT_TEXT)
}

const doLike = (accountId: string): void => {
  VMContext.setPredecessor_account_id(accountId)

  VMContext.setSigner_account_id(accountId)

  contract.like()
}

describe('Project initialization', (): void => {
  beforeEach((): void => {
    attachMinBalance()

    useContractAsPredecessor()

    useProjectOwnerAsSigner()
  })

  it('should create a project with proper metadata', (): void => {
    contract.init(
      PROJECT_IDENTIFIER,
      PROJECT_TITLE,
      PROJECT_DESCRIPTION,
      PROJECT_IMAGE_URL
    )

    const project = contract.get()

    expect(project.owner).toStrictEqual(OWNER_ACCOUNT_ID)
    expect(project.title).toStrictEqual(PROJECT_TITLE)
    expect(project.description).toStrictEqual(PROJECT_DESCRIPTION)
    expect(project.imageUrl).toStrictEqual(PROJECT_IMAGE_URL)
    expect(project.total_donations).toStrictEqual(u128.Zero)
    expect(project.funding).toStrictEqual(true)
  })

  it('should prevent a double initialization', (): void => {
    contract.init(
      PROJECT_IDENTIFIER,
      PROJECT_TITLE,
      PROJECT_DESCRIPTION,
      PROJECT_IMAGE_URL
    )

    expect((): void => {
      contract.init(
        PROJECT_IDENTIFIER,
        PROJECT_TITLE,
        PROJECT_DESCRIPTION,
        PROJECT_IMAGE_URL
      )
    }).toThrow('Contract is already initialized.')
  })

  it('should require a minimum balance', (): void => {
    VMContext.setAttached_deposit(u128.Zero)

    expect((): void => {
      contract.init(
        PROJECT_IDENTIFIER,
        PROJECT_TITLE,
        PROJECT_DESCRIPTION,
        PROJECT_IMAGE_URL
      )
    }).toThrow(
      'You must deposit at least ' +
        util.asNEAR(util.MIN_ATTACHED_DEPOSIT) +
        ' NEAR to initialize this contract.'
    )
  })

  it('should require the project title not to be blank', (): void => {
    expect((): void => {
      contract.init(
        PROJECT_IDENTIFIER,
        '',
        PROJECT_DESCRIPTION,
        PROJECT_IMAGE_URL
      )
    }).toThrow('Title must not be blank.')
  })

  it('should require the project description not exceed 500 characters', (): void => {
    expect((): void => {
      contract.init(
        PROJECT_IDENTIFIER,
        PROJECT_TITLE,
        LONG_TEXT,
        PROJECT_IMAGE_URL
      )
    }).toThrow(
      'Description must be less than ' +
        util.MAX_STRING_LENGTH.toString() +
        ' characters.'
    )
  })

  it('should require the project imageUrl to be a valid url', (): void => {
    expect((): void => {
      contract.init(
        PROJECT_IDENTIFIER,
        PROJECT_TITLE,
        PROJECT_DESCRIPTION,
        'url-to-image'
      )
    }).toThrow('Your URL is not valid, and must start with "https://".')
  })
})

describe('Project donations', (): void => {
  beforeEach(doInitialize)

  describe('donate()', (): void => {
    it('should capture donations', (): void => {
      doDonate(DONOR1_ACCOUNT_ID)

      expect(contract.get().total_donations).toStrictEqual(
        util.MIN_ATTACHED_DEPOSIT
      )
    })

    it('should require user donate directly', (): void => {
      useContractAsPredecessor()

      VMContext.setSigner_account_id(DONOR1_ACCOUNT_ID)

      expect((): void => {
        contract.donate()
      }).toThrow('User must donate directly.')
    })

    it('should require user attach some money to donate', (): void => {
      VMContext.setAttached_deposit(u128.Zero)

      VMContext.setPredecessor_account_id(DONOR1_ACCOUNT_ID)

      VMContext.setSigner_account_id(DONOR1_ACCOUNT_ID)

      expect((): void => {
        contract.donate()
      }).toThrow('User must attach some money.')
    })
  })

  describe('release_donations()', (): void => {
    beforeEach((): void => {
      VMContext.setAccount_balance(u128.mul(util.ONE_NEAR, u128.from(10)))

      VMContext.setAttached_deposit(u128.mul(util.ONE_NEAR, u128.from(150)))

      VMContext.setSigner_account_id(DONOR1_ACCOUNT_ID)

      VMContext.setPredecessor_account_id(DONOR1_ACCOUNT_ID)

      contract.donate()
    })

    it('should be able to release the donations fund', (): void => {
      expect((): void => {
        doReleaseDonations()
      }).not.toThrow()
    })

    it('should not be able to release the donations', (): void => {
      expect((): void => {
        useContractAsPredecessor()

        contract.release_donations()
      }).toThrow(
        'Only the person who launched this project can release the donations.'
      )

      expect((): void => {
        VMContext.setPredecessor_account_id(OWNER_ACCOUNT_ID)

        useProjectOwnerAsSigner()

        contract.release_donations()
      }).toThrow(
        'Funds donated to this project can be released only by the owner of this contract.'
      )
    })

    it('should not be able to donate after the project is complete', (): void => {
      doReleaseDonations()

      // manually mark the project as complete bacause the callback function from the ContractPromiseBatch does not work on unitest.
      const project = Project.get()
      project.funding = false
      Project.set(project)

      expect((): void => {
        doDonate(DONOR1_ACCOUNT_ID)
      }).toThrow(
        'The project is not actively seeking crowdfunding at this time. For more information, please contact the project owner.'
      )
    })
  })

  it('should calculate a running total for donations properly', (): void => {
    doDonate(DONOR1_ACCOUNT_ID)

    doDonate(DONOR2_ACCOUNT_ID)

    const twice_attached_deposit = u128.mul(
      util.MIN_ATTACHED_DEPOSIT,
      u128.from(2)
    )

    expect(contract.get_total_donations()).toBe(twice_attached_deposit)
  })

  it('should return a list of donors who have donated to the project', (): void => {
    doDonate(DONOR1_ACCOUNT_ID)

    doDonate(DONOR2_ACCOUNT_ID)

    expect(contract.get_donation_list(0).length).toBe(2)
  })

  it('should return total number of donations in the project', (): void => {
    doDonate(DONOR1_ACCOUNT_ID)

    doDonate(DONOR2_ACCOUNT_ID)

    expect(contract.get_donation_count()).toBe(2)
  })
})

describe('Project comments', (): void => {
  beforeEach(doInitialize)

  beforeEach((): void => {
    VMContext.setSigner_account_id(DONOR1_ACCOUNT_ID)

    VMContext.setPredecessor_account_id(DONOR1_ACCOUNT_ID)
  })

  it('should capture a comment', (): void => {
    contract.add_comment(COMMENT_TEXT)

    expect(contract.get_comment_list(0)[0].text).toStrictEqual(COMMENT_TEXT)
  })

  it('should reject long comments', (): void => {
    expect((): void => {
      contract.add_comment(LONG_TEXT)
    }).toThrow(
      'Comment text is too long. Please keep it under ' +
        util.MAX_STRING_LENGTH.toString() +
        ' characters.'
    )
  })

  it('should capture multiple comments', (): void => {
    doComment(DONOR1_ACCOUNT_ID)

    doComment(DONOR2_ACCOUNT_ID)

    doComment(OWNER_ACCOUNT_ID)

    expect(contract.get_comment_list(0).length).toBe(3)

    expect(contract.get_comment_count()).toBe(3)
  })
})

describe('Project likes', (): void => {
  beforeEach(doInitialize)

  it('should capture one like', (): void => {
    doLike(DONOR1_ACCOUNT_ID)

    expect(contract.get_like_count()).toBe(1)
  })

  it('should capture multiple likes', (): void => {
    doLike(DONOR1_ACCOUNT_ID)

    doLike(DONOR2_ACCOUNT_ID)

    doLike(CONTRACT_ACCOUNT_ID)

    expect(contract.get_like_count()).toBe(3)
  })

  it('should count all likes from the same sender as 1', (): void => {
    doLike(DONOR1_ACCOUNT_ID)

    doLike(DONOR2_ACCOUNT_ID)

    doLike(DONOR1_ACCOUNT_ID)

    expect(contract.get_like_count()).toBe(2)
  })
})
