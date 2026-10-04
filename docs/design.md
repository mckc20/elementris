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

Phase 2 assigns lime to alkali metals and mint to noble gases. Peach marks the current element before placement. These colors support explicit family labels and an outlined destination with a ‘Place here’ cue; they are not the only signal.

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

The Coming Soon visual reference is carried into the lesson by palette tokens, the dotted background, bold typography, raised tiles, and native buttons. `ElementTile`, `Button`, and `PageLayout` remain reusable foundations. The lesson board has aligned columns with fixed collection slots, a textual placement cue, visible keyboard focus, and short tile-drop feedback. Reduced motion removes drop and press movement. After placement the player chooses when to advance; keyboard focus moves to that action, then to the next element heading. The overview's neutral hydrogen cell prevents implying it belongs to the alkali metals.

## Language control

Issue #8 places a compact DE / EN button group beside the brand in the top-right of every screen. Each option has a minimum 44px tap target, native-language accessible name, visible keyboard focus, and `aria-pressed` state. The selected language uses a deep-green fill; the group follows the existing raised-control style. Longer German headings wrap within the portrait layout. Switching preserves lesson state and keeps keyboard focus on the selected control.

## Practice and results

Phase 3 keeps the same peach current tile and labelled lime/mint columns. Practice hides the family guide and destination outline until hints are requested: the first hint explains membership in the live feedback region; the second adds the existing outline and placement cue. A peach hint button stays focused as its label changes between stages. Corrections keep the placement target focused, and successful placements move focus to Next as in guided learning. Results use a mint definition list for totals and a peach review panel with element names, symbols, hint stages, and retries. The results heading receives focus; replay resets the round.

The full brand symbol and wordmark act as one keyboard-accessible home button with a localized label and visible focus outline. A centered raised Back to home button sits above the footer on every started-round screen, including completion and results. Returning home focuses the introduction heading and scrolls to the top.

## Saved progress and lesson selection

Phase 4 adds a mint lesson card near the top of the introduction. It shows distinct guided visits, guided/full-practice completion, latest unaided practice answers, and the review count. Guided, practice, and targeted-review actions sit within the card. Device-only storage and review rules are explained alongside the totals. The lesson's family introduction remains below. Reset uses an inline confirmation with native buttons and returns focus to the introduction after clearing or cancelling. Targeted practice uses the existing board and results with the actual subset size.

## Phase 5 validation fixes

Progress-card secondary text uses the approved deep-green ink to meet small-text contrast on mint. The header wraps when text grows; controls and lesson prose wrap long words, and current/collected tiles can grow vertically so enlarged text remains readable. The normal portrait layout retains two family columns and raised tiles. Phase 5 adds automated contrast, focus, touch and enlarged-text checks; physical-device and screen-reader observations remain pending in [MVP validation](mvp-validation.md).

## Phase 6 destination labels

The catalogue supplies neutral localized “Group N” / “Gruppe N” labels for groups 1–18 and separate Lanthanoids / Lanthanoide and Actinoids / Actinoide labels. These support the portrait boards without assigning family properties to every group member. Play now has a peach home card beside the existing mint Learn & practise card. Selection uses a two-column grid of native checkboxes with element counts, a minimum of two choices and support for all 20 destinations, and a raised round-summary panel.

Two or three equal-width falling lanes use lime, mint, and peach backgrounds. Larger boards repeat these colors and scroll horizontally with lanes at least 100 pixels wide; keyboard movement brings the selected lane into view. The peach element tile shows number, symbol, and localized name; a matching text heading and identity line remain accessible outside the visual track. Selected lanes have an outline, native pressed state, and a “✓ Selected” label. Large lane buttons select rather than submit, with separate Drop/Pause buttons below. Selecting a lane returns focus to the board; Space or down arrow drops the tile. Collections remain outside the track with explicit membership notes.

The board itself is focusable and owns arrow movement/drop shortcuts; nested buttons and the header retain native behavior. Feedback uses a polite atomic live region. New attempts focus the board, while correction/collection/pause focus Retry/Continue/Resume. Selection and results focus headings. Reduced-motion preference replaces descent with a stationary tile/countdown, and a labelled checkbox offers that alternative to all players. No decorative falling/celebration animation is added. Result totals use the existing mint metrics panel and a peach corrected-elements panel.
