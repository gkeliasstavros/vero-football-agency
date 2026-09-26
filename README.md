# VERO Football Agency website

This is a dependency-free, responsive static website. Open `index.html` to preview it locally. The homepage leads to dedicated `agency.html`, `services.html`, `players.html`, `coaches.html`, `clubs.html`, `contact.html` and `privacy.html` pages. A branded `404.html` is configured by `.htaccess`. The header remains available on scroll and the mobile menu is keyboard accessible. Gallery photos open in a native dialog with close and arrow navigation. The contact form validates fields and prepares an email draft locally; visitors can copy the address and message if no email app is configured. No web form claims a message was sent.

## Agency website research, September 2026

- THE·TEAM global football (formerly Wasserman): clearly separates talent representation and reach. UNIK Sports Management joined THE·TEAM in 2025. Sources: https://the.team/sports-talent/global-football-soccer/ and https://the.team/news/the-team-acquires-unik-sports-management/
- Fem11: women's football focus, clear football/development/commercial categories, a dedicated roster and direct contact. Sources: https://www.fem11.de/ and https://www.fem11.de/kader
- CAA Base: explicit coverage of representation, moves, communication and life around a career. Source: https://caabase.com/base-services/
- ROOF: bold photography and a distinct point of view with short editorial sections. Source: https://www.roof.football/
- Unique Sports Group: direct routes to services, staff, news and contact. Source: https://www.uniquesg.com/
- Gestifute: attentive, close career guidance and a clear agency identity. Source: https://gestifute.com/
- Women's Football Agency: separates athlete management from marketing and project work. Source: https://womensfootballagency.com/

VERO applies the useful patterns in its own voice and visual identity. The site does not borrow text, claim competitor scale, display invented numbers, or publish an unconfirmed roster.

## Content review before publishing

- The supplied VERO artwork and real football photos are used on the homepage. The image gallery has no player names until the identities and a public roster have been verified. Do not generate or alter identity-defining features.
- Confirm that `verofootballagency@gmail.com` is the right public email. The form uses `mailto:` and therefore requires a configured email app on the visitor's device; a true inbox-backed web form would need a configured mail service or Hostinger server endpoint.
- Confirm the responsible business's legal name, postal address, email provider and email-retention practice, then review `privacy.html` before calling the privacy information final. The currently published page accurately describes the browser-side contact flow but cannot supply unprovided legal identity details.
- Confirm any player names, current affiliations and permission to show them publicly before adding a named roster. Two supplied photos with visible phone UI were excluded.
- Confirm the final copy, legal identity and privacy notice with the agency before attaching the official domain.
- Review the design on phone and desktop, then connect the official domain when ready.

## Deployment verification

Hostinger's live page was observed with a newer HTML file and an older cached `styles.css`, causing a broken desktop hero. The HTML references versioned CSS and JavaScript URLs to fetch the matching assets. Increment the `v=` query string whenever either file changes and verify the live page after each deployment. The contact email is still subject to owner confirmation. No server-side email delivery exists.

## Hostinger deployment

This repository is connected to the Hostinger temporary site `navajowhite-fox-356039.hostingersite.com`; branch `main` deploys to `public_html`. If the next GitHub commit is not reflected on the site, redeploy from the Hostinger Git dashboard. The official domain is not yet attached.

The site uses only HTML, CSS and a small JavaScript file. No build command, Node.js server, database, or environment variables are required. The version query on CSS and JS URLs must be incremented after changes because the Hostinger CDN previously served an older stylesheet with a newer HTML file.
