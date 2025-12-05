// --- SOUND SYSTEM ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration) {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playStartup() {
    // Futuristic startup sound
    setTimeout(() => playTone(220, 'sawtooth', 0.8), 0);
    setTimeout(() => playTone(440, 'sine', 0.8), 200);
    setTimeout(() => playTone(880, 'square', 1.2), 400);
}

function playClick() {
    playTone(1200, 'square', 0.05);
}

function playOpen() {
    playTone(800, 'triangle', 0.1);
}

// --- BOOT SEQUENCE ---
const bootText = [
    "Initializing Gensyn OS Kernel...",
    "Loading RL Swarm Protocols...",
    "Establishing Neural Links [OK]",
    "Verifying Proof-of-Learning...",
    "Syncing Distributed Compute Nodes...",
    "Aggregating Community Intelligence...",
    "System Ready."
];

const bootScreen = document.getElementById('boot-screen');
const bootTextContainer = document.getElementById('boot-text');
const bootBar = document.getElementById('boot-bar');
const bootFill = document.getElementById('boot-fill');
const desktop = document.getElementById('desktop');

let lineIndex = 0;

function typeLine() {
    if (lineIndex < bootText.length) {
        const p = document.createElement('div');
        p.style.marginBottom = "5px";
        p.innerHTML = `> ${bootText[lineIndex]}`;
        bootTextContainer.appendChild(p);
        // Auto scroll to bottom
        bootTextContainer.scrollTop = bootTextContainer.scrollHeight;
        
        lineIndex++;
        playClick(); 
        setTimeout(typeLine, Math.random() * 400 + 200);
    } else {
        bootBar.style.display = 'block';
        let width = 0;
        const interval = setInterval(() => {
            width += Math.random() * 10;
            if(width > 100) width = 100;
            bootFill.style.width = width + '%';
            if(width === 100) {
                clearInterval(interval);
                setTimeout(launchDesktop, 800);
            }
        }, 80);
    }
}

function launchDesktop() {
    bootScreen.style.display = 'none';
    desktop.style.display = 'block';
    playStartup();
}

window.onload = () => {
    setTimeout(typeLine, 1000);
    updateClock();
    setInterval(updateClock, 1000);
};


// --- WINDOW MANAGER & CONTENT ---
let zIndexCounter = 100;
let windows = {};

// Helper function to generate window content HTML
function generateAppContent(title, icon, description, author, links, extendedInfo = "") {
    const linkList = links.map(l => 
        `<li><a href="${l.url}" target="_blank"><i class="fa-solid fa-external-link-alt" style="font-size:10px; margin-right:5px;"></i> ${l.text}</a></li>`
    ).join('');

    return `
        <div class="window-content-header">
            <i class="fa-solid ${icon}"></i>
            <div>
                <h2 style="margin:0; font-size:18px;">${title}</h2>
                <span style="color:#666;">Community App</span>
            </div>
        </div>
        <div style="margin-bottom:15px; line-height: 1.5;">
            <p>${description}</p>
            ${extendedInfo ? `<div style="margin-top:10px; font-size:13px; color:#444;">${extendedInfo}</div>` : ''}
        </div>
        <div class="author-box">
            <strong><i class="fa-solid fa-user-pen"></i> Built by:</strong> ${author}
        </div>
        <fieldset style="border: 1px solid #808080; padding: 10px;">
            <legend>External Access</legend>
            <ul class="link-list">
                ${linkList}
            </ul>
        </fieldset>
    `;
}

const contentMap = {
    'blazy': {
        title: 'Blazy Agent',
        icon: 'fa-robot',
        content: generateAppContent(
            'Blazy', 
            'fa-robot', 
            'Blazy is a custom Agent that aggregates news and information about @gensynai from different sources to bring them all in one place.', 
            'KongClaves', 
            [{ text: 'Launch Blazy Agent', url: 'http://gensyn-ai-agent.vercel.app' }],
            'It is intended to help make research about Gensyn easier and save time.'
        )
    },
    'nodeguide': {
        title: 'Gensyn Node Guide',
        icon: 'fa-book-open-reader',
        content: generateAppContent(
            'Gensyn Node Guide', 
            'fa-book-open-reader', 
            'Getting your node up and running shouldn’t feel like a puzzle. This guide is designed to make the whole process simple and stress-free.', 
            'Lino', 
            [{ text: 'Explore Node Buddy', url: 'http://gensyn-node-buddy.vercel.app' }],
            '<ul><li>Easy Step-by-Step Setup</li><li>Helpful Troubleshooting Tips</li></ul><br>Set up your node in just a few minutes and start earning rewards.'
        )
    },
    'eventhub': {
        title: 'Community Event Hub',
        icon: 'fa-calendar-days',
        content: generateAppContent(
            'Gensyn Community Event Hub', 
            'fa-calendar-days', 
            'This is your go-to place for <strong>upcoming + past events</strong> on the Gensyn ecosystem.', 
            'Mr Network', 
            [{ text: 'Visit Event Hub', url: 'http://gensyn-hub-comm.vercel.app' }]
        )
    },
    'wallpapers': {
        title: 'Gensyn Wallpapers',
        icon: 'fa-image',
        content: generateAppContent(
            'Gensyn Wallpapers', 
            'fa-image', 
            'Introducing timeless piece of ARTS: Gensyn wallpapers. High quality backgrounds for your devices.', 
            'KongClaves', 
            [{ text: 'Visit Gallery', url: 'http://gensyn-gallery.up.railway.app' }]
        )
    },
    'knowteam': {
        title: 'Know Your Team',
        icon: 'fa-users',
        content: generateAppContent(
            'Know Your Gensyn Team', 
            'fa-users', 
            'I built an application where you can easily find information about @gensynai team members from the founder down to operation team.', 
            'audu Emmanuel', 
            [{ text: 'Open App', url: 'http://knowyourgensynteam.netlify.app' }]
        )
    },
    'factcards': {
        title: 'Gensyn Fact Cards',
        icon: 'fa-address-card',
        content: generateAppContent(
            'Gensyn Fact Cards', 
            'fa-address-card', 
            'So, i thought to myself, why not create something fun and impactful to the community. then, i came up with gensyn fact cards.', 
            'Dave', 
            [{ text: 'View Fact Cards', url: 'http://gensyn-fact-cards-rho.vercel.app' }]
        )
    },
    'wordgame': {
        title: 'Word Construct',
        icon: 'fa-gamepad',
        content: generateAppContent(
            'Word Construct Game', 
            'fa-gamepad', 
            'I created this new game for @gensynai called the Gensyn Word Construct Game. Play, enjoy and quote with your scores 🤞🏽', 
            'Pesco', 
            [{ text: 'Play Now', url: 'http://gensyn-word.vercel.app' }]
        )
    },
    'market': {
        title: 'Gensyn Market',
        icon: 'fa-chart-line',
        content: generateAppContent(
            'Gensyn Market', 
            'fa-chart-line', 
            'Bet on Topics. Bet on Your conviction. Bet on Your favourite community Team. Bet for fun.', 
            'Tempest', 
            [{ text: 'Enter Market', url: 'http://gensynmarket.vercel.app' }]
        )
    },
    'codeassist': {
        title: 'CodeAssist',
        icon: 'fa-code',
        content: generateAppContent(
            'CodeAssist', 
            'fa-code', 
            'Official Gensyn tools for assisting with code verification and generation.', 
            'Gensyn', 
            [
                { text: 'Getting Started Docs', url: 'https://docs.gensyn.ai/testnet/codeassist/getting-started' },
                { text: 'Blog: Introducing CodeAssist', url: 'https://blog.gensyn.ai/introducing-codeassist/' }
            ]
        )
    },
    'sapo': {
        title: 'Sapo Protocol',
        icon: 'fa-network-wired',
        content: generateAppContent(
            'Sapo Protocol', 
            'fa-network-wired', 
            'Efficient LM Post-training with Collective RL. Scalable Asynchronous Proof-of-Optimization.', 
            'Gensyn', 
            [
                { text: 'GitHub: RL Swarm', url: 'https://github.com/gensyn-ai/rl-swarm?ref=blog.gensyn.ai' },
                { text: 'ArXiv Paper', url: 'https://arxiv.org/abs/2509.08721?ref=blog.gensyn.ai' },
                { text: 'Blog Post', url: 'https://blog.gensyn.ai/sapo-efficient-lm-post-training-with-collective-rl/' }
            ]
        )
    },
    'judge': {
        title: 'Judge',
        icon: 'fa-gavel',
        content: generateAppContent(
            'Judge', 
            'fa-gavel', 
            'The arbitration layer for the Gensyn network.', 
            'Gensyn', 
            [
                { text: 'Blog: Introducing Judge', url: 'https://blog.gensyn.ai/introducing-judge/' }
            ]
        )
    },
    'verde': {
        title: 'Verde',
        icon: 'fa-leaf',
        content: generateAppContent(
            'Verde', 
            'fa-leaf', 
            'Verifiable Reinforcement Learning. Ensuring computational integrity.', 
            'Gensyn', 
            [
                { text: 'GitHub: Repops Demo', url: 'https://github.com/gensyn-ai/repops-demo' },
                { text: 'Article: Verde', url: 'https://www.gensyn.ai/articles/verde' },
                { text: 'ArXiv Paper', url: 'https://arxiv.org/abs/2502.19405' }
            ]
        )
    },
    'recycle': {
        title: 'Recycle Bin',
        icon: 'fa-trash-can',
        content: '<div style="padding:20px; text-align:center;">The folder is empty.</div>'
    }
};

function handleIconClick(appId) {
    playClick();
    openWindow(appId);
}

function openWindow(appId) {
    if (windows[appId]) {
        bringToFront(appId);
        return;
    }

    playOpen();

    const appData = contentMap[appId];
    if (!appData) return;

    const win = document.createElement('div');
    win.classList.add('window');
    win.id = `win-${appId}`;
    win.style.zIndex = ++zIndexCounter;
    
    // Random position stagger
    const top = 50 + (Object.keys(windows).length * 30);
    const left = 50 + (Object.keys(windows).length * 30);
    win.style.top = `${top}px`;
    win.style.left = `${left}px`;
    
    win.innerHTML = `
        <div class="title-bar" onmousedown="startDrag(event, '${appId}')">
            <div style="display:flex; align-items:center; gap:5px;">
                <i class="fa-solid ${appData.icon}" style="font-size:12px;"></i>
                ${appData.title}
            </div>
            <div class="title-bar-controls">
                <button onclick="minimizeWindow('${appId}')">_</button>
                <button onclick="maximizeWindow('${appId}')">□</button>
                <button onclick="closeWindow('${appId}')" style="color:black;">X</button>
            </div>
        </div>
        <div class="window-body">
            ${appData.content}
        </div>
    `;
    
    win.addEventListener('mousedown', () => bringToFront(appId));
    document.getElementById('desktop').appendChild(win);
    windows[appId] = win;
    addTaskbarItem(appId, appData.title, appData.icon);
}

function closeWindow(appId) {
    const win = document.getElementById(`win-${appId}`);
    if (win) {
        win.remove();
        delete windows[appId];
        removeTaskbarItem(appId);
    }
}

function minimizeWindow(appId) {
    const win = document.getElementById(`win-${appId}`);
    if(win) win.style.display = 'none';
}

function maximizeWindow(appId) {
    const win = document.getElementById(`win-${appId}`);
    if(win.style.width === '100%') {
        win.style.width = '450px';
        win.style.height = 'auto';
        win.style.top = '50px';
        win.style.left = '50px';
    } else {
        win.style.top = '0';
        win.style.left = '0';
        win.style.width = '100%';
        win.style.height = 'calc(100% - 40px)'; 
    }
}

function bringToFront(appId) {
    const win = document.getElementById(`win-${appId}`);
    if (win) {
        win.style.zIndex = ++zIndexCounter;
        win.style.display = 'flex'; 
    }
}

// --- DRAG FUNCTIONALITY ---
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let currentDragWin = null;

function startDrag(e, appId) {
    e.preventDefault(); 
    isDragging = true;
    currentDragWin = document.getElementById(`win-${appId}`);
    const rect = currentDragWin.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    bringToFront(appId);
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
}

function doDrag(e) {
    if (!isDragging || !currentDragWin) return;
    let x = e.clientX - dragOffset.x;
    let y = e.clientY - dragOffset.y;
    if(y < 0) y = 0;
    currentDragWin.style.left = x + 'px';
    currentDragWin.style.top = y + 'px';
}

function stopDrag() {
    isDragging = false;
    currentDragWin = null;
    document.removeEventListener('mousemove', doDrag);
    document.removeEventListener('mouseup', stopDrag);
}

// --- TASKBAR MANAGEMENT ---
function addTaskbarItem(appId, title, icon) {
    const container = document.getElementById('taskbar-items');
    const item = document.createElement('div');
    item.className = 'task-item active';
    item.id = `task-${appId}`;
    item.onclick = () => bringToFront(appId);
    item.innerHTML = `<i class="fa-solid ${icon}" style="margin-right:5px;"></i> ${title}`;
    container.appendChild(item);
}

function removeTaskbarItem(appId) {
    const item = document.getElementById(`task-${appId}`);
    if (item) item.remove();
}

// --- START MENU ---
function toggleStartMenu() {
    playClick();
    const menu = document.getElementById('start-menu');
    const btn = document.getElementById('start-btn');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
        btn.classList.remove('active');
    } else {
        menu.style.display = 'block';
        btn.classList.add('active');
    }
}

document.addEventListener('click', (e) => {
    const menu = document.getElementById('start-menu');
    const btn = document.getElementById('start-btn');
    if (e.target !== menu && !menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
        menu.style.display = 'none';
        btn.classList.remove('active');
    }
});

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    document.getElementById('clock').innerText = `${hours}:${minutes} ${ampm}`;
}
