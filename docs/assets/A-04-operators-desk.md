# A-04 — The Operator's Desk

**Used in:** §2 base plate + input to `A-05` · **Priority: P0**
**Pipeline:** ① GPT Image Gen → ② Whisk variants
**Deliver:** `public/render/A-04_desk-wide.webp`, `A-04_desk-top.webp` — 2048px

---

## The brief, and the trap

This is a real Indian SMB desk, rendered with total sincerity.

**The trap:** it is very easy to make this condescending — the quaint little business drowning
in paper, waiting to be rescued. That framing will lose you every prospect who recognises
their own desk in it.

**The fix:** render it as *competent under bad conditions*. This desk belongs to someone
running a real business well, with the wrong tools. Light it beautifully. Make the ledger
handsome. Make the handwriting confident. The viewer should feel **seen**, not diagnosed.

Test: show it to one of your actual clients. If they smile, it works. If they wince, regenerate.

---

## Prompt 1 — the wide establishing shot

Aspect **16:9**.

```
A photorealistic interior photograph of a small Indian business owner's working
desk, late afternoon, warm tungsten and window light.

On the desk, arranged as they would genuinely be after a working day — not
staged, not tidied:
- A hardbound accounting ledger, red cloth spine, lying open, columns ruled by
  hand, entries in blue and red pen
- A metal spike file with a thick stack of impaled bills
- A well-used desk calculator with worn keys
- A smartphone lying face-up, screen on, a messaging app visible but with NO
  recognisable branding — generic dark chat bubbles only
- A carbon-copy order book, pink and yellow duplicate sheets fanned slightly
- A cutting-chai glass, half full, leaving a ring on a paper delivery note
- Yellow and pink sticky notes, some on the desk, some stuck to the monitor edge
- An older laptop, open, showing a dense spreadsheet
- A rubber stamp, wooden handle, ink-stained
- Rubber bands, a bulldog clip, a blue ballpoint with the cap missing

Behind the desk: a plain painted wall, a wall calendar, a few papers pinned up.
Softly out of focus.

Lighting: warm 3200K tungsten from above-left, plus soft daylight from a window
off frame right. Rich warm shadows. The desk surface catches a gentle sheen.

Mood: warm, lived-in, competent, hard-working. This person is good at their job.
Dignified, NOT chaotic, NOT pitiable, NOT messy for comedy.

Composition: shot from a standing height, looking down at roughly 35 degrees.
The desk fills the lower two-thirds. Keep the upper-centre area relatively quiet
for headline text.

Rendering: photorealistic, 35mm lens, f/2.8, shallow depth of field falling off
toward the background. Fine film grain. Warm cinematic grade, slightly lifted
shadows, natural colour.

No: people, faces, hands, brand logos, WhatsApp green or logo, Western office
aesthetics, stock-photo staging, clutter played for comedy, text overlays.
```

---

## Prompt 2 — the top-down plate

This is the frame `A-05`'s paper storm lifts off. **Aspect 16:9.**

```
A photorealistic overhead photograph of a small Indian business owner's working
desk, shot straight down from directly above at 90 degrees — a flat lay with no
perspective distortion. The desk surface fills the entire frame edge to edge.

On the desk, arranged as they would genuinely be after a working day — not
staged, not tidied:
- A hardbound accounting ledger, red cloth spine, lying open, columns ruled by
  hand, entries in blue and red pen
- A metal spike file with a thick stack of impaled bills
- A well-used desk calculator with worn keys
- A smartphone lying face-up, screen on, showing a generic dark messaging
  interface with NO recognisable branding and no legible text
- A carbon-copy order book, pink and yellow duplicate sheets fanned slightly
- A cutting-chai glass, half full, leaving a ring on a paper delivery note
- Yellow and pink sticky notes, some on the desk, some stuck to a monitor edge
- An older laptop, open, showing a dense spreadsheet
- A rubber stamp, wooden handle, ink-stained
- Rubber bands, a bulldog clip, a blue ballpoint with the cap missing

Objects are distributed across the surface unevenly and realistically — denser
toward the centre-right where someone has been working, sparser at the edges.
The wooden desk surface shows between them: warm mid-brown grain, some wear, a
few pen marks, a faint tea ring.

Lighting: a single soft overhead source slightly off-centre to the left, casting
gentle directional shadows to the lower right of each object. Warm 3200K
tungsten, even across the frame, no hotspots.

Composition: leave a clear area roughly in the centre of the frame — an empty
patch of bare desk surface about 30% of the frame width — where a headline will
sit.

Mood: warm, lived-in, competent, hard-working. This person is good at their job
and is using the wrong tools. Dignified, NOT chaotic, NOT pitiable, NOT messy
for comedy.

Rendering: photorealistic overhead product photography, deep focus so everything
is sharp, fine film grain, warm cinematic grade with slightly lifted shadows.

Do not include: people, faces, hands, brand logos, WhatsApp green or the WhatsApp
logo, legible text or handwriting, Western office aesthetics, stock-photo
staging, clutter played for comedy, harsh shadows, vignette, text overlays,
watermark.
```

---

## Prompt 3 — the "after" desk

The same desk, cleaned up, running the system you built. Used at the end of §2 and as the
before/after pair on case study pages. **Aspect 16:9.**

```
A photorealistic overhead photograph of a small Indian business owner's working
desk, shot straight down from directly above at 90 degrees — a flat lay with no
perspective distortion. The desk surface fills the entire frame edge to edge.

The desk is now largely clear. The hardbound red-spine accounting ledger is
CLOSED and pushed to one side. The metal spike file is empty. The sticky notes
are gone. The carbon-copy order book is shut and stacked. The loose bills and
challans have been cleared away.

In the centre of the desk, a modern laptop is open, displaying a clean dark
dashboard interface — near-black background, a violet accent colour, a data
table and a few metric tiles, all softly out of focus so no text is legible. The
screen is the brightest thing in the frame.

Still present, deliberately: the cutting-chai glass, half full. The blue
ballpoint with the cap missing. The tea ring on the wood. The same worn desk
surface with its grain, pen marks and wear. This is the same person's desk, still
in daily use — just no longer buried.

Lighting: a single soft overhead source slightly off-centre to the left, casting
gentle directional shadows. Warm 3200K tungsten, even, no hotspots, matching the
warmth of a working office in late afternoon.

Rendering: photorealistic overhead product photography, deep focus, fine film
grain, warm cinematic grade with slightly lifted shadows.

Do not include: people, faces, hands, brand logos, legible text on the laptop
screen, a sterile empty desk, an obviously staged "after" shot, new-looking
furniture, harsh shadows, vignette, text overlays, watermark.
```

Keeping the chai glass matters. A spotless desk reads as a different room; the same desk with
the paper gone reads as *your* desk, fixed.

---

## The nine industry variants

Moved to [`A-08-case-study-heroes.md`](A-08-case-study-heroes.md), which now carries nine fully
standalone prompts — one per case study workspace. No cross-referencing, no Whisk style-locking
required.

---

## Acceptance criteria

- [ ] **No WhatsApp branding.** No green, no logo, no exact bubble shape. This is a legal risk
      and it is also just lazier design.
- [ ] No faces, no people. Hands only if genuinely needed.
- [ ] Any Devanagari text is correctly formed — **have a Hindi reader verify.** Garbled Hindi
      on an Indian company's site is far worse than English-only.
- [ ] The desk reads as competent, not comic
- [ ] Centre area is quiet enough for a headline
- [ ] Objects look used — new-looking props kill it instantly
- [ ] Warm grade, but not orange-teal graded like a film trailer

---

## Serious alternative: shoot it

A real photograph of a real client's desk will beat any render here, and it costs a day.

Overhead rig, locked-off camera, one softbox. Shoot the desk before, then again after cleanup
with the laptop running the system you actually built. You get a genuine before/after
match-cut, and it stops being *illustration* and becomes **evidence**.

Given that your entire writing voice trades on being real and unglamorous, I would push hard
for this over generation. Generate the desk only if the shoot cannot happen.
