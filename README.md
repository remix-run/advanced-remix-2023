# Advanced Remix Workshop - Remix Conf 2023

Welcome to the workshop repo! Let's get you set up.

## Setup

You will need the following tools to run the apps in this project:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)

### 👉 Clone the repo:

```sh
# http
git clone https://github.com/remix-run/advanced-remix-2023

# git
git clone git://github.com/remix-run/advanced-remix-2023

# or however you clone repos
```

### 👉 Install dependencies

```sh
cd advanced-remix-2023
npm i
```

### 👉 Run an app

```sh
# from the root of this repository
npm run dev -w 1-fetchers
```

This project uses npm workspaces, so that command is the same as changing into the "1-fetchers" directory and running `npm run dev` there.

```sh
cd 1-fetchers
npm run dev
```

### 👉 Check the README for each topic

Each topic will have a list of instructions, links, and tips for completing the work. Note that `3-server-caching` has a final task that requires Redis to be installed on your machine. It's advised to get that working before the workshop. If you can't, don't worry, it's only a minor part of the workshop and you'll be fine skipping it.

### 👉 Join the Workshop Discord!

Join the [Remix Discord](https://discord.gg/MFu36wmj) and we'll be talking about the workshop in `#workshop-advanced-remix`. If you're having trouble with setup, please join and ask for help!
