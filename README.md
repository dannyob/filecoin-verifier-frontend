# Filecoin Verifier Application

Table of Contents
=================

   * [Filecoin Verifier Application](#filecoin-verifier-application)
      * [Getting Started](#getting-started)
         * [Setting up Lotus](#setting-up-lotus)
            * [Pre-requirements](#pre-requirements)
            * [Connecting to Nerpa Net](#connecting-to-nerpa-net)
            * [Getting your lotus token](#getting-your-lotus-token)
         * [Deploying Filecoin Pro Registry](#deploying-filecoin-pro-registry)
            * [Pre-reqs](#pre-reqs)
            * [Generating a wallet and seed phrase](#generating-a-wallet-and-seed-phrase)
      * [Direct usage](#direct-usage)

## Getting Started

### Setting up Lotus

If you haven’t set up Lotus before, the following instructions will guide you through how to get yourself up and running (and connected to the right network!). If you have set up Lotus before, skip to the section where you get the Lotus token and proceed.

#### Pre-requirements

Before installing lotus, make sure you have Go installed. If you’re on a Mac, you should be able to run the following in your terminal:
```
 brew install go
```

Additionally, make sure you
1. Join filecoin.io/slack
2. Message jnthnvctr (who will add you to our private channel, fil-verifier-beta, for iteration)
3. Send (once added to the private channel, fil-verifier-beta) your github user name so you can access the web app.

#### Connecting to Nerpa Net

Filecoin has various networks, for the purposes of our testing we’re going to be running verification and our testing on “Nerpa net” - a managed devnet that mirrors the testnet (and is close to what will ship for mainnet). You can read the docs here, or follow these step by step instructions.


If you’re on a Mac, you can run the following commands from your Terminal:
```
git clone https://github.com/filecoin-project/lotus.git
cd lotus
git checkout ntwk-nerpa
make lotus
./lotus daemon
```

These instructions will clone the ```lotus``` repository, checkout the configuration for the nerpa network, build lotus, and finally run the lotus daemon. After running all of these commands, you’ll see your terminal start attempting to sync with the Nerpa Network.

**Note:** You can check the status of your chain sync by comparing the block height in your terminal to the block height in the [Nerpa Network Stats Dashboard](https://stats.nerpa.interplanetary.dev/d/z6FtI92Zz/nerpa?orgId=1&refresh=30s&kiosk). This should take 20 or so minutes.

Once your node is synced, you should see messages with periodic new block updates.

Congratulations you’re now connected to the Nerpa Net!

#### Getting your lotus token

While the Verifier App requires local deployment, you’ll need to be able to connect your lotus node to the application. To do this, you’ll need your lotus token.

To get your lotus token, open a new Terminal window (CMD+T), and run the following:
```
cat ~/.lotus/token
```

Note that the command line response will dump out your token. Note that the output here does not add a new line, so be careful when you copy this out!

During mainnet, and in normal operation, this is a very risky thing to do - so please don’t do this in production!

### Deploying Filecoin Pro Registry
Note: Make sure you’ve been added to the github repo or this won’t work! Make sure your Daemon is still running in order to connect to the Nerpa Network!


#### Pre-reqs

Make sure you’ve been added to the slack and github repo!
Make sure you’ve installed npm, node, and react-scripts (and potentially typescript):


```
brew install npm
brew install node
```

```
npm install -g react-scripts
npm install -g typescript
```

In a new Terminal window, in an appropriate place run:
```
git clone https://github.com/keyko-io/filecoin-verifier-frontend.git
```

Next, to configure the app to talk to your running lotus daemon. From the location you cloned the repo run
```
cd filecoin-verifier-frontend/src/
vi config.ts
```

This will allow you to edit the ```config.ts``` file. To edit the file, type ```i```.

First edit the name of the first Lotus Node entry so it says “Lotus Nerpa Net”. It should look like this:

```
export const config = {
  apiUri: process.env.REACT_APP_API_URI || 'http://localhost:4000',
  lotusNodes: [{
    name: 'Lotus Nerpa Net',
```

Next, 3 lines down from “name”, edit the value associated with “token”.
Instead of the value that is there, delete that token and use the token associated with your lotus node

Remember, this is the token you got by running:
```
cat ~/.lotus/token
```

When you’ve made both edits, hit ESC, and type ```:wq``` to save your edits.

With this edit, you can now launch the web app!
```
cd ..
npm run start
```

#### Generating a wallet and seed phrase

In mainnet, likely verifiers (and root key holders) would use a hardware wallet (e.g. a Ledger) to securely interact with the verifier app.

In the short term, you can generate a seed phrase using the [Glif Web Wallet](https://wallet.glif.io/?network=t) (use Dev mode!), and import that seed phrase inside the verifier app.


## Direct usage

This application is deployed automatically on [Fleek](https://filecoinproregistry.on.fleek.co/).
So if you have a local lotus node running connected to a testnet you can make use directly of that version of the application.
