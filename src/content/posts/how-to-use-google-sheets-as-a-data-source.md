---
title: "How to use Google Sheets as a Data Source"
draft: false
date: 2024-09-18T08:00:00.000Z
includeToc: false
tags:
  - website
  - database
---

I find myself looking this up every few months, so writing it down for future me.

This is how I use Google Sheets as a data source for websites. It's quite convenient for small projects where you don't want to set up a database, and let others contribute to the dataset.

```javascript
import Papa from "papaparse";

async function loadData(): Promise<any[]> {
  const baseSheetUrl = "https://docs.google.com/spreadsheets/d/<something-here>";
  const url = baseSheetUrl + "/gviz/tq?tqx=out:csv&sheet=Sheet1";
  const response = await fetch(url);

  if (!response.ok) {
    console.error("Error loading data!");
    return [];
  }

  const csvData = await response.text();
  const parsedData = Papa.parse(csvData, { header: true });
  const data = parsedData.data;
  return data;
}
```
