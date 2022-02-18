import {
  context,
  u128,
  storage,
  PersistentUnorderedMap,
  PersistentSet,
} from 'near-sdk-as'
import { AccountId, PROJECT_KEY, random } from '../../utils'

const donations = new PersistentUnorderedMap<u64, Donation>('d')
const comments = new PersistentUnorderedMap<u64, Comment>('c')
const likes = new PersistentSet<string>('l')

@nearBindgen
export class Project {
  contract_owner: AccountId = context.predecessor
  created_at: u64 = context.blockTimestamp
  total_donations: u128 = u128.Zero
  // If it's true, then users can still donate.
  // Otherwise, the project marked as complete and they can't donate any more.
  funding: bool = true

  constructor(
    public owner: AccountId,
    public identifier: string,
    public title: string,
    public description: string,
    public imageUrl: string
  ) {}

  static create(
    owner: AccountId,
    identifier: string,
    title: string,
    description: string,
    imageUrl: string
  ): void {
    const project = new Project(owner, identifier, title, description, imageUrl)
    this.set(project)
  }

  static set(project: Project): void {
    storage.set(PROJECT_KEY, project)
  }

  static get(): Project {
    return storage.getSome<Project>(PROJECT_KEY)
  }

  // ---------------------
  // ------DONATIONS------
  // ---------------------
  static add_donation(): void {
    const project = this.get()

    project.total_donations = u128.add(
      project.total_donations,
      context.attachedDeposit
    )

    this.set(project)

    const donation = new Donation()
    donations.set(donation.created_at * random(), donation)
  }

  static get_donation_list(offset: u32, limit: u32): Donation[] {
    return donations.values(offset, offset + limit)
  }

  static get_donation_count(): u32 {
    return donations.length
  }

  static release_donations(): void {
    const project = Project.get()

    project.total_donations = u128.Zero
    project.funding = false // mark the project as complete

    this.set(project)
  }

  // --------------------
  // ------COMMENTS------
  // --------------------
  static add_comment(text: string): void {
    const comment = new Comment(text)
    comments.set(comment.created_at * random(), comment)
  }

  static get_comment_list(offset: u32, limit: u32): Comment[] {
    return comments.values(offset, offset + limit)
  }

  static get_comment_count(): u32 {
    return comments.length
  }

  // --------------------
  // -------LIKES--------
  // --------------------
  static like(): void {
    likes.add(context.sender)
  }

  static get_like_count(): u32 {
    return likes.size
  }
}

@nearBindgen
export class Donation {
  created_at: u64 = context.blockTimestamp
  donor: AccountId = context.sender
  amount: u128 = context.attachedDeposit
}

@nearBindgen
export class Comment {
  created_at: u64 = context.blockTimestamp
  author: AccountId = context.sender

  constructor(public text: string) {}
}
