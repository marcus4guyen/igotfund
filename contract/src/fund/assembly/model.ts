import { context, PersistentUnorderedMap, storage } from 'near-sdk-as'
import { AccountId, FUND_KEY, key_for } from '../../utils'

// A list of projects in this contract
const projects = new PersistentUnorderedMap<u32, Project>('ps')

@nearBindgen
export class Fund {
  created_at: u64 = context.blockTimestamp

  constructor() {}

  static create(): void {
    this.set(new Fund())
  }

  static set(fund: Fund): void {
    storage.set(FUND_KEY, fund)
  }

  static get(): Fund {
    return storage.getSome<Fund>(FUND_KEY)
  }

  // =================
  // =====Project=====
  // =================
  static create_project(owner: AccountId, identifier: string): void {
    projects.set(key_for(identifier), new Project(owner, identifier))
  }

  static remove_project(identifier: string): void {
    projects.delete(key_for(identifier))
  }

  static get_project(identifier: string): Project {
    return projects.getSome(key_for(identifier))
  }

  static get_project_list(offset: u32, limit: u32): Project[] {
    return projects.values(offset, offset + limit)
  }

  static get_project_count(): u32 {
    return projects.length
  }

  static has_project(identifier: string): bool {
    return projects.get(key_for(identifier)) != null
  }
  // =================
}

@nearBindgen
export class Project {
  constructor(public owner: AccountId, public identifier: string) {}
}

@nearBindgen
export class ProjectInitArgs {
  constructor(
    public identifier: string,
    public title: string,
    public description: string,
    public imageUrl: string
  ) {}
}

@nearBindgen
export class ProjectAsArgs {
  constructor(public owner: AccountId, public identifier: string) {}
}
