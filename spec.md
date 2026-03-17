# Specification

## Summary
**Goal:** Build PawFund, an animal welfare donation platform where donors can browse campaigns, make one-time or recurring donations, and track their giving history.

**Planned changes:**
- Apply a warm, earthy visual theme (amber, soft green, creamy white) with rounded typography, card-based layouts, and gentle shadows across all pages
- Add a navbar with the PawFund logo and a hero banner on the home page
- Implement donor registration and login via Internet Identity, with a profile page showing display name, avatar URL, contact email, and total lifetime donations
- Build campaign listings with title, description, category (e.g., stray dogs, wildlife rescue, shelter cats), cover image, fundraising goal, amount raised, start/end dates, and active/completed status; support filtering by category and status
- Add campaign detail pages with a visual progress bar, percentage raised, total donor count, days remaining, and a list of up to 10 recent donors
- Implement one-time donation submission (custom amount, recorded with donor ID, campaign ID, amount in USD, timestamp, transaction reference ID); prompt unauthenticated users to log in
- Add recurring monthly donation support via a toggle on the donation form; store frequency and next-due date; allow cancellation from the donor profile
- Build a donation history page (newest-first) showing campaign name, amount, date, transaction reference, and a receipt detail view
- Persist all data (donors, campaigns, donations, recurring donations) in the Motoko backend actor

**User-visible outcome:** Donors can sign up, browse and filter animal welfare campaigns, make one-time or monthly donations, view campaign progress, and access a full history of their donations with receipts — all within a warm, nature-inspired interface.
