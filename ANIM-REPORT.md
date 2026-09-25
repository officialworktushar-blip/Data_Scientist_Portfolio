# Creative Animations — Verification Report (Playwright)

- Date: 2026-09-25T16:33:54.984Z
- Viewports: **1440** and **390** (+ JS-disabled and prefers-reduced-motion passes)

| Pass | Page | Viewport | CLS | Jank frames | Long tasks | Max frame | Notes | Errors |
|---|---|---|---|---|---|---|---|---|
| YES | Home | 1440 | 0.0002 | 0 | 1 | 17 | hero/split/rotate/terminal OK | stack-sticky OK | marquee-rows OK | none |
| YES | Home | 390 | 0.0001 | 0 | 1 | 17 | hero/split/rotate/terminal OK | stack-sticky OK | marquee-rows OK | none |
| YES | About | 1440 | 0.0000 | 0 | 0 | 17 | - | none |
| YES | About | 390 | 0.0000 | 0 | 0 | 17 | - | none |
| YES | Projects | 1440 | 0.0000 | 0 | 0 | 17 | - | none |
| YES | Projects | 390 | 0.0000 | 0 | 0 | 17 | - | none |
| YES | Skills | 1440 | 0.0000 | 0 | 0 | 17 | - | none |
| YES | Skills | 390 | 0.0000 | 0 | 1 | 17 | - | none |
| YES | Contact | 1440 | 0.0000 | 0 | 0 | 17 | - | none |
| YES | Contact | 390 | 0.0000 | 0 | 0 | 17 | - | none |
| YES | Home | JSoff | - | undefined | undefined | undefined | mounts 9/9 empty 0 opacity0 0 h0 0 h1:
        Turning Data  |  |
| YES | About | JSoff | - | undefined | undefined | undefined | mounts 6/6 empty 0 opacity0 0 h0 0 h1:The Story Behind the D |  |
| YES | Projects | JSoff | - | undefined | undefined | undefined | mounts 3/3 empty 0 opacity0 0 h0 0 h1:200+ Projects. Real Re |  |
| YES | Skills | JSoff | - | undefined | undefined | undefined | mounts 4/4 empty 0 opacity0 0 h0 0 h1:A Full-Stack Data Scie |  |
| YES | Contact | JSoff | - | undefined | undefined | undefined | mounts 3/3 empty 0 opacity0 0 h0 0 h1:Let's Build Something  |  |
| YES | Home | RM | - | undefined | undefined | undefined | hidden 0 marqueeAnims 0 lenis false progress false pt false |  |
| YES | About | RM | - | undefined | undefined | undefined | hidden 0 marqueeAnims 0 lenis false progress false pt false |  |
| YES | Projects | RM | - | undefined | undefined | undefined | hidden 0 marqueeAnims 0 lenis false progress false pt false |  |
| YES | Skills | RM | - | undefined | undefined | undefined | hidden 0 marqueeAnims 0 lenis false progress false pt false |  |
| YES | Contact | RM | - | undefined | undefined | undefined | hidden 0 marqueeAnims 0 lenis false progress false pt false |  |

**Pass: 20/20**

Screenshots: C:\Users\off1c\AppData\Local\Temp\opencode\shots\anim-*.png
Thresholds: CLS ≤ 0.08, jank frames ≤ 3 (>50ms), long tasks ≤ 2 during a ~5s slow scroll.
JS-off: every [data-section] mount filled, zero opacity-0 / height-0 leaf nodes.
Reduced-motion: zero hidden reveals, no marquee/lenis/progress/page-transition, split text visible.