# Rajdeep Pal Portfolio

Interactive cybersecurity portfolio for Rajdeep Pal, hosted with GitHub Pages.

**Live site:** https://rajdeeppal01.github.io/portfolio/  
**Repository:** https://github.com/rajdeeppal01/portfolio

## Overview

This is a static, single-page portfolio built with plain HTML, CSS, and JavaScript. The experience is centered around an interactive terminal-style interface where visitors can explore professional experience, projects, skills, credentials, contact details, and download the resume.

The site does not require a build step, backend server, framework, package manager, or database. GitHub Pages serves the files directly from the repository root.

## Features

- Dark obsidian cybersecurity-themed interface
- Interactive terminal console
- Clickable top navigation synced with terminal commands
- Visitor `whoami` command with browser/session metadata
- Experience timeline
- Project showcase cards
- Technical skills matrix
- Credentials grid
- Theme switching commands
- Resume download command
- Contact form UI with simulated secure-transmission flow
- Responsive layout for desktop, tablet, and mobile

## Current Sections

- Overview
- Experience
- Projects
- Skills
- Credentials
- Contact

## Terminal Commands

| Command | Alias | Description |
| --- | --- | --- |
| `help` | `menu` | Show available terminal commands. |
| `ls` | | List portfolio sections. |
| `whoami` | `overview`, `about` | Show visitor metadata and professional summary. |
| `experience` | `exp` | Show professional experience timeline. |
| `projects` | `proj` | Show project cards. |
| `skills` | | Show technical skills matrix. |
| `credentials` | `certs` | Show credentials and achievements. |
| `contact` | | Open the contact section. |
| `theme list` | | Show available visual themes. |
| `theme matrix` | | Switch to Matrix theme. |
| `theme dracula` | | Switch to Dracula theme. |
| `theme nord` | | Switch to Nord theme. |
| `theme obsidian` | `theme default` | Return to the default theme. |
| `download` | `resume` | Download the PDF resume. |
| `scan` | `hack` | Run the diagnostic simulator. |
| `clear` | | Clear terminal output and restore the welcome guide. |

## Project Structure

```text
portfolio/
├── index.html
├── style.css
├── script.js
├── Resume_Rajdeep.pdf
└── README.md
```

## File Responsibilities

| File | Purpose |
| --- | --- |
| `index.html` | Main HTML structure, navigation, hero shell, terminal shell, contact section, footer, and asset links. |
| `style.css` | Layout, colors, responsive design, terminal styling, card styling, and theme variables. |
| `script.js` | Navigation behavior, terminal command processor, dynamic content rendering, theme switching, clock/session timers, contact simulation, and resume download. |
| `Resume_Rajdeep.pdf` | Resume file downloaded through the terminal. |

## How It Works

On page load, `script.js` runs a startup sequence:

1. Initializes the live clock in the header.
2. Starts the session duration timer in the footer.
3. Starts the hero typing animation.
4. Wires navigation links to terminal views.
5. Initializes the terminal command processor.
6. Starts the scroll warp visual effect.

Most portfolio content is rendered dynamically inside the terminal. For example, clicking **Projects** runs the same logic as typing `projects` in the terminal.

## Editing Guide

### Update hero text

Edit `index.html`:

- `.hero-title`
- `.hero-desc`
- `.stats-dashboard`

### Update experience

Edit `getExperienceHTML()` in `script.js`.

### Update projects

Edit `getProjectsHTML()` in `script.js`.

### Update skills

Edit `getSkillsHTML()` in `script.js`.

### Update credentials

Edit `getCredentialsHTML()` in `script.js`.

### Update contact details

Edit the contact links and visible values in `index.html`.

### Update resume

Replace `Resume_Rajdeep.pdf` in the repository root. If the filename changes, update the `download` command in `script.js`.

### Update colors or themes

Edit CSS variables in `style.css`:

- `:root`
- `body.theme-matrix`
- `body.theme-dracula`
- `body.theme-nord`

## Local Preview

Because this is a static site, it can be previewed by opening `index.html` in a browser.

For a simple local server:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deployment

The portfolio is deployed through GitHub Pages.

Expected Pages configuration:

- Source: `main` branch
- Folder: `/ (root)`

After pushing changes to `main`, GitHub Pages usually refreshes within a few minutes.

## Verification Checklist

After making changes, verify:

- Navigation links work.
- Terminal commands work.
- `download` downloads the resume.
- `theme` commands switch themes.
- Contact section opens correctly.
- Desktop and mobile layouts do not overflow.
- `node --check script.js` passes if Node.js is available.

## Notes

- The contact form currently simulates a secure transmission and does not send real email.
- The portfolio is intentionally static and lightweight.
- The Personal and Audio Deck sections were removed from the current version.

