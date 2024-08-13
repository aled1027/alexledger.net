---
title: "Login for More People"
draft: false
date: 2024-08-13T08:00:00.000Z
includeToc: false
tags:
  - community
  - library
  - tech-help
---

At library tech help, a common issue I assist library patrons with is logging into services or devices.

A common pattern is:

1. Patron wants to do something on a web service, like print a document.
2. Patron doesn't have their password for that service, so we try resetting their password.
3. Patron logs into gmail.
4. Patron forgets their gmail password, so they get in by getting a text message or verifying on their phone.
5. Once they can access their email, patron finds the email for resetting their web service password and we complete the task.

While that pattern is common, it's also common for Patrons to not have a phone, so they can't access their gmail.
Or they don't use gmail and the reset password system doesn't work for them.

The patron is locked out of everything.

It's really hard to remember passwords and it's really hard to have a robust reset password system for folks without phones.

How can we make this easier?

Of course, we try to help folks remember passwords by writing them down, but how can we make the system work better for them?[^1]

**What if we could have two types of login. I'll call them soft login and hard login.**

Hard login is the classic login with password, MFA, and/or passkeys - whatever it is, the system is confident that that user is who they claim to be.

Soft login has fewer requirements. It asks the user something semi-public, like their name and date of birth. Or their library card number. Or their driver's license number.

**With soft login, users can do soft tasks** - read documents that aren't too sensitive, make reasonable changes to settings and so on. But it requires a hard login to do hard tasks, like changing the password, using a stored credit card.

Soft login could even support purchases, so long as the credit card isn't saved on the account.

The idea isn't perfect, but it's so important to think about. Technical systems are critical to operate in our society, and we've built systems that make it challenging and stressful for large swaths of the population.

[^1]: This is a problem that the security community has thought about a lot and I'd imagine the idea I'm laying out has been considered.
