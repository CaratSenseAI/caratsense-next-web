# A-02 — The Chaos Artefacts

**Used in:** §1 (34 orbiting), §2 (200 suspended), §3 (16 panels) · **Priority: P0**
**Deliver:** `public/artefacts/**` — ~800px longest edge

---

## Status

**Paper (14) — ✅ DONE.** All 14 accepted, in `generated/`. Not being reworked.

**Screens (12) — ❌ NOT GENERATED.** Moved to HTML → [`../HTML-COMPONENTS.md`](../HTML-COMPONENTS.md) §1–§5.
**Physical (8) + `calc-01` — 9 prompts below.**

So this file now asks for **9 generated files**, not 34. The other 12 are components and the
14 paper images are done.

Every prompt below is **complete and standalone.** Copy one block, paste, generate. No
references to other prompts, no shared preamble to remember.

Two deliberate choices, so you know they're intentional rather than inconsistent:

- **Pure black backgrounds.** The two cleanest paper images (`ledger-02`, `notebook`) came out
  on flat black with no halo; the other twelve got a grey studio ground and a glow. Black keys
  out to transparent in one command, so every prompt below specifies it. The mixed backgrounds
  across the full set don't matter — everything gets cut out anyway.
- **No text on anything.** The only string in these nine prompts is `4,21,900` on the
  calculator LCD, and there is a blank fallback for it. Every other object is explicitly
  textless, which removes the entire typo/garble failure mode.

---

# PART 1 — Screens — MOVED TO HTML

All twelve screen artefacts (`wa-01`…`wa-06`, `xl-01`…`xl-03`, `call-01`, `q-mark`) have been
**removed from the generation queue.** They are built in HTML.

**Why:** they are interface — rectangles, text and colour. Image models cannot draw interface.
`wa-02` came back as a transparent checkerboard with the bubble missing entirely. `xl-03` needed
`Sales_Report_v2_FINAL_final.xlsx` rendered with every underscore intact. And §5 needs these as
real DOM regardless, so `Flip` can morph the bubbles into table rows — generating them meant
building them twice.

→ **Specs: [`../HTML-COMPONENTS.md`](../HTML-COMPONENTS.md) §1–§5**

The one exception is below, because it is a photograph of a physical material rather than a
rendering of a UI.

---

### `calc-01` — calculator LCD

**Aspect: 1:1**

```
Extreme macro photograph of the LCD display panel of an old cheap desk
calculator, cropped tight so only the display and its immediate plastic bezel
fill the frame.

The display shows, in dark grey seven-segment digits, exactly this number with
Indian digit grouping: 4,21,900

Behind and around the lit digits, the faint grey ghosting of the unlit segment
positions is just visible. The LCD has the characteristic olive-grey-green cast
of a cheap twisted-nematic panel, with a subtle iridescent polarised sheen
shifting across its surface.

The surrounding plastic bezel is beige, yellowed with age, with one fine scratch
across it and dust caught in the recess along the lower edge.

Lighting: hard low-angle light raking across the panel from the left, catching
the polariser sheen and the texture of the aged plastic. Deliberately uneven,
with the right side falling darker.

Camera: 100mm macro lens, f/5.6, dead-on and perfectly flat to the panel, zero
perspective distortion. The display fills about 80% of the frame width.

Background: the black plastic of the calculator body only, filling the frame
behind the display. No desk, no surface, no environment visible.

Do not include: any other digits, brand names, key labels, buttons, solar panel,
glow, halo, bloom, lens flare, vignette, gradient background, studio backdrop,
drop shadow, reflection of a room, watermark, people, hands.
```

If the digits come out wrong, generate it **blank** — change the display line to
`The display is blank, all segments unlit, showing only the faint grey ghosting of the inactive
seven-segment positions` — and overlay the number in the free **DSEG7 Classic** font at
`mix-blend-mode: multiply`.

---

# PART 2 — Physical objects (8)

Each uses a deliberately different photographic setup — different lens, light and angle — so
the set reads as objects photographed over time rather than one session with one softbox.

---

### `spike` — the paper spindle

```
Macro photograph of a steel paper spike file — a sharp vertical metal spindle
mounted on a heavy circular cast-iron base — with a thick stack of about forty
blank paper bills impaled on it and compressed down toward the base.

Every sheet is completely blank: no printing, no writing, no ruled lines. Cream
and white papers of slightly different sizes and ages, edges misaligned, several
dog-eared, the lowest sheets yellowed and crushed flat under the weight above.

The spindle tip protrudes above the paper stack, tarnished, slightly bent to one
side.

Lighting: hard directional light from the right at a low 20-degree angle,
throwing every paper edge into sharp relief and casting deep shadow between the
sheets. Deliberately high contrast, almost harsh.

Camera: 85mm lens, f/8, three-quarter view from slightly above eye level. The
object fills about 75% of the frame height.

Background: pure flat black #000000, edge to edge, completely even. The object
sits in total void with no surface beneath it.

Do not include: text, writing, printing, ruled lines, numbers, logos, glow,
halo, rim light, bloom, vignette, grey background, gradient background, studio
backdrop, drop shadow, reflection, mockup template, glossy finish, illustration,
3D render look, people, hands.
```

---

### `stamp` — wooden rubber stamp

```
Product photograph of a traditional wooden-handled rubber stamp lying on its
side, so that both the turned wooden knob handle and the rubber printing face
are visible in profile.

The rubber face is stained deep violet with dried ink, worn unevenly, with ink
crusted into the crevices — but seen from this side angle the raised type on the
face is not legible, reading only as an abstract worn rubber surface.

The wooden handle is unvarnished honey-coloured hardwood with visible grain, worn
smooth on its upper surface from years of thumb pressure, with a single violet
ink fingerprint smudge near the base.

Lighting: soft, broad, diffuse illumination from directly above, like light
through an overcast window. Gentle and even, almost no hard shadow anywhere. The
opposite of dramatic.

Camera: 60mm lens, f/11, low three-quarter angle almost at surface level. The
object fills about 60% of the frame width, oriented diagonally across the frame.

Background: pure flat black #000000, edge to edge, completely even. The object
sits in total void with no surface beneath it.

Do not include: legible text, letters, numbers, dates, logos, ink pad, paper,
glow, halo, rim light, bloom, vignette, grey background, gradient background,
studio backdrop, drop shadow, reflection, mockup template, glossy finish,
illustration, 3D render look, people, hands.
```

---

### `clip` — bulldog clip on a paper wad

```
Tight macro photograph of a blackened steel bulldog clip gripping a thick wad of
about sixty blank sheets of paper, cropped so the clip occupies the upper half of
the frame and the compressed paper edges fill the lower half.

The paper is entirely blank — no printing, no writing, no ruled lines. The sheets
fan very slightly, their edges uneven, several corners creased and soft, with a
band of grey handling grime along one side of the stack.

The clip's black enamel is chipped along the jaw revealing bare bright steel
beneath, and its two looped steel handles are folded flat, lightly rusted at the
pivot points.

Lighting: raking light from directly left, almost parallel to the paper edges,
maximising the texture of the stacked sheets and the chipped enamel. Strong
falloff into shadow toward the right.

Camera: 100mm macro lens, f/6.3, dead-on frontal view with zero perspective.
Extremely shallow depth of field, with focus on the clip jaw and rapid falloff
behind it.

Background: pure flat black #000000, edge to edge, completely even. The object
sits in total void with no surface beneath it.

Do not include: text, writing, printing, ruled lines, numbers, logos, glow,
halo, rim light, bloom, vignette, grey background, gradient background, studio
backdrop, drop shadow, reflection, mockup template, glossy finish, illustration,
3D render look, people, hands.
```

---

### `chai` — cutting chai glass

```
Photograph of a small Indian cutting-chai glass — the classic thick-walled,
slightly waisted tumbler about 100mm tall — half full of milky amber tea.

The glass is cheap pressed glass with visible vertical mould seams, tiny trapped
bubbles in its thick base, and cloudy limescale marks around the rim from
repeated washing. The tea's surface carries a faint skin and one small cluster of
bubbles clinging to the edge.

Lighting: strong backlight from directly behind the glass, so the tea glows warm
translucent amber, the glass walls read as bright refracting edges, and the thick
base throws a bright caustic. One very dim cool fill from the front left keeps
the nearest surface from going completely black.

Camera: 85mm lens, f/4, positioned dead level with the liquid surface. The glass
fills about 70% of the frame height, centred.

Background: pure flat black #000000, edge to edge, completely even. The glass
sits in total void with no surface beneath it.

Do not include: text, branding, logos, saucer, spoon, steam, table, tray, other
glasses, glow, halo, rim light, bloom, lens flare, vignette, grey background,
gradient background, studio backdrop, drop shadow, reflection on a surface,
mockup template, illustration, 3D render look, people, hands.
```

---

### `chai-ring` — dried tea ring stain

```
Flatbed scanner capture of a single dried tea ring stain on a sheet of blank
white paper.

The stain is an irregular brown-amber ellipse marking where a glass base once
sat — darker and more concentrated around its outer edge where the liquid
evaporated last, lighter and blotchy through the interior, with one small drip
mark running away from it. The paper fibres have wicked the stain unevenly,
giving the boundary a soft feathered edge.

The paper is otherwise completely blank — no ruled lines, no writing, no
printing, no marks of any kind other than the stain itself and the paper's own
fibre texture.

Lighting: absolutely flat, even and shadowless — the perfectly diffuse
illumination of a document scanner. No directionality whatsoever, no highlights,
no falloff.

Camera: flat scan, dead-on, zero perspective. The stain is centred and fills
about 45% of the frame.

Background: the white paper fills the entire frame edge to edge. No surface
beneath, no environment, no border.

Do not include: text, writing, ruled lines, numbers, logos, cup, glass, table,
shadow, glow, halo, bloom, vignette, gradient, drop shadow, reflection, mockup
template, illustration, 3D render look, people, hands.
```

---

### `pen` — used ballpoint

```
Extreme macro photograph of a well-used cheap blue ballpoint pen lying
horizontally with its cap missing, cropped to show the writing tip and about
two-thirds of the barrel.

The clear plastic barrel reveals the blue ink column inside, roughly a third
depleted with a visible air gap above it. Tooth marks and small dents are pressed
into the plastic near the grip area. The metal tip is scratched, with a small
crust of dried blue ink at the very point. Fine dust clings to the barrel where
static has gathered.

Lighting: a single small hard specular source from the upper right, creating one
bright narrow highlight running the length of the barrel, with everything else
falling rapidly away into black. Very high contrast, very small light source.

Camera: 100mm macro lens, f/8, dead-on side profile view. The pen runs
diagonally across the frame at about 15 degrees and fills roughly 85% of the
frame width.

Background: pure flat black #000000, edge to edge, completely even. The pen sits
in total void with no surface beneath it.

Do not include: text, branding, logos, brand names on the barrel, cap, paper,
writing, glow, halo, rim light, bloom, lens flare, vignette, grey background,
gradient background, studio backdrop, drop shadow, reflection, mockup template,
illustration, 3D render look, people, hands.
```

---

### `tape` — roll of clear tape

```
Photograph of a partly-used roll of clear cellophane tape on its plastic core,
with the loose free end lifted and curling away from the roll, its edge torn
raggedly rather than cut cleanly.

Enough tape remains on the roll to show the layered spiral edge in cross-section.
Trapped between the layers are a few dust specks and one thin line of bubbles.
The plastic core is scuffed and chalky white. The torn free end has picked up a
single stray hair.

Lighting: soft light from the upper left plus one dim cool edge light from the
right, so the transparent tape reads through subtle refraction and internal
reflection rather than surface glare. Deliberately restrained — the highlights
must not blow out.

Camera: 70mm lens, f/9, three-quarter view from about 40 degrees above. The
object fills about 65% of the frame and sits slightly left of centre.

Background: pure flat black #000000, edge to edge, completely even. The roll
sits in total void with no surface beneath it.

Do not include: text, branding, logos, dispenser, scissors, paper, glow, halo,
rim light, bloom, lens flare, vignette, grey background, gradient background,
studio backdrop, drop shadow, reflection, mockup template, illustration, 3D
render look, people, hands.
```

---

### `rubber-band` — tangle of rubber bands

```
Overhead photograph of a loose tangle of about fifteen thin rubber bands — the
pale beige-pink kind used to bundle cash and files in Indian shops — heaped
naturally as if simply dropped in place.

The bands are in visibly different states of age: some still elastic and faintly
glossy, several gone dull and chalky with a powdery surface bloom, two clearly
perished with hairline cracks along their surface, and one snapped open and lying
slack. They overlap and twist irregularly with no arrangement.

Lighting: broad, soft, completely diffuse illumination from directly overhead —
perfectly even, with no directional drama at all, so that the differences in
surface finish between the fresh and the perished bands do all of the visual
work.

Camera: 50mm lens, f/10, pointing straight down. The heap fills about 55% of the
frame, with deep focus keeping the entire tangle sharp.

Background: pure flat black #000000, edge to edge, completely even. The bands sit
in total void with no surface beneath them.

Do not include: text, writing, logos, cash, banknotes, paper, files, container,
glow, halo, rim light, bloom, vignette, grey background, gradient background,
studio backdrop, drop shadow, reflection, mockup template, illustration, 3D
render look, people, hands.
```

---

## After generating

Strip the black to transparent:

```bash
for f in *.png; do
  magick "$f" -alpha off \
    \( +clone -colorspace Gray -level 4%,26% \) \
    -compose CopyOpacity -composite \
    -trim +repage "cut_$f"
done
```

`chai-ring` is the exception — it is white paper, so key the **white** instead, or just leave
it opaque and use it as a `multiply` layer over the paper artefacts.

Then compress:

```bash
for f in cut_*.png; do cwebp -q 82 -alpha_q 100 "$f" -o "${f%.png}.webp"; done
```

## Output spec

```
public/artefacts/
  paper/     14 files   ✅ done
  screen/    12 files
  object/     8 files
```

Total budget: **≤ 900KB across all 34.**

§2 needs 200 suspended artefacts — instance these 34 at varied scale, rotation and opacity
rather than generating more.
