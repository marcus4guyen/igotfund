import { PersistentUnorderedMap, VMContext } from 'near-sdk-as'
import * as util from '../../utils'
import * as contract from '../assembly'
import * as model from '../assembly/model'

const CONTRACT_ACCOUNT_ID = 'fund'
const OWNER_ACCOUNT_ID = 'alice'
const PROJECT_IDENTIFIER = 'defi'

const projects = (): PersistentUnorderedMap<u32, model.Project> => {
  return new PersistentUnorderedMap<u32, model.Project>('ps')
}

const useContractAsPredecessor = (): void => {
  VMContext.setPredecessor_account_id(CONTRACT_ACCOUNT_ID)
}

const useOwnerAsPredecessor = (): void => {
  VMContext.setPredecessor_account_id(CONTRACT_ACCOUNT_ID)
}

const attachMinBalance = (): void => {
  VMContext.setAttached_deposit(util.MIN_ATTACHED_DEPOSIT)
}

const doInitialize = (): void => {
  attachMinBalance()

  useContractAsPredecessor()

  contract.init()
}

const doAddProject = (): void => {
  useOwnerAsPredecessor()

  const project = new model.Project(OWNER_ACCOUNT_ID, PROJECT_IDENTIFIER)

  projects().set(util.key_for(project.identifier), project)
}

describe('Contract initialization', (): void => {
  beforeEach(useContractAsPredecessor)

  it('should create a contract', (): void => {
    attachMinBalance()

    contract.init()

    expect((): void => {
      model.Fund.get()
    }).not.toThrow()
  })

  it('should prevent double initialization', (): void => {
    attachMinBalance()

    contract.init()

    expect((): void => {
      contract.init()
    }).toThrow('Contract is already initialized.')
  })

  it('should require a minimum amount for deposit', (): void => {
    expect((): void => {
      contract.init()
    }).toThrow(
      'You must stake at least 10 NEAR tokens in order to initialize this contract.'
    )
  })
})

describe('Project methods', (): void => {
  beforeEach((): void => {
    doInitialize()

    doAddProject()
  })

  it('should add a new project', (): void => {
    expect(contract.get_project_list(0)[0].identifier).toStrictEqual(
      PROJECT_IDENTIFIER,
      'Project identifier should be ' + PROJECT_IDENTIFIER
    )

    expect(contract.get_project_list(0)[0].owner).toStrictEqual(
      OWNER_ACCOUNT_ID,
      'Project owner should be ' + OWNER_ACCOUNT_ID
    )
  })

  it('should return a list of project', (): void => {
    expect(contract.get_project_list(0).length).toBeGreaterThan(
      0,
      'Project length should be greater than 0'
    )
  })

  it('should return a total number of projects in this contract', (): void => {
    expect(contract.get_project_count()).toStrictEqual(
      1,
      'Project length should be 1'
    )
  })
})
