# VERO Football Agency website

This is a responsive website with HTML, CSS, JavaScript and one PHP contact endpoint. Open `index.html` to preview the pages locally; submitting the contact form requires a PHP host. The homepage leads to dedicated `agency.html`, `services.html`, `players.html`, `coaches.html`, `clubs.html`, `contact.html` and `privacy.html` pages. A branded `404.html` is configured by `.htaccess`. The header remains available on scroll and the mobile menu is keyboard accessible. Gallery photos open in a native dialog with close and arrow navigation. The contact form validates fields and posts to `contact.php`, which attempts to hand a message to the host's mail server. When the server cannot accept it, the visitor can use a prepared email draft or copy the details. Server acceptance does not guarantee inbox delivery.

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
- `verofootballagency@gmail.com` is the confirmed public email. Test enquiries submitted both on the temporary site and `verofootball.com` arrived in that inbox on 26 September 2026. PHP `mail()` can still accept messages that are subsequently filtered. For stronger long-term delivery, use authenticated SMTP with a configured sender mailbox.
- VERO is operated by a company registered in Bulgaria with business correspondence address Boulevard Vitosha 63, Sofia, Bulgaria. Website enquiry correspondence is retained for one year after the last message; no analytics are used. The company's exact registered legal name has not yet been supplied and must be added to `privacy.html` before calling the controller identification complete.
- Confirm any player names, current affiliations and permission to show them publicly before adding a named roster. Two supplied photos with visible phone UI were excluded.
- Confirm final copy and the company's exact legal identity with the agency.
- Review the design on phone and desktop.

## Deployment verification

Hostinger's live page was observed with a newer HTML file and an older cached `styles.css`, causing a broken desktop hero. The HTML references versioned CSS and JavaScript URLs to fetch the matching assets. Increment the `v=` query string whenever either file changes and verify the live page after each deployment. `contact.php` checks a honeypot and limits successful submissions to three per hour per network address. It keeps no message database; a temporary hashed network identifier and timestamps enforce the limit. Test actual delivery with the owner before describing the form as reliable.

## Hostinger deployment

This repository is connected to Hostinger; branch `main` deploys to `public_html`. The official domain `verofootball.com` and `www.verofootball.com` both served the current site over HTTPS on 26 September 2026. If the next GitHub commit is not reflected on the site, redeploy from the Hostinger Git dashboard.

No build command, Node.js server, database, or environment variables are required. The host must support PHP and permit `mail()` for direct form submission. The version query on CSS and JS URLs must be incremented after changes because the Hostinger CDN previously served an older stylesheet with a newer HTML file.
