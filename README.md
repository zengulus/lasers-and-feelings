# Lasers & Treason // FCOS Toolbox

A no-build, no-VTT toolbox for a shared **Lasers and Treason** one-shot. It is a static site that can be published directly with GitHub Pages.

## Tool consoles

Player console:

- `CITIZEN.DAT`: locally saved Troubleshooter record and seven-step setup utility.
- `ROLL.EXE`: action, R&D Safe/Useful, and pharmaceutical interaction rollers.
- `KIT.CHK`, `NOTES.TXT`, and `RULES.HLP`: equipment, field notes, and a compact rules reference.
- `RELAY.COM`: an optional player-owned Discord webhook that announces that player's rolls.

GM console:

- `MISSION.EXE`: a mission generator built from 10 formats and five 25-entry tables.
- `CLOCK.EXE`: a six-step ASCII pressure tracker.
- `TROUBLE.EXE` and `RNDLAB.EXE`: complication and experimental item generators.
- `SECRETS.TXT` and `INCIDENT.LOG`: private local notes and table incidents.

The interface uses literal ASCII directories, tool boundaries, selected states, checkboxes, dice results, and meters. VT323 (loaded through Google Fonts), responsive multi-column tool bays, scanlines, phosphor glow, and a CRT vignette give the toolbox an old NFO-viewer feel while retaining a single-column mobile fallback.

Characters, settings, clocks, and notes are stored in the current browser. There are no accounts or server-side data. Keep the GM console on a device players cannot inspect.

## Discord webhook notes

The optional player webhook is stored only in that browser. It is never placed in a link or sent anywhere except Discord when the player rolls or runs the connection test. A webhook URL is still a secret, so do not paste one into an untrusted browser or device.

## Publish to GitHub Pages

1. Push these files to the branch you want to publish.
2. In the GitHub repository, open **Settings > Pages**.
3. Choose **Deploy from a branch**, select the branch, and choose the repository root (`/`).
4. Save. GitHub will provide the public URL in the Pages settings.

Because this is plain HTML, CSS, and JavaScript, no build step is needed.
