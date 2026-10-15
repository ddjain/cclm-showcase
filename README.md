# CCLM Test Work Showcase

Interactive web presentation (Reveal.js + GSAP) for the CCLM chaos & resilience program.

## Run

```bash
cd cclm-showcase
python3 -m http.server 8765
# open http://localhost:8765
```

Or open `index.html` directly in a browser.

## Controls

| Key / UI | Action |
|----------|--------|
| `T` | Next teaching beat (within slide) |
| `→` / Next | Next slide |
| `←` / Prev | Previous slide |
| `F` | Fullscreen |
| Act dots | Jump to act |
| A / A+ / A++ | UI zoom |

## Design

- Tokens from `design-system/cclm-showcase/` (ui-ux-pro-max), page override `pages/presentation.md` (dark cinematic, IBM Plex Sans + JetBrains Mono).
- Structure inspired by [krkn-demo/product-demo](https://github.com/rh-rahulshetty/krkn-demo/tree/main/product-demo).

## Speaker notes

See [notes/cclm-showcase-speaker-outline.md](../notes/cclm-showcase-speaker-outline.md).
