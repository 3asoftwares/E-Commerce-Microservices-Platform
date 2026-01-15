/**
 * 3A Softwares - Customer Support Application
 * Uses Shell App for authentication (no standalone login)
 * Features: Create, Update, Resolve, Assign Tickets, View Support Users
 */

// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG_LOCAL = {
  TICKET_API_URL: 'http://localhost:3016/api',
  AUTH_API_URL: 'http://localhost:3011/api/auth',
  SHELL_APP_URL: 'http://localhost:3000',
  AUTH_COOKIE_NAMES: {
    USER: 'auth_user',
    ACCESS_TOKEN: 'auth_access_token',
    REFRESH_TOKEN: 'auth_refresh_token',
    TOKEN_EXPIRY: 'auth_token_expiry',
  },
};

const CONFIG_PROD = {
  TICKET_API_URL: 'https://e-ticket-service.up.railway.app/api',
  AUTH_API_URL: 'https://e-auth-service.up.railway.app',
  SHELL_APP_URL: 'https://e-shell-app.vercel.app',
  AUTH_COOKIE_NAMES: {
    USER: 'auth_user',
    ACCESS_TOKEN: 'auth_access_token',
    REFRESH_TOKEN: 'auth_refresh_token',
    TOKEN_EXPIRY: 'auth_token_expiry',
  },
};

const CONFIG = !['localhost', '127.0.0.1'].includes(window.location.hostname)
  ? CONFIG_LOCAL
  : CONFIG_PROD;

// ==========================================
// APPLICATION STATE
// ==========================================
const AppState = {
  currentUser: null,
  tickets: [],
  supportUsers: [],
  dashboardStats: null,
  currentPage: 'dashboard',
  selectedTicket: null,
  isLoading: false,
  token: null,
  isEmbedded: window.self !== window.top,
  usersCurrentPage: 1,
  usersPerPage: 10,
  ticketsCurrentPage: 1,
  ticketsPerPage: 10,
  // Lazy loading flags
  ticketsLoaded: false,
  usersLoaded: false,
  statsLoaded: false,
};

// ==========================================
// COOKIE HELPERS
// ==========================================
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(';').shift());
  }
  return null;
}

function setCookie(name, value, days = 1) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function clearAllAuthCookies() {
  Object.values(CONFIG.AUTH_COOKIE_NAMES).forEach(deleteCookie);
}

function getAuthFromCookies() {
  const userStr = getCookie(CONFIG.AUTH_COOKIE_NAMES.USER);
  const token = getCookie(CONFIG.AUTH_COOKIE_NAMES.ACCESS_TOKEN);

  if (!userStr || !token) return null;

  try {
    return { user: JSON.parse(userStr), token };
  } catch (e) {
    console.error('Error parsing user cookie:', e);
    return null;
  }
}

function storeAuthToCookies(user, accessToken, refreshToken = null) {
  setCookie(CONFIG.AUTH_COOKIE_NAMES.USER, JSON.stringify(user), 7);
  setCookie(CONFIG.AUTH_COOKIE_NAMES.ACCESS_TOKEN, accessToken, 1);
  if (refreshToken) {
    setCookie(CONFIG.AUTH_COOKIE_NAMES.REFRESH_TOKEN, refreshToken, 7);
  }
  setCookie(CONFIG.AUTH_COOKIE_NAMES.TOKEN_EXPIRY, (Date.now() + 3600 * 1000).toString(), 1);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '');

const truncateText = (text, maxLength) =>
  text && text.length > maxLength ? text.substring(0, maxLength) + '...' : text || '';

const formatStatus = (status) => (status ? status.split('-').map(capitalize).join(' ') : '');

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const days = Math.floor((new Date() - d) / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function getUserAvatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;
}

// ==========================================
// UI HELPERS
// ==========================================
function setLoading(isLoading) {
  AppState.isLoading = isLoading;
  document.querySelectorAll('button[type="submit"]').forEach((btn) => {
    btn.disabled = isLoading;
    if (isLoading) {
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
    }
  });
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('successToast');
  const toastMessage = document.getElementById('toastMessage');
  const toastHeader = toast?.querySelector('.toast-header');

  if (!toast || !toastMessage || !toastHeader) return;

  toastMessage.textContent = message;
  toastHeader.classList.toggle('bg-danger', type === 'error');
  toastHeader.classList.toggle('bg-success', type !== 'error');

  new bootstrap.Toast(toast).show();
}

function animateCounter(elementId, targetValue) {
  const element = document.getElementById(elementId);
  if (!element) return;

  let current = 0;
  const increment = targetValue / 20;
  const timer = setInterval(() => {
    current += increment;
    if (current >= targetValue) {
      element.textContent = targetValue;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 50);
}

// ==========================================
// AUTHENTICATION
// ==========================================
async function initializeApp() {
  setupEventListeners();

  if (AppState.isEmbedded) {
    setupShellIntegration();
  } else {
    await handleStandaloneAuth();
  }
}

async function handleStandaloneAuth() {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('userId');

  if (userId) {
    window.history.replaceState({}, document.title, window.location.pathname);
    await fetchUserById(userId);
    return;
  }

  const cookieAuth = getAuthFromCookies();
  if (cookieAuth?.token && cookieAuth?.user) {
    if (['support', 'admin'].includes(cookieAuth.user.role)) {
      AppState.token = cookieAuth.token;
      AppState.currentUser = cookieAuth.user;
      await showDashboard();
      return;
    }
    showAccessDenied();
    return;
  }

  redirectToShellLogin();
}

async function fetchUserById(userId) {
  try {
    const response = await fetch(`${CONFIG.AUTH_API_URL}/user/${userId}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      redirectToShellLogin();
      return;
    }

    const result = await response.json();
    if (!result.success || !result.data) {
      redirectToShellLogin();
      return;
    }

    const { user, accessToken, refreshToken } = result.data;

    if (['support', 'admin'].includes(user.role)) {
      storeAuthToCookies(user, accessToken, refreshToken);
      AppState.currentUser = user;
      AppState.token = accessToken;
      await showDashboard();
    } else {
      showAccessDenied();
    }
  } catch (error) {
    console.error('Failed to fetch user:', error);
    redirectToShellLogin();
  }
}

function redirectToShellLogin() {
  window.location.href = `${CONFIG.SHELL_APP_URL}?logout=true`;
}

function setupShellIntegration() {
  window.addEventListener('message', async (event) => {
    const { type, payload } = event.data || {};

    if (type === 'AUTH_DATA' && payload?.user && payload?.token) {
      if (['support', 'admin'].includes(payload.user.role)) {
        AppState.currentUser = payload.user;
        AppState.token = payload.token;
        sessionStorage.setItem('supportAuth', JSON.stringify(payload));
        await showDashboard();
      } else {
        showAccessDenied();
      }
    }

    if (type === 'THEME_CHANGE' && payload) {
      applyTheme(payload.theme);
    }

    if (type === 'LOGOUT') {
      handleLogout();
    }
  });

  window.parent?.postMessage({ type: 'REQUEST_AUTH' }, '*');
}

function showAccessDenied() {
  document.getElementById('dashboardPage')?.classList.remove('active');
  document.body.innerHTML = `
    <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div class="text-center">
        <i class="bi bi-shield-x text-danger" style="font-size: 64px;"></i>
        <h2 class="mt-3">Access Denied</h2>
        <p class="text-muted">You don't have permission to access the Support Portal.</p>
        <p class="text-muted">Only users with 'support' or 'admin' role can access this application.</p>
        <button class="btn btn-primary mt-3" onclick="goToShellApp()">
          <i class="bi bi-arrow-left me-2"></i>Go to Main App
        </button>
      </div>
    </div>
  `;
}

function goToShellApp() {
  localStorage.removeItem('supportAuth');
  sessionStorage.removeItem('supportAuth');

  if (AppState.isEmbedded && window.parent) {
    window.parent.postMessage({ type: 'CLOSE_APP' }, '*');
  } else {
    window.location.href = CONFIG.SHELL_APP_URL;
  }
}

function handleLogout(e) {
  e?.preventDefault();

  AppState.currentUser = null;
  AppState.token = null;
  AppState.tickets = [];
  AppState.supportUsers = [];

  localStorage.removeItem('supportAuth');
  sessionStorage.removeItem('supportAuth');
  clearAllAuthCookies();

  if (AppState.isEmbedded && window.parent) {
    window.parent.postMessage({ type: 'LOGOUT_REQUEST' }, '*');
  } else {
    window.location.href = `${CONFIG.SHELL_APP_URL}?logout=true`;
  }
}

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  document.body.classList.toggle('dark-theme', isDark);
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
  // Sidebar menu
  document.querySelectorAll('.sidebar-menu li').forEach((item) => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      if (page) {
        showPage(page);
        updateActiveMenuItem(page);
      }
    });
  });

  // Sidebar toggle
  document.getElementById('sidebarToggle')?.addEventListener('click', toggleSidebar);

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
  document.getElementById('logoutDropdown')?.addEventListener('click', handleLogout);

  // New ticket form
  document.getElementById('newTicketForm')?.addEventListener('submit', handleCreateTicket);

  // Filters
  ['filterStatus', 'filterPriority', 'filterCategory'].forEach((id) => {
    document.getElementById(id)?.addEventListener('change', filterTickets);
  });
  document.getElementById('ticketSearch')?.addEventListener('input', debounce(filterTickets, 300));

  // Global search
  document
    .getElementById('globalSearch')
    ?.addEventListener('input', debounce(handleGlobalSearch, 300));

  // Select all checkbox
  document.getElementById('selectAll')?.addEventListener('change', (e) => {
    document
      .querySelectorAll('#ticketsTableBody input[type="checkbox"]')
      .forEach((cb) => (cb.checked = e.target.checked));
  });

  // Resolve ticket button
  document.getElementById('resolveTicketBtn')?.addEventListener('click', handleResolveTicket);
}

// ==========================================
// NAVIGATION
// ==========================================
async function showDashboard() {
  document.getElementById('dashboardPage')?.classList.add('active');

  updateUserInfo();
  updateUIForRole();

  // Only load dashboard stats on initial load
  await loadDashboardStats();
  updateDashboardStats();
  updatePriorityChart();
  renderUserTickets();
}

async function showPage(pageName) {
  document.querySelectorAll('.content-section').forEach((s) => s.classList.remove('active'));
  document.getElementById(`${pageName}Content`)?.classList.add('active');

  AppState.currentPage = pageName;

  // Lazy load data based on page
  switch (pageName) {
    case 'dashboard':
      if (!AppState.statsLoaded) await loadDashboardStats();
      updateDashboardStats();
      updatePriorityChart();
      renderUserTickets();
      break;
    case 'tickets':
      if (!AppState.ticketsLoaded) await loadTickets();
      renderTicketsTable();
      break;
    case 'users':
      if (!AppState.usersLoaded) await loadSupportUsers();
      renderUsersTable();
      break;
    case 'newTicket':
      if (!AppState.usersLoaded) await loadSupportUsers();
      populateAssigneeDropdown();
      break;
    case 'reports':
      if (!AppState.statsLoaded) await loadDashboardStats();
      updateReports();
      break;
  }
}

function updateActiveMenuItem(pageName) {
  document.querySelectorAll('.sidebar-menu li').forEach((item) => {
    item.classList.toggle('active', item.dataset.page === pageName);
  });
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.querySelector('.main-content');

  sidebar.classList.toggle('collapsed');
  mainContent.classList.toggle('expanded');

  if (window.innerWidth <= 991) {
    sidebar.classList.toggle('show');
  }
}

function updateUserInfo() {
  if (!AppState.currentUser) return;

  const { name, avatar } = AppState.currentUser;
  const avatarUrl = avatar || getUserAvatarUrl(name);

  const userName = document.getElementById('userName');
  if (userName) userName.textContent = name;

  const userAvatar = document.getElementById('userAvatar');
  if (userAvatar) {
    userAvatar.src = avatarUrl;
    userAvatar.alt = name;
  }

  const welcomeMessage = document.getElementById('welcomeMessage');
  if (welcomeMessage) {
    welcomeMessage.textContent = `Welcome back, ${name.split(' ')[0]}! Here's your support overview.`;
  }
}

function updateUIForRole() {
  if (!AppState.currentUser) return;

  const usersMenuItem = document.querySelector('.sidebar-menu li[data-page="users"]');
  if (usersMenuItem) {
    usersMenuItem.style.display = AppState.currentUser.role === 'admin' ? '' : 'none';
  }
}

// ==========================================
// API HELPERS
// ==========================================
async function apiRequest(endpoint, options = {}) {
  const token = AppState.token || getCookie(CONFIG.AUTH_COOKIE_NAMES.ACCESS_TOKEN);

  const response = await fetch(`${CONFIG.TICKET_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

// ==========================================
// DATA LOADING
// ==========================================
async function loadDashboardStats() {
  try {
    setLoading(true);
    const userId = AppState.currentUser?._id || AppState.currentUser?.id;
    const endpoint = userId ? `/tickets/stats?userId=${userId}` : '/tickets/stats';
    console.log('loadDashboardStats - calling:', endpoint);
    const response = await apiRequest(endpoint);
    console.log('loadDashboardStats - response:', response);
    if (response.success) {
      AppState.dashboardStats = response.data;
      AppState.statsLoaded = true;
    }
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
    showToast('Failed to load dashboard stats', 'error');
  } finally {
    setLoading(false);
  }
}

async function loadTickets() {
  try {
    setLoading(true);
    const response = await apiRequest('/tickets?limit=1000');
    if (response.success) {
      AppState.tickets = response.data;
      AppState.ticketsLoaded = true;
    }
  } catch (error) {
    console.error('Error loading tickets:', error);
    showToast('Failed to load tickets', 'error');
  } finally {
    setLoading(false);
  }
}

async function loadSupportUsers() {
  try {
    setLoading(true);
    const response = await fetch(
      `${CONFIG.AUTH_API_URL.replace('/auth', '')}/users?role=support&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${AppState.token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      AppState.supportUsers = data.data?.users || data.data || data.users || [];
      AppState.usersLoaded = true;
    }
  } catch (error) {
    console.error('Error loading support users:', error);
  } finally {
    setLoading(false);
  }
}

// ==========================================
// DASHBOARD
// ==========================================
function getMyTickets() {
  const userId = AppState.currentUser?._id || AppState.currentUser?.id;
  return userId ? AppState.tickets.filter((t) => t.assignedTo === userId) : [];
}

function updateDashboardStats() {
  const stats = AppState.dashboardStats;
  if (!stats) return;

  const total = stats.total || 0;
  const open = stats.byStatus?.open || 0;
  const inProgress = stats.byStatus?.inProgress || 0;
  const resolved = (stats.byStatus?.resolved || 0) + (stats.byStatus?.closed || 0);

  animateCounter('totalTickets', total);
  animateCounter('openTickets', open);
  animateCounter('inProgressTickets', inProgress);
  animateCounter('resolvedTickets', resolved);

  const ticketCount = document.getElementById('ticketCount');
  if (ticketCount) ticketCount.textContent = total;

  const notificationBadge = document.getElementById('notificationBadge');
  if (notificationBadge) {
    notificationBadge.textContent = open;
    notificationBadge.style.display = open > 0 ? 'inline-block' : 'none';
  }
}

function updateReports() {
  const stats = AppState.dashboardStats;
  if (!stats) return;

  const total = stats.total || 0;
  const resolved = (stats.byStatus?.resolved || 0) + (stats.byStatus?.closed || 0);

  const resolutionRate = document.getElementById('resolutionRate');
  if (resolutionRate) {
    resolutionRate.textContent = total > 0 ? `${Math.round((resolved / total) * 100)}%` : '0%';
  }

  // Average resolution time would require additional API data
  // For now, show a placeholder or can be added to stats API later
  const avgResolutionTime = document.getElementById('avgResolutionTime');
  if (avgResolutionTime) {
    avgResolutionTime.textContent = '--';
  }
}

function updatePriorityChart() {
  const stats = AppState.dashboardStats;
  if (!stats) return;

  const total = stats.total || 1;
  const priorities = {
    high: (stats.byPriority?.high || 0) + (stats.byPriority?.urgent || 0),
    medium: stats.byPriority?.medium || 0,
    low: stats.byPriority?.low || 0,
  };

  ['high', 'medium', 'low'].forEach((p) => {
    const count = document.getElementById(`${p}Count`);
    const bar = document.getElementById(`${p}PriorityBar`);
    if (count) count.textContent = priorities[p];
    if (bar) bar.style.width = `${(priorities[p] / total) * 100}%`;
  });
}

function renderUserTickets() {
  const tableBody = document.getElementById('userTicketsTable');
  if (!tableBody) return;

  const userTickets = AppState.dashboardStats?.userTickets || [];

  if (userTickets.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="5" class="text-center py-4 text-muted">No tickets assigned to you</td></tr>';
    return;
  }

  tableBody.innerHTML = userTickets
    .map(
      (ticket) => `
    <tr onclick="viewTicket('${ticket._id || ticket.id}')" style="cursor: pointer;">
      <td><strong>#${ticket.ticketId || ticket.id}</strong></td>
      <td>${truncateText(ticket.subject, 30)}</td>
      <td><span class="priority-badge ${ticket.priority}">${capitalize(ticket.priority)}</span></td>
      <td><span class="status-badge ${ticket.status}">${formatStatus(ticket.status)}</span></td>
      <td>${formatDate(ticket.createdAt)}</td>
    </tr>
  `
    )
    .join('');
}

// ==========================================
// PAGINATION HELPER
// ==========================================
function renderPagination(container, currentPage, totalPages, onPageChange) {
  if (!container || totalPages <= 1) {
    if (container) container.innerHTML = '';
    return;
  }

  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  let html = `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="event.preventDefault(); ${onPageChange}(${currentPage - 1})">
        <i class="bi bi-chevron-left"></i>
      </a>
    </li>
  `;

  if (startPage > 1) {
    html += `<li class="page-item"><a class="page-link" href="#" onclick="event.preventDefault(); ${onPageChange}(1)">1</a></li>`;
    if (startPage > 2)
      html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
  }

  for (let i = startPage; i <= endPage; i++) {
    html += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" onclick="event.preventDefault(); ${onPageChange}(${i})">${i}</a>
      </li>
    `;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1)
      html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
    html += `<li class="page-item"><a class="page-link" href="#" onclick="event.preventDefault(); ${onPageChange}(${totalPages})">${totalPages}</a></li>`;
  }

  html += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="event.preventDefault(); ${onPageChange}(${currentPage + 1})">
        <i class="bi bi-chevron-right"></i>
      </a>
    </li>
  `;

  container.innerHTML = html;
}

// ==========================================
// TICKETS
// ==========================================
function renderTicketsTable(tickets = AppState.tickets) {
  const tableBody = document.getElementById('ticketsTableBody');
  const paginationContainer = document.getElementById('ticketsPagination');
  if (!tableBody) return;

  if (tickets.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" class="text-center py-4">
          <i class="bi bi-inbox text-muted" style="font-size: 48px;"></i>
          <p class="text-muted mt-2">No tickets found</p>
        </td>
      </tr>
    `;
    if (paginationContainer) paginationContainer.innerHTML = '';
    return;
  }

  const totalPages = Math.ceil(tickets.length / AppState.ticketsPerPage);
  if (AppState.ticketsCurrentPage > totalPages) {
    AppState.ticketsCurrentPage = totalPages || 1;
  }

  const startIndex = (AppState.ticketsCurrentPage - 1) * AppState.ticketsPerPage;
  const paginatedTickets = tickets.slice(startIndex, startIndex + AppState.ticketsPerPage);

  tableBody.innerHTML = paginatedTickets
    .map(
      (ticket) => `
    <tr>
      <td><input type="checkbox" class="form-check-input" value="${ticket._id}"></td>
      <td><strong>#${ticket.ticketId}</strong></td>
      <td>${truncateText(ticket.subject, 25)}</td>
      <td>
        <div class="user-avatar">
          <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(ticket.customerName)}&background=random" alt="${ticket.customerName}">
          <div class="user-info">
            <div class="user-name">${ticket.customerName}</div>
            <div class="user-email">${ticket.customerEmail}</div>
          </div>
        </div>
      </td>
      <td>${capitalize(ticket.category)}</td>
      <td><span class="priority-badge ${ticket.priority}">${capitalize(ticket.priority)}</span></td>
      <td><span class="status-badge ${ticket.status}">${formatStatus(ticket.status)}</span></td>
      <td>${ticket.assignedToName || 'Unassigned'}</td>
      <td>
        <div class="d-flex gap-1">
          <button class="action-btn view" onclick="viewTicket('${ticket._id}')" title="View">
            <i class="bi bi-eye"></i>
          </button>
          <button class="action-btn edit" onclick="showAssignModal('${ticket._id}')" title="Assign">
            <i class="bi bi-person-plus"></i>
          </button>
          ${
            ticket.status !== 'resolved' && ticket.status !== 'closed'
              ? `
            <button class="action-btn success" onclick="quickResolve('${ticket._id}')" title="Resolve">
              <i class="bi bi-check-circle"></i>
            </button>
          `
              : ''
          }
        </div>
      </td>
    </tr>
  `
    )
    .join('');

  renderPagination(
    paginationContainer,
    AppState.ticketsCurrentPage,
    totalPages,
    'changeTicketsPage'
  );
}

function changeTicketsPage(page) {
  const totalPages = Math.ceil(AppState.tickets.length / AppState.ticketsPerPage);
  if (page < 1 || page > totalPages) return;
  AppState.ticketsCurrentPage = page;
  renderTicketsTable();
}

function filterTickets() {
  const status = document.getElementById('filterStatus')?.value;
  const priority = document.getElementById('filterPriority')?.value;
  const category = document.getElementById('filterCategory')?.value;
  const search = document.getElementById('ticketSearch')?.value?.toLowerCase();

  AppState.ticketsCurrentPage = 1;

  let filtered = [...AppState.tickets];

  if (status) filtered = filtered.filter((t) => t.status === status);
  if (priority) filtered = filtered.filter((t) => t.priority === priority);
  if (category) filtered = filtered.filter((t) => t.category === category);
  if (search) {
    filtered = filtered.filter(
      (t) =>
        t.subject?.toLowerCase().includes(search) ||
        t.customerName?.toLowerCase().includes(search) ||
        t.customerEmail?.toLowerCase().includes(search) ||
        t.ticketId?.toString().includes(search)
    );
  }

  renderTicketsTable(filtered);
}

async function handleCreateTicket(e) {
  e.preventDefault();
  setLoading(true);

  try {
    const ticketData = {
      customerName: document.getElementById('ticketCustomer').value,
      customerEmail: document.getElementById('ticketEmail').value,
      subject: document.getElementById('ticketSubject').value,
      category: document.getElementById('ticketCategory').value,
      priority: document.getElementById('ticketPriority').value,
      description: document.getElementById('ticketDescription').value,
    };

    const response = await apiRequest('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });

    if (response.success) {
      AppState.tickets.unshift(response.data);
      // Invalidate stats cache so it reloads on dashboard
      AppState.statsLoaded = false;
      showToast(`Ticket ${response.data.ticketId} created successfully!`);
      e.target.reset();
      showPage('tickets');
      updateActiveMenuItem('tickets');
    }
  } catch (error) {
    showToast(error.message || 'Failed to create ticket', 'error');
  } finally {
    setLoading(false);
  }
}

async function viewTicket(ticketId) {
  const ticket = AppState.tickets.find((t) => t._id === ticketId);
  if (!ticket) return;

  AppState.selectedTicket = ticket;

  const modalBody = document.getElementById('ticketDetailBody');
  const isResolved = ['resolved', 'closed'].includes(ticket.status);

  modalBody.innerHTML = `
    <div class="ticket-detail">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="text-muted small">Ticket ID</label>
          <div><strong>#${ticket.ticketId}</strong></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="text-muted small">Status</label>
          <div><span class="status-badge ${ticket.status}">${formatStatus(ticket.status)}</span></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="text-muted small">Priority</label>
          <div><span class="priority-badge ${ticket.priority}">${capitalize(ticket.priority)}</span></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="text-muted small">Category</label>
          <div>${capitalize(ticket.category)}</div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="text-muted small">Customer</label>
          <div>${ticket.customerName}</div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="text-muted small">Email</label>
          <div>${ticket.customerEmail}</div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="text-muted small">Assigned To</label>
          <div>${ticket.assignedToName || 'Unassigned'}</div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="text-muted small">Created</label>
          <div>${formatDate(ticket.createdAt)}</div>
        </div>
      </div>
      <hr>
      <div class="mb-3">
        <label class="text-muted small">Subject</label>
        <div><strong>${ticket.subject}</strong></div>
      </div>
      <div class="mb-3">
        <label class="text-muted small">Description</label>
        <div class="p-3 bg-light rounded">${ticket.description}</div>
      </div>
      ${
        ticket.resolution
          ? `
        <div class="mb-3">
          <label class="text-muted small">Resolution</label>
          <div class="p-3 bg-success bg-opacity-10 rounded text-success">${ticket.resolution}</div>
        </div>
      `
          : ''
      }
      ${
        !isResolved
          ? `
        <hr>
        <div class="mb-3">
          <label class="form-label">Resolution Notes</label>
          <textarea class="form-control" id="resolutionNotes" rows="3" placeholder="Enter resolution details..."></textarea>
        </div>
      `
          : ''
      }
    </div>
  `;

  const resolveBtn = document.getElementById('resolveTicketBtn');
  if (resolveBtn) {
    resolveBtn.style.display = isResolved ? 'none' : 'inline-block';
  }

  new bootstrap.Modal(document.getElementById('ticketDetailModal')).show();
}

async function handleResolveTicket() {
  if (!AppState.selectedTicket) return;

  const resolution = document.getElementById('resolutionNotes')?.value;
  if (!resolution) {
    showToast('Please enter resolution notes', 'error');
    return;
  }

  setLoading(true);

  try {
    const response = await apiRequest(`/tickets/${AppState.selectedTicket._id}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ resolution }),
    });

    if (response.success) {
      const index = AppState.tickets.findIndex((t) => t._id === AppState.selectedTicket._id);
      if (index !== -1) AppState.tickets[index] = response.data;

      // Invalidate stats cache
      AppState.statsLoaded = false;
      showToast('Ticket resolved successfully!');
      bootstrap.Modal.getInstance(document.getElementById('ticketDetailModal')).hide();
      renderTicketsTable();
    }
  } catch (error) {
    showToast(error.message || 'Failed to resolve ticket', 'error');
  } finally {
    setLoading(false);
  }
}

async function quickResolve(ticketId) {
  const resolution = prompt('Enter resolution notes:');
  if (!resolution) return;

  setLoading(true);

  try {
    const response = await apiRequest(`/tickets/${ticketId}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ resolution }),
    });

    if (response.success) {
      const index = AppState.tickets.findIndex((t) => t._id === ticketId);
      if (index !== -1) AppState.tickets[index] = response.data;

      // Invalidate stats cache
      AppState.statsLoaded = false;
      showToast('Ticket resolved successfully!');
      renderTicketsTable();
    }
  } catch (error) {
    showToast(error.message || 'Failed to resolve ticket', 'error');
  } finally {
    setLoading(false);
  }
}

async function showAssignModal(ticketId) {
  const ticket = AppState.tickets.find((t) => t._id === ticketId);
  if (!ticket) return;

  AppState.selectedTicket = ticket;

  // Load users if not already loaded
  if (!AppState.usersLoaded) {
    await loadSupportUsers();
  }

  const activeUsers = AppState.supportUsers.filter((u) => u.isActive !== false);

  if (activeUsers.length === 0) {
    showToast('No support agents available.', 'error');
    return;
  }

  const assignOptions = activeUsers
    .map(
      (u) => `
    <option value="${u._id}" data-name="${u.name}" ${ticket.assignedTo === u._id ? 'selected' : ''}>
      ${u.name} (${u.email})
    </option>
  `
    )
    .join('');

  // Remove existing modal
  document.getElementById('assignModal')?.remove();

  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <div class="modal fade" id="assignModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Assign Ticket #${ticket.ticketId}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Assign to Support Agent</label>
              <select class="form-select" id="assignToUser">
                <option value="">Select Agent</option>
                ${assignOptions}
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="handleAssignTicket()">
              <i class="bi bi-person-check me-1"></i>Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  `
  );

  new bootstrap.Modal(document.getElementById('assignModal')).show();
}

async function handleAssignTicket() {
  if (!AppState.selectedTicket) return;

  const select = document.getElementById('assignToUser');
  const assignedTo = select.value;
  const assignedToName = select.options[select.selectedIndex]?.dataset?.name || '';

  if (!assignedTo) {
    showToast('Please select a user', 'error');
    return;
  }

  setLoading(true);

  try {
    const response = await apiRequest(`/tickets/${AppState.selectedTicket._id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ assignedTo, assignedToName }),
    });

    if (response.success) {
      const index = AppState.tickets.findIndex((t) => t._id === AppState.selectedTicket._id);
      if (index !== -1) AppState.tickets[index] = response.data;

      showToast('Ticket assigned successfully!');
      bootstrap.Modal.getInstance(document.getElementById('assignModal')).hide();
      renderTicketsTable();
    }
  } catch (error) {
    showToast(error.message || 'Failed to assign ticket', 'error');
  } finally {
    setLoading(false);
  }
}

// ==========================================
// USERS
// ==========================================
function renderUsersTable() {
  const tableBody = document.getElementById('usersTableBody');
  const paginationContainer = document.getElementById('usersPagination');
  if (!tableBody) return;

  if (AppState.supportUsers.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-4">
          <i class="bi bi-people text-muted" style="font-size: 48px;"></i>
          <p class="text-muted mt-2">No support users found</p>
        </td>
      </tr>
    `;
    if (paginationContainer) paginationContainer.innerHTML = '';
    return;
  }

  // Calculate counts and sort
  const usersWithCounts = AppState.supportUsers
    .map((user) => ({
      ...user,
      assignedCount: AppState.tickets.filter((t) => t.assignedTo === user._id).length,
      resolvedCount: AppState.tickets.filter(
        (t) => t.assignedTo === user._id && ['resolved', 'closed'].includes(t.status)
      ).length,
    }))
    .sort((a, b) => b.assignedCount - a.assignedCount);

  const totalPages = Math.ceil(usersWithCounts.length / AppState.usersPerPage);
  if (AppState.usersCurrentPage > totalPages) {
    AppState.usersCurrentPage = totalPages || 1;
  }

  const startIndex = (AppState.usersCurrentPage - 1) * AppState.usersPerPage;
  const paginatedUsers = usersWithCounts.slice(startIndex, startIndex + AppState.usersPerPage);

  tableBody.innerHTML = paginatedUsers
    .map(
      (user) => `
    <tr>
      <td>
        <div class="user-avatar">
          <img src="${user.avatar || getUserAvatarUrl(user.name)}" alt="${user.name}">
          <div class="user-info">
            <div class="user-name">${user.name}</div>
            <div class="user-email">${user.email}</div>
          </div>
        </div>
      </td>
      <td><span class="badge bg-primary">${capitalize(user.role)}</span></td>
      <td>${user.assignedCount}</td>
      <td>${user.resolvedCount}</td>
      <td><span class="badge ${user.isActive !== false ? 'bg-success' : 'bg-secondary'}">${user.isActive !== false ? 'Active' : 'Inactive'}</span></td>
    </tr>
  `
    )
    .join('');

  renderPagination(paginationContainer, AppState.usersCurrentPage, totalPages, 'changeUsersPage');
}

function changeUsersPage(page) {
  const totalPages = Math.ceil(AppState.supportUsers.length / AppState.usersPerPage);
  if (page < 1 || page > totalPages) return;
  AppState.usersCurrentPage = page;
  renderUsersTable();
}

function populateAssigneeDropdown() {
  const dropdown = document.getElementById('ticketAssignee');
  if (!dropdown) return;

  const activeUsers = AppState.supportUsers.filter((u) => u.isActive !== false);

  if (activeUsers.length === 0) {
    dropdown.innerHTML = '<option value="">No agents available</option>';
    return;
  }

  dropdown.innerHTML = `
    <option value="">Unassigned</option>
    ${activeUsers.map((u) => `<option value="${u._id}">${u.name}</option>`).join('')}
  `;
}

// ==========================================
// SEARCH
// ==========================================
async function handleGlobalSearch(e) {
  const query = e.target.value.toLowerCase();
  if (query.length < 2) return;

  // Load tickets if not already loaded
  if (!AppState.ticketsLoaded) {
    await loadTickets();
  }

  const results = AppState.tickets.filter(
    (t) =>
      t.subject?.toLowerCase().includes(query) ||
      t.customerName?.toLowerCase().includes(query) ||
      t.ticketId?.toString().includes(query)
  );

  if (results.length > 0) {
    showPage('tickets');
    updateActiveMenuItem('tickets');
    renderTicketsTable(results);
  }
}

// ==========================================
// GLOBAL EXPORTS
// ==========================================
window.showPage = showPage;
window.viewTicket = viewTicket;
window.showAssignModal = showAssignModal;
window.handleAssignTicket = handleAssignTicket;
window.quickResolve = quickResolve;
window.handleResolveTicket = handleResolveTicket;
window.goToShellApp = goToShellApp;
window.redirectToShellLogin = redirectToShellLogin;
window.updateActiveMenuItem = updateActiveMenuItem;
window.changeUsersPage = changeUsersPage;
window.changeTicketsPage = changeTicketsPage;

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', initializeApp);
