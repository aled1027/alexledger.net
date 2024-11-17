---
title: "The Future of Civic Tech: Lessons from the Datasette Office Hours"
date: 2024-11-17T08:00:00.000Z
draft: false
includeToc: false
tags:
  - datasette
  - civic-tech
  - data
  - community
  - portland
---

After watching the [Datasette Office hours](https://www.youtube.com/watch?v=OziYd7xcGzc&ab_channel=SimonWillison), I’m buzzing with ideas around the intersection of AI, civic tech, data analysis, and data accessibility. Here are some thoughts.

I want to build something on top of Phillip’s [civic band](https://civic.band/) project. He has [meetings notes for the Portland metro](https://oregon-metro.or.civic.band/meetings/minutes), under the label “Oregon Metro”. I’m not sure what a good 1 to 2 hour project would be here. Some ideas:

- Similar to Simon Willison and Alex Garcia’s demo where they took embeddings of news stories and did a straightforward find similar new stories
- Extracting out topics and grouping them
- something I’ve been toying with in my head, is extracting out / generating wikipedia-like articles from the minutes
- A summary, like converting the minutes into a blurb news article, maybe Axios style.

Simon showed a very compelling demo (though it may have been removed from the YouTube video) where he built Claude-like artifacts within Datasette. The concept is simple: a textarea for prompts and an iframe for the generated HTML widgets. But then it gets more interesting: Datasette can automatically inject information about its data and scheme into the prompt, allowing users to leverage the underlying data.

One new piece in this is the ability to use the Datasette write API and update or add data within the instance. And that data access has many security considerations, which Simon alluded to addressing by giving the iframe, the generated HTML, particularized access to the data so it’s safe and appropriately scoped.

This is the vision of building prompt-driven interactive data dashboards.

I’m still considering in what ways the [baked-data architecture](https://simonwillison.net/2020/Dec/13/datasette-io/) of Datasette is essential to this process. To me, it’s undoubted that the baked-data architecture affords many benefits around security, runaway queries, and general isolation. So what happens to these applications when those restrictions are loosened and a more standard Postgres \+ Backend \+ Frontend architecture is used.

We seem to be reaching an inflection point: AI, tools like Datasette, and tools built on those tools are dramatically lowering the barrier for civic tech development. We may see incredible transformations over the next few years in how we engage with civic tech and access democratized data, which I hope improves the quality of civic engagement.
