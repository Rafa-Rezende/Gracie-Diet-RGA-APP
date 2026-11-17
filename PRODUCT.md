# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static single-page app in vanilla JS, no build dependencies: `src/pagina.html` (structure and CSS), `src/regras.js`, `src/categorias.js`, `src/alimentos.js`, `src/app.js`, joined by `montar.js` into `publico/` (deployed on Vercel) and `index.html` (claude.ai preview). Data in the phone's localStorage, no accounts. Tests with `node --test`.

## Users

Jiu-jitsu practitioners, two equal groups: students who want to follow the Gracie eating method day to day (they train mostly in the evening and use the phone in the kitchen and before/after training to build and log meals), and competitors preparing for an IBJJF tournament who also need to reach a weight category safely. Interface language: Portuguese from Portugal, addressing the user as "tu".

## Product Purpose

Make the Gracie method of eating practical on a phone: say whether foods can go on the same plate, organise the 3 daily meals (at least 4 h 30 apart, only water in between) around the training time, log what was eaten, and, for competitors, show how much weight is left to a category and whether the pace to the tournament date is safe. Success: a practitioner follows the method without looking up the book, and a competitor reaches the category without water cuts.

## Positioning

Reaches practitioners directly (not through academies). The rules engine applies the book's food-group table and combination rules exactly (ported from the user's mycros app, same test cases), and the competitor mode joins the method with IBJJF weight classes and a safe weekly pace. The app is honest that the book's justifications lack scientific support: it helps follow the method, it does not promise health outcomes.

## Operating Context

Used one-handed on a phone, in the kitchen while preparing a meal, at the academy before or after training, and in the weeks before a tournament with daily morning weigh-ins. IBJJF weighs in immediately before the first fight, with the gi in gi divisions.

## Capabilities and Constraints

- Meal logging only offers the groups that belong to each meal (sweet meal: sweet fruit, fresh cheese, starch, neutrals; cooked meal: proteins/vegetables/fats, one starch, neutrals) and blocks foods that would break the combination, with the reason.
- "Posso juntar?" checker is free: any foods, live verdict.
- Competitor mode: gi/no-gi, male/female adult IBJJF classes, gi weight, tournament date, weight log with chart.
- IBJJF table is a baseline still to be confirmed against the official table (`src/categorias.js`).
- Optional academy logo slot (white-label): the academy supplies its own logo; the app never ships third-party marks.
- No alerts/confirms; no external scripts; fonts from Google Fonts only.

## Brand Commitments

- Name: **Gracie Diet**, always with "app não oficial · baseado no livro *The Gracie Diet*, de Rorion Gracie (2010)". No Gracie-family, academy (Ralph Gracie, Renzo Gracie, RGA) or book trademarks/logos in the app.
- Personality: serious and traditional, respectful of jiu-jitsu tradition; explicitly not a generic fitness-app look.

## Evidence on Hand

The book as the only source of rules. No testimonials, users, academies or partnerships exist: do not fabricate any.

## Product Principles

1. The plate first: what can go together right now, in one tap.
2. Follow the method exactly; be honest about what science says.
3. Safety over speed for competitors: no water cuts, pace capped around 1 % of body weight per week.
4. Respect the tradition: sober, serious, never gamified hype.
