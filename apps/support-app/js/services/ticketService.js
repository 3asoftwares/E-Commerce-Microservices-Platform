/**
 * Ticket Service - Handles all ticket operations with the backend API
 * Uses Fetch API to interact with ticket-service
 */

const TicketService = {
    baseUrl: 'http://localhost:3009/api',

    /**
     * Get auth token from storage
     * @returns {string|null} Token
     */
    getToken() {
        const user = localStorage.getItem('supportUser') || sessionStorage.getItem('supportUser');
        if (user) {
            return JSON.parse(user).token;
        }
        return null;
    },

    /**
     * Get headers with auth token
     * @returns {Object} Headers
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    },

    /**
     * Fetch all tickets
     * @param {Object} filters - Filter options
     * @returns {Promise<Object>} Tickets response
     */
    async getTickets(filters = {}) {
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const response = await fetch(`${this.baseUrl}/tickets?${params}`, {
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tickets');
            }

            return await response.json();
        } catch (error) {
            console.error('TicketService.getTickets error:', error);
            throw error;
        }
    },

    /**
     * Get a single ticket by ID
     * @param {string} ticketId - Ticket ID
     * @returns {Promise<Object>} Ticket object
     */
    async getTicketById(ticketId) {
        try {
            const response = await fetch(`${this.baseUrl}/tickets/${ticketId}`, {
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch ticket');
            }

            return await response.json();
        } catch (error) {
            console.error('TicketService.getTicketById error:', error);
            throw error;
        }
    },

    /**
     * Create a new ticket (public endpoint)
     * @param {Object} ticketData - Ticket data
     * @returns {Promise<Object>} Created ticket
     */
    async createTicket(ticketData) {
        try {
            const response = await fetch(`${this.baseUrl}/tickets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticketData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create ticket');
            }

            return await response.json();
        } catch (error) {
            console.error('TicketService.createTicket error:', error);
            throw error;
        }
    },

    /**
     * Update a ticket
     * @param {string} ticketId - Ticket ID
     * @param {Object} updates - Update data
     * @returns {Promise<Object>} Updated ticket
     */
    async updateTicket(ticketId, updates) {
        try {
            const response = await fetch(`${this.baseUrl}/tickets/${ticketId}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error('Failed to update ticket');
            }

            return await response.json();
        } catch (error) {
            console.error('TicketService.updateTicket error:', error);
            throw error;
        }
    },

    /**
     * Assign ticket to a support user
     * @param {string} ticketId - Ticket ID
     * @param {string} userId - Support user ID
     * @returns {Promise<Object>} Updated ticket
     */
    async assignTicket(ticketId, userId) {
        try {
            const response = await fetch(`${this.baseUrl}/tickets/${ticketId}/assign`, {
                method: 'PATCH',
                headers: this.getHeaders(),
                body: JSON.stringify({ assignedTo: userId }),
            });

            if (!response.ok) {
                throw new Error('Failed to assign ticket');
            }

            return await response.json();
        } catch (error) {
            console.error('TicketService.assignTicket error:', error);
            throw error;
        }
    },

    /**
     * Resolve a ticket
     * @param {string} ticketId - Ticket ID
     * @param {string} resolution - Resolution notes
     * @returns {Promise<Object>} Resolved ticket
     */
    async resolveTicket(ticketId, resolution) {
        try {
            const response = await fetch(`${this.baseUrl}/tickets/${ticketId}/resolve`, {
                method: 'PATCH',
                headers: this.getHeaders(),
                body: JSON.stringify({ resolution }),
            });

            if (!response.ok) {
                throw new Error('Failed to resolve ticket');
            }

            return await response.json();
        } catch (error) {
            console.error('TicketService.resolveTicket error:', error);
            throw error;
        }
    },

    /**
     * Add a comment to a ticket
     * @param {string} ticketId - Ticket ID
     * @param {string} message - Comment message
     * @param {boolean} isInternal - Is internal note
     * @returns {Promise<Object>} Updated ticket
     */
    async addComment(ticketId, message, isInternal = false) {
        try {
            const response = await fetch(`${this.baseUrl}/tickets/${ticketId}/comment`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ message, isInternal }),
            });

            if (!response.ok) {
                throw new Error('Failed to add comment');
            }

            return await response.json();
        } catch (error) {
            console.error('TicketService.addComment error:', error);
            throw error;
        }
    },

    /**
     * Delete a ticket
     * @param {string} ticketId - Ticket ID
     * @returns {Promise<Object>} Success response
     */
    async deleteTicket(ticketId) {
        try {
            const response = await fetch(`${this.baseUrl}/tickets/${ticketId}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error('Failed to delete ticket');
            }

            return await response.json();
        } catch (error) {
            console.error('TicketService.deleteTicket error:', error);
            throw error;
        }
    },

    /**
     * Get ticket statistics
     * @returns {Promise<Object>} Stats
     */
    async getStats() {
        try {
            const response = await fetch(`${this.baseUrl}/tickets/stats`, {
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }

            return await response.json();
        } catch (error) {
            console.error('TicketService.getStats error:', error);
            throw error;
        }
    },

    /**
     * Get all support users
     * @returns {Promise<Object>} Support users
     */
    async getSupportUsers() {
        try {
            const response = await fetch(`${this.baseUrl}/support-users`, {
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch support users');
            }

            return await response.json();
        } catch (error) {
            console.error('TicketService.getSupportUsers error:', error);
            throw error;
        }
    },

    /**
     * Login support user
     * @param {string} email - Email
     * @param {string} password - Password
     * @returns {Promise<Object>} Login response
     */
    async login(email, password) {
        try {
            const response = await fetch(`${this.baseUrl}/support-users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            return data;
        } catch (error) {
            console.error('TicketService.login error:', error);
            throw error;
        }
    },

    /**
     * Create a support user
     * @param {Object} userData - User data
     * @returns {Promise<Object>} Created user
     */
    async createSupportUser(userData) {
        try {
            const response = await fetch(`${this.baseUrl}/support-users`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create user');
            }

            return await response.json();
        } catch (error) {
            console.error('TicketService.createSupportUser error:', error);
            throw error;
        }
    },

    /**
     * Update a support user
     * @param {string} userId - User ID
     * @param {Object} updates - Update data
     * @returns {Promise<Object>} Updated user
     */
    async updateSupportUser(userId, updates) {
        try {
            const response = await fetch(`${this.baseUrl}/support-users/${userId}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            return await response.json();
        } catch (error) {
            console.error('TicketService.updateSupportUser error:', error);
            throw error;
        }
    },

    /**
     * Delete a support user
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Success response
     */
    async deleteSupportUser(userId) {
        try {
            const response = await fetch(`${this.baseUrl}/support-users/${userId}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            return await response.json();
        } catch (error) {
            console.error('TicketService.deleteSupportUser error:', error);
            throw error;
        }
    },
};

// Export for use in app.js
window.TicketService = TicketService;
