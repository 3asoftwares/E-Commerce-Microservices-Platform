/**
 * 3A Softwares - Customer Support Application
 * Technologies: JavaScript (ES6+), HTML5, CSS3, SCSS, Bootstrap, Fetch API
 * Features: Ticket management, Support user management, Admin authentication
 */

// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG = {
    API_BASE_URL: 'http://localhost:3009/api',
    USE_API: true, // Set to false to use mock data
};

// ==========================================
// APPLICATION STATE
// ==========================================
const AppState = {
    currentUser: null,
    tickets: [],
    supportUsers: [],
    currentPage: 'dashboard',
    ticketIdCounter: 1000,
    selectedTicket: null,
    isLoading: false,
    token: null,
};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    // Check for existing session
    const savedUser = localStorage.getItem('supportUser') || sessionStorage.getItem('supportUser');
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        AppState.currentUser = userData.user || userData;
        AppState.token = userData.token;
        await showDashboard();
    }

    // Setup event listeners
    setupEventListeners();
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Password toggle
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const passwordInput = document.getElementById('password');
            const icon = togglePassword.querySelector('i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.replace('bi-eye', 'bi-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.replace('bi-eye-slash', 'bi-eye');
            }
        });
    }

    // Sidebar menu items
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    menuItems.forEach((item) => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            if (page) {
                showPage(page);
                updateActiveMenu(item);
            }
        });
    });

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }

    // Logout buttons
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutDropdown = document.getElementById('logoutDropdown');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (logoutDropdown) logoutDropdown.addEventListener('click', handleLogout);

    // New ticket form
    const newTicketForm = document.getElementById('newTicketForm');
    if (newTicketForm) {
        newTicketForm.addEventListener('submit', handleCreateTicket);
    }

    // Filters
    const filterStatus = document.getElementById('filterStatus');
    const filterPriority = document.getElementById('filterPriority');
    const filterCategory = document.getElementById('filterCategory');
    const ticketSearch = document.getElementById('ticketSearch');

    if (filterStatus) filterStatus.addEventListener('change', filterTickets);
    if (filterPriority) filterPriority.addEventListener('change', filterTickets);
    if (filterCategory) filterCategory.addEventListener('change', filterTickets);
    if (ticketSearch) ticketSearch.addEventListener('input', debounce(filterTickets, 300));

    // Global search
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('input', debounce(handleGlobalSearch, 300));
    }

    // Select all checkbox
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('#ticketsTableBody input[type="checkbox"]');
            checkboxes.forEach((cb) => (cb.checked = e.target.checked));
        });
    }

    // Resolve ticket button in modal
    const resolveBtn = document.getElementById('resolveTicketBtn');
    if (resolveBtn) {
        resolveBtn.addEventListener('click', handleResolveTicket);
    }
}

// ==========================================
// AUTHENTICATION
// ==========================================
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    setLoading(true);

    try {
        if (CONFIG.USE_API && window.TicketService) {
            const response = await window.TicketService.login(email, password);
            
            if (response.success) {
                AppState.currentUser = response.data.user;
                AppState.token = response.data.token;

                const storage = rememberMe ? localStorage : sessionStorage;
                storage.setItem('supportUser', JSON.stringify(response.data));

                await showDashboard();
                showToast(`Welcome back, ${response.data.user.name}!`);
            } else {
                showToast(response.message || 'Login failed', 'error');
            }
        } else {
            // Fallback to mock login
            if (email === 'admin@3asoftwares.com' && password === 'admin123') {
                const user = {
                    id: 1,
                    name: 'Admin User',
                    email: email,
                    role: 'admin',
                };

                AppState.currentUser = user;

                if (rememberMe) {
                    localStorage.setItem('supportUser', JSON.stringify({ user }));
                }

                await showDashboard();
                showToast('Welcome back, Admin!');
            } else {
                showToast('Invalid credentials. Please try again.', 'error');
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast(error.message || 'Login failed. Please try again.', 'error');
    } finally {
        setLoading(false);
    }
}

function handleLogout(e) {
    e.preventDefault();

    AppState.currentUser = null;
    AppState.token = null;
    AppState.tickets = [];
    AppState.supportUsers = [];
    localStorage.removeItem('supportUser');
    sessionStorage.removeItem('supportUser');

    // Show login page
    document.getElementById('dashboardPage').classList.remove('active');
    document.getElementById('loginPage').classList.add('active');

    // Reset form
    document.getElementById('loginForm').reset();
}

// ==========================================
// NAVIGATION
// ==========================================
async function showDashboard() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('dashboardPage').classList.add('active');

    // Update user info in UI
    updateUserInfo();

    // Load data from API
    await loadTickets();
    await loadSupportUsers();

    updateDashboardStats();
    renderRecentTickets();
    renderTicketsTable();
    renderUsersTable();
    updatePriorityChart();
    populateAssigneeDropdown();
}

function showPage(pageName) {
    // Hide all content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach((section) => section.classList.remove('active'));

    // Show selected section
    const targetSection = document.getElementById(`${pageName}Content`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    AppState.currentPage = pageName;

    // Refresh data if needed
    if (pageName === 'dashboard') {
        updateDashboardStats();
        renderRecentTickets();
        updatePriorityChart();
    } else if (pageName === 'tickets') {
        renderTicketsTable();
    } else if (pageName === 'users') {
        renderUsersTable();
    }
}

function updateActiveMenu(activeItem) {
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    menuItems.forEach((item) => item.classList.remove('active'));
    activeItem.classList.add('active');
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');

    // For mobile
    if (window.innerWidth <= 991) {
        sidebar.classList.toggle('show');
    }
}

function updateUserInfo() {
    const userNameElements = document.querySelectorAll('.user-profile span');
    const userAvatarElements = document.querySelectorAll('.user-profile img');

    if (AppState.currentUser) {
        userNameElements.forEach((el) => {
            el.textContent = AppState.currentUser.name;
        });
        userAvatarElements.forEach((el) => {
            el.src = AppState.currentUser.avatar || 
                `https://ui-avatars.com/api/?name=${encodeURIComponent(AppState.currentUser.name)}&background=6366f1&color=fff`;
        });
    }
}

// ==========================================
// DATA LOADING
// ==========================================
async function loadTickets() {
    try {
        if (CONFIG.USE_API && window.TicketService) {
            const response = await window.TicketService.getTickets();
            if (response.success) {
                AppState.tickets = response.data;
            }
        }
    } catch (error) {
        console.error('Error loading tickets:', error);
        showToast('Failed to load tickets', 'error');
    }
}

async function loadSupportUsers() {
    try {
        if (CONFIG.USE_API && window.TicketService && AppState.currentUser?.role === 'admin') {
            const response = await window.TicketService.getSupportUsers();
            if (response.success) {
                AppState.supportUsers = response.data;
            }
        }
    } catch (error) {
        console.error('Error loading support users:', error);
    }
}

// ==========================================
// DASHBOARD
// ==========================================
function updateDashboardStats() {
    const total = AppState.tickets.length;
    const open = AppState.tickets.filter((t) => t.status === 'open').length;
    const inProgress = AppState.tickets.filter((t) => t.status === 'in-progress').length;
    const resolved = AppState.tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;

    animateCounter('totalTickets', total);
    animateCounter('openTickets', open);
    animateCounter('inProgressTickets', inProgress);
    animateCounter('resolvedTickets', resolved);

    // Update badge count
    const ticketCount = document.getElementById('ticketCount');
    if (ticketCount) ticketCount.textContent = total;
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

function updatePriorityChart() {
    const high = AppState.tickets.filter((t) => t.priority === 'high' || t.priority === 'urgent').length;
    const medium = AppState.tickets.filter((t) => t.priority === 'medium').length;
    const low = AppState.tickets.filter((t) => t.priority === 'low').length;
    const total = AppState.tickets.length || 1;

    const highCount = document.getElementById('highCount');
    const mediumCount = document.getElementById('mediumCount');
    const lowCount = document.getElementById('lowCount');
    const highBar = document.getElementById('highPriorityBar');
    const mediumBar = document.getElementById('mediumPriorityBar');
    const lowBar = document.getElementById('lowPriorityBar');

    if (highCount) highCount.textContent = high;
    if (mediumCount) mediumCount.textContent = medium;
    if (lowCount) lowCount.textContent = low;
    if (highBar) highBar.style.width = `${(high / total) * 100}%`;
    if (mediumBar) mediumBar.style.width = `${(medium / total) * 100}%`;
    if (lowBar) lowBar.style.width = `${(low / total) * 100}%`;
}

function renderRecentTickets() {
    const tableBody = document.getElementById('recentTicketsTable');
    if (!tableBody) return;

    const recentTickets = [...AppState.tickets]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    if (recentTickets.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4 text-muted">No tickets yet</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = recentTickets
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
// TICKETS
// ==========================================
function renderTicketsTable(tickets = AppState.tickets) {
    const tableBody = document.getElementById('ticketsTableBody');
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
        return;
    }

    tableBody.innerHTML = tickets
        .map(
            (ticket) => `
        <tr>
            <td><input type="checkbox" class="form-check-input" value="${ticket._id || ticket.id}"></td>
            <td><strong>#${ticket.ticketId || ticket.id}</strong></td>
            <td>${truncateText(ticket.subject, 25)}</td>
            <td>
                <div class="user-avatar">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(ticket.customerName || ticket.customer)}&background=random" alt="${ticket.customerName || ticket.customer}">
                    <div class="user-info">
                        <div class="user-name">${ticket.customerName || ticket.customer}</div>
                        <div class="user-email">${ticket.customerEmail || ticket.email}</div>
                    </div>
                </div>
            </td>
            <td>${capitalize(ticket.category)}</td>
            <td><span class="priority-badge ${ticket.priority}">${capitalize(ticket.priority)}</span></td>
            <td><span class="status-badge ${ticket.status}">${formatStatus(ticket.status)}</span></td>
            <td>${formatDate(ticket.createdAt)}</td>
            <td>
                <div class="d-flex gap-1">
                    <button class="action-btn view" onclick="viewTicket('${ticket._id || ticket.id}')" title="View">
                        <i class="bi bi-eye"></i>
                    </button>
                    ${AppState.currentUser?.role === 'admin' ? `
                    <button class="action-btn edit" onclick="showAssignModal('${ticket._id || ticket.id}')" title="Assign">
                        <i class="bi bi-person-plus"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteTicket('${ticket._id || ticket.id}')" title="Delete">
                        <i class="bi bi-trash"></i>
                    </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `
        )
        .join('');
}

function filterTickets() {
    const status = document.getElementById('filterStatus')?.value;
    const priority = document.getElementById('filterPriority')?.value;
    const category = document.getElementById('filterCategory')?.value;
    const search = document.getElementById('ticketSearch')?.value?.toLowerCase();

    let filtered = [...AppState.tickets];

    if (status) {
        filtered = filtered.filter((t) => t.status === status);
    }
    if (priority) {
        filtered = filtered.filter((t) => t.priority === priority);
    }
    if (category) {
        filtered = filtered.filter((t) => t.category === category);
    }
    if (search) {
        filtered = filtered.filter(
            (t) =>
                t.subject?.toLowerCase().includes(search) ||
                (t.customerName || t.customer)?.toLowerCase().includes(search) ||
                (t.customerEmail || t.email)?.toLowerCase().includes(search) ||
                (t.ticketId || t.id)?.toString().includes(search)
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

        if (CONFIG.USE_API && window.TicketService) {
            const response = await window.TicketService.createTicket(ticketData);
            
            if (response.success) {
                AppState.tickets.unshift(response.data);
                showToast(`Ticket ${response.data.ticketId} created successfully!`);
                e.target.reset();
                showPage('tickets');
                updateActiveMenuItem('tickets');
                updateDashboardStats();
            }
        } else {
            // Mock create
            const newTicket = {
                id: AppState.ticketIdCounter++,
                ...ticketData,
                customer: ticketData.customerName,
                email: ticketData.customerEmail,
                status: 'open',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            AppState.tickets.unshift(newTicket);
            showToast(`Ticket #${newTicket.id} created successfully!`);
            e.target.reset();
            showPage('tickets');
            updateActiveMenuItem('tickets');
        }
    } catch (error) {
        console.error('Error creating ticket:', error);
        showToast(error.message || 'Failed to create ticket', 'error');
    } finally {
        setLoading(false);
    }
}

async function viewTicket(ticketId) {
    const ticket = AppState.tickets.find((t) => (t._id || t.id) === ticketId || t._id === ticketId);
    if (!ticket) return;

    AppState.selectedTicket = ticket;
    const assignedUser = ticket.assignedTo?.name || 'Unassigned';

    const modalBody = document.getElementById('ticketDetailBody');
    modalBody.innerHTML = `
        <div class="ticket-detail">
            <div class="ticket-meta">
                <div class="meta-item">
                    <div class="meta-label">Ticket ID</div>
                    <div class="meta-value">#${ticket.ticketId || ticket.id}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Status</div>
                    <div class="meta-value">
                        <span class="status-badge ${ticket.status}">${formatStatus(ticket.status)}</span>
                    </div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Priority</div>
                    <div class="meta-value">
                        <span class="priority-badge ${ticket.priority}">${capitalize(ticket.priority)}</span>
                    </div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Customer</div>
                    <div class="meta-value">${ticket.customerName || ticket.customer}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Email</div>
                    <div class="meta-value">${ticket.customerEmail || ticket.email}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Category</div>
                    <div class="meta-value">${capitalize(ticket.category)}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Assigned To</div>
                    <div class="meta-value">${assignedUser}</div>
                </div>
            </div>
            
            <div class="mb-3">
                <h6 class="text-muted">SUBJECT</h6>
                <p class="fw-bold">${ticket.subject}</p>
            </div>
            
            <div class="ticket-description">
                <h6>DESCRIPTION</h6>
                <p>${ticket.description}</p>
            </div>
            
            ${ticket.resolution ? `
            <div class="ticket-resolution mt-3">
                <h6>RESOLUTION</h6>
                <p class="text-success">${ticket.resolution}</p>
            </div>
            ` : ''}
            
            ${ticket.comments && ticket.comments.length > 0 ? `
            <div class="ticket-comments mt-3">
                <h6>COMMENTS</h6>
                ${ticket.comments.map(c => `
                    <div class="comment-item ${c.isInternal ? 'internal' : ''}">
                        <div class="comment-header">
                            <strong>${c.userName}</strong>
                            <small class="text-muted">${formatDateTime(c.createdAt)}</small>
                            ${c.isInternal ? '<span class="badge bg-warning">Internal</span>' : ''}
                        </div>
                        <p>${c.message}</p>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <div class="row mb-3 mt-3">
                <div class="col-6">
                    <small class="text-muted">Created: ${formatDateTime(ticket.createdAt)}</small>
                </div>
                <div class="col-6 text-end">
                    <small class="text-muted">Updated: ${formatDateTime(ticket.updatedAt)}</small>
                </div>
            </div>
            
            <div class="ticket-response">
                <h6>ADD RESPONSE</h6>
                <textarea placeholder="Type your response here..." id="ticketResponse" class="form-control mb-2"></textarea>
                <div class="form-check mb-2">
                    <input type="checkbox" class="form-check-input" id="internalNote">
                    <label class="form-check-label" for="internalNote">Internal note (not visible to customer)</label>
                </div>
                <button class="btn btn-outline-primary btn-sm" onclick="addTicketComment()">
                    <i class="bi bi-chat-dots me-1"></i>Add Comment
                </button>
            </div>
        </div>
    `;

    // Store current ticket ID for resolve action
    document.getElementById('resolveTicketBtn').dataset.ticketId = ticketId;

    // Update resolve button visibility
    const resolveBtn = document.getElementById('resolveTicketBtn');
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
        resolveBtn.style.display = 'none';
    } else {
        resolveBtn.style.display = 'block';
    }

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('ticketDetailModal'));
    modal.show();
}

async function addTicketComment() {
    const response = document.getElementById('ticketResponse')?.value;
    const isInternal = document.getElementById('internalNote')?.checked || false;

    if (!response || !AppState.selectedTicket) return;

    try {
        if (CONFIG.USE_API && window.TicketService) {
            const result = await window.TicketService.addComment(
                AppState.selectedTicket._id,
                response,
                isInternal
            );
            
            if (result.success) {
                showToast('Comment added successfully!');
                await loadTickets();
                viewTicket(AppState.selectedTicket._id);
            }
        }
    } catch (error) {
        console.error('Error adding comment:', error);
        showToast('Failed to add comment', 'error');
    }
}

async function handleResolveTicket() {
    const ticketId = document.getElementById('resolveTicketBtn').dataset.ticketId;
    const response = document.getElementById('ticketResponse')?.value || 'Ticket resolved';

    try {
        if (CONFIG.USE_API && window.TicketService) {
            const result = await window.TicketService.resolveTicket(ticketId, response);
            
            if (result.success) {
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('ticketDetailModal'));
                modal.hide();

                showToast(`Ticket resolved successfully!`);

                // Refresh data
                await loadTickets();
                updateDashboardStats();
                renderRecentTickets();
                updatePriorityChart();
                
                if (AppState.currentPage === 'tickets') {
                    renderTicketsTable();
                }
            }
        } else {
            // Mock resolve
            const ticketIndex = AppState.tickets.findIndex((t) => (t._id || t.id) === ticketId);
            if (ticketIndex !== -1) {
                AppState.tickets[ticketIndex].status = 'resolved';
                AppState.tickets[ticketIndex].updatedAt = new Date();

                const modal = bootstrap.Modal.getInstance(document.getElementById('ticketDetailModal'));
                modal.hide();

                showToast(`Ticket resolved!`);
                updateDashboardStats();
                renderRecentTickets();
                updatePriorityChart();
                
                if (AppState.currentPage === 'tickets') {
                    renderTicketsTable();
                }
            }
        }
    } catch (error) {
        console.error('Error resolving ticket:', error);
        showToast('Failed to resolve ticket', 'error');
    }
}

function showAssignModal(ticketId) {
    const ticket = AppState.tickets.find((t) => (t._id || t.id) === ticketId);
    if (!ticket) return;

    const assignOptions = AppState.supportUsers
        .filter(u => u.status === 'active')
        .map(u => `<option value="${u._id}">${u.name} (${u.email})</option>`)
        .join('');

    const modalHtml = `
        <div class="modal fade" id="assignModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Assign Ticket #${ticket.ticketId || ticket.id}</h5>
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
                        <button type="button" class="btn btn-primary" onclick="assignTicket('${ticketId}')">
                            <i class="bi bi-person-check me-1"></i>Assign
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('assignModal');
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('assignModal'));
    modal.show();
}

async function assignTicket(ticketId) {
    const userId = document.getElementById('assignToUser')?.value;
    if (!userId) {
        showToast('Please select an agent', 'error');
        return;
    }

    try {
        if (CONFIG.USE_API && window.TicketService) {
            const result = await window.TicketService.assignTicket(ticketId, userId);
            
            if (result.success) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('assignModal'));
                modal.hide();

                showToast(result.message || 'Ticket assigned successfully');
                await loadTickets();
                renderTicketsTable();
            }
        }
    } catch (error) {
        console.error('Error assigning ticket:', error);
        showToast('Failed to assign ticket', 'error');
    }
}

async function deleteTicket(ticketId) {
    if (!confirm(`Are you sure you want to delete this ticket?`)) return;

    try {
        if (CONFIG.USE_API && window.TicketService) {
            const result = await window.TicketService.deleteTicket(ticketId);
            
            if (result.success) {
                showToast('Ticket deleted successfully');
                await loadTickets();
                renderTicketsTable();
                updateDashboardStats();
            }
        } else {
            AppState.tickets = AppState.tickets.filter((t) => (t._id || t.id) !== ticketId);
            showToast('Ticket deleted');
            renderTicketsTable();
            updateDashboardStats();
        }
    } catch (error) {
        console.error('Error deleting ticket:', error);
        showToast('Failed to delete ticket', 'error');
    }
}

// ==========================================
// SUPPORT USERS
// ==========================================
function renderUsersTable() {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;

    // Show admin-only content
    if (AppState.currentUser?.role !== 'admin') {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-muted">
                    <i class="bi bi-lock" style="font-size: 48px;"></i>
                    <p class="mt-2">Admin access required</p>
                </td>
            </tr>
        `;
        return;
    }

    if (AppState.supportUsers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-muted">No support users found</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = AppState.supportUsers
        .map((user) => {
            return `
            <tr>
                <td>
                    <div class="user-avatar">
                        <img src="${user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}" alt="${user.name}">
                        <div class="user-info">
                            <div class="user-name">${user.name}</div>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td><span class="badge ${user.role === 'admin' ? 'bg-primary' : 'bg-secondary'}">${capitalize(user.role)}</span></td>
                <td><span class="badge ${user.status === 'active' ? 'bg-success' : 'bg-danger'}">${capitalize(user.status)}</span></td>
                <td>
                    <span class="badge bg-info">${user.assignedTickets || 0} assigned</span>
                    <span class="badge bg-success">${user.resolvedTickets || 0} resolved</span>
                </td>
                <td>
                    <div class="d-flex gap-1">
                        <button class="action-btn view" onclick="viewSupportUser('${user._id}')" title="View">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="editSupportUser('${user._id}')" title="Edit">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteSupportUser('${user._id}')" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        })
        .join('');
}

function viewSupportUser(userId) {
    const user = AppState.supportUsers.find((u) => u._id === userId);
    if (!user) return;

    const modalHtml = `
        <div class="modal fade" id="viewUserModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Support User Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-3">
                            <img src="${user.avatar}" alt="${user.name}" class="rounded-circle" style="width: 80px; height: 80px;">
                            <h5 class="mt-2">${user.name}</h5>
                            <span class="badge ${user.role === 'admin' ? 'bg-primary' : 'bg-secondary'}">${capitalize(user.role)}</span>
                        </div>
                        <table class="table table-sm">
                            <tr><td><strong>Email:</strong></td><td>${user.email}</td></tr>
                            <tr><td><strong>Status:</strong></td><td><span class="badge ${user.status === 'active' ? 'bg-success' : 'bg-danger'}">${user.status}</span></td></tr>
                            <tr><td><strong>Department:</strong></td><td>${user.department || 'N/A'}</td></tr>
                            <tr><td><strong>Assigned Tickets:</strong></td><td>${user.assignedTickets || 0}</td></tr>
                            <tr><td><strong>Resolved Tickets:</strong></td><td>${user.resolvedTickets || 0}</td></tr>
                            <tr><td><strong>Last Login:</strong></td><td>${user.lastLogin ? formatDateTime(user.lastLogin) : 'Never'}</td></tr>
                            <tr><td><strong>Created:</strong></td><td>${formatDateTime(user.createdAt)}</td></tr>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const existingModal = document.getElementById('viewUserModal');
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('viewUserModal'));
    modal.show();
}

function editSupportUser(userId) {
    const user = AppState.supportUsers.find((u) => u._id === userId);
    if (!user) return;

    const modalHtml = `
        <div class="modal fade" id="editUserModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Support User</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editUserForm">
                            <div class="mb-3">
                                <label class="form-label">Full Name</label>
                                <input type="text" class="form-control" name="name" value="${user.name}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" value="${user.email}" disabled>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Role</label>
                                <select class="form-select" name="role">
                                    <option value="agent" ${user.role === 'agent' ? 'selected' : ''}>Support Agent</option>
                                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Status</label>
                                <select class="form-select" name="status">
                                    <option value="active" ${user.status === 'active' ? 'selected' : ''}>Active</option>
                                    <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Department</label>
                                <input type="text" class="form-control" name="department" value="${user.department || ''}">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="updateSupportUser('${userId}')">
                            <i class="bi bi-check-lg me-1"></i>Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const existingModal = document.getElementById('editUserModal');
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
    modal.show();
}

async function updateSupportUser(userId) {
    const form = document.getElementById('editUserForm');
    const formData = new FormData(form);
    
    const updates = {
        name: formData.get('name'),
        role: formData.get('role'),
        status: formData.get('status'),
        department: formData.get('department'),
    };

    try {
        if (CONFIG.USE_API && window.TicketService) {
            const result = await window.TicketService.updateSupportUser(userId, updates);
            
            if (result.success) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
                modal.hide();

                showToast('User updated successfully');
                await loadSupportUsers();
                renderUsersTable();
            }
        }
    } catch (error) {
        console.error('Error updating user:', error);
        showToast('Failed to update user', 'error');
    }
}

async function deleteSupportUser(userId) {
    const user = AppState.supportUsers.find((u) => u._id === userId);
    if (!user) return;

    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

    try {
        if (CONFIG.USE_API && window.TicketService) {
            const result = await window.TicketService.deleteSupportUser(userId);
            
            if (result.success) {
                showToast('User deleted successfully');
                await loadSupportUsers();
                renderUsersTable();
            }
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showToast('Failed to delete user', 'error');
    }
}

async function handleAddUser() {
    const form = document.getElementById('addUserForm');
    const formData = new FormData(form);
    
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role'),
        department: formData.get('department') || '',
    };

    if (!userData.name || !userData.email || !userData.password) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    try {
        if (CONFIG.USE_API && window.TicketService) {
            const result = await window.TicketService.createSupportUser(userData);
            
            if (result.success) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
                modal.hide();
                form.reset();

                showToast('User created successfully');
                await loadSupportUsers();
                renderUsersTable();
            }
        }
    } catch (error) {
        console.error('Error creating user:', error);
        showToast(error.message || 'Failed to create user', 'error');
    }
}

function populateAssigneeDropdown() {
    const dropdown = document.getElementById('ticketAssignee');
    if (!dropdown || AppState.supportUsers.length === 0) return;

    const options = AppState.supportUsers
        .filter(u => u.status === 'active')
        .map(u => `<option value="${u._id}">${u.name}</option>`)
        .join('');

    dropdown.innerHTML = `<option value="">Unassigned</option>${options}`;
}

// ==========================================
// SEARCH
// ==========================================
function handleGlobalSearch(e) {
    const query = e.target.value.toLowerCase();

    if (query.length < 2) return;

    const results = AppState.tickets.filter(
        (t) =>
            t.subject?.toLowerCase().includes(query) ||
            (t.customerName || t.customer)?.toLowerCase().includes(query) ||
            (t.ticketId || t.id)?.toString().includes(query)
    );

    if (results.length > 0) {
        showPage('tickets');
        updateActiveMenuItem('tickets');
        renderTicketsTable(results);
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function formatStatus(status) {
    if (!status) return '';
    return status.split('-').map(capitalize).join(' ');
}

function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function updateActiveMenuItem(pageName) {
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    menuItems.forEach((item) => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
}

function setLoading(isLoading) {
    AppState.isLoading = isLoading;
    const buttons = document.querySelectorAll('button[type="submit"]');
    buttons.forEach((btn) => {
        if (isLoading) {
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
        } else {
            btn.disabled = false;
        }
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('successToast');
    const toastMessage = document.getElementById('toastMessage');
    const toastHeader = toast?.querySelector('.toast-header');

    if (!toast || !toastMessage || !toastHeader) return;

    toastMessage.textContent = message;

    if (type === 'error') {
        toastHeader.classList.remove('bg-success');
        toastHeader.classList.add('bg-danger');
    } else {
        toastHeader.classList.remove('bg-danger');
        toastHeader.classList.add('bg-success');
    }

    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// Make functions globally accessible
window.showPage = showPage;
window.viewTicket = viewTicket;
window.deleteTicket = deleteTicket;
window.showAssignModal = showAssignModal;
window.assignTicket = assignTicket;
window.addTicketComment = addTicketComment;
window.viewSupportUser = viewSupportUser;
window.editSupportUser = editSupportUser;
window.updateSupportUser = updateSupportUser;
window.deleteSupportUser = deleteSupportUser;
window.handleAddUser = handleAddUser;
