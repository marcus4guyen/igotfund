import { PersistentUnorderedMap, VMContext } from 'near-sdk-as'
import * as util from '../../utils'
import * as contract from '../assembly'
import * as model from '../assembly/model'

const FUND_ACCOUNT_ID = 'fund'
const OWNER_ACCOUNT_ID = 'alice'
const PROJECT_NAME = 'defi'

const useFundAsPredecessor = (): void => {
  VMContext.setPredecessor_account_id(FUND_ACCOUNT_ID)
}

const attachMinBalance = (): void => {
  VMContext.setAttached_deposit(util.MIN_ATTACHED_DEPOSIT)
}

const doInitialize = (): void => {
  attachMinBalance()
  useFundAsPredecessor()
  contract.init()
}

const projects = (): PersistentUnorderedMap<u32, model.Project> => {
  return new PersistentUnorderedMap<u32, model.Project>('ps')
}

describe('Fund initialization', () => {
  beforeEach(useFundAsPredecessor)

  it('should create a fund', () => {
    attachMinBalance()

    contract.init()

    expect((): void => {
      model.Fund.get()
    }).not.toThrow()
  })

  it('should prevent double initialization', () => {
    attachMinBalance()

    contract.init()

    expect((): void => {
      contract.init()
    }).toThrow('Contract is already initialized.')
  })

  it('should require a minimum balance', () => {
    expect((): void => {
      contract.init()
    }).toThrow('You must deposit at least 10 NEAR to initialize this contract.')
  })
})

describe('Fund self-service methods', () => {
  beforeEach(doInitialize)

  it('should return a list of project', () => {
    const project = new model.Project(OWNER_ACCOUNT_ID, PROJECT_NAME)
    projects().set(util.key_for(project.name), project)

    expect(contract.get_project_list(0).length).toBeGreaterThan(
      0,
      'Project length must be greater than 0'
    )

    expect(contract.get_project_list(0)[0].name).toStrictEqual(
      PROJECT_NAME,
      'Project name should be ' + PROJECT_NAME
    )
  })

  it('should return a count of projects', () => {
    const project = new model.Project(OWNER_ACCOUNT_ID, PROJECT_NAME)
    projects().set(util.key_for(project.name), project)

    expect(contract.get_project_count()).toStrictEqual(
      1,
      'Project length should be 1'
    )
  })
})
