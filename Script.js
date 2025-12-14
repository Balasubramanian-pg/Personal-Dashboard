let charts = {};

// --- SIDEBAR TOGGLE LOGIC ---
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
        // Simple class toggle for mobile
        if (sidebar.style.width === '0px' || sidebar.style.width === '') {
            sidebar.style.width = '260px';
        } else {
            sidebar.style.width = '0px';
        }
    } else {
        // Desktop Collapse
        sidebar.classList.toggle('collapsed');
    }
}

// --- TAB SWITCHER ---
async function switchTab(tabName) {
    const container = document.getElementById('main-content');
    const headerTitle = document.getElementById('viewHeaderTitle');
    const globalControls = document.getElementById('globalControls');

    // Update Sidebar Active State
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('nav-active');
        btn.classList.add('nav-inactive');
    });
    document.getElementById(`nav-${tabName}`).classList.add('nav-active');
    document.getElementById(`nav-${tabName}`).classList.remove('nav-inactive');

    try {
        const response = await fetch(`${tabName}.html`);
        if (!response.ok) throw new Error('Failed to load tab');
        const html = await response.text();
        
        container.innerHTML = html;

        // Logic per tab
        if (tabName === 'dashboard') {
            headerTitle.innerText = 'Overview Dashboard';
            globalControls.classList.add('hidden');
            initDashCharts();
        } else if (tabName === 'business') {
            headerTitle.innerText = 'Business Dashboard';
            globalControls.classList.remove('hidden');
            initBusinessCharts();
        } else if (tabName === 'calendar') {
            headerTitle.innerText = 'Calendar';
            globalControls.classList.add('hidden');
            renderCalendar();
        }

    } catch (error) {
        console.error(error);
        container.innerHTML = `<div class="p-6 text-red-600 font-bold">Error loading content. Are you running a local server?</div>`;
    }

    // Close sidebar on mobile select
    if (window.innerWidth < 1024) {
        document.getElementById('sidebar').style.width = '0px';
    }
}

// --- CHART RENDERING ---
function initDashCharts() {
    // Wait for DOM
    setTimeout(() => {
        const ctx1 = document.getElementById('donutChart');
        if (ctx1) {
            if (charts.d1) charts.d1.destroy();
            charts.d1 = new Chart(ctx1, {
                type: 'doughnut',
                data: { labels: ['Spent', 'Saved'], datasets: [{ data: [30, 70], backgroundColor: ['#2563eb', '#e5e7eb'] }] },
                options: { maintainAspectRatio: false, cutout: '70%' }
            });
        }
        
        const ctx2 = document.getElementById('categoryChart');
        if (ctx2) {
            if (charts.d2) charts.d2.destroy();
            charts.d2 = new Chart(ctx2, {
                type: 'bar',
                data: { labels: ['Food', 'Rent', 'Bills'], datasets: [{ label: 'Cost', data: [200, 500, 300], backgroundColor: '#1e3a8a' }] },
                options: { maintainAspectRatio: false, plugins: { legend: { display: false } } }
            });
        }
    }, 100);
}

function initBusinessCharts() {
    setTimeout(() => {
        const ctxMain = document.getElementById('businessMainChart');
        if (ctxMain) {
            if (charts.b1) charts.b1.destroy();
            const gradient = ctxMain.getContext('2d').createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(13, 148, 136, 0.2)');
            gradient.addColorStop(1, 'rgba(13, 148, 136, 0)');

            charts.b1 = new Chart(ctxMain, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Balance',
                        data: [50, 80, 60, 100, 90, 120],
                        borderColor: '#0d9488',
                        backgroundColor: gradient,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { display: false } } }
            });
        }

        const ctxDonut = document.getElementById('businessDonutChart');
        if (ctxDonut) {
            if (charts.b2) charts.b2.destroy();
            charts.b2 = new Chart(ctxDonut, {
                type: 'doughnut',
                data: { labels: ['Vendor', 'Salary', 'Other'], datasets: [{ data: [40, 30, 30], backgroundColor: ['#0f172a', '#14b8a6', '#99f6e4'] }] },
                options: { maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } } }
            });
        }
    }, 100);
}

function renderCalendar() {
    setTimeout(() => {
        const el = document.getElementById('calendar');
        if (!el) return;
        el.innerHTML = '';
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(d => el.innerHTML += `<div class="text-center font-bold text-gray-400 py-2 text-sm">${d}</div>`);
        
        // Empty slots
        for(let i=0; i<3; i++) el.innerHTML += `<div></div>`;
        // Days
        for(let i=1; i<=31; i++) {
            el.innerHTML += `<div class="aspect-square border border-gray-100 rounded flex items-center justify-center hover:bg-blue-50 cursor-pointer text-sm font-medium text-gray-600">${i}</div>`;
        }
    }, 50);
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    switchTab('dashboard');
    if(window.innerWidth < 1024) document.getElementById('sidebar').style.width = '0px';
});