# 05 — The Thread

> A WhatsApp conversation scrolls past. Then it crystallises into structured data.
> The most literal, most legible, and most persuasive animation you could run.

**Build:** Medium · **Needs:** nothing · **Role:** proof section, or a per-case-study module

---

## Why this one closes deals

Every other concept in this folder is a metaphor. This one is a **demonstration**.

Your own words: *"Every business below was running on memory, spreadsheets, or WhatsApp
before we got there."* Nine case studies, and WhatsApp is the antagonist in most of them —
the bakery taking cake orders in chat, the student-housing operator running tenancies in a
thread, the fabric mill coordinating plants by message.

Your prospect is running their business in WhatsApp **right now, on the phone in their hand.**

So show them their own thread, and then show it becoming a system. There is no abstraction
gap to cross. They will not need the metaphor explained because they are living in it.

---

## The move

A phone-shaped frame, centred, dark. Inside it, a WhatsApp-like thread scrolls upward at
reading speed as you scroll down — messages arriving, one after another, all of them the
texture of real order chaos:

```
                            Hi need a cake for saturday   14:02

  ok! what flavour?                                14:09

                                   black forest 1kg   14:11

  ₹1240. ok?                                       14:31

                                    ok. and delivery?   15:47

                          actually make it 1.5kg sorry   16:20

  ok                                               19:02

                              did u get my last msg?    21:44
```

Each bubble is a small failure: a price computed by hand, a change lost in the scroll, a
question answered five hours late, a confirmation that never came.

Then, at the pinned moment, **the thread crystallises.**

Every bubble rotates flat, loses its tail, squares its corners, aligns to a baseline grid,
and becomes a **row in a table**. The timestamps become a status column. The prices become a
currency column. The chaos becomes a schema.

```
  ORD-4471   Anjali M.    Black Forest · 1.5kg   ₹1,860   Sat 14:00   ● Confirmed
  ORD-4472   Rehan S.     Red Velvet · 500g      ₹680     Sat 11:00   ● In oven
  ORD-4473   Priya K.     Custom · 2 tier        ₹3,100   Sun 16:00   ● Quoted
```

Same elements. Same text, mostly. Re-laid-out.

---

## Implementation

Pure `Flip`, and the cleanest use of it in this folder because the two states are so
structurally different that the interpolation does something genuinely surprising.

```tsx
useGSAP(() => {
  const bubbles = gsap.utils.toArray<HTMLElement>('[data-msg]')

  const chat = Flip.getState(bubbles, { props: 'borderRadius,backgroundColor,color' })

  // Swap the container's layout mode. That is the entire DOM change.
  container.current!.dataset.mode = 'table'

  const crystallise = Flip.from(chat, {
    duration: 1,
    ease: 'power3.inOut',
    stagger: { amount: 0.5, from: 'start' },
    props: 'borderRadius,backgroundColor,color',
    absolute: true,
    paused: true,
  })

  ScrollTrigger.create({
    trigger: stage.current,
    start: 'top top',
    end: '+=200%',
    pin: true,
    scrub: 1,
    animation: crystallise,
  })
})
```

And the two layouts, driven entirely off one data attribute:

```css
/* chat mode */
[data-mode='chat'] [data-msg] {
  max-width: 68%;
  border-radius: 18px;
  background: #1F1A2E;
  padding: 10px 14px;
}
[data-mode='chat'] [data-msg][data-out] { margin-left: auto; background: #2C1F4A; }

/* table mode */
[data-mode='table'] {
  display: grid;
  grid-template-columns: auto 1fr auto auto auto auto;
  gap: 0;
}
[data-mode='table'] [data-msg] {
  max-width: none;
  margin-left: 0;
  border-radius: 2px;
  background: transparent;
  border-bottom: 1px solid rgba(124,34,212,.18);
  padding: 14px 12px;
  font-variant-numeric: tabular-nums;
}
```

Passing `props: 'borderRadius,backgroundColor,color'` is what makes this sing — `Flip`
interpolates those alongside position and size, so you watch a rounded purple chat bubble
*become* a square transparent table cell in one continuous move.

---

## Details

**The tail is the tell.** A chat bubble's little pointed tail is what makes it read as a
bubble. Render it as a small rotated square via `::after` and scale it to zero over the first
30% of the tween. It disappearing is the exact moment the audience registers "this is not a
chat any more."

**Right-aligned messages have furthest to travel.** Outbound bubbles sit at `margin-left:
auto` and must cross the whole width to reach column 1. That long diagonal is the most
dramatic path in the animation — make sure a few of your most important messages are outbound.

**Tabular numerals on arrival.** `font-variant-numeric: tabular-nums` on the resolved state
means the currency column aligns perfectly. It is a two-word CSS change and it is most of
what makes the table look *engineered* rather than merely tidy.

**Fill in what was missing.** In the resolved table, some cells contain data that was never
in the thread at all — a status, an order ID, a delivery slot. Fade those in *last*, after
the Flip settles, in `--accent-gold`. The message: the system does not just organise what you
had, it knows things you did not.

**Sound is tempting. Don't.** A WhatsApp notification tone would land the joke instantly and
would also be the single most annoying decision on the site. No autoplay audio.

---

## The per-case-study variant

This module is small enough to run **nine times**, once per case study, each with its own
thread content:

| Case study | Thread | Becomes |
|---|---|---|
| Home bakery | Cake orders, flavour changes | Order pipeline |
| Student housing | Tenancy queries, rent chasing | Tenancy ledger |
| Fabric mill | Batch queries across plants | Batch traceability |
| Dead stock | "anyone need 40 pcs?" | Matched demand engine |
| Real estate | Site visit scheduling | CRM pipeline |

Same component, different JSON. That is nine bespoke-feeling animations for the cost of one,
and it gives every case study page a signature moment instead of just body text.

If you are looking for the highest leverage in this entire folder, it is this: **one
`<Thread>` component, nine content files.**

---

## Pitfalls

**Do not clone WhatsApp's UI.** Use the *grammar* of a chat thread — alignment, bubbles,
timestamps — but not their green, not their logo, not their exact bubble geometry. Trade dress
is a real risk and you gain nothing from the resemblance being exact. Purple-tinted dark
bubbles read as "a chat" perfectly well.

**Write the thread properly.** This is a writing task, not a design task. The messages must
be boring and true — the specific tedium of "did u get my last msg?" is what makes it land.
Invent nothing dramatic. Your Medium pieces already have the right ear for this; use the same
person.

**Language.** Real Indian SMB threads are Hinglish. `bhai kal ka order confirm hai?` is more
honest than a clean English sentence, and it will land far harder with your actual market. It
also risks alienating an international reader. My recommendation: mix it, lightly — one or two
Hinglish messages among English ones, exactly as a real thread looks.

**Keep the table short.** Six to eight rows. A long table after the Flip becomes a scroll
problem inside a pinned section, which is the one layout bug users genuinely hate.
