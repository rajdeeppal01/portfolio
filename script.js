let visitorIP = '192.168.1.105 (Local NAT)';
let visitorLocation = 'Unknown Location';

// Fetch visitor details in the background on load
fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(data => {
        if (data.ip) visitorIP = data.ip;
        if (data.city && data.country_name) {
            visitorLocation = `${data.city}, ${data.country_name}`;
        }
    })
    .catch(() => {
        // Fallback is already set
    });

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initSessionTracker();
    initTypingAnimation();
    initNavigation();
    initTerminal();
    initScrollWarp(); // Double-layered scroll warp loop (Window + Terminal)
});

/* --------------------------------------------------------------------------
   01. REAL-TIME CLOCK & SESSION TRACKER
   -------------------------------------------------------------------------- */
function initClock() {
    const clockElement = document.getElementById('header-time');
    if (!clockElement) return;

    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds} IST`;
    }

    updateTime();
    setInterval(updateTime, 1000);
}

function initSessionTracker() {
    const sessionElement = document.getElementById('session-time');
    if (!sessionElement) return;

    let totalSeconds = 0;
    setInterval(() => {
        totalSeconds++;
        const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(totalSeconds % 60).padStart(2, '0');
        sessionElement.textContent = `${hrs}:${mins}:${secs}`;
    }, 1000);
}

/* --------------------------------------------------------------------------
   02. TYPING ANIMATION (HERO SUBTITLE)
   -------------------------------------------------------------------------- */
function initTypingAnimation() {
    const subtitleElement = document.getElementById('type-subtitle');
    if (!subtitleElement) return;

    const phrases = [
        "Cybersecurity Analyst",
        "Threat Detection Engineer",
        "AI-Security Integrator",
        "Security Automation Developer"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            subtitleElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            subtitleElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* --------------------------------------------------------------------------
   03. NAVIGATION & TERMINAL COMMAND INTERCEPTORS
   -------------------------------------------------------------------------- */
// Unified tab switching logic
function syncTerminalView(command) {
    const heroSection = document.getElementById('hero');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Update navigation active states
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').replace('#', '');
        if (href === command) {
            link.classList.add('active');
        }
    });

    if (heroSection) {
        if (command === 'overview') {
            heroSection.classList.remove('terminal-only-view');
        } else {
            heroSection.classList.add('terminal-only-view');
        }
    }
}

window.switchTab = function(command) {
    const sections = document.querySelectorAll('.saas-section');

    // Hide all sections, show the active one!
    sections.forEach(sec => sec.classList.remove('active-sec'));
    
    if (command === 'contact') {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.classList.add('active-sec');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            heroSection.classList.add('active-sec');
        }
        syncTerminalView(command);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Trigger command execution in terminal
        if (window.executeTerminalCommand) {
            window.executeTerminalCommand(command);
        }
    }
};

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const btnGoContact = document.getElementById('btn-go-contact');
    const terminalInput = document.getElementById('terminal-input');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').replace('#', '');
            if (window.switchTab) {
                window.switchTab(targetId);
            }
        });
    });

    const logoLink = document.getElementById('logo-home-link');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.switchTab) {
                window.switchTab('overview');
            }
        });
    }

    if (btnGoContact) {
        btnGoContact.addEventListener('click', () => {
            if (window.switchTab) window.switchTab('contact');
        });
    }

    // Intercept hash navigation on load
    if (window.location.hash) {
        const initialCmd = window.location.hash.replace('#', '');
        setTimeout(() => {
            if (window.switchTab) window.switchTab(initialCmd);
        }, 300);
    }
}

function getWelcomeBannerHTML() {
    return `
<pre class="terminal-banner" style="color: var(--primary-green); font-size: 0.85rem; line-height: 1.25; margin-bottom: 1.25rem; font-family: var(--font-mono); overflow-x: auto; white-space: pre; text-align: center; text-shadow: 0 0 5px var(--primary-green-glow);">
             ___
          .-'   '-.
         /   \\\\ /   \\\\
        |  -- O --  |
         \\\\   / \\\\   /
          '-.   .-'
             """
</pre>`;
}

function getWelcomeGuideHTML() {
    return `
<div class="terminal-card" style="border-color: var(--border-slate); background-color: transparent; border-style: dashed; font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.5; margin-bottom: 1rem;">
    <div style="color: var(--primary-green); margin-bottom: 0.35rem;"><strong>[+] Core Console Commands:</strong></div>
    <div><span style="color: var(--primary-green); margin-right: 0.5rem;">•</span><strong style="color: var(--text-white);">whoami</strong>     - Extract visitor details & show professional summary.</div>
    <div><span style="color: var(--primary-green); margin-right: 0.5rem;">•</span><strong style="color: var(--text-white);">help</strong>       - View full CLI command reference menu.</div>
    <div><span style="color: var(--primary-green); margin-right: 0.5rem;">•</span><strong style="color: var(--text-white);">ls / cd</strong>    - Navigate folders (experience, projects, skills, credentials, contact).</div>
    <div><span style="color: var(--primary-green); margin-right: 0.5rem;">•</span><strong style="color: var(--text-white);">theme</strong>      - Change console colors (matrix, dracula, nord, obsidian).</div>
    <div><span style="color: var(--primary-green); margin-right: 0.5rem;">•</span><strong style="color: var(--text-white);">crt</strong>        - Toggle CRT retro scanline filter (on/off).</div>
    <div><span style="color: var(--primary-green); margin-right: 0.5rem;">•</span><strong style="color: var(--text-white);">download</strong>   - Download PDF resume package.</div>
    <div><span style="color: var(--primary-green); margin-right: 0.5rem;">•</span><strong style="color: var(--text-white);">clear</strong>      - Clear screen logs and reset terminal view.</div>
</div>`;
}

function getWhoamiHTML() {
    const ua = navigator.userAgent;
    let os = 'Unknown OS';
    if (ua.includes('Windows')) os = 'Windows OS';
    else if (ua.includes('Macintosh') || ua.includes('Mac OS')) os = 'Mac OS';
    else if (ua.includes('Linux')) os = 'Linux OS';
    else if (ua.includes('Android')) os = 'Android OS';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    let browser = 'Unknown Browser';
    if (ua.includes('Firefox')) browser = 'Mozilla Firefox';
    else if (ua.includes('Chrome') && ua.includes('Safari') && ua.includes('Edg')) browser = 'Microsoft Edge';
    else if (ua.includes('Chrome') && ua.includes('Safari')) browser = 'Google Chrome';
    else if (ua.includes('Safari')) browser = 'Apple Safari';

    return `
<div class="terminal-rich-container">
    <div class="terminal-sec-header">
        <span class="terminal-sec-num">[+]</span>
        <span class="terminal-sec-title">VISITOR SESSION DETECTED</span>
    </div>
    <div class="terminal-card" style="font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.5; border-color: var(--primary-green); background-color: var(--primary-green-dim);">
        <div><span style="color: var(--primary-green); margin-right: 0.5rem;">[>]</span><strong>IP Address:</strong> ${visitorIP}</div>
        <div><span style="color: var(--primary-green); margin-right: 0.5rem;">[>]</span><strong>Location:</strong> ${visitorLocation}</div>
        <div><span style="color: var(--primary-green); margin-right: 0.5rem;">[>]</span><strong>Operating System:</strong> ${os}</div>
        <div><span style="color: var(--primary-green); margin-right: 0.5rem;">[>]</span><strong>Browser Engine:</strong> ${browser}</div>
        <div><span style="color: var(--primary-green); margin-right: 0.5rem;">[>]</span><strong>Handshake Security:</strong> SEC_GUEST_SESSION_ACTIVE</div>
    </div>
</div>`;
}

function getAboutHTML() {
    return `
<div class="terminal-rich-container">
    <div class="terminal-sec-header">
        <span class="terminal-sec-num">00 //</span>
        <span class="terminal-sec-title">PROFESSIONAL SUMMARY</span>
    </div>
    <div class="terminal-card">
        <p style="font-size: 0.9rem; line-height: 1.55; margin-bottom: 0.75rem;">
            B.Tech Computer Science student specializing in <strong>Cybersecurity & Digital Forensics</strong> at UPES Dehradun. Driven by the convergence of security automation, cognitive threat intelligence, and intelligent systems engineering.
        </p>
        <p style="font-size: 0.9rem; line-height: 1.55;">
            Experienced in architecting modern microservice infrastructures, designing low-latency telemetry protocols, and deploying cognitive LLM agent planners for active penetration desynchronization. Currently validating and expanding threat detection suites at Jio Platforms Limited.
        </p>
    </div>
    <div class="terminal-card" style="margin-top: 0.65rem; border-color: var(--border-slate); background-color: transparent; border-style: dashed; font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.5;">
        <div style="color: var(--primary-green); margin-bottom: 0.35rem;"><strong>[i] CONSOLE QUICK START GUIDE:</strong></div>
        <div><span style="color: var(--primary-green); margin-right: 0.5rem;">•</span>Type <strong style="color: var(--text-white);">help</strong> to list all interactive system commands.</div>
        <div><span style="color: var(--primary-green); margin-right: 0.5rem;">•</span>Type <strong style="color: var(--text-white);">theme matrix</strong> | <strong style="color: var(--text-white);">theme dracula</strong> | <strong style="color: var(--text-white);">theme nord</strong> to customize themes.</div>
        <div><span style="color: var(--primary-green); margin-right: 0.5rem;">•</span>Use <strong style="color: var(--text-white);">ls</strong> / <strong style="color: var(--text-white);">cd [section]</strong> to navigate folders (experience, projects, skills, credentials, contact).</div>
    </div>
</div>`;
}

function getExperienceHTML() {
    return `
<div class="terminal-rich-container">
    <div class="terminal-sec-header">
        <span class="terminal-sec-num">01 //</span>
        <span class="terminal-sec-title">PROFESSIONAL EXPERIENCE</span>
    </div>
    <div class="terminal-timeline">
        <!-- Jio -->
        <div class="terminal-timeline-item">
            <div class="terminal-timeline-dot"></div>
            <div class="terminal-card terminal-timeline-content">
                <div class="terminal-card-header">
                    <span class="term-job-title">Cybersecurity Intern</span>
                    <span class="term-company">Jio Platforms Limited</span>
                </div>
                <div class="term-card-meta">June 2026 - Present | Navi Mumbai, IN</div>
                <div class="term-card-body">
                    <p>Developing and validating the <strong>Jio Cybersecurity Suite (JCS)</strong>, a converged cognitive security platform combining automated vulnerability analysis and threat simulation.</p>
                    <ul class="term-bullets">
                        <li><strong>Netra0 (Automated Threat Intelligence & CVE Scanner):</strong> Orchestrates target reconnaissance by scanning active TCP ports, extracting service banners, and querying live NVD v2.0 API endpoints to identify and rank network vulnerabilities using CVSS scores.</li>
                        <li><strong>Netra1 (Autonomous Pentesting Agent):</strong> Built an interactive agent powered by a Gemini 2.5 Flash cognitive planner to autonomously execute network intrusion and evasion modules (packet fragmentation, TLS tunneling, SSH brute-forcing, UDP DDoS floods) through a conversational console with built-in authorization gates.</li>
                        <li><strong>Suite Architecture:</strong> Containerized microservices (FastAPI, PostgreSQL, Redis, Celery) deployed via Kubernetes (Minikube) on RHEL 9.</li>
                    </ul>
                </div>
                <div class="term-tags">
                    <span class="term-tag">Gemini API</span>
                    <span class="term-tag">FastAPI</span>
                    <span class="term-tag">Kubernetes</span>
                    <span class="term-tag">Docker</span>
                    <span class="term-tag">RHEL 9</span>
                </div>
            </div>
        </div>

        <!-- Power Grid -->
        <div class="terminal-timeline-item">
            <div class="terminal-timeline-dot"></div>
            <div class="terminal-card terminal-timeline-content">
                <div class="terminal-card-header">
                    <span class="term-job-title">Cybersecurity Intern</span>
                    <span class="term-company">Power Grid Corporation of India Limited</span>
                </div>
                <div class="term-card-meta">June 2025 - July 2025 | Gurgaon, IN</div>
                <div class="term-card-body">
                    <p>Focused on automating log analysis pipelines and evaluating network posture under simulated intrusion scenarios.</p>
                    <ul class="term-bullets">
                        <li><strong>Security Automation:</strong> Developed and deployed two internal log analysis tools, reducing manual effort by approximately 40%.</li>
                        <li><strong>Vulnerability Analysis:</strong> Performed security testing and system behavior simulations to identify infrastructure vulnerabilities.</li>
                        <li><strong>SOC Integration:</strong> Collaborated with SOC analysts to align SIEM pipelines, alert prioritization, and threat intelligence integration.</li>
                    </ul>
                </div>
                <div class="term-tags">
                    <span class="term-tag">Python</span>
                    <span class="term-tag">SIEM</span>
                    <span class="term-tag">Log Analysis</span>
                </div>
            </div>
        </div>
    </div>
</div>`;
}

function getProjectsHTML() {
    return `
<div class="terminal-rich-container">
    <div class="terminal-sec-header">
        <span class="terminal-sec-num">02 //</span>
        <span class="terminal-sec-title">SYSTEM BUILDOUTS</span>
    </div>
    <div class="terminal-projects-grid">
        <!-- Jio Cybersecurity Suite -->
        <div class="terminal-card project-terminal-card" data-project-id="jcs-suite">
            <div class="term-proj-status">
                <span class="status-dot green"></span> STATUS: ACTIVE
            </div>
            <h4 class="term-proj-title">Jio Cybersecurity Suite (JCS)</h4>
            <p class="term-proj-desc" style="margin-bottom: 0.5rem;">
                A converged cognitive security platform combining automated CVE reconnaissance and active threat intrusion simulation, containerized in Kubernetes on RHEL 9.
            </p>
            <ul class="term-bullets" style="font-size: 0.82rem; margin-bottom: 0.85rem; color: var(--text-muted); list-style-type: none; padding-left: 0;">
                <li style="position: relative; padding-left: 0.85rem; margin-bottom: 0.35rem;"><strong style="color: var(--text-white);">Netra0 (Automated Threat Intelligence & CVE Scanner):</strong> Orchestrates target reconnaissance by scanning active TCP ports, extracting service banners, and querying live NVD v2.0 API endpoints to identify and rank network vulnerabilities using CVSS scores.</li>
                <li style="position: relative; padding-left: 0.85rem; margin-bottom: 0.35rem;"><strong style="color: var(--text-white);">Netra1 (Autonomous Pentesting Agent):</strong> Built an interactive agent powered by a Gemini 2.5 Flash cognitive planner to autonomously execute network intrusion and evasion modules (packet fragmentation, TLS tunneling, SSH brute-forcing, UDP DDoS floods) through a conversational console with built-in authorization gates.</li>
            </ul>
            <div class="term-tags">
                <span class="term-tag">FastAPI</span>
                <span class="term-tag">Kubernetes</span>
                <span class="term-tag">Docker</span>
                <span class="term-tag">RHEL 9</span>
            </div>
            <div class="term-proj-actions">
                <span class="term-action-link disabled">Jio Platforms</span>
            </div>
        </div>

        <!-- Event Viewer GUI -->
        <div class="terminal-card project-terminal-card" data-project-id="ev-gui">
            <div class="term-proj-status">
                <span class="status-dot green"></span> STATUS: STABLE
            </div>
            <h4 class="term-proj-title">Event Viewer GUI Tool</h4>
            <p class="term-proj-desc">
                A lightweight GUI-based alternative to the native Windows Event Viewer, tailored for threat hunting and rapid SOC triage. Implements multi-threaded log querying and advanced custom rule parsing.
            </p>
            <div class="term-tags">
                <span class="term-tag">PowerShell</span>
                <span class="term-tag">WinForms</span>
                <span class="term-tag">Windows API</span>
            </div>
            <div class="term-proj-actions">
                <a href="https://github.com/rajdeeppal01/custom-event-viewer" target="_blank" rel="noopener noreferrer" class="term-action-link">Repository ↗</a>
            </div>
        </div>

        <!-- Windows Event Log Parser -->
        <div class="terminal-card project-terminal-card" data-project-id="log-parser">
            <div class="term-proj-status">
                <span class="status-dot green"></span> STATUS: STABLE
            </div>
            <h4 class="term-proj-title">Windows Event Log Parser</h4>
            <p class="term-proj-desc">
                A cross-version log analysis tool written in Python capable of parsing Windows Event Logs, Apache access logs, and generic web server outputs to identify brute-force patterns and anomalous account behavior.
            </p>
            <div class="term-tags">
                <span class="term-tag">Python</span>
                <span class="term-tag">Tkinter</span>
                <span class="term-tag">Regex Engines</span>
            </div>
            <div class="term-proj-actions">
                <a href="https://github.com/rajdeeppal01/custom-log-parser" target="_blank" rel="noopener noreferrer" class="term-action-link">Repository ↗</a>
            </div>
        </div>

        <!-- PehraSafe Telemetry -->
        <div class="terminal-card project-terminal-card" data-project-id="location-telemetry">
            <div class="term-proj-status">
                <span class="status-dot green"></span> STATUS: OPTIMIZED
            </div>
            <h4 class="term-proj-title">PehraSafe Location Telemetry</h4>
            <p class="term-proj-desc">
                A low-latency, bandwidth-optimized location telemetry protocol designed specifically for tactical security teams operating in environments with degraded, low-bandwidth network connectivity.
            </p>
            <div class="term-tags">
                <span class="term-tag">Telemetry Prot.</span>
                <span class="term-tag">Networks</span>
                <span class="term-tag">Optimization</span>
            </div>
            <div class="term-proj-actions">
                <span class="term-action-link disabled">Proprietary</span>
            </div>
        </div>
    </div>
</div>`;
}

function getSkillsHTML() {
    return `
<div class="terminal-rich-container">
    <div class="terminal-sec-header">
        <span class="terminal-sec-num">03 //</span>
        <span class="terminal-sec-title">TECHNICAL MATRIX</span>
    </div>
    <div class="terminal-skills-grid">
        <!-- Skill Cat 1 -->
        <div class="terminal-card terminal-skills-category">
            <h5>Programming & Scripting</h5>
            <div class="term-skills-list">
                <div class="term-skill-item">
                    <div class="term-skill-info">
                        <span>Python <span class="term-sub-skill">(FastAPI, Celery, PostgreSQL, Redis, Paramiko)</span></span>
                        <span>90%</span>
                    </div>
                    <div class="term-bar-wrap">
                        <div class="term-skill-bar" data-level="90%"></div>
                    </div>
                </div>
                <div class="term-skill-item">
                    <div class="term-skill-info">
                        <span>PowerShell & Bash</span>
                        <span>85%</span>
                    </div>
                    <div class="term-bar-wrap">
                        <div class="term-skill-bar" data-level="85%"></div>
                    </div>
                </div>
                <div class="term-skill-item">
                    <div class="term-skill-info">
                        <span>JavaScript <span class="term-sub-skill">(Vanilla, WebSockets, Conversational Consoles)</span></span>
                        <span>80%</span>
                    </div>
                    <div class="term-bar-wrap">
                        <div class="term-skill-bar" data-level="80%"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Skill Cat 2 -->
        <div class="terminal-card terminal-skills-category">
            <h5>Infrastructure & DevOps</h5>
            <div class="term-skills-list">
                <div class="term-skill-item">
                    <div class="term-skill-info">
                        <span>Kubernetes <span class="term-sub-skill">(Minikube)</span> & Docker</span>
                        <span>85%</span>
                    </div>
                    <div class="term-bar-wrap">
                        <div class="term-skill-bar" data-level="85%"></div>
                    </div>
                </div>
                <div class="term-skill-item">
                    <div class="term-skill-info">
                        <span>RHEL 9 & Kali Linux</span>
                        <span>85%</span>
                    </div>
                    <div class="term-bar-wrap">
                        <div class="term-skill-bar" data-level="85%"></div>
                    </div>
                </div>
                <div class="term-skill-item">
                    <div class="term-skill-info">
                        <span>Git & GitHub workflows</span>
                        <span>90%</span>
                    </div>
                    <div class="term-bar-wrap">
                        <div class="term-skill-bar" data-level="90%"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Skill Cat 3 -->
        <div class="terminal-card terminal-skills-category">
            <h5>AI-Security Integration</h5>
            <div class="term-skills-list">
                <div class="term-skill-item">
                    <div class="term-skill-info">
                        <span>LLM API Integration <span class="term-sub-skill">(Gemini 2.5 Flash, Claude)</span></span>
                        <span>90%</span>
                    </div>
                    <div class="term-bar-wrap">
                        <div class="term-skill-bar" data-level="90%"></div>
                    </div>
                </div>
                <div class="term-skill-item">
                    <div class="term-skill-info">
                        <span>Autonomous ReAct Agent Loops</span>
                        <span>85%</span>
                    </div>
                    <div class="term-bar-wrap">
                        <div class="term-skill-bar" data-level="85%"></div>
                    </div>
                </div>
                <div class="term-skill-item">
                    <div class="term-skill-info">
                        <span>Cognitive Security Planning <span class="term-sub-skill">(Authorization Gates)</span></span>
                        <span>80%</span>
                    </div>
                    <div class="term-bar-wrap">
                        <div class="term-skill-bar" data-level="80%"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Skill Cat 4 -->
        <div class="terminal-card terminal-skills-category">
            <h5>Security Core Concepts</h5>
            <div class="term-skills-list">
                <div class="term-skill-item">
                    <div class="term-skill-info">
                        <span>Threat Detection <span class="term-sub-skill">(Wazuh, Suricata)</span></span>
                        <span>85%</span>
                    </div>
                    <div class="term-bar-wrap">
                        <div class="term-skill-bar" data-level="85%"></div>
                    </div>
                </div>
                <div class="term-skill-item">
                    <div class="term-skill-info">
                        <span>Vulnerability Analysis <span class="term-sub-skill">(CVSS v3, Live NVD API)</span></span>
                        <span>80%</span>
                    </div>
                    <div class="term-bar-wrap">
                        <div class="term-skill-bar" data-level="80%"></div>
                    </div>
                </div>
                <div class="term-skill-item">
                    <div class="term-skill-info">
                        <span>NIDS Evasion & Intrusion Modules <span class="term-sub-skill">(TLS Tunneling, SSH Brute, UDP Floods, Packet Frag.)</span></span>
                        <span>80%</span>
                    </div>
                    <div class="term-bar-wrap">
                        <div class="term-skill-bar" data-level="80%"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
}

function getCredentialsHTML() {
    return `
<div class="terminal-rich-container">
    <div class="terminal-sec-header">
        <span class="terminal-sec-num">04 //</span>
        <span class="terminal-sec-title">AUTHENTICATION SHIELDS</span>
    </div>
    <div class="terminal-certs-grid">
        <div class="terminal-card terminal-cert-card">
            <span class="term-cert-issuer">ISC2</span>
            <h5 class="term-cert-name">Certified in Cybersecurity (CC)</h5>
            <span class="term-cert-date">ISSUED: 2025</span>
        </div>
        <div class="terminal-card terminal-cert-card">
            <span class="term-cert-issuer">AWS</span>
            <h5 class="term-cert-name">AWS Security Learning Plan</h5>
            <span class="term-cert-date">ISSUED: 2025</span>
        </div>
        <div class="terminal-card terminal-cert-card">
            <span class="term-cert-issuer">GOOGLE</span>
            <h5 class="term-cert-name">Startup School: Prompt to Prototype</h5>
            <span class="term-cert-date">ISSUED: 2025</span>
        </div>
        <div class="terminal-card terminal-cert-card">
            <span class="term-cert-issuer">TCS iON</span>
            <h5 class="term-cert-name">AI with Python - Deep Neural Networks</h5>
            <span class="term-cert-date">ISSUED: 2024</span>
        </div>
        <div class="terminal-card terminal-cert-card">
            <span class="term-cert-issuer">POSTMAN</span>
            <h5 class="term-cert-name">API Fundamentals Student Expert</h5>
            <span class="term-cert-date">ISSUED: 2025</span>
        </div>
        <div class="terminal-card terminal-cert-card">
            <span class="term-cert-issuer">POWERGRID</span>
            <h5 class="term-cert-name">Cybersecurity Industrial Internship</h5>
            <span class="term-cert-date">ISSUED: 2025</span>
        </div>
        <div class="terminal-card terminal-cert-card">
            <span class="term-cert-issuer">ISRO</span>
            <h5 class="term-cert-name">AI/ML for Geodata Analysis</h5>
            <span class="term-cert-date">ISSUED: 2025</span>
        </div>
        <div class="terminal-card terminal-cert-card">
            <span class="term-cert-issuer">FORAGE SIMULATIONS</span>
            <h5 class="term-cert-name">Deloitte, TATA, Mastercard</h5>
            <span class="term-cert-date">ISSUED: 2025</span>
        </div>
    </div>
    <div class="terminal-card terminal-ach-banner">
        <div class="term-ach-title">IEEE CIS Student Chapter — PR Associate Head (2025 - 2026)</div>
        <p class="term-ach-desc">Led public relations, event promotions, and community building, driving cybersecurity awareness and tech workshops for over 500+ active members.</p>
    </div>
</div>`;
}

/* --------------------------------------------------------------------------
   05. INTERACTIVE TERMINAL LOGIC & COMMAND PROCESSOR
   -------------------------------------------------------------------------- */
function initTerminal() {
    const input = document.getElementById('terminal-input');
    const log = document.getElementById('terminal-log');
    const screen = document.getElementById('terminal-screen');

    if (!input || !log || !screen) return;

    // Focus input on screen click
    screen.addEventListener('click', () => {
        input.focus({ preventScroll: true });
    });

    // Handle command submission
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            input.value = '';
            
            printLine(`guest@raj-console:~$ ${command}`, 'input-echo');
            
            if (command) {
                processCommand(command);
            }
            
            // Scroll to top for section commands, scroll to bottom for others!
            const sectionCmds = ['overview', 'about', 'experience', 'exp', 'projects', 'proj', 'skills', 'credentials', 'certs'];
            const cmdLower = command.trim().toLowerCase();
            const isCdSection = cmdLower.startsWith('cd ') && sectionCmds.some(s => cmdLower.includes(s));
            
            if (sectionCmds.includes(cmdLower) || isCdSection || cmdLower.startsWith('cd ~') || cmdLower === 'cd') {
                screen.scrollTop = 0;
            } else {
                screen.scrollTop = screen.scrollHeight;
            }
        }
    });

    function printLine(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        log.appendChild(line);
    }

    // Append raw HTML directly into the terminal log
    function appendHTML(htmlString) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString.trim();
        
        const childNode = tempDiv.firstChild;
        log.appendChild(childNode);

        // Trigger animations for skill progress bars if present
        setTimeout(() => {
            const bars = childNode.querySelectorAll('.term-skill-bar');
            bars.forEach(bar => {
                bar.style.width = bar.getAttribute('data-level');
            });
        }, 100);
    }

    function printDirectoryList() {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `
<span class="dir-highlight">overview/</span>    
<span class="dir-highlight">experience/</span>    
<span class="dir-highlight">projects/</span>    
<span class="dir-highlight">skills/</span>    
<span class="dir-highlight">credentials/</span>    
<span class="dir-highlight">contact/</span>`.trim();
        log.appendChild(line);
    }

    function processCommand(rawCmd) {
        const cleanCmd = rawCmd.trim();
        const lowerCmd = cleanCmd.toLowerCase();
        const tokens = cleanCmd.split(' ');
        const baseCmd = tokens[0].toLowerCase();

        // Handle cd command
        if (baseCmd === 'cd') {
            const path = tokens.slice(1).join(' ').trim().toLowerCase();
            
            if (!path || path === '~' || path === '/') {
                log.innerHTML = '';
                printLine(`guest@raj-console:~$ cd ${path || ''}`, 'input-echo');
                appendHTML(getWhoamiHTML());
                appendHTML(getAboutHTML());
                syncTerminalView('overview');
            } else if (path === '..' || path === '../') {
                log.innerHTML = '';
                printLine('guest@raj-console:~$ cd ..', 'input-echo');
                appendHTML(getWhoamiHTML());
                appendHTML(getAboutHTML());
                syncTerminalView('overview');
            } else if (path === 'overview') {
                log.innerHTML = '';
                printLine('guest@raj-console:~$ cd overview', 'input-echo');
                appendHTML(getWhoamiHTML());
                appendHTML(getAboutHTML());
                syncTerminalView('overview');
            } else if (path === 'experience' || path === 'exp') {
                log.innerHTML = '';
                printLine('guest@raj-console:~$ cd experience', 'input-echo');
                appendHTML(getExperienceHTML());
                syncTerminalView('experience');
            } else if (path === 'projects' || path === 'proj') {
                log.innerHTML = '';
                printLine('guest@raj-console:~$ cd projects', 'input-echo');
                appendHTML(getProjectsHTML());
                syncTerminalView('projects');
            } else if (path === 'skills') {
                log.innerHTML = '';
                printLine('guest@raj-console:~$ cd skills', 'input-echo');
                appendHTML(getSkillsHTML());
                syncTerminalView('skills');
            } else if (path === 'credentials' || path === 'certs') {
                log.innerHTML = '';
                printLine('guest@raj-console:~$ cd credentials', 'input-echo');
                appendHTML(getCredentialsHTML());
                syncTerminalView('certs');
            } else if (path === 'contact') {
                printLine('[+] Redirecting to contact section...', 'success-msg');
                setTimeout(() => {
                    if (window.switchTab) window.switchTab('contact');
                }, 300);
            } else {
                printLine(`bash: cd: ${path}: No such file or directory`, 'error-msg');
            }
            return;
        }

        // Handle ls command
        if (lowerCmd === 'ls') {
            printDirectoryList();
            return;
        }

        // Handle theme command
        if (baseCmd === 'theme') {
            const themeName = tokens.slice(1).join(' ').trim().toLowerCase();
            const validThemes = ['matrix', 'dracula', 'nord', 'obsidian', 'default'];
            
            if (!themeName || themeName === 'list') {
                printLine('Available console themes:', 'success-msg');
                printLine('  theme obsidian - (Default) Warm Obsidian Dark');
                printLine('  theme matrix   - Digital Green on Black');
                printLine('  theme dracula  - Cyberpunk Vampire Purple');
                printLine('  theme nord     - Frosty Scandinavian Blue');
                return;
            }
            
            if (validThemes.includes(themeName)) {
                // Remove all existing theme classes
                document.body.classList.remove('theme-matrix', 'theme-dracula', 'theme-nord', 'theme-obsidian');
                
                if (themeName === 'default' || themeName === 'obsidian') {
                    printLine('[+] Color theme synchronized: Obsidian Default.', 'success-msg');
                } else {
                    document.body.classList.add(`theme-${themeName}`);
                    printLine(`[+] Color theme synchronized: ${themeName.charAt(0).toUpperCase() + themeName.slice(1)}.`, 'success-msg');
                }
            } else {
                printLine(`bash: theme: "${themeName}" is not a recognized console theme. Type "theme list" to view options.`, 'error-msg');
            }
            return;
        }

        // Handle clearing previous sections before loading a new one
        switch (lowerCmd) {
            case 'whoami':
            case 'overview':
            case 'about':
                log.innerHTML = '';
                printLine(`guest@raj-console:~$ ${lowerCmd}`, 'input-echo');
                appendHTML(getWhoamiHTML());
                appendHTML(getAboutHTML());
                syncTerminalView('overview');
                break;
                
            case 'experience':
            case 'exp':
                log.innerHTML = '';
                printLine('guest@raj-console:~$ experience', 'input-echo');
                appendHTML(getExperienceHTML());
                syncTerminalView('experience');
                break;
                
            case 'projects':
            case 'proj':
                log.innerHTML = '';
                printLine('guest@raj-console:~$ projects', 'input-echo');
                appendHTML(getProjectsHTML());
                syncTerminalView('projects');
                break;
                
            case 'skills':
                log.innerHTML = '';
                printLine('guest@raj-console:~$ skills', 'input-echo');
                appendHTML(getSkillsHTML());
                syncTerminalView('skills');
                break;
                
            case 'credentials':
            case 'certs':
                log.innerHTML = '';
                printLine('guest@raj-console:~$ credentials', 'input-echo');
                appendHTML(getCredentialsHTML());
                syncTerminalView('certs');
                break;
                
            case 'contact':
                printLine('[+] Redirecting to contact section...', 'success-msg');
                setTimeout(() => {
                    if (window.switchTab) window.switchTab('contact');
                }, 300);
                break;
                
            case 'help':
            case 'menu':
                printLine('Raj Command Console Utility - Core Manual:', 'success-msg');
                printLine('  ls         - List all portfolio sections (directories).');
                printLine('  cd [dir]   - Change directory (cd Overview, cd Projects, etc.).');
                printLine('  whoami     - Print visitor digital-forensics session metadata & bio.');
                printLine('  overview   - Print Rajdeep Pal bio profile.');
                printLine('  experience - Render the professional career timeline.');
                printLine('  projects   - Render active system buildouts.');
                printLine('  skills     - Render the technical matrices.');
                printLine('  credentials- Display authenticated learning shields.');
                printLine('  contact    - Scroll down to the contact dispatch section.');
                printLine('  theme [t]  - Change console theme (theme list for options).');
                printLine('  crt        - Toggle CRT retro scanline screen effect.');
                printLine('  download   - Download Rajdeep Pal PDF resume.');
                printLine('  clear      - Purge console screen logs.');
                break;
                
            case 'crt':
                const isActive = document.body.classList.toggle('crt-active');
                if (isActive) {
                    printLine('[+] CRT retro scanline filter: ENABLED.', 'success-msg');
                } else {
                    printLine('[+] CRT retro scanline filter: DISABLED (Pristine Obsidian Mode active).', 'success-msg');
                }
                break;
                
            case 'download':
            case 'resume':
                printLine('[+] Initiating secure resume transmission...', 'success-msg');
                setTimeout(() => {
                    const link = document.createElement('a');
                    link.href = 'Resume_Rajdeep.pdf';
                    link.download = 'Resume_Rajdeep.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    printLine('[✓] Resume package successfully transmitted.', 'success-msg');
                }, 1000);
                break;
                
            case 'scan':
            case 'hack':
                runTerminalScan();
                break;
                
            case 'clear':
                log.innerHTML = '';
                appendHTML(getWelcomeBannerHTML());
                printLine("Welcome to Rajdeep Pal's interactive portfolio console.", 'info-msg');
                printLine("Type whoami to learn more about me! Or click navigation links above to explore.", 'info-msg');
                printLine('');
                appendHTML(getWelcomeGuideHTML());
                break;
                
            default:
                printLine(`Command not found: "${rawCmd}". Type "help" to view core manual.`, 'error-msg');
        }
    }

    function runTerminalScan() {
        printLine('[+] Initializing Raj Secure Diagnostic Audit...', 'success-msg');
        input.disabled = true;
        
        const scanSteps = [
            { text: '[+] Ingesting cognitive planner directives...', delay: 300 },
            { text: '[+] Connecting to active Kubernetes cluster namespace... ONLINE.', delay: 600 },
            { text: '[+] Resolving local Redis broker and Celery worker tiers... Connected.', delay: 1000 },
            { text: '[+] Triggering Netra0 vulnerability scanner: checking local ports... 80/open, 443/open, 2201/secured.', delay: 1400 },
            { text: '[+] Initiating Netra1 autonomous penetration simulation: evasion gates validation... PASS.', delay: 1800 },
            { text: '[+] Querying live NVD CVE database API... 0 matching CVE correlations.', delay: 2200 },
            { text: '[+] System safety auth guards verified: securely cleared.', delay: 2500 },
            { text: '=======================================================', delay: 2700 },
            { text: 'RAJ SECURITY NODE DIAGNOSTIC SUMMARY:', delay: 2800, class: 'success-msg' },
            { text: '  - Cognitive Agent Status: ACTIVE (Gemini-2.5-Flash)', delay: 2900 },
            { text: '  - Network Vulnerabilities Identified: 0 (Secure)', delay: 3000 },
            { text: '  - Evasion Modules Efficacy: 100%', delay: 3100 },
            { text: '  - Security Policies Compliance: SECURE', delay: 3200 },
            { text: '=======================================================', delay: 3300 },
            { text: '[+] Node diagnostic completed. Status: SECURE.', delay: 3500, class: 'success-msg' }
        ];

        scanSteps.forEach(step => {
            setTimeout(() => {
                printLine(step.text, step.class || 'system-msg');
                screen.scrollTop = screen.scrollHeight;
                
                if (step.delay === 3500) {
                    input.disabled = false;
                    input.focus({ preventScroll: true });
                }
            }, step.delay);
        });
    }

    // Expose command executor globally for navigation clicks
    window.executeTerminalCommand = function(cmd) {
        input.focus({ preventScroll: true });
        input.value = cmd;
        
        // Short delay to simulate realistic button click typing
        setTimeout(() => {
            input.value = '';
            
            // Handle overview as clear + re-welcome
            if (cmd === 'overview') {
                log.innerHTML = '';
                appendHTML(getWelcomeBannerHTML());
                printLine("Welcome to Rajdeep Pal's interactive portfolio console.", 'info-msg');
                printLine("Type whoami to learn more about me! Or click navigation links above to explore.", 'info-msg');
                printLine('');
                appendHTML(getWelcomeGuideHTML());
                appendHTML(getWhoamiHTML());
                appendHTML(getAboutHTML());
            } else {
                processCommand(cmd);
            }
            
            // If it is a section command, scroll to the top so it starts at the beginning!
            const sectionCmds = ['overview', 'experience', 'exp', 'projects', 'proj', 'skills', 'credentials', 'certs'];
            setTimeout(() => {
                if (sectionCmds.includes(cmd)) {
                    screen.scrollTop = 0;
                } else {
                    screen.scrollTop = screen.scrollHeight;
                }
            }, 50);
            
        }, 150);
    };
}

/* --------------------------------------------------------------------------
   06. INLINE DIAGNOSTIC SIMULATOR (Renders natively in terminal)
   -------------------------------------------------------------------------- */
window.runDiagnostic = function(projectId) {
    const log = document.getElementById('terminal-log');
    const screen = document.getElementById('terminal-screen');
    const input = document.getElementById('terminal-input');
    
    if (!log || !screen) return;

    // Prevent input during diagnostic sequence
    if (input) input.disabled = true;

    let targetName = "";
    let logs = [];

    if (projectId === 'jcs-suite') {
        targetName = "Jio_Cybersecurity_Suite_JCS";
        logs = [
            "Initializing Jio Cybersecurity Suite (JCS) microservice diagnostics...",
            "Connecting to FastAPI gateway API cluster... Latency: 12ms.",
            "Verifying Kubernetes container namespaces (Minikube)... All pods active.",
            "Testing Redis message broker queues and Celery task loops...",
            "Ingesting mock CVE threat intelligence feeds via live Netra0 API...",
            "Validating Netra1 autonomous ReAct pentesting agent loops... Safely authorized.",
            "Running automated threat remediation modules... Remediation generated.",
            "DIAGNOSTIC STATUS: 100% OPERATIONAL // Jio Suite secure."
        ];
    } else if (projectId === 'ev-gui') {
        targetName = "Event_Viewer_GUI.exe";
        logs = [
            "Initializing Custom Event Viewer diagnostics...",
            "Loading multi-threaded UI parsing structures...",
            "Establishing event log API listeners...",
            "Simulating security log parsing benchmarks (10,000 events)...",
            "Applying active alert filter metrics...",
            "PARSING METRIC: 142ms (Native Event Viewer average: 480ms)",
            "SOC log triage efficiency increase: ~30.4%",
            "Active security threat rules verified: 45 signatures loaded.",
            "DIAGNOSTIC STATUS: 100% OPERATIONAL // Core elements stable."
        ];
    } else if (projectId === 'log-parser') {
        targetName = "Windows_Log_Parser.py";
        logs = [
            "Initializing Windows Event Log Parser engine...",
            "Loading core regex patterns and file converters (EVTX -> JSON)...",
            "Simulating anomalous audit inputs...",
            "Brute-Force signature match triggered: Event 4625 (Failed Logon) - Threshold exceeded.",
            "Alert correlation integration: PASSED.",
            "Log conversion throughput: 8,450 records/second.",
            "Engine memory overhead: 24MB (STABLE).",
            "DIAGNOSTIC STATUS: 100% OPERATIONAL // Parser active."
        ];
    } else if (projectId === 'location-telemetry') {
        targetName = "PehraSafe_Telemetry_Protocol";
        logs = [
            "Initializing PehraSafe Telemetry Protocol emulator...",
            "Measuring bandwidth threshold capacity... 9.6 kbps (Extremely Low).",
            "Compressing coordinates dataset into binary payload telemetry...",
            "Initiating low-bandwidth packet broadcast... [0x4F8A2E]",
            "Packet transmission acknowledged by master station in 45ms.",
            "Compression payload optimization: 1:8.4 ratio against standard formats.",
            "Packet delivery reliability rate: 100% (0% packet loss in degraded states).",
            "DIAGNOSTIC STATUS: 100% OPERATIONAL // Protocol optimized."
        ];
    }

    // Print diagnostic shell echo
    const echoLine = document.createElement('div');
    echoLine.className = 'terminal-line input-echo';
    echoLine.style.marginTop = '1rem';
    echoLine.textContent = `guest@raj-console:~$ diagnostics --target ${targetName}`;
    log.appendChild(echoLine);
    screen.scrollTop = screen.scrollHeight;

    let delay = 0;
    logs.forEach((logText, index) => {
        delay += 180 + Math.random() * 100;
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            
            if (index === 0) {
                line.className = 'terminal-line success-msg';
                line.textContent = `[+] ${logText}`;
            } else if (index === logs.length - 1) {
                line.className = 'terminal-line success-msg';
                line.style.fontWeight = 'bold';
                line.textContent = `[✓] ${logText}`;
            } else {
                line.className = 'terminal-line system-msg';
                line.textContent = `[>] ${logText}`;
            }
            
            log.appendChild(line);
            
            // Smoothly scroll down
            screen.scrollTo({
                top: screen.scrollHeight,
                border: 'smooth'
            });

            // Re-enable input at complete
            if (index === logs.length - 1) {
                if (input) {
                    input.disabled = false;
                    input.focus({ preventScroll: true });
                }
            }
        }, delay);
    });
};

/* --------------------------------------------------------------------------
   07. NORMAL PAGE CONTACT FORM SUBMISSION HANDLER
   -------------------------------------------------------------------------- */
window.handleFormSubmit = function(event) {
    event.preventDefault();

    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    const status = document.getElementById('channel-status');
    
    if (!form || !btn || !status) return;

    const sender = document.getElementById('form-sender').value;
    const email = document.getElementById('form-email').value;
    const subject = document.getElementById('form-subject').value;

    btn.disabled = true;
    btn.textContent = "Encrypting Data Packet...";
    status.textContent = "TRANSMITTING";
    status.className = "channel-status transmitting";
    
    setTimeout(() => {
        btn.textContent = "Broadcasting Packet...";
        
        setTimeout(() => {
            btn.textContent = "Transmit Completed";
            status.textContent = "ENCRYPTED_DELIVERY";
            status.className = "channel-status positive";
            

            
            alert("Transmission successfully processed. Your secure packet has been logged into the database.");
            
            form.reset();
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = "Transmit Packet";
                status.textContent = "READY";
                status.className = "channel-status positive";
            }, 3000);
            
        }, 1200);
    }, 1000);
};

/* --------------------------------------------------------------------------
   08. DOUBLE-LAYERED SCROLL WARPING (WINDOW + TERMINAL CONTENT)
   -------------------------------------------------------------------------- */
function initScrollWarp() {
    // LAYER 1: Window Scroll (Warping console wrapper and stats dashboard)
    let lastWinScrollY = window.scrollY;
    let winSpeed = 0;
    let winTargetSpeed = 0;

    // LAYER 2: Terminal Body Scroll (Warping cards inside the terminal)
    const terminalBody = document.getElementById('terminal-screen');
    let lastTermScrollTop = terminalBody ? terminalBody.scrollTop : 0;
    let termSpeed = 0;
    let termTargetSpeed = 0;

    const lerpFactor = 0.08;

    function trackScrollWarp() {
        // Handle window scroll warp
        const currentWinScrollY = window.scrollY;
        winTargetSpeed = currentWinScrollY - lastWinScrollY;
        lastWinScrollY = currentWinScrollY;

        winSpeed += (winTargetSpeed - winSpeed) * lerpFactor;
        const winSkew = Math.max(-3.0, Math.min(3.0, winSpeed * 0.08));
        const winScale = Math.max(0.98, Math.min(1.02, 1 - Math.abs(winSpeed) * 0.0006));

        const winWarpTargets = document.querySelectorAll('.terminal-wrapper, .stats-dashboard, .hero-intel, .saas-card');
        winWarpTargets.forEach(el => {
            if (Math.abs(winSpeed) > 0.05) {
                el.style.transform = `skewY(${winSkew}deg) scaleY(${winScale})`;
            } else {
                el.style.transform = '';
            }
        });

        // Handle terminal scroll warp
        if (terminalBody) {
            const currentTermScrollTop = terminalBody.scrollTop;
            termTargetSpeed = currentTermScrollTop - lastTermScrollTop;
            lastTermScrollTop = currentTermScrollTop;

            termSpeed += (termTargetSpeed - termSpeed) * lerpFactor;
            const termSkew = Math.max(-3.0, Math.min(3.0, termSpeed * 0.08));
            const termScale = Math.max(0.98, Math.min(1.02, 1 - Math.abs(termSpeed) * 0.0008));

            const termWarpTargets = terminalBody.querySelectorAll(
                '.terminal-card, .project-terminal-card, .terminal-skills-category, .terminal-cert-card, .terminal-ach-banner'
            );
            termWarpTargets.forEach(el => {
                if (Math.abs(termSpeed) > 0.05) {
                    el.style.transform = `skewY(${termSkew}deg) scaleY(${termScale})`;
                } else {
                    el.style.transform = '';
                }
            });
        }

        requestAnimationFrame(trackScrollWarp);
    }

    requestAnimationFrame(trackScrollWarp);
}
