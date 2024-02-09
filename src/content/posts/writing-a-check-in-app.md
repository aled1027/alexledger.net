---
title: "Writing a Check-in App"
draft: true
date: 2024-02-09T08:00:00.000Z
tags:
  - information-management
  - archiving
  - astro
  - netlify
  - ntfy.sh
---

My partner has been having health issues for the last few months, and we wanted to start tracking how they're feeling and how various daily activities might be affecting them. They're an app-streak person, someone who's done Duolingo in the past, so I thought that in the spirit of [home-cooked apps](https://blakewatson.com/journal/magnoliajs-2023-the-joys-of-home-cooked-apps/), I'd whip up an app that:

1. Shows a form with a series of questions
2. Persists the data on submission
3. Notifies them once a day to fill out the form

I started by building a little website with Astro that had a basic form. I deployed the site with Netlify and enabled Netlify forms, which makes it so that when the form is submitted, the data is persisted on Netlify - this is my favorite way to make forms in prototypes.

I then experimented with PWAs, which I eventually removed for reasons outlined below.

Finally, I set up notifications with ntfy.sh and GitHub actions so that there's a push notification to fill out the form once a day.

## The Daily Workflow

The daily workflow for the app is the following six steps:

1. Github action calls the ntfy.sh API to send a notification.
2. The ntfy.sh server receives the notification.
3. Ntfy uses web push to notify the phone app, which is subscribed to the topic.
4. User clicks the notification, navigating them to the check-in website.
5. The user fill outs the form on the check-in website and submits.
6. The form is submitted to Netlify forms, which persists the data.

## Notifications with ntfy.sh

[ntfy.sh](ntfy.sh) is the most exciting part of this project for me. It's "a simple HTTP-based pub-sub notification service" that makes sending notifications to phones, computers, or any device super easy with a REST API.[^1]

The gist is:

1. There's a topic that's any string; for example, it could be `mytopic123`.
2. A device subscribes to the topic, like with `curl -s ntfy.sh/mytopic123/json`.
3. Another device publishes to the topic, like with `curl -d "Hello :)" ntfy.sh/mytopic123`

I generated a random string for the topic so hopefully nobody else uses it. If someone does see the notification - because they are not private in this model - it's not a big deal because all they say is "Check in!".

On-click behavior (and more, check the docs) can be added to the notifications by adding this header: `"Click: https://my-app.pp/"` to the publish request. Then when the notification is clicked, the user is navigated to the url.

Finally, [ntfy.sh](ntfy.sh) has a free app, where you can subscribe to topics and get notifications, completing the picture.

## Technologies Used

- Astro
- [ntfy.sh](ntfy.sh)
- Netlify for hosting
- Netlify Forms
- GitHub Actions

## Things I Learned

### PWAs and Why I Pulled it out in the End

The only reason I wanted a PWA was to support push notifications. I was never able to get a simple push notification to show up in the PWA, (but I did get the simple push demo to work which is discussed below). Ultimately, I was going to need Web Push, not just notifications, which seemed like too much for this small project to me (see below) and that's how I ended up using [ntfy.sh](ntfy.sh).

By adding [ntfy.sh](ntfy.sh) I no longer needed any of the PWA features so I pulled it out.

Other than that, adding a PWA and making a native app vibe was pretty straightforward with Astro's [vite-pwa](https://github.com/vite-pwa/astro). I'd use it again for sure if needed.

### The iPhone API Notifications and Web Push Notification Was Hard for Me

I was able to get basic notifications working, like if a user clicks a button, I could send a notification. I was more daunted by web push notifications, which just seemed to require so much.

The best resource I found on the topic is https://simple-push-demo.vercel.app/. If I ever _need_ push notifications to use web push in the future, this is the first place I'll look.



[^1]: Quotation from [https://ntfy.sh/](https://ntfy.sh/)
