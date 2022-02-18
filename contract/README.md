# Contract

There are two main contracts: the fund contract and the project contract. Fund contracts create "child" contracts - project contracts. These can act as a factory, whereby a parent contract creates many child contracts.

**Fund Contract**

```ts
/**
 * In order to keep the contract working, at least 10 NEAR will be needed for deposit.
 */
//
export function init(): void {}

/**
 * To create a new project on our platform, you'll need at least 10 NEAR.
 * After you've received enough support from our community and raised 100 NEAR, you can release the funds for your project.
 * All donations will be transferred directly to your wallet immediately,
 * but the initial deposit (10 NEAR) for creating your project will be paid for the contract owner.
 */
export function add_project(identifier: string, title: string, description: string, imageUrl: string): void {}

/**
 * Once the project has reached 100 NEAR in funding or 10 Likes, the project owner can release the donation funds.
 */
export function release_donations(identifier: string): void {}

/**
 * Use the Offset-based Pagination to get the projects.
 */
export function get_project_list(offset: u32, limit: u32 = PAGE_SIZE): Project[] {}
```

**Project Contract**

```ts
/**
 * In order to keep the contract working, at least 10 NEAR will be needed for deposit.
 */
export function init(identifier: string, title: string, description: string, imageUrl: string): void {}

// ---------------------
// ------DONATIONS------
// ---------------------

/**
 * One of the most interesting features about the donation system is the opportunity for users to donate directly to projects they find interesting.
 * When enough funds are collected from the community, project owners can release the donations fund.
 */
export function donate(): void {}

/**
 * Get a list of donors who have generously donated to the project.
 */
export function get_donation_list(offset: u32, limit: u32 = PAGE_SIZE): Donation[] {}

/**
 * In order to release the donations fund, the project must receive at least 100 NEAR tokens or 10 likes from the community.
 * All donations will be transferred directly to the project owner's wallet immediately,
 * but the initial deposit for launching the project (10 NEAR) will be kept to pay for the contract owner (5 NEAR) and for the storage staking (5 NEAR).
 *
 * IMPORTANT:
 * Releasing the funds will mark the project as complete, meaning you won't be able to receive further donations from the community.
 * If you want to continue raising money, you'll need to create a new one.
 */
export function release_donations(): void {}

// --------------------
// ------COMMENTS------
// --------------------

/**
 * User will have to comment directly.
 */
export function add_comment(text: string): void {}

/**
 * Use the Offset-based Pagination to get the comments.
 */
export function get_comment_list(offset: u32, limit: u32 = PAGE_SIZE): Comment[] {}

// --------------------
// -------LIKES--------
// --------------------

/**
 * User will have to like directly.
 */
export function like(): void {}
```

## Usage

## Available Commands

**Building Contracts**

- `yarn build` builds all contracts (debug)
- `yarn build:release` builds all contracts (release)
- `yarn clean` removes the build folder

**Testing Contracts**

- `yarn test` runs unit tests for all contracts
- `yarn test -f <CONTRACT_NAME>` runs unit tests for a specific contract

**Deploying Contracts**

- `yarn deploy` deploys the `./build/release/fund.wasm` to a dev account

### Script

```sh
dev-deploy.sh             # deploy build/release/fund.wasm to a dev account
deploy.sh                 # deploy the contract to a $CONTRACT environment variable
add-project.sh            # add a new project attaching 10 NEAR
```

## Testing

### Unit Test

**Fund**

- run - `yarn test:unit -f fund`

```text
[Describe]: Contract initialization

 [Success]: ✔ should create a contract
 [Success]: ✔ should prevent double initialization
 [Success]: ✔ should require a minimum amount for deposit

[Describe]: Project methods

 [Success]: ✔ should add a new project
 [Success]: ✔ should return a list of project
 [Success]: ✔ should return a total number of projects in this contract

    [File]: src/fund/__tests__/index.unit.spec.ts
  [Groups]: 3 pass, 3 total
  [Result]: ✔ PASS
[Snapshot]: 0 total, 0 added, 0 removed, 0 different
 [Summary]: 6 pass,  0 fail, 6 total
    [Time]: 17.13ms
```

**Project**

- run - `yarn test:unit -f project`

```text
[Describe]: Project initialization

 [Success]: ✔ should create a project with proper metadata
 [Success]: ✔ should prevent a double initialization
 [Success]: ✔ should require a minimum balance
 [Success]: ✔ should require the project title not to be blank
 [Success]: ✔ should require the project description not exceed 500 characters
 [Success]: ✔ should require the project imageUrl to be a valid url

[Describe]: Project donations

[Describe]: donate()

 [Success]: ✔ should capture donations
 [Success]: ✔ should require user donate directly
 [Success]: ✔ should require user attach some money to donate

[Describe]: release_donations()

 [Success]: ✔ should be able to release the donations fund
 [Success]: ✔ should not be able to release the donations
 [Success]: ✔ should not be able to donate after the project is complete

 [Success]: ✔ should calculate a running total for donations properly
 [Success]: ✔ should return a list of donors who have donated to the project
 [Success]: ✔ should return total number of donations in the project

[Describe]: Project comments

 [Success]: ✔ should capture a comment
 [Success]: ✔ should reject long comments
 [Success]: ✔ should capture multiple comments

[Describe]: Project likes

 [Success]: ✔ should capture one like
 [Success]: ✔ should capture multiple likes
 [Success]: ✔ should count all likes from the same sender as 1

    [File]: src/project/__tests__/index.unit.spec.ts
  [Groups]: 7 pass, 7 total
  [Result]: ✔ PASS
[Snapshot]: 0 total, 0 added, 0 removed, 0 different
 [Summary]: 21 pass,  0 fail, 21 total
    [Time]: 104.201ms
```
