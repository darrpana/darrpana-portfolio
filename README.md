# Darrpana's Café — portfolio

Static site: HTML, CSS and plain JavaScript. There's no build step and nothing to install.

## Run it

Open `index.html` in a browser, or serve the folder (either command works):

```bash
python3 -m http.server 4173
# or: ruby -run -e httpd . -p 4173
```

## Edit content

All copy, links and data live in **`js/config.js`**:

| What | Key |
|---|---|
| Email for every "Say hello" link | `site.email` |
| Resume PDF | `site.resumeUrl` (or replace `assets/resume.pdf`) |
| Hero text, illustration, labels and the scroll dive point | `hero` (wrap words in `*…*` to accent them in the headline) |
| Five project cards | `work.projects` |
| Project hover cursor (cup body; steam is animated in `cursor.js`) | `work.cursorCup` |
| Section stickers | `career.sticker`, `explorations.sticker` |
| About text and CTA | `about` |
| Timeline entries and the Psychology branch | `career.milestones`, `career.influence` |
| Gallery images (54 placeholders) | `gallery` |
| Branding projects and their detail pages | `explorations.branding.projects` |
| Social links | `social.links` |
| How full the corner cup is in each section | `cupLevels` |

## Replace placeholder art

Keep the canvas sizes and everything stays aligned:

- Hero: `assets/hero/cup-sticker.webp` and `label-*.webp`, positioned in pixels on the 1802 × 1112 canvas in `config.hero`.
- `assets/closing/closing-scene.svg`: **600 × 520**, table top at y = 402.
- `assets/stickers/*.svg`: section stickers (any size; keep the purple backing).
- `assets/about/portrait.svg`: 400 × 480.
- Project mockups are 3:2. Gallery tiles are square. Branding covers are 4:3.
- PNG, JPG and WebP all work. Change the path in the config.

## Structure

```
index.html              landing page (sections are mounted from components)
illustrations.html      gallery + lightbox (?open=N opens image N)
branding.html?p=slug    branding detail
case-study.html?p=…     case-study placeholder
css/styles.css          tokens, layout, animations, reduced-motion rules
js/config.js            ← content
js/core.js              registry, helpers, shared scroll loop
js/components/*.js      header, hero, persistent cup,
                        cursor, work stack, about, timeline, explorations,
                        social, closing, footer
js/pages.js             subpage components
```
