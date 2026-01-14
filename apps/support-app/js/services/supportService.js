/**
 * Support Service - Handles all support ticket operations
 * Uses Fetch API to interact with JSON data
 */

const SupportService = {
    baseUrl: './data',

    /**
     * Fetch all tickets from JSON
     * @returns {Promise<Array>} Array of tickets
     */
    async getTickets() {
        try {
            const response = await fetch(`${this.baseUrl}/tickets.json`);
            if (!response.ok) {
                throw new Error('Failed to fetch tickets');
            }
            const data = await response.json();
            return data.tickets || [];
        } catch (error) {
            console.error('SupportService.getTickets error:', error);
            throw error;
        }
    },

    /**
     * Get a single ticket by ID
     * @param {number} ticketId - Ticket ID
     * @returns {Promise<Object>} Ticket object
     */
    async getTicketById(ticketId) {
        try {
            const tickets = await this.getTickets();
            return tickets.find((t) => t.id === ticketId);
        } catch (error) {
            console.error('SupportService.getTicketById error:', error);
            throw error;
        }
    },

    /**
     * Create a new ticket (simulated - adds to local state)
     * @param {Object} ticketData - Ticket data
     * @returns {Promise<Object>} Created ticket
     */
    async createTicket(ticketData) {
        // Simulate API call delay
        await this.simulateDelay(500);

        const newTicket = {
            ...ticketData,
            id: Date.now(),
            status: 'open',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        return newTicket;
    },

    /**
     * Update ticket status
     * @param {number} ticketId - Ticket ID
     * @param {string} status - New status
     * @returns {Promise<Object>} Updated ticket
     */
    async updateTicketStatus(ticketId, status) {
        await this.simulateDelay(300);

        return {
            id: ticketId,
            status: status,
            updatedAt: new Date().toISOString(),
        };
    },

    /**
     * Resolve a ticket
     * @param {number} ticketId - Ticket ID
     * @param {string} resolution - Resolution notes
     * @returns {Promise<Object>} Resolved ticket
     */
    async resolveTicket(ticketId, resolution) {
        await this.simulateDelay(300);

        return {
            id: ticketId,
            status: 'resolved',
            resolution: resolution,
            resolvedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    },

    /**
     * Delete a ticket
     * @param {number} ticketId - Ticket ID
     * @returns {Promise<boolean>} Success status
     */
    async deleteTicket(ticketId) {
        await this.simulateDelay(300);
        return true;
    },

    /**
     * Search tickets
     * @param {string} query - Search query
     * @param {Array} tickets - Tickets to search
     * @returns {Array} Filtered tickets
     */
    searchTickets(query, tickets) {
        const lowerQuery = query.toLowerCase();
        return tickets.filter(
            (t) =>
                t.subject.toLowerCase().includes(lowerQuery) ||
                t.customer.toLowerCase().includes(lowerQuery) ||
                t.email.toLowerCase().includes(lowerQuery) ||
                t.id.toString().includes(lowerQuery) ||
                t.description.toLowerCase().includes(lowerQuery)
        );
    },

    /**
     * Filter tickets by criteria
     * @param {Array} tickets - Tickets to filter
     * @param {Object} filters - Filter criteria
     * @returns {Array} Filtered tickets
     */
    filterTickets(tickets, filters) {
        let filtered = [...tickets];

        if (filters.status) {
            filtered = filtered.filter((t) => t.status === filters.status);
        }
        if (filters.priority) {
            filtered = filtered.filter((t) => t.priority === filters.priority);
        }
        if (filters.category) {
            filtered = filtered.filter((t) => t.category === filters.category);
        }
        if (filters.assignee) {
            filtered = filtered.filter((t) => t.assignee === filters.assignee);
        }

        return filtered;
    },

    /**
     * Get ticket statistics
     * @param {Array} tickets - Tickets array
     * @returns {Object} Statistics object
     */
    getTicketStats(tickets) {
        return {
            total: tickets.length,
            open: tickets.filter((t) => t.status === 'open').length,
            inProgress: tickets.filter((t) => t.status === 'in-progress').length,
            resolved: tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length,
            high: tickets.filter((t) => t.priority === 'high').length,
            medium: tickets.filter((t) => t.priority === 'medium').length,
            low: tickets.filter((t) => t.priority === 'low').length,
        };
    },

    /**
     * Simulate network delay
     * @param {number} ms - Milliseconds to delay
     */
    simulateDelay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
};

// Export for use in other modules
window.SupportService = SupportService;
