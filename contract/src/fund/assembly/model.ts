import { context, PersistentUnorderedMap, storage } from 'near-sdk-as'

import { AccountId, FUND_KEY, key_for } from '../../utils'

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

  // =====Projects=====
  static create_project(owner: AccountId, project: string): void {
    projects.set(key_for(project), new Project(owner, project))
  }

  static remove_project(project: string): void {
    projects.delete(key_for(project))
  }

  static get_project(project: string): Project {
    return projects.getSome(key_for(project))
  }

  static get_project_list(offset: u32, limit: u32): Project[] {
    return projects.values(offset, offset + limit)
  }

  static get_project_count(): u32 {
    return projects.length
  }

  static has_project(project: string): bool {
    return projects.get(key_for(project)) != null
  }
}

@nearBindgen
export class Project {
  constructor(public owner: AccountId, public name: string) {}
}

@nearBindgen
export class ProjectInitArgs {
  constructor(
    public identifier: string,
    public title: string,
    public description: string,
    public image: string
  ) {}
}

@nearBindgen
export class ProjectAsArgs {
  constructor(public owner: AccountId, public project: string) {}
}
