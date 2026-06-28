# Portfolio Website

A single-page, dark-themed personal portfolio built with **plain HTML, CSS, and JavaScript** — no build step, no dependencies. Just static files you can push straight to GitHub Pages.

## Features

- **Image lightbox** — hover a project image to get a custom "View" cursor, click to expand it in an aesthetic full-screen overlay (close with the X, clicking the backdrop, or `Esc`).
- **Scroll reveal** — content fades/slides into view as you scroll ("view as you scroll").
- **About Me + dotted world map** — a canvas-rendered dotted world map with a glowing, pulsing location pin.
- **Color-coded Skills** — each skill is a colored chip; click one to smooth-scroll to **Projects** and highlight the projects that used that skill (click it again to clear).
- **Contact** — GitHub, LinkedIn, and Email links.
- Fully responsive and respects `prefers-reduced-motion`.

## File structure

```
portfolio_website/
├── index.html      # page markup & content
├── styles.css      # all styling (theme variables at the top)
├── script.js       # reveal, lightbox, skills filter, map renderer
├── assets/         # placeholder project images (SVG)
└── README.md
```

## Customize it

All content is **placeholder** — search for these and replace:

- `[Your Name]`, `[Your City]` — your name and location.
- Hero tagline, About paragraphs, and stats in `index.html`.
- **Contact links** in `index.html`: replace `https://github.com/your-username`, `https://www.linkedin.com/in/your-handle`, and `mailto:you@example.com`.
- **Projects**: edit each `<article class="project">` (title, description, image, and the `data-skills` / `data-skill` tags). Drop your own images into `assets/` and update the `data-img` / `src`.
- **Skills**: edit the `.chip` buttons — change the label, `data-skill`, and the `--chip` color.
- **Map pin location**: on `<span class="map__pin" ... style="--x: 20%; --y: 31%">`, adjust `--x` / `--y` (percent across/down the map box).
- **Font**: change the single `--font` variable at the top of `styles.css`. To use a Google Font, add its `<link>` in `index.html` and set `--font` to it.

> Note: a skill's `data-skill` on a chip must match the `data-skills` / `data-skill` values on the projects and tags for the highlight to work.

## Run locally

Just open `index.html` in a browser. (Optionally serve it for nicer behavior:)

```bash
# Python
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a new GitHub repository and push these files to the `main` branch:

   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

2. On GitHub: **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Set branch to **main** and folder to **/ (root)**, then **Save**.
5. Wait a minute — your site will be live at `https://your-username.github.io/your-repo/`.

No build configuration is required since everything is static.
