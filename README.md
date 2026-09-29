# Naneinf — links

A small, playful link-in-bio page: plain HTML, CSS and JavaScript. No build step, no dependencies
(only Google Fonts). Includes synthesized sound effects (Web Audio API, no audio files).

## Structure

```
index.html      markup + links
style.css       styles (base → cute layer → colorful layer → sound button)
script.js       interactions: picker, parallax, emoji effects, critters
sfx.js          optional sound effects (needs the markup + script.js)
assets/         banner.jpg, pfp.jpg (default), pfp-2..4.jpg (picker options)
```

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Customize

- **Links:** edit the `.link-card` blocks in `index.html`. Give each a `style="--n:<index>"` for the entrance stagger.
- **Profile pictures:** put images in `assets/` and add another `.profile-option` button in the `#picker` dialog
  (`data-src="assets/your-image.jpg"`).
- **Sound:** change `MASTER_VOLUME` in `sfx.js`. Visitors can mute with the 🔊 button or the `M` key
  (the choice is stored in `localStorage`). Remove the `sfx.js` script tag to disable sound entirely.
- **Reduced motion:** honored in CSS and in the emoji effects.

## Deploy

Works on any static host, e.g. GitHub Pages (Settings → Pages → deploy from the `main` branch root).
For link previews, add absolute `og:image` / `og:url` meta tags once you know the final URL.

## Layout notes

The card is horizontally symmetric: the name is flanked by mirrored ✦ / ♡ sparks (fixed-width boxes),
the profile picture, ears and blush sit inside one `.pfp-wrap` that scales with the breakpoint, and the ticker
uses the shared `--content-pad` variable so its bleed matches the card padding on every screen size.
If you add elements to the header, keep them in mirrored pairs or center them in `.pfp-wrap` / `.name-row`.

## License

Code is released under the [MIT License](LICENSE).
The images in `assets/` are **not** covered by that license — add credits for the banner and profile
pictures here if they aren't your own artwork.
