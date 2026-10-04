# Approved visual direction

The Coming Soon page is the visual reference for Elementris. Preserve its palette, readable typography, crisp outlines, and raised tiles across lesson boards, controls, hints, and results.

| Role | Value |
| --- | --- |
| Background | Warm off-white `#f5f7f2` |
| Text, outlines, and tile shadow | Deep green `#20332d` |
| Accent | Green `#377f64` |
| Tile fill | Soft lime `#d9e9b9` |
| Tile fill | Mint `#bce5d9` |
| Tile fill | Peach `#f3d7a6` |
| Secondary text | `#59675f` |

Element-family color assignments have not been defined yet. The landing illustration's colors do not establish those assignments.

## Tile treatment

The current element tiles use:

```css
border: 1.5px solid #20332d;
border-radius: 12px;
box-shadow: 0 5px 0 #20332d;
```

Use bold element symbols, clear atomic numbers, and smaller element names. Interactive controls can move down slightly and shorten their shadow while pressed.

## Layout and feedback

- Keep the subtle dotted background and spacious layout where they support readability.
- Design for small portrait screens with large, stable placement targets.
- Decorative tile rotations suit illustrations; game targets stay aligned and stable.
- Use readable system fonts and strong heading hierarchy.
- Pair color feedback with text or icons. Keep controls usable with a keyboard and visible focus states.
- Respect reduced-motion preferences when introducing drop, press, or celebration animations.

The current reference implementation is `public/index.html` and `public/styles.css`.
