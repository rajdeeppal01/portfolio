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
    // Render all sections one below the other in the main container
    const mainContainer = document.querySelector('.saas-container');
    if (mainContainer) {
        // Create Experience Section
        const expSec = document.createElement('section');
        expSec.id = 'experience';
        expSec.className = 'saas-section';
        expSec.innerHTML = getExperienceHTML();
        mainContainer.appendChild(expSec);
        
        // Create Projects Section
        const projSec = document.createElement('section');
        projSec.id = 'projects';
        projSec.className = 'saas-section';
        projSec.innerHTML = getProjectsHTML();
        mainContainer.appendChild(projSec);
        
        // Create Skills Section
        const skillsSec = document.createElement('section');
        skillsSec.id = 'skills';
        skillsSec.className = 'saas-section';
        skillsSec.innerHTML = getSkillsHTML();
        mainContainer.appendChild(skillsSec);
        
        // Create Credentials Section
        const certsSec = document.createElement('section');
        certsSec.id = 'certs';
        certsSec.className = 'saas-section';
        certsSec.innerHTML = getCredentialsHTML();
        mainContainer.appendChild(certsSec);
        
        // Move Contact Section to the end
        const contactSec = document.getElementById('contact');
        if (contactSec) {
            mainContainer.appendChild(contactSec);
        }
    }

    initClock();
    initSessionTracker();
    initTypingAnimation();
    initNavigation();
    initTerminal();
    initScrollWarp(); // Double-layered scroll warp loop (Window + Terminal)
    initAmbientCanvas();
    initCustomCursor();
    initMobileViewToggle();
    
    // Animate skill bars when scrolled into view
    if (window.initSkillsScrollTrigger) {
        window.initSkillsScrollTrigger();
    }
    
    // Initialize visitor telemetry counter
    if (window.initVisitorCounter) {
        window.initVisitorCounter();
    }

    // Initialize time and weather personalization
    if (window.initTimeAndWeather) {
        window.initTimeAndWeather();
    }
    
    // Initialize owner location loader
    initOwnerLocation();



    // Initialize 3D card tilt effects
    if (window.initCardTilt) {
        window.initCardTilt();
    }

    // Initialize circular theme toggle transition
    if (window.initThemeToggle) {
        window.initThemeToggle();
    }

    // Initialize smooth caret input
    initSmoothCaret();
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
        if (document.body.classList.contains('terminal-minimized') || command === 'overview') {
            heroSection.classList.remove('terminal-only-view');
        } else {
            heroSection.classList.add('terminal-only-view');
        }
    }
}

window.switchTab = function(command) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle centering layout class
    if (command === 'overview') {
        document.body.classList.remove('tab-view-active');
    } else {
        document.body.classList.add('tab-view-active');
    }
    
    // Automatically switch mobile view from Console to Profile when navigating
    if (document.body.classList.contains('mobile-console-mode')) {
        document.body.classList.remove('mobile-console-mode');
        const toggleContainer = document.getElementById('mobile-view-toggle');
        if (toggleContainer) {
            const buttons = toggleContainer.querySelectorAll('.view-toggle-btn');
            buttons.forEach(btn => {
                if (btn.getAttribute('data-view') === 'profile') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    }
    
    // Update navigation active states
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').replace('#', '');
        if (href === command) {
            link.classList.add('active');
        }
    });

    if (command === 'overview') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        let targetId = command;
        if (command === 'certs') targetId = 'certs';
        if (command === 'exp') targetId = 'experience';
        if (command === 'proj') targetId = 'projects';
        
        const section = document.getElementById(targetId);
        if (section) {
            const yOffset = -80; // Header offset
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }
};

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const btnGoContact = document.getElementById('btn-go-contact');
    const terminalInput = document.getElementById('terminal-input');
    const toggleBtn = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Mobile menu toggle
    if (toggleBtn && navMenu) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleBtn.classList.toggle('open');
            navMenu.classList.toggle('mobile-active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && e.target !== toggleBtn) {
                toggleBtn.classList.remove('open');
                navMenu.classList.remove('mobile-active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').replace('#', '');
            if (window.switchTab) {
                window.switchTab(targetId);
            }
            // Close mobile menu
            if (toggleBtn && navMenu) {
                toggleBtn.classList.remove('open');
                navMenu.classList.remove('mobile-active');
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
            // Close mobile menu
            if (toggleBtn && navMenu) {
                toggleBtn.classList.remove('open');
                navMenu.classList.remove('mobile-active');
            }
        });
    }

    if (btnGoContact) {
        btnGoContact.addEventListener('click', () => {
            if (window.switchTab) window.switchTab('contact');
            // Close mobile menu
            if (toggleBtn && navMenu) {
                toggleBtn.classList.remove('open');
                navMenu.classList.remove('mobile-active');
            }
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

function getWelcomeGuideHTML() {
    return `
<div class="terminal-card" style="border-color: var(--border-slate); background-color: transparent; border-style: dashed; font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.5; margin-bottom: 1rem;">
    <div style="color: var(--primary-green); margin-bottom: 0.35rem;"><strong>[+] Core Console Commands:</strong></div>
    <div><span style="color: var(--primary-green); margin-right: 0.5rem;">•</span><strong style="color: var(--text-white);">whoami</strong>     - Extract visitor details & show professional summary.</div>
    <div><span style="color: var(--primary-green); margin-right: 0.5rem;">•</span><strong style="color: var(--text-white);">help</strong>       - View full CLI command reference menu.</div>
    <div><span style="color: var(--primary-green); margin-right: 0.5rem;">•</span><strong style="color: var(--text-white);">ls / cd</strong>    - Navigate folders (experience, projects, skills, credentials, contact).</div>
    <div><span style="color: var(--primary-green); margin-right: 0.5rem;">•</span><strong style="color: var(--text-white);">theme</strong>      - Change console colors (matrix, dracula, nord, obsidian).</div>
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
                    <p>Developing the <strong>Jio Cybersecurity Suite (JCS)</strong>, a unified offline-first cognitive security platform combining automated threat intelligence and autonomous threat simulation.</p>
                    <ul class="term-bullets">
                        <li><strong>JCS0 (Automated CVE Reconnaissance & Triage Engine):</strong> Orchestrates target intelligence sweeps by performing passive DNS mapping, active TCP port sweeps, and service banner extraction, correlating findings against live and offline SQLite NVD v2.0 CVE databases to rank network vulnerabilities.</li>
                        <li><strong>JCS1 (Autonomous Pentesting & Threat Simulation Agent):</strong> Built an interactive agent powered by a local, self-hosted open-source LLM (Ollama with <code>phi3</code>) via a ReAct reasoning planner to autonomously execute SSH audits, TLS tunneling, packet fragmentation, and UDP floods through a secure conversational console with built-in operator authorization gates.</li>
                        <li><strong>Suite Architecture (V11.0 Production Upgrade):</strong> Re-engineered the platform from Kubernetes into a high-stability <strong>Docker Compose</strong> microservices pipeline (FastAPI, PostgreSQL, Redis, Celery) on RHEL 9, utilizing segregated Celery worker tiers (T1/T2/T3) and a host-level Nginx reverse proxy.</li>
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
                A unified, offline-first cognitive security platform combining automated CVE reconnaissance and active threat simulation.
            </p>
            <ul class="term-bullets" style="font-size: 0.82rem; margin-bottom: 0.85rem; color: var(--text-muted); list-style-type: none; padding-left: 0;">
                <li style="position: relative; padding-left: 0.85rem; margin-bottom: 0.35rem;"><strong style="color: var(--text-white);">JCS0 (Automated CVE Reconnaissance & Triage Engine):</strong> Orchestrates target intelligence sweeps by performing passive DNS mapping, active TCP port sweeps, and service banner extraction, correlating findings against live and offline SQLite NVD v2.0 CVE databases to rank network vulnerabilities.</li>
                <li style="position: relative; padding-left: 0.85rem; margin-bottom: 0.35rem;"><strong style="color: var(--text-white);">JCS1 (Autonomous Pentesting & Threat Simulation Agent):</strong> Built an interactive agent powered by a local, self-hosted open-source LLM (Ollama with <code>phi3</code>) via a ReAct reasoning planner to autonomously execute SSH audits, TLS tunneling, packet fragmentation, and UDP floods through a secure conversational console with built-in operator authorization gates.</li>
                <li style="position: relative; padding-left: 0.85rem; margin-bottom: 0.35rem;"><strong style="color: var(--text-white);">Suite Architecture (V11.0 Production Upgrade):</strong> Re-engineered the platform from Kubernetes into a high-stability <strong>Docker Compose</strong> microservices pipeline (FastAPI, PostgreSQL, Redis, Celery) on RHEL 9, utilizing segregated Celery worker tiers (T1/T2/T3) and a host-level Nginx reverse proxy.</li>
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
    screen.addEventListener('click', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('input')) {
            return;
        }
        input.focus({ preventScroll: true });
    });

    // Programmatically focus input on load without scrolling
    input.focus({ preventScroll: true });

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
    window.printTerminalLine = printLine;

    // Append raw HTML directly into the terminal log
    function appendHTML(htmlString) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString.trim();
        
        const childNode = tempDiv.firstChild;
        if (childNode) {
            const cards = childNode.querySelectorAll('.terminal-card, .project-terminal-card, .terminal-skills-category, .terminal-cert-card, .terminal-ach-banner, .song-row-item, .timeline-item');
            if (cards.length > 0) {
                cards.forEach(card => card.classList.add('stagger-in'));
            } else {
                childNode.classList.add('stagger-in');
            }
        }
        
        log.appendChild(childNode);

        // Trigger animations for skill progress bars if present
        setTimeout(() => {
            const bars = childNode.querySelectorAll('.term-skill-bar');
            bars.forEach(bar => {
                bar.style.width = bar.getAttribute('data-level');
            });
            if (window.updateClassicContentFlow) {
                window.updateClassicContentFlow();
            }
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
                printLine('  download   - Download Rajdeep Pal PDF resume.');
                printLine('  clear      - Purge console screen logs.');
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

    const formData = new FormData(form);
    const subject = formData.get('subject') || 'Portfolio Contact';
    formData.append('_subject', `Portfolio Contact: ${subject}`);
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');

    btn.disabled = true;
    btn.textContent = "Encrypting Data Packet...";
    status.textContent = "TRANSMITTING";
    status.className = "channel-status transmitting";
    
    setTimeout(() => {
        btn.textContent = "Broadcasting Packet...";

        fetch('https://formsubmit.co/ajax/rajdeeppalwork@gmail.com', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Message transmission failed.');
            }
            return response.json();
        })
        .then(() => {
            btn.textContent = "Transmit Completed";
            status.textContent = "DELIVERED";
            status.className = "channel-status positive";

            alert("Transmission delivered. Your message has been sent to Rajdeep Pal.");
            
            form.reset();
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = "Transmit Packet";
                status.textContent = "READY";
                status.className = "channel-status positive";
            }, 3000);
        })
        .catch(() => {
            btn.disabled = false;
            btn.textContent = "Transmit Packet";
            status.textContent = "FAILED";
            status.className = "channel-status error";
            alert("Transmission failed. Please email rajdeeppalwork@gmail.com directly.");
        });
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

        const winWarpTargets = document.querySelectorAll('.stats-dashboard, .hero-intel, .saas-card');
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

/* --------------------------------------------------------------------------
   09. INTERACTIVE AMBIENT CANVAS & CUSTOM FLUID CURSOR
   -------------------------------------------------------------------------- */
function initAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
    
    let mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };
    let touch = { x: 0, y: 0, tx: 0, ty: 0, opacity: 0, targetOpacity: 0 };
    
    window.addEventListener('mousemove', (e) => {
        mouse.tx = e.clientX;
        mouse.ty = e.clientY;
    });
    
    // Touch event handlers for mobile ambient glow
    window.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            touch.targetOpacity = 0.22; // Visible glowing opacity
            touch.tx = e.touches[0].clientX;
            touch.ty = e.touches[0].clientY;
            
            // Initialize position immediately on first touch to prevent jumping
            if (touch.opacity < 0.05) {
                touch.x = touch.tx;
                touch.y = touch.ty;
            }
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            touch.tx = e.touches[0].clientX;
            touch.ty = e.touches[0].clientY;
        }
    }, { passive: true });

    const endTouch = () => {
        touch.targetOpacity = 0;
    };
    window.addEventListener('touchend', endTouch, { passive: true });
    window.addEventListener('touchcancel', endTouch, { passive: true });
    
    // Define 3 interactive glowing blobs
    const blobs = [
        { x: Math.random() * width, y: Math.random() * height, r: 350, speed: 0.03, color1: 'rgba(20, 184, 166, 0.08)', color2: 'rgba(20, 184, 166, 0)' },
        { x: Math.random() * width, y: Math.random() * height, r: 450, speed: 0.02, color1: 'rgba(56, 189, 248, 0.06)', color2: 'rgba(56, 189, 248, 0)' },
        { x: Math.random() * width, y: Math.random() * height, r: 400, speed: 0.015, color1: 'rgba(139, 92, 246, 0.05)', color2: 'rgba(139, 92, 246, 0)' }
    ];
    
    // Generate parallax background particles
    const particles = [];
    for (let i = 0; i < 70; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 1.5 + 0.5,
            depth: Math.random() * 0.4 + 0.1, // Parallax depth factor
            color: `rgba(255, 255, 255, ${Math.random() * 0.15 + 0.05})`
        });
    }
    
    function animate() {
        // Smoothly ease mouse coordinates
        mouse.x += (mouse.tx - mouse.x) * 0.08;
        mouse.y += (mouse.ty - mouse.y) * 0.08;
        
        const scrollY = window.scrollY;
        
        // Clear with background color matching active theme
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-darker') || '#0a0a0c';
        ctx.fillRect(0, 0, width, height);
        
        // Draw parallax stars/particles first
        particles.forEach(p => {
            // Apply vertical shift based on scrollY and particle depth
            let py = (p.y - scrollY * p.depth) % height;
            if (py < 0) py += height;
            
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, py, p.r, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw touch glow blob on mobile
        touch.opacity += (touch.targetOpacity - touch.opacity) * 0.1;
        if (touch.opacity > 0.01) {
            touch.x += (touch.tx - touch.x) * 0.15;
            touch.y += (touch.ty - touch.y) * 0.15;
            
            const radius = 150; // Concentrated glow area
            const grad = ctx.createRadialGradient(touch.x, touch.y, 0, touch.x, touch.y, radius);
            grad.addColorStop(0, `rgba(20, 184, 166, ${touch.opacity})`);
            grad.addColorStop(0.5, `rgba(20, 184, 166, ${touch.opacity * 0.35})`);
            grad.addColorStop(1, 'rgba(20, 184, 166, 0)');
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(touch.x, touch.y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        blobs.forEach((blob, idx) => {
            // Blob centers follow the eased mouse with offsets
            const targetX = mouse.x + Math.sin(Date.now() * 0.0008 + idx * 2) * 150;
            const targetY = mouse.y + Math.cos(Date.now() * 0.0008 + idx * 2) * 150;
            
            blob.x += (targetX - blob.x) * blob.speed;
            blob.y += (targetY - blob.y) * blob.speed;
            
            // Render beautiful radial gradient glow
            const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
            grad.addColorStop(0, blob.color1);
            grad.addColorStop(1, blob.color2);
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function initCustomCursor() {
    const dot = document.getElementById('custom-cursor-dot');
    const ring = document.getElementById('custom-cursor-ring');
    if (!dot || !ring) return;
    
    let mouse = { x: -100, y: -100, tx: -100, ty: -100 };
    let ringPos = { x: -100, y: -100 };
    
    const hoverSelectors = 'a, button, input, textarea, select, .nav-link, .btn, .song-row-item, .logo-container, [onclick]';

    window.addEventListener('mousemove', (e) => {
        mouse.tx = e.clientX;
        mouse.ty = e.clientY;
        
        // Make cursor visible on first move
        if (dot.style.opacity === '') {
            dot.style.opacity = '1';
            ring.style.opacity = '1';
        }
    });
    
    // Touch event handlers for mobile
    window.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            mouse.tx = e.touches[0].clientX;
            mouse.ty = e.touches[0].clientY;
            
            // Set initial position immediately to prevent jumping
            if (dot.style.opacity !== '1') {
                mouse.x = mouse.tx;
                mouse.y = mouse.ty;
                ringPos.x = mouse.tx;
                ringPos.y = mouse.ty;
            }
            
            dot.style.opacity = '1';
            ring.style.opacity = '1';

            // Touch-based hover state
            if (e.target.closest(hoverSelectors)) {
                document.body.classList.add('cursor-hover');
            } else {
                document.body.classList.remove('cursor-hover');
            }
        }
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.tx = e.touches[0].clientX;
            mouse.ty = e.touches[0].clientY;

            // Update hover state during touch drag/scroll
            const element = document.elementFromPoint(mouse.tx, mouse.ty);
            if (element && element.closest(hoverSelectors)) {
                document.body.classList.add('cursor-hover');
            } else {
                document.body.classList.remove('cursor-hover');
            }
        }
    });

    window.addEventListener('touchend', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
        document.body.classList.remove('cursor-hover');
    });

    window.addEventListener('touchcancel', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
        document.body.classList.remove('cursor-hover');
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    });
    
    function updateCursor() {
        // Move dot instantly
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
        dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
        
        // Move ring with lag (inertial easing)
        ringPos.x += (mouse.x - ringPos.x) * 0.15;
        ringPos.y += (mouse.y - ringPos.y) * 0.15;
        ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
        
        requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);
    
    // Trigger cursor scaling on hoverable elements for desktop mouse
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverSelectors)) {
            document.body.classList.add('cursor-hover');
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (!e.target.closest(hoverSelectors)) {
            document.body.classList.remove('cursor-hover');
        }
    });
}

window.toggleTerminalMinimize = function(minimize) {
    const wrapper = document.querySelector('.terminal-wrapper');
    if (minimize) {
        document.body.classList.add('terminal-minimized');
        const overlay = document.getElementById('terminal-minimized-overlay');
        if (overlay) overlay.style.display = 'flex';
        
        // On mobile, switch view back to Profile so they don't see an empty screen
        if (document.body.classList.contains('mobile-console-mode')) {
            document.body.classList.remove('mobile-console-mode');
            const toggleContainer = document.getElementById('mobile-view-toggle');
            if (toggleContainer) {
                const buttons = toggleContainer.querySelectorAll('.view-toggle-btn');
                buttons.forEach(btn => {
                    if (btn.getAttribute('data-view') === 'profile') {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }
        }
    } else {
        document.body.classList.remove('terminal-minimized');
        const overlay = document.getElementById('terminal-minimized-overlay');
        if (overlay) overlay.style.display = 'none';
        
        // Reset any inline drag offsets to snap back to the default floating position
        if (wrapper) {
            wrapper.style.left = '';
            wrapper.style.top = '';
            wrapper.style.right = '';
        }
        
        const input = document.getElementById('terminal-input');
        if (input) input.focus({ preventScroll: true });
    }
};

window.initSkillsScrollTrigger = function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.term-skill-bar');
                bars.forEach(bar => {
                    bar.style.width = bar.getAttribute('data-level');
                });
            }
        });
    }, { threshold: 0.15 });
    
    const skillsSec = document.getElementById('skills');
    if (skillsSec) observer.observe(skillsSec);
};

// Dragging capability for the terminal
function makeTerminalDraggable() {
    const wrapper = document.querySelector('.terminal-wrapper');
    const header = document.querySelector('.terminal-header');
    if (!wrapper || !header) return;
    
    let isDragging = false;
    let startX, startY;
    let initialLeft, initialTop;
    
    header.addEventListener('mousedown', (e) => {
        // Do not drag if clicking dots or status lights
        if (e.target.closest('.terminal-dots') || e.target.closest('.terminal-status-light')) return;
        if (document.body.classList.contains('terminal-minimized')) return;
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        
        const rect = wrapper.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
        
        wrapper.style.transition = 'none';
        wrapper.style.left = `${initialLeft}px`;
        wrapper.style.right = 'auto';
        
        document.body.classList.add('dragging-active');
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        wrapper.style.left = `${initialLeft + dx}px`;
        wrapper.style.top = `${initialTop + dy}px`;
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            wrapper.style.transition = 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
            document.body.classList.remove('dragging-active');
        }
    });
}

// Initialise features on load
setTimeout(() => {
    makeTerminalDraggable();
    window.initVisitorCounter();
}, 500);

// Live visitor telemetry counter
window.initVisitorCounter = function() {
    const activeEl = document.getElementById('live-active-users');
    const totalEl = document.getElementById('total-visits-counter');
    if (!activeEl || !totalEl) return;
    
    // Simulate live active users (nodes) fluctuating slightly
    setInterval(() => {
        const current = parseInt(activeEl.textContent, 10) || 2;
        const change = Math.random() > 0.5 ? 1 : -1;
        const next = Math.max(1, Math.min(5, current + change));
        activeEl.textContent = next;
    }, 4000);
    
    // Fallback counter logic using localStorage
    let localVisits = parseInt(localStorage.getItem('portfolio_visits'), 10);
    if (!localVisits || isNaN(localVisits)) {
        localVisits = 1482; // Baseline starting value
    }
    localVisits += 1;
    localStorage.setItem('portfolio_visits', localVisits);
    totalEl.textContent = localVisits;
    
    // Try fetching from CountAPI
    const namespace = 'rajdeeppal01_portfolio';
    const key = 'visits';
    fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.value) {
                totalEl.textContent = data.value;
                localStorage.setItem('portfolio_visits', data.value);
            }
        })
        .catch(err => {
            console.log("CountAPI offline, running on local telemetry fallback.");
        });
};

// Fetch owner location from owner_location.json
function initOwnerLocation() {
    fetch('owner_location.json')
        .then(res => res.json())
        .then(data => {
            const cityCountryEl = document.getElementById('owner-city-country');
            const coordsEl = document.getElementById('owner-coordinates');
            
            if (data.city && data.country) {
                if (cityCountryEl) cityCountryEl.textContent = `${data.city}, ${data.country}`;
            }
            if (data.latitude && data.longitude) {
                if (coordsEl) {
                    const latDir = data.latitude >= 0 ? 'N' : 'S';
                    const lonDir = data.longitude >= 0 ? 'E' : 'W';
                    coordsEl.textContent = `${Math.abs(data.latitude).toFixed(2)}° ${latDir}, ${Math.abs(data.longitude).toFixed(2)}° ${lonDir}`;
                }
            }
        })
        .catch(() => {
            // Fallback is already hardcoded in HTML
        });
}

// Live Time-of-Day Greeting & Visitor Weather Telemetry Sync
window.initTimeAndWeather = function() {
    const greetingEl = document.getElementById('dynamic-greeting');
    
    // 1. Time-of-day Greeting
    if (greetingEl) {
        const updateGreeting = () => {
            const hour = new Date().getHours();
            let msg = "NODE: ONLINE";
            if (hour >= 5 && hour < 12) {
                msg = "NODE: ONLINE // Good morning";
            } else if (hour >= 12 && hour < 17) {
                msg = "NODE: ONLINE // Good afternoon";
            } else if (hour >= 17 && hour < 21) {
                msg = "NODE: ONLINE // Good evening";
            } else {
                msg = "SECURITY NODE: ACTIVE // Working late? Good night";
            }
            greetingEl.innerHTML = `<span class="status-dot-pulse" style="width: 5px; height: 5px; background: var(--primary-green); border-radius: 50%; display: inline-block;"></span> <span>${msg}</span>`;
        };
        updateGreeting();
        // Update every 5 minutes
        setInterval(updateGreeting, 300000);
    }
    
    // 2. Visitor Location & Weather Sync (using visitor details)
    const updateVisitorWeather = () => {
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                if (data.city && data.country_code) {
                    const visitorLoc = `${data.city}, ${data.country_code}`;
                    const lat = data.latitude;
                    const lon = data.longitude;
                    
                    // Fetch weather for visitor coordinates
                    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
                        .then(r => r.json())
                        .then(wData => {
                            const telemetryEl = document.getElementById('visitor-telemetry');
                            if (wData && wData.current_weather && telemetryEl) {
                                const temp = Math.round(wData.current_weather.temperature);
                                const code = wData.current_weather.weathercode;
                                
                                // Map WMO codes to Emojis
                                let emoji = "☀️";
                                if (code === 0) emoji = "☀️";
                                else if (code >= 1 && code <= 3) emoji = "🌤️";
                                else if (code >= 45 && code <= 48) emoji = "🌫️";
                                else if (code >= 51 && code <= 65) emoji = "🌧️";
                                else if (code >= 71 && code <= 77) emoji = "❄️";
                                else if (code >= 80 && code <= 82) emoji = "🌧️";
                                else if (code >= 95 && code <= 99) emoji = "⛈️";
                                
                                telemetryEl.innerHTML = `<span class="status-dot-pulse" style="width: 5px; height: 5px; background: var(--text-muted); border-radius: 50%; display: inline-block;"></span> <span>Visitor: ${visitorLoc} // ${emoji} ${temp}°C</span>`;
                                telemetryEl.style.display = 'inline-flex';
                            }
                        })
                        .catch(() => {
                            const telemetryEl = document.getElementById('visitor-telemetry');
                            if (telemetryEl) {
                                telemetryEl.innerHTML = `<span class="status-dot-pulse" style="width: 5px; height: 5px; background: var(--text-muted); border-radius: 50%; display: inline-block;"></span> <span>Visitor: ${visitorLoc}</span>`;
                                telemetryEl.style.display = 'inline-flex';
                            }
                        });
                }
            })
            .catch(() => {
                // Keep telemetry hidden if IP check fails
            });
    };
    
    updateVisitorWeather();
    // Update visitor weather every 10 minutes
    setInterval(updateVisitorWeather, 600000);
};



// 3D Card Parallax Tilt effect
window.initCardTilt = function() {
    const cards = document.querySelectorAll('.project-card, .experience-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            
            const angleX = (yc - y) / 18;
            const angleY = (x - xc) / 18;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.015, 1.015, 1.015)`;
            card.style.boxShadow = '0 15px 35px rgba(20, 184, 166, 0.12)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.boxShadow = '';
        });
    });
};

// Highly Robust Theme Switcher Toggle
window.initThemeToggle = function() {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    
    btn.addEventListener('click', () => {
        const isCurrentlyLight = document.body.classList.contains('light-theme');
        if (isCurrentlyLight) {
            document.body.classList.remove('light-theme');
            btn.innerHTML = `
                <svg id="theme-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 17px; height: 17px; pointer-events: none;">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
            `;
        } else {
            document.body.classList.add('light-theme');
            btn.innerHTML = `
                <svg id="theme-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 17px; height: 17px; pointer-events: none;">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            `;
        }
    });
};

// Floating Mobile View Toggle (Profile vs. Console)
function initMobileViewToggle() {
    const toggleContainer = document.getElementById('mobile-view-toggle');
    if (!toggleContainer) return;
    
    const buttons = toggleContainer.querySelectorAll('.view-toggle-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const view = button.getAttribute('data-view');
            
            // Update active button styling
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update body class for view mode
            if (view === 'console') {
                document.body.classList.add('mobile-console-mode');
                // Automatically restore terminal if it was minimized
                if (window.toggleTerminalMinimize) {
                    window.toggleTerminalMinimize(false);
                }
                // Focus terminal input if visible
                setTimeout(() => {
                    const termInput = document.getElementById('terminal-input');
                    if (termInput) termInput.focus();
                }, 100);
            } else {
                document.body.classList.remove('mobile-console-mode');
            }
        });
    });
}

// Smooth Caret Input Implementation
function initSmoothCaret() {
    const input = document.getElementById('terminal-input');
    if (!input) return;
    
    const container = document.createElement('div');
    container.className = 'terminal-caret-container';
    
    const caret = document.createElement('div');
    caret.className = 'terminal-caret blinking';
    
    input.parentNode.insertBefore(container, input);
    container.appendChild(input);
    container.appendChild(caret);
    
    const measurer = document.createElement('span');
    measurer.style.position = 'absolute';
    measurer.style.visibility = 'hidden';
    measurer.style.whiteSpace = 'pre';
    measurer.style.fontFamily = 'var(--font-mono)';
    measurer.style.fontSize = '0.85rem';
    measurer.style.letterSpacing = 'normal';
    measurer.style.padding = '0';
    measurer.style.margin = '0';
    document.body.appendChild(measurer);
    
    function updateCaretPosition() {
        const val = input.value;
        const selectionStart = input.selectionStart || val.length;
        const textBeforeCursor = val.substring(0, selectionStart);
        
        measurer.textContent = textBeforeCursor.replace(/ /g, '\u00a0');
        
        const width = measurer.getBoundingClientRect().width;
        caret.style.left = `${width}px`;
        
        caret.classList.remove('blinking');
        clearTimeout(caret.blinkTimeout);
        caret.blinkTimeout = setTimeout(() => {
            caret.classList.add('blinking');
        }, 500);
    }
    
    input.addEventListener('input', updateCaretPosition);
    input.addEventListener('keydown', () => setTimeout(updateCaretPosition, 10));
    input.addEventListener('keyup', updateCaretPosition);
    input.addEventListener('click', updateCaretPosition);
    input.addEventListener('focus', () => { caret.style.display = 'block'; });
    input.addEventListener('blur', () => { caret.style.display = 'none'; });
    
    updateCaretPosition();
}
