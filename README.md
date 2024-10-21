# vv-monorepo-public

### Fully on-chain RPG with MMO sandbox games

#### How to install
- pnpm i

#### Project structure
- <b>packages/client</b>
- pnpm build
- pnpm run preview
- <b>packages/contracts</b>
- npx mud tablegen
- pnpm run build
- pnpm run deploy:basetestnet

#### this project is using MUD Framework to develope fully on-chain game for smart contract
- This on-chain is design system like ECS (Entity, Component, System)
- You can see mud.config.ts, this file is for create game state and store on-chain, this will create solidity code, when run mud tablegen, this is Component
- In systems folder is System

#### Cover Image for your game (See Appendix A1) - A simple image to bring excitement and craft a vision as succinctly as possible

![Lobby](/ss1.png "Lobby")
![Quest](/ss2.png "Quest")
![Character](/ss3.png "Character")
![World](/ss4.png "World")

#### About my Game section - A short description of your game

Voxelverses is fully on-chain RPG and MMO sandbox game set on a planet discovered 500 years after Earth’s destruction. Players explore sub-dimensions, battle mythical creatures, and colonize regions. As a web-based game, it requires no downloads and offers real asset ownership, social quests, and community-driven content. AI-driven NPCs provide dynamic interactions, while integrated social gaming features let players team up, share progress, and complete quests together through Discord, Twitch. With its blend of GameFi economics and collaborative gameplay, Voxelverses bridges Web2 and Web3, attracting traditional gamers to blockchain gaming and setting a new standard for social, player-driven experiences, and Mod2Earn.

#### How to Play section - A guide outlining clear steps on how to play test the game

1. Creaete Account \
1.1 Choose Character and Username
2. Do quest such as daily check-in, daily login, gathering resource
3. Login in world
4. Mine to gathering resource