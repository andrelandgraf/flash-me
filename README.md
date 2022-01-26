![Flash Me](./public/logo.png)

# Welcome to Flash Me!

Flash Me! Learn through rehearsal. Create and study with flashcards online.

[Go to Flash Me](https://flash-me.fly.dev/) and start learning with flashcards today!

## Presentation

I gave a talk about ["Full stack web development with Remix"](https://www.youtube.com/watch?v=az9QZRSeuPM) at the React Jax's January 2022 meetup. I used Flash Me to explain some Remix fundamentals. You can find the presentation notes [here](./REACTJAX_WEB_DEV_WITH_REMIX_TALK.txt).

## Motivation <img src="./public/light-bulb.png" alt="light bulb" style="width: 30px; height: 30px;">

Flashcards are a great way to rehearse and learn. I constantly hear about awesome things in YouTube videos, podcasts, on Twitter, or by talking to people and I just wanted to create a place for myself where I can quickly and easily create flashcards for the things I'm learning.

I am currently doing a lot of leetcode and flashcards are a great addition to that! Rehearse the steps of an algorithm by creating a flashcard for it!

## Remix.run 💜

This project has been created using [Remix.run](https://remix.run/) and I can only recommend to check it out!

- [Remix Docs](https://remix.run/docs)

## Fly Setup

The webapp and database are hosted on [Fly](https://fly.io/). To get started, you need to create an account and deploy the webapp:

1. [Install `flyctl`](https://fly.io/docs/getting-started/installing-flyctl/)

2. Sign up and log in to Fly

```sh
flyctl auth signup
```

3. Setup Fly. It might ask if you want to deploy, say no since you haven't built the app yet.

```sh
flyctl launch
```

4. Postgres

```sh
flyctl postgres create
flyctl postgres attach --postgres-app [postgres-db-app-name]
# adds secret DATABASE_URL to fly app
```

Access postgres locally via vpn tunnel: https://fly.io/docs/reference/private-networking/#private-network-vpn

5. Status

```sh
flyctl status
flyctl vm status [vm]
```

6. Logs

```sh
flyctl logs
```

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

Prepare database migration to new schema:

```sh
npx prisma migrate dev
```

If you've followed the setup instructions already, all you need to do is run this:

```sh
npm run deploy
```

You can run `flyctl info` to get the url and ip address of your server.

Check out the [fly docs](https://fly.io/docs/getting-started/node/) for more information.
