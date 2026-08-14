# Lasers & Treason — Mission Control

A dependency-free, no-VTT companion for a shared **Lasers and Treason** one-shot. It is intentionally a static site so it can be published directly with GitHub Pages.

## What it includes

- Player Mode: a locally saved Troubleshooter record, roll helper, kit checklist, field log, and concise rules reference.
- A guided seven-step Troubleshooter creation protocol following the supplied handout: clearance, Service Group, restricted factors, Lasers/Treason number, clone designation, standard kit, and orders.
- DM Mode: editable player-facing briefing, mission phase, pressure clock, secret notes, incident log, complication prompts, and R&D item generator.
- Shareable player snapshots: the DM can copy a link containing the current briefing and clock and paste it into the group chat. No sign-in, server, or VTT required.
- Default-dark, DOS-style terminal presentation that stays legible on phones.
- Optional Discord relay: players can paste a webhook to announce their own characterful rolls; the DM can paste a separate hook to post the current briefing.

Characters and notes are stored in each participant's browser. A briefing snapshot only shares the current mission information—not anyone's private notes. It is a point-in-time handoff: after the DM changes the scene or clock, they should send a new link.

DM notes are deliberately not included in the static site’s shared briefing links. For table secrecy, keep the DM console on a device the players cannot browse.

## Discord webhook notes

Webhook URLs are stored only in the browser where they are pasted and are never included in player snapshots. A player hook posts that player’s rolls; a DM hook posts the current briefing when requested. A webhook URL is still a secret: on a static GitHub Pages site, do not paste one into a browser or device you do not trust.

## Publish to GitHub Pages

1. Push these files to the branch you want to publish.
2. In the GitHub repository, open **Settings → Pages**.
3. Choose **Deploy from a branch**, select the branch, and choose the repository root (`/`).
4. Save. GitHub will provide the public URL in the Pages settings.

Because this is plain HTML, CSS, and JavaScript, no build step is needed.
