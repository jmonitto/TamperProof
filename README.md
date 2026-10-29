# Tamperproof customer-service demo

A standalone Node.js demo. It uses a snapshot of Tamperproof's public website, not a live NetSuite or inventory connection. Product links point to public product-family pages; verify the specific options on the site or with Tamperproof. Prices, availability and exact fit are not guaranteed by the assistant.

Run with Node.js 22 or newer using `npm start`, with `OPENAI_API_KEY` set securely in the environment. Never commit the key. On Render, create a Web Service from this repository and set `OPENAI_API_KEY` in Environment; `render.yaml` provides the defaults. Public visitors can invoke the API and incur usage costs. The application has a basic per-process hourly request cap; it is not a comprehensive abuse-prevention or spending control.

`catalog.json` and `facts.txt` are dated source snapshots, not a complete catalog or automatic live feed. Review and refresh them when the site changes. The store's robots.txt requests a 20-second crawl delay.

