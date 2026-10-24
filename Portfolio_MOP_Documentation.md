# Rajdeep Pal Portfolio - Method of Procedure (MOP)

**Project:** Rajdeep Pal Interactive Console Portfolio  
**Live URL:** https://rajdeeppal01.github.io/portfolio/  
**GitHub Repository:** https://github.com/rajdeeppal01/portfolio  
**Current local source:** `C:\Users\rajde\OneDrive\Desktop\projects\portfolio-source\portfolio-main`  
**Documentation folder:** `C:\Users\rajde\OneDrive\Desktop\projects\portfolio`  
**Last updated:** 27 June 2026  

---

## 1. Purpose

This document explains what is where in the portfolio, how the site works, how the interactive console is wired, how GitHub Pages deployment works, and how to safely make future changes.

The portfolio is a static GitHub Pages website. There is no backend server, no build step, and no package manager. The live site is powered directly by:

- `index.html`
- `style.css`
- `script.js`
- `Resume_Rajdeep.pdf`

The Personal and Audio Deck sections were removed from the live project. The current public navigation includes only:

- Overview
- Experience
- Projects
- Skills
- Credentials
- Contact

---

## 2. Repository and File Map

### 2.1 Live repository root

The GitHub repository root contains the files that GitHub Pages serves:

| File | Purpose |
| --- | --- |
| `index.html` | Main page structure, header, hero area, terminal shell, contact section, footer, and script/style links. |
| `style.css` | All visual design, layout rules, responsive behavior, terminal styling, theme variables, and color modes. |
| `script.js` | All interactivity: clock, typing animation, navigation, terminal commands, rendered terminal sections, contact form behavior, scroll effects, theme switching, and resume download. |
| `Resume_Rajdeep.pdf` | Resume asset downloaded by the terminal `download` or `resume` command. |

### 2.2 Local working folders

There are two local folders currently relevant:

| Local path | Purpose |
| --- | --- |
| `C:\Users\rajde\OneDrive\Desktop\projects\portfolio-source\portfolio-main` | Editable downloaded source copy of the live GitHub repository. |
| `C:\Users\rajde\OneDrive\Desktop\projects\portfolio` | Documentation folder containing this MOP and walkthrough notes. |

Important: the documentation folder is not currently the GitHub Pages source. The actual editable site files are in `portfolio-source\portfolio-main`.

---

## 3. High-Level Runtime Flow

When a visitor opens the portfolio URL:

1. GitHub Pages serves `index.html`.
2. `index.html` loads Google Fonts, then `style.css`.
3. The browser renders the dark portfolio shell:
   - fixed background grid
   - sticky navigation header
   - hero overview
   - interactive terminal panel
   - contact section
   - footer
4. At the bottom of `index.html`, the browser loads `script.js`.
5. `script.js` waits for `DOMContentLoaded`.
6. Once the DOM is ready, these startup functions run:
   - `initClock()`
   - `initSessionTracker()`
   - `initTypingAnimation()`
   - `initNavigation()`
   - `initTerminal()`
   - `initScrollWarp()`
7. The user can then interact through either:
   - top navigation links
   - terminal commands
   - contact form
   - theme commands
   - resume download command

---

## 4. `index.html` - What Is Where

### 4.1 Head

The `<head>` section defines:

- metadata for SEO and page identity
- viewport settings for mobile responsiveness
- Google Fonts:
  - `Plus Jakarta Sans`
  - `JetBrains Mono`
- link to `style.css`

The page title is:

`Rajdeep Pal | Cybersecurity & AI-Security Architect`

### 4.2 Body classes

The `<body>` has:

`clean-saas-theme console-pivot-theme`

These classes let CSS apply the SaaS-like dark interface and console-focused layout behavior.

### 4.3 Background grid

The element:

`<div class="saas-grid-bg"></div>`

creates the fixed subtle grid texture behind the whole site. It is styled in `style.css` through `.saas-grid-bg`.

### 4.4 Header and navigation

The main header is:

`<header class="saas-header" id="main-header">`

Inside it:

- `#logo-home-link` returns the user to Overview.
- `.logo-icon` is the SVG football-style mark.
- `#nav-menu` contains the visible navigation links.
- `#header-time` displays the live clock.
- `#mobile-toggle` is the mobile menu button markup.

Current navigation links:

| Link text | Hash | Behavior |
| --- | --- | --- |
| Overview | `#overview` | Shows the hero overview and prints overview content in the terminal. |
| Experience | `#experience` | Opens the professional timeline inside the terminal. |
| Projects | `#projects` | Opens the project cards inside the terminal. |
| Skills | `#skills` | Opens the technical matrix inside the terminal. |
| Credentials | `#certs` | Opens credential cards inside the terminal. |
| Contact | `#contact` | Switches to the standalone contact page section. |

Personal and Audio Deck navigation links have been removed.

### 4.5 Hero section

The hero section is:

`<section id="hero" class="saas-section hero-section active-sec">`

It contains two major columns:

| Area | Class | Purpose |
| --- | --- | --- |
| Left content | `.hero-intel` | Badge, main headline, typing subtitle, summary paragraph, stats dashboard, contact button. |
| Right content | `.hero-visual` | Terminal UI wrapper and interactive console. |

The hero starts active because it has `active-sec`.

### 4.6 Stats dashboard

The `.stats-dashboard` contains three stat boxes:

- Current Post
- Location
- Education

These are static HTML values. Edit them directly in `index.html`.

### 4.7 Contact button

The Contact button has:

`id="btn-go-contact"`

The click behavior is attached in `script.js` inside `initNavigation()`. It calls:

`window.switchTab('contact')`

### 4.8 Terminal shell markup

The terminal is created in `index.html` as static shell markup:

| Element | Purpose |
| --- | --- |
| `.terminal-wrapper` | Full terminal frame. |
| `.terminal-header` | Top bar with dots, title, and online status. |
| `#terminal-screen` | Scrollable terminal body. |
| `#terminal-log` | Container where command output and section cards are appended. |
| `.terminal-guide-line` | Small guide above the input. |
| `#terminal-input` | Actual command input. |

Most terminal section content is not written directly in `index.html`. It is generated by JavaScript template functions in `script.js`.

### 4.9 Contact section

The contact section is:

`<section id="contact" class="saas-section contact-section">`

It includes:

- section heading: Secure Transmission
- contact form with:
  - sender name
  - sender email
  - subject
  - message
- connection links:
  - email
  - phone
  - LinkedIn
  - GitHub

The form submits through FormSubmit's AJAX endpoint and sends messages to `rajdeeppalwork@gmail.com`. It still keeps the portfolio's themed secure-transmission status animation in `handleFormSubmit(event)`.

### 4.10 Footer

The footer contains:

- copyright
- session duration timer
- integrity hash text

The timer is updated by `initSessionTracker()` in `script.js`.

---

## 5. `style.css` - Styling System

### 5.1 CSS variables

The main design tokens live in `:root`.

Important variables:

| Variable | Purpose |
| --- | --- |
| `--bg-darker` | Main page background. |
| `--bg-dark` | Secondary dark surfaces. |
| `--bg-card` | Card and terminal content background. |
| `--bg-card-hover` | Hover background for cards. |
| `--text-white` | Brightest text. |
| `--text-bright` | Main readable text. |
| `--text-muted` | Secondary text. |
| `--primary-green` | Main accent color, currently teal. |
| `--accent-blue` | Secondary accent color. |
| `--border-slate` | Default border color. |
| `--font-sans` | Main UI font. |
| `--font-mono` | Terminal font. |
| `--header-height` | Fixed header height. |
| `--max-width` | Main layout max width. |

To change the overall look, update the variables first instead of editing many individual rules.

### 5.2 Base layout

The reset and base rules define:

- `box-sizing: border-box`
- no default margins
- smooth scroll behavior
- dark body background
- custom scrollbars
- font defaults

### 5.3 Header and nav styles

Key classes:

- `.saas-header`
- `.header-container`
- `.logo-container`
- `.logo-icon`
- `.saas-nav`
- `.nav-link`
- `.header-actions-panel`
- `.mobile-nav-toggle`

The nav active state is applied by JavaScript with:

`link.classList.add('active')`

### 5.4 Section visibility

The website behaves like a single-page app. CSS controls visible sections:

- `.saas-section` is hidden by default.
- `.saas-section.active-sec` is visible.

JavaScript switches the `active-sec` class when navigation changes.

### 5.5 Hero layout

The hero uses `.hero-layout` to place intro content and terminal side by side.

When viewing terminal-focused sections, JavaScript adds:

`terminal-only-view`

to the hero section. CSS then applies:

- `.hero-section.terminal-only-view .hero-layout`
- `.hero-section.terminal-only-view .hero-intel`
- `.hero-section.terminal-only-view .hero-visual`

This hides the left hero text and makes the terminal full-width for Experience, Projects, Skills, and Credentials.

### 5.6 Terminal UI styling

Important classes:

- `.terminal-wrapper`
- `.terminal-header`
- `.terminal-body`
- `.terminal-output`
- `.terminal-line`
- `.terminal-card`
- `.terminal-sec-header`
- `.terminal-sec-title`
- `.terminal-guide-line`
- `.terminal-input-line`
- `#terminal-input`

The terminal is styled as the main interactive interface. Most rendered cards use `.terminal-card`.

### 5.7 Terminal content grids

The terminal has specific layout classes:

| Class | Used by |
| --- | --- |
| `.terminal-timeline` | Experience section. |
| `.terminal-projects-grid` | Projects section. |
| `.project-terminal-card` | Individual project cards. |
| `.terminal-skills-grid` | Skills section. |
| `.terminal-skills-category` | Skill category cards. |
| `.terminal-certs-grid` | Credentials section. |
| `.terminal-cert-card` | Individual credential cards. |
| `.terminal-ach-banner` | IEEE CIS achievement banner. |

### 5.8 Contact styling

The Contact page uses:

- `.contact-section`
- `.contact-layout`
- `.contact-form-wrap`
- `.saas-form`
- `.form-row`
- `.form-group`
- `.saas-input`
- `.saas-contact-info-wrap`
- `.info-card`
- `.conn-link`

### 5.9 Theme classes

At the end of `style.css`, the site defines alternate color modes:

- `body.theme-matrix`
- `body.theme-dracula`
- `body.theme-nord`

The terminal command `theme matrix`, `theme dracula`, or `theme nord` adds one of these classes to the body.

The command `theme obsidian` or `theme default` removes theme classes and returns to the default `:root` design.

---

## 6. `script.js` - Functional Architecture

### 6.1 Startup sequence

At the top of `script.js`, visitor IP/location variables are initialized:

- `visitorIP`
- `visitorLocation`

The script attempts to fetch public visitor info from:

`https://ipapi.co/json/`

If it fails, the default fallback values remain.

When the DOM loads, this block runs:

```js
document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initSessionTracker();
    initTypingAnimation();
    initNavigation();
    initTerminal();
    initScrollWarp();
});
```

### 6.2 Clock

Function:

`initClock()`

Updates:

`#header-time`

Every second, it writes the current local time in `HH:MM:SS IST` format.

### 6.3 Session tracker

Function:

`initSessionTracker()`

Updates:

`#session-time`

It starts at `00:00:00` and increments every second while the page is open.

### 6.4 Typing animation

Function:

`initTypingAnimation()`

Updates:

`#type-subtitle`

Current phrases:

- Cybersecurity Analyst
- Threat Detection Engineer
- AI-Security Integrator
- Security Automation Developer

To edit the typing text, update the `phrases` array.

### 6.5 Navigation sync

Function:

`syncTerminalView(command)`

Responsibilities:

- removes active class from all nav links
- adds active class to the matching nav link
- toggles `terminal-only-view` on the hero section

Overview shows both hero text and terminal. Other terminal sections hide the hero text and expand the terminal.

### 6.6 Tab switching

Global function:

`window.switchTab(command)`

Used by nav clicks and custom buttons.

Behavior:

- hides all `.saas-section` elements
- if command is `contact`, shows the Contact section
- otherwise, shows the Hero section and executes the matching terminal command
- scrolls the browser window back to top

### 6.7 Navigation events

Function:

`initNavigation()`

Attaches behavior to:

- all `.nav-link` elements
- `#logo-home-link`
- `#btn-go-contact`
- initial URL hash if present

Examples:

- clicking Projects calls `window.switchTab('projects')`
- clicking Contact calls `window.switchTab('contact')`
- clicking the logo calls `window.switchTab('overview')`

### 6.8 Terminal content template functions

These functions return HTML strings that are inserted into `#terminal-log`:

| Function | Output |
| --- | --- |
| `getWelcomeGuideHTML()` | Initial command guide card. |
| `getWhoamiHTML()` | Visitor session details: IP, location, OS, browser, handshake status. |
| `getAboutHTML()` | Professional summary and quick-start guide. |
| `getExperienceHTML()` | Experience timeline for Jio Platforms and Power Grid. |
| `getProjectsHTML()` | Project cards: JCS, Event Viewer GUI, Windows Log Parser, PehraSafe Telemetry. |
| `getSkillsHTML()` | Technical skill matrix. |
| `getCredentialsHTML()` | Credential cards and IEEE CIS achievement banner. |

To edit visible content in Experience, Projects, Skills, or Credentials, update these functions in `script.js`.

### 6.9 Terminal initialization

Function:

`initTerminal()`

Responsible for:

- finding `#terminal-input`, `#terminal-log`, and `#terminal-screen`
- focusing the input without scrolling
- listening for Enter key commands
- printing command echoes
- appending rendered HTML
- processing commands
- controlling terminal scroll position

Important detail:

`input.focus({ preventScroll: true })`

is used to stop the browser from jumping the terminal to the bottom when the input is focused.

### 6.10 Terminal command list

Current supported commands:

| Command | Aliases | Behavior |
| --- | --- | --- |
| `whoami` | `overview`, `about` | Prints visitor metadata and professional summary. |
| `experience` | `exp` | Prints professional experience timeline. |
| `projects` | `proj` | Prints project cards. |
| `skills` | none | Prints technical matrix. |
| `credentials` | `certs` | Prints credential grid. |
| `contact` | none | Switches to the Contact section. |
| `ls` | none | Lists available portfolio directories. |
| `cd [dir]` | examples: `cd projects`, `cd skills` | Opens a section by directory-style command. |
| `theme [name]` | `theme list` | Changes or lists color themes. |
| `download` | `resume` | Downloads `Resume_Rajdeep.pdf`. |
| `scan` | `hack` | Runs the diagnostic simulator. |
| `clear` | none | Clears terminal and restores welcome guide. |
| `help` | `menu` | Prints command reference. |

Removed commands:

- `personal`
- `audio`
- `music`

These were removed from the command processor, `ls`, `help`, and navigation.

### 6.11 `cd` command behavior

The `cd` command is handled inside `processCommand(rawCmd)`.

Examples:

- `cd`
- `cd ~`
- `cd /`
- `cd overview`
- `cd experience`
- `cd projects`
- `cd skills`
- `cd credentials`
- `cd contact`

Invalid directories print:

`bash: cd: [path]: No such file or directory`

### 6.12 Theme command behavior

The `theme` command supports:

- `theme list`
- `theme matrix`
- `theme dracula`
- `theme nord`
- `theme obsidian`
- `theme default`

Implementation:

1. Remove all existing theme classes:
   - `theme-matrix`
   - `theme-dracula`
   - `theme-nord`
   - `theme-obsidian`
2. If selected theme is default/obsidian, do not add a class.
3. Otherwise add `theme-[name]` to `document.body`.

The actual colors are controlled by CSS variables in `style.css`.

### 6.13 Resume download

Commands:

- `download`
- `resume`

Behavior:

1. Creates a temporary `<a>` element.
2. Points it to `Resume_Rajdeep.pdf`.
3. Sets `download = 'Resume_Rajdeep.pdf'`.
4. Clicks it programmatically.
5. Removes the temporary element.

If the resume file name changes, update both:

- the actual PDF filename in the repo
- the `link.href` and `link.download` values in `script.js`

### 6.14 Diagnostic simulator

There are two diagnostic-related blocks:

- `runTerminalScan()` inside `initTerminal()`
- `window.runDiagnostic(projectId)`

Current user-facing command:

- `scan`
- `hack`

The project card diagnostic buttons were previously removed, so `window.runDiagnostic(projectId)` is mostly legacy support. It is still safe to keep unless you want to simplify the script further.

### 6.15 Contact form handler

Global function:

`window.handleFormSubmit(event)`

This is called by the form in `index.html`:

`onsubmit="handleFormSubmit(event)"`

It sends mail through FormSubmit's AJAX endpoint:

`https://formsubmit.co/ajax/rajdeeppalwork@gmail.com`

The form fields in `index.html` include `name` attributes so FormSubmit receives the submitted values:

- `name`
- `email`
- `subject`
- `message`

The handler appends FormSubmit metadata:

- `_subject`
- `_template`
- `_captcha`

It preserves the portfolio's themed flow:

- encryption
- packet broadcast
- successful transmission

Then it shows a success alert and resets the form. If the request fails, it marks the channel status as `FAILED` and asks the visitor to email directly.

Important: FormSubmit may require a one-time activation email confirmation for `rajdeeppalwork@gmail.com` after the first live submission.

### 6.16 Scroll warp effect

Function:

`initScrollWarp()`

This creates subtle visual skew/scale effects while scrolling:

- window-level effects on terminal wrapper, stats dashboard, hero content, and cards
- terminal-level effects on cards inside the terminal body

It runs continuously through:

`requestAnimationFrame(trackScrollWarp)`

If performance ever feels heavy on low-end devices, this function is the first candidate to simplify or disable.

---

## 7. Current Content Inventory

### 7.1 Static content in `index.html`

Edit `index.html` for:

- page title and metadata
- header nav labels
- hero headline
- hero paragraph
- stats dashboard
- Contact button text
- contact form labels/placeholders
- email, phone, LinkedIn, GitHub links
- footer text

### 7.2 Dynamic terminal content in `script.js`

Edit `script.js` for:

- professional summary
- visitor metadata card layout
- experience descriptions
- project descriptions and links
- skill categories and percentages
- credential cards
- terminal command behavior
- theme command behavior
- resume download behavior

### 7.3 Visual design in `style.css`

Edit `style.css` for:

- colors
- spacing
- layout grids
- responsive behavior
- terminal appearance
- card styles
- contact form styling
- theme variants
- animations

---

## 8. How Navigation Works

The portfolio is not multiple pages. It is one HTML page pretending to be multiple sections.

There are two real top-level sections:

1. `#hero`
2. `#contact`

Overview, Experience, Projects, Skills, and Credentials all render inside the terminal within `#hero`.

Contact is different: it is a separate visible page section in the HTML.

Navigation flow:

1. User clicks a nav link.
2. `initNavigation()` intercepts the click.
3. It prevents the browser's normal hash jump.
4. It extracts the hash text, such as `projects`.
5. It calls `window.switchTab('projects')`.
6. `switchTab()` shows either:
   - the hero section and runs a terminal command, or
   - the contact section directly
7. `syncTerminalView()` updates nav active states and terminal layout mode.

---

## 9. How Terminal Rendering Works

The terminal output area is:

`#terminal-log`

When a command runs:

1. The input value is captured.
2. A command echo line is printed.
3. `processCommand(rawCmd)` decides what to do.
4. For section commands, the log is cleared.
5. A template function returns an HTML string.
6. `appendHTML(htmlString)` converts the HTML string to DOM nodes.
7. The new content is appended to `#terminal-log`.
8. The terminal scroll position is adjusted.

Section commands scroll to the top so the heading is visible. Utility commands scroll to the bottom so the latest output is visible.

---

## 10. Deployment MOP - GitHub Pages

### 10.1 How GitHub Pages serves this site

GitHub Pages serves the root of the `main` branch from:

`rajdeeppal01/portfolio`

Because `index.html` is at the repo root, GitHub Pages uses it as the homepage.

Live URL:

`https://rajdeeppal01.github.io/portfolio/`

### 10.2 Manual GitHub upload procedure

Use this method if Git is unavailable:

1. Open the repository on GitHub.
2. Go to the `main` branch.
3. Upload or edit changed files:
   - `index.html`
   - `style.css`
   - `script.js`
   - `Resume_Rajdeep.pdf` if changed
4. Commit directly to `main`.
5. Wait 1-3 minutes for GitHub Pages to refresh.
6. Open the live URL and hard-refresh the browser.

### 10.3 API push procedure used in this session

Because `git` and `gh` were not available in the local shell, the updated files were pushed using the GitHub Contents API.

Files pushed:

- `index.html`
- `script.js`

Commit message used:

`Remove personal and audio deck sections`

Important security rule:

Any GitHub Personal Access Token used for this should be temporary and revoked immediately after use.

### 10.4 Recommended future Git workflow

If Git is installed later, the normal flow should be:

```powershell
git clone https://github.com/rajdeeppal01/portfolio.git
cd portfolio
git status
git add index.html style.css script.js Resume_Rajdeep.pdf
git commit -m "Update portfolio"
git push origin main
```

---

## 11. Standard Change Procedures

### 11.1 Change hero text

File:

`index.html`

Edit:

- `.hero-title`
- `.hero-subtitle`
- `.hero-desc`
- `.stats-dashboard`

Verify:

- desktop layout
- mobile layout
- text does not overflow

### 11.2 Change nav items

Files:

- `index.html`
- `script.js`

Steps:

1. Add or remove `<a class="nav-link">` in `index.html`.
2. Add/remove command handling in `script.js`.
3. Update `printDirectoryList()`.
4. Update `help` output.
5. Update `sectionCmds` arrays.
6. Verify click navigation and terminal commands.

### 11.3 Change Experience section

File:

`script.js`

Function:

`getExperienceHTML()`

Verify:

- command `experience`
- command `exp`
- command `cd experience`
- nav link Experience

### 11.4 Change Projects section

File:

`script.js`

Function:

`getProjectsHTML()`

Related CSS:

- `.terminal-projects-grid`
- `.project-terminal-card`
- `.project-terminal-card[data-project-id="jcs-suite"]`

Verify:

- project card spacing
- links open in new tabs
- mobile grid collapses cleanly

### 11.5 Change Skills section

File:

`script.js`

Function:

`getSkillsHTML()`

If changing progress bars, ensure each bar has:

`data-level="NN%"`

The width animation is triggered by `appendHTML()`.

### 11.6 Change Credentials section

File:

`script.js`

Function:

`getCredentialsHTML()`

Related CSS:

- `.terminal-certs-grid`
- `.terminal-cert-card`
- `.terminal-ach-banner`

### 11.7 Change Contact details

File:

`index.html`

Edit:

- `mailto:` link
- `tel:` link
- LinkedIn URL
- GitHub URL
- visible contact text

If changing form behavior, edit:

`window.handleFormSubmit(event)` in `script.js`.

### 11.8 Change resume PDF

Steps:

1. Replace `Resume_Rajdeep.pdf` in the repo root.
2. Keep the same filename if possible.
3. If changing filename, update `script.js` download command.
4. Push the new PDF.
5. Test the terminal command:
   - `download`
   - `resume`

### 11.9 Change colors

File:

`style.css`

Preferred method:

1. Edit `:root` variables for default theme.
2. Edit `body.theme-*` blocks for command themes.
3. Avoid hardcoding colors in individual components unless needed.

### 11.10 Add a new terminal section

Steps:

1. Add a nav link in `index.html`.
2. Create a new `getNewSectionHTML()` function in `script.js`.
3. Add command cases in `processCommand()`.
4. Add `cd` support.
5. Add the section to `printDirectoryList()`.
6. Add help text.
7. Add the command to `sectionCmds` arrays.
8. Add CSS classes if needed.
9. Test direct command, `cd`, and nav click.

---

## 12. Removed Features Registry

The following features were intentionally removed from the live portfolio:

| Feature | Removed from |
| --- | --- |
| Personal nav link | `index.html` |
| Audio Deck nav link | `index.html` |
| Floating mini music widget | `index.html` |
| YouTube iframe player loader/controller | `script.js` |
| `getPersonalHTML()` | `script.js` |
| `getAudioDeckHTML()` | `script.js` |
| `personal` command | `script.js` |
| `audio` command | `script.js` |
| `music` command | `script.js` |
| `personal/` and `audio/` terminal directory entries | `script.js` |
| Personal/Audio help text | `script.js` |

Post-removal verification:

- No remaining Personal/Audio Deck references in `index.html`, `style.css`, or `script.js`.
- `node --check script.js` passed.
- Remote GitHub raw files were checked after push and showed zero matches for the removed feature references.

---

## 13. Verification Checklist

Run this checklist after every meaningful change.

### 13.1 Static file checks

- Confirm `index.html` loads `style.css`.
- Confirm `index.html` loads `script.js`.
- Confirm `Resume_Rajdeep.pdf` exists if resume command is enabled.
- Search for stale removed feature references if deleting sections.

### 13.2 JavaScript syntax

Run:

```powershell
node --check script.js
```

Expected result:

No output and exit code `0`.

### 13.3 Browser behavior

Open the site and test:

- Overview nav
- Experience nav
- Projects nav
- Skills nav
- Credentials nav
- Contact nav
- Logo click
- Contact button
- terminal input focus
- terminal section scroll-to-top behavior

### 13.4 Terminal commands

Test:

```text
help
ls
whoami
experience
projects
skills
credentials
contact
theme list
theme matrix
theme obsidian
download
clear
```

### 13.5 Responsive checks

Check at:

- desktop width
- tablet width
- mobile width

Look for:

- nav wrapping issues
- terminal overflow
- cards too wide
- contact links wrapping badly
- text clipped inside buttons

### 13.6 Deployment checks

After pushing:

1. Wait 1-3 minutes.
2. Open `https://rajdeeppal01.github.io/portfolio/`.
3. Hard refresh.
4. Test navigation and key terminal commands.
5. Verify the live files if needed through raw GitHub URLs.

---

## 14. Known Notes and Risks

### 14.1 Contact form uses FormSubmit

The contact form now sends real email through FormSubmit's AJAX endpoint. The first real submission may trigger a one-time activation email to `rajdeeppalwork@gmail.com`; confirm that email once so future messages deliver normally.

### 14.2 Public visitor IP fetch

The `whoami` command uses visitor metadata fetched from `ipapi.co`. If that request fails, fallback values are used. This does not break the site.

### 14.3 Git not installed in current shell

During the latest update, `git` and `gh` were not available in the environment. GitHub API push was used instead.

### 14.4 Documentation is local unless pushed

This MOP is saved locally in the documentation folder. It is not automatically part of the GitHub Pages repo unless copied into the repository and pushed.

---

## 15. Quick Reference

### Live site

`https://rajdeeppal01.github.io/portfolio/`

### Repository

`https://github.com/rajdeeppal01/portfolio`

### Current source files

`C:\Users\rajde\OneDrive\Desktop\projects\portfolio-source\portfolio-main`

### Current documentation file

`C:\Users\rajde\OneDrive\Desktop\projects\portfolio\Portfolio_MOP_Documentation.md`

### Main files to edit

- HTML/content shell: `index.html`
- styling/layout/themes: `style.css`
- behavior/terminal/content templates: `script.js`
- resume asset: `Resume_Rajdeep.pdf`

### Current active sections

- Overview
- Experience
- Projects
- Skills
- Credentials
- Contact

### Current removed sections

- Personal
- Audio Deck
