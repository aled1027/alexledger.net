---
title: "Kombucha and Tabular Recipe Notation"
date: 2023-05-29T15:49:10-07:00
draft: false
tags: [kombucha, fermentation, cooking, trn, design]
toc: true
---

## Tabular Recipe Notation

Before getting to Kombucha I want to describe my favorite recipe design: tabular recipe notation or TRN. TRN is from [Cooking for Engineers](https://www.cookingforengineers.com/) and is a layout of a recipe in HTML that, in my opinion, makes the recipe incredibly easy to follow.

<img src="/src/images/trn_pancakes.png" alt="Tabular Recipe Notation of Pancakes" style="max-width:300px;margin-inline:auto;"/>

You can imagine that there's a directed acyclic graph underlying the recipe, and that HTML table is derived from it. At some point I'd love to write a converter from YAML directions, or something of the like, into a tabular recipe notation HTML table. I have a basic version that works on very simple recipes, but it doesn't work on anything complex.

## Kombucha

Here's my current Kombucha TRN recipe, largely informed by Sandor Katz's The Art of Fermentation.

<style>
:root {
    --recipe-color: #7d44b2;
  }

.recipe table {
/_ border: 2px solid #40A040; _/
border: 2px solid var(--recipe-color);
font: 9pt/120% Trebuchet MS, Arial, sanserif;
border-spacing: 0px;
empty-cells: show;
border-collapse: collapse;
background-color: #FFFFFF;
}

.recipe table th {
border: 1px solid var(--recipe-color);
border-bottom: 2px solid var(--recipe-color);
}

.recipe table td {
border: 1px solid var(--recipe-color);
border-left: 0;
border-top: 0;
padding: 2px 4px;
}

.recipe table td.righthide {
border-right: 0;
border-bottom: 1px solid var(--recipe-color);
}

.recipe table td.vertical {
text-align: center;
layout-flow: vertical-ideographic;
vertical-align: middle;
}

.recipe table td.recipe-title {
font: 12pt/140% Trebuchet MS, Arial, sanserif;
text-align: center;
layout-flow: vertical-ideographic;
vertical-align: middle;
}

.recipe table td.recipe-center {
text-align: center;
}
</style>

<div class="recipe">
    <table>
        <tr>
            <td colspan="100" class="recipe-title">Kombucha (≈3 cups)</td>
        </tr>
        <tr>
            <td rowspan='1'>1 C hot water</td>
            <td rowspan='2'>Brew tea concentrate</td>
            <td rowspan='3'>Dissolve in sugar</td>
            <td rowspan='6'>Incorporate it all together</td>
        </tr>
        <tr>
            <td rowspan='1'>2 tea bags</td>
        </tr>
        <tr>
            <td rowspan='1'>1/3 C sugar</td>
            <!-- This is the line that's manually added: -->
            <td rowspan="1" class="righthide"></td>
        </tr>
        <tr>
            <td rowspan='1'>2 C room temp water</td>
        </tr>
        <tr>
            <td rowspan='1'>SCOBY and starter</td>
        </tr>
    </table>
</div>
You can see that even this isn't quite right, as there's the dotted line that shouldn't be there. I'll figure it out, but this little card is more than useable when I'm clicking whipping up kombucha.

All credit for Tabular Recipe Notation goes to [Michael Chu](https://www.cookingforengineers.com/).
