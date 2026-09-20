# Prolay Panda — GenAI Visual Systems Portfolio

## Deploy on Vercel

The project is ready for Vercel Free Tier. See `VERCEL_DEPLOYMENT.md` for the
dashboard and CLI deployment instructions. Vercel publishes the static `dist/`
directory using the included `vercel.json` configuration.

Focused application portfolio for a GenAI Prompt Engineer / Visual Style Systems role.

## Project structure

- `dist/index.html` - portfolio website
- `dist/styles.css` - responsive visual design
- `dist/script.js` - reveal animation, cursor effect and JSON copy interaction
- `dist/assets/` - all generated portfolio images, including controlled style variations
- `output/pdf/` - final PDF portfolio
- `create_portfolio_pdf.py` - ReportLab source for rebuilding the PDF
- `RESEARCH_AND_VALIDATION.md` - evidence matrix, hypotheses, limitations and source list
- `.openai/hosting.json` - Sites hosting configuration

## Run locally

From the project directory:

```bash
python3 -m http.server 8080 --directory dist
```

Then open `http://localhost:8080`.

## Rebuild the PDF

Install ReportLab if required:

```bash
python3 -m pip install reportlab
python3 create_portfolio_pdf.py
```

## Model disclosure

The visual work in this portfolio was generated using ChatGPT / OpenAI Images. No hands-on experience with other image-generation models is claimed.

## Usage note

This portfolio and its artwork were created specifically for Prolay Kumar Panda's professional application. Review and update personal contact details before submitting it to an employer.
