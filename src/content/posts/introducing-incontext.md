---
title: "Introducing inContext for Accelerating Language Learning"
draft: false
date: 2024-09-23T08:00:00.000Z
includeToc: false
tags:
  - incontext
  - language-learning
---

I couldn't be more excited to announce the public release of my newest project, **[inContext](https://incontext.fun)**!

**inContext** is a language-learning browser extension that builds tailored, context-informed definitions of words and displays them in the webpage.

<iframe width="560" height="315" src="https://www.youtube.com/embed/ncwV3cJinC8?si=CAY9FaDqG431jPYf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

tl;dr: Learning a language? Try **[inContext](https://incontext.fun)** for free!

## Why We Built inContext

Miguel and I started building **inContext** when I visited him in Spain over the summer. Inspired by other amazing language learning tools like Duolingo, Readlang, and Yomitan, we wanted to build a tool that leveraged the most recent capabilities of AI to build definitions that made sense for readers.

As learners of other languages, we try to read texts that are just beyond our current level - the idea of the [i+1 language learning thesis](https://en.wikipedia.org/wiki/Input_hypothesis) - which means that we're frequently finding words we don't know.

We used to do one of two things: (a) look up the word on google translate and translate to English or (b) look up the word in a dictionary.

I’m currently learning Spanish, so that’s driving a lot of my motivation. When reading in Spanish and looking up a word with google translate, I could feel my brain being pulled out of its immersive Spanish world. I was no longer in Spanish learning mode; I was in a translation-comparative mode that I could feel was limiting my ability to learn the language.

On the opposite end of the spectrum, if I looked up the word in the Spanish dictionary, often the definition in Spanish was too complex for me, using words I didn't know.

Given all that, Miguel and I prototyped **inContext**. We were startled by how useful it was and how much we used it as we browsed online. We’re now here to share it with language learners across the world.

## Features

I want to call out a few awesome features of **inContext**:

- Everything you need, right where you're reading. Simply highlight the word, press Option on Mac or Control on Windows and boom! a tooltip pops up with your tailored definition. See this in action [here](https://youtu.be/ncwV3cJinC8?t=162)

- We have an awesome free version, no credit card required. There's also an affordable subscription that includes more definitions with the best AI models. The free version offers more than enough definitions to get going and see if this kind of thing works for you.

- We have an amazing integration with [Anki](<https://en.wikipedia.org/wiki/Anki_(software)>). **inContext** supports exporting words, definitions, and contexts, into neat little flashcards for spaced-repetition learning ([our anki docs](https://incontext.fun/anki)).

- It works great in conjunction with other language learning apps. Because **inContext** is simply a browser extension, you can read anything online and it'll just work. I'm personally using it in conjunction with Readlang and Lingq for learning Spanish.

- We're launching with support for Spanish, Japanese, French, Catalan, and English. And more languages are in the pipeline.

- We're taking privacy super seriously. We're not sending any of your data to OpenAI, Anthropic, or any other AI company. We're using hosted models so that the data is staying within our fence.[^1]

## Try It Out! Tell Your Friends!

If you want to try it out, head over to **[inContext](https://incontext.fun)** and click the Try Now button to get started.

- There's a free subscription, no credit card required!
- There's a premium subscription that gives you access to more words and better AI models.

_Just curious but not ready to install?_ Check out our introductory [YouTube video](https://www.youtube.com/watch?v=ncwV3cJinC8&ab_channel=inContext) to see **inContext** in action.

_Want to read more about language learning?_ Check out our [blog](https://incontext.fun/blog)!

_Know someone who is learning a language?_ Share **inContext** with them. And if they are looking for resources on using **inContext** or learning about languages generally, send them our way. We love connecting with other language learners.

## Just Getting Started

This is just the start. Miguel and I are really excited about this baseline product. And now that we have this, we have so many ideas for where we want to go. But, we want to hear from you!

Are you learning another language? What kind of tools do you use and what can we build to help you out?
Let us know by contacting us by email and joining the **inContext** community.

[^1]: We're using AWS Bedrock with Anthropic models behind the scenes.
