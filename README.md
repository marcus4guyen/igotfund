![Near, Inc. logo](https://near.org/wp-content/themes/near-19/assets/img/logo.svg?t=1553011311)

# Certified Programs: igodfund

igotfund is an easy way to raise money for your project, idea, or invention. Using this platform, you can tap into the community and reach people who are interested in funding your creative ideas. You can create as many projects as you want so that you can reach out to the widest possible audience. It's only 10 NEAR for each project, and when it reaches a goal of 100 NEAR or 10 likes from the community, then you can release the donations fund to your NEAR wallet.

## Some Roles & Rules

> Project Owner (one who creates a project on the platform)
>
> - can set up as many projects as they like, with each project costing 10 NEAR
> - the donations will be released once the project has raised at least 100 NEAR or has reached 10 likes on the community board
> - as soon as the donations for a project have been released:
>
>   - the project is marked complete and can't be donated to anymore
>   - users can still like and comment on the project
>   - the initial 10 NEAR deposit will be kept, 5 NEAR will pay for the Contract owner and the remaining will go to storage staking
>
> Contract Owner (a person who deploys the smart contract)
>
> - can deploy and initialize contracts, which require a minimum of 10 NEAR deposits to be staked
> - will be rewarded with 5 NEAR tokens when the Project owner decides to release the donations fund
>
> Donor (anyone with a NEAR account)
>
> - can donate, like, and comment on any project that they find appealing
> - the minimum donation amount is 1 NEAR
> - must donate, like, and comment directly (not through a cross-contract call)
> - can't like the same project multiple times

## Project Structure

```text
contract
├── src
│   ├── fund                          <-- master contract (deploys by Contract owner)
│   │   ├── **test**
│   │   │   ├── index.unit.spec.ts
│   │   ├── assembly
│   │   │   ├── index.ts
│   │   │   ├── model.ts
│   ├── project                       <-- project contract (deploys by the master contract)
│   │   ├── **test**
│   │   │   ├── index.unit.spec.ts
│   │   ├── assembly
│   │   │   ├── index.ts
│   │   │   ├── model.ts
│   ├── utils.ts
├── script
│   ├── add-project.sh
│   ├── deploy.sh
│   ├── dev-deploy.sh                 <-- deploy fund.wasm to a dev account
web                                   <-- NEXT.JS project
├── components
│   ├── ui
├── near
│   ├── config.js
│   ├── utils.js
├── pages
├── redux
│   ├── actions
│   │   ├── contract.js               <-- using near-api-js to make RPC calls to the contracts
│   ├── reducers
│   ├── store
├── utils
README.md                             <-- YOU ARE HERE
```

## Get Started

### Using Gitpod

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io#https://github.com/marcus4guyen/igotfund)

### Local Setup

**Step 1. Init the contract - `'/contract'`**

1. install dependencies `cd contract && yarn`
2. run test - `yarn test`
3. compile the contract - `yarn build:release`
4. deploy the contract - `yarn deploy`
5. set environment variable - `export CONTRACT=<dev-123-456>`
6. init the contract - `near call $CONTRACT init --accountId $CONTRACT --amount 10`

**Step 2. Prepare for the web app - `'/'`**

1. install dependencies - `cd .. && yarn`
2. run - `yarn prepare`

**Step 3. Start the web app - `'/web'`**

1. install dependencies `cd web && yarn`
2. start the server - `yarn dev`
3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result

_Please run `yarn prepare` & restart the web server everytime you deploy a new smart contract_

## Credit

I was inspired by the [sample-meme-museum](https://github.com/Learn-NEAR/NCD.L1.sample--meme-museum) to make this project. I learned about XCC, contract file structure, and unit test from their repo.
