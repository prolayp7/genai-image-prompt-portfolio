# Prolay Panda — GenAI Visual Systems Portfolio

## Deploy on Vercel

The project is a static site for Vercel Free Tier. Import the repository in Vercel, leave the framework preset as Other, and set the output directory to `dist` if Vercel does not read `vercel.json` automatically. The included `vercel.json` sets `dist` as the output directory and requires no build step. `VERCEL_DEPLOYMENT.md` has additional dashboard and CLI steps. The deployable PDF is included at `dist/downloads/portfolio.pdf`.

Focused application portfolio for a GenAI Prompt Engineer / Visual Style Systems role.

## Project structure

- `dist/index.html` - portfolio website
- `dist/styles.css` - responsive visual design
- `dist/script.js` - accessible artwork viewer, view and review controls, comparison slider and copy feedback
- `dist/assets/` - source PNGs, optimized WebP artwork and social preview image
- `output/pdf/` - original PDF portfolio source output
- `dist/downloads/portfolio.pdf` - compressed downloadable PDF for Vercel
- `create_portfolio_pdf.py` - ReportLab source for rebuilding the PDF
- `RESEARCH_AND_VALIDATION.md` - evidence matrix, hypotheses, limitations and source list
- `CHANGELOG.md` - implementation changes
- `AUDIT.md` - checks and remaining browser validation

## Run locally

From the project directory:

```bash
python3 -m http.server 8080 --directory dist
```

Then open `http://localhost:8080`. Preview through a local HTTP server so relative asset paths and the PDF download work as deployed.

## Rebuild the PDF

Install ReportLab if required:

```bash
python3 -m pip install reportlab
python3 create_portfolio_pdf.py
```

## Model disclosure

The visual work in this portfolio was generated using ChatGPT / OpenAI Images. No hands-on experience with other image-generation models is claimed.

## Usage note

This portfolio and its artwork were created specifically for Prolay Kumar Panda's professional application.

## Browser validation and current-site PDF

The production site remains dependency-free. For development checks, provide an existing
`playwright-core` installation via `PLAYWRIGHT_MODULE` (module name or absolute path).
Set `CHROME_PATH` if Chrome is not at `/opt/google/chrome/chrome`.

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
# In another terminal, with playwright-core available:
node scripts/browser-check.cjs
python3 create_portfolio_pdf.py
```

The browser check exercises five widths and key interactions, and refreshes
`dist/downloads/prompt-examples.json`. The PDF exporter reads the current website,
uses its print stylesheet, includes all three JSON panels and compresses artwork
for the downloadable `dist/downloads/portfolio.pdf`. It does not call an image API.
`PORTFOLIO_URL` can override the exporter's default local URL.
