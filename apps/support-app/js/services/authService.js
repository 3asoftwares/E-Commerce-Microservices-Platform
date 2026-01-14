/**
 * Auth Service - Handles authentication using Fetch API
 * Uses JSON data for user authentication
 */

const AuthService = {
    baseUrl: './data',

    /**
     * Fetch users from JSON
     * @returns {Promise<Array>} Array of users
     */
    async getUsers() {
        try {
            const response = await fetch(`${this.baseUrl}/users.json`);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            return data.users || [];
        } catch (error) {
            console.error('AuthService.getUsers error:', error);
            throw error;
        }
    },

    /**
     * Authenticate user with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} User object or null
     */
    async login(email, password) {
        try {
            const users = await this.getUsers();
            const user = users.find((u) => u.email === email && u.password === password);

            if (user) {
                // Remove password from returned user object
                const { password: _, ...safeUser } = user;
                return {
                    success: true,
                    user: safeUser,
                    message: 'Login successful',
                };
            }

            return {
                success: false,
                user: null,
                message: 'Invalid email or password',
            };
        } catch (error) {
            console.error('AuthService.login error:', error);
            return {
                success: false,
                user: null,
                message: 'Login failed. Please try again.',
            };
        }
    },

    /**
     * Logout user
     * @returns {Promise<boolean>} Success status
     */
    async logout() {
        localStorage.removeItem('supportUser');
        sessionStorage.removeItem('supportUser');
        return true;
    },

    /**
     * Save user session
     * @param {Object} user - User object
     * @param {boolean} remember - Remember user
     */
    saveSession(user, remember = false) {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('supportUser', JSON.stringify(user));
    },

    /**
     * Get current user from session
     * @returns {Object|null} User object or null
     */
    getCurrentUser() {
        const localUser = localStorage.getItem('supportUser');
        const sessionUser = sessionStorage.getItem('supportUser');

        if (localUser) {
            return JSON.parse(localUser);
        }
        if (sessionUser) {
            return JSON.parse(sessionUser);
        }
        return null;
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return this.getCurrentUser() !== null;
    },

    /**
     * Check if current user is admin
     * @returns {boolean}
     */
    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    },

    /**
     * Get user by ID
     * @param {number} userId - User ID
     * @returns {Promise<Object>} User object
     */
    async getUserById(userId) {
        try {
            const users = await this.getUsers();
            const user = users.find((u) => u.id === userId);
            if (user) {
                const { password: _, ...safeUser } = user;
                return safeUser;
            }
            return null;
        } catch (error) {
            console.error('AuthService.getUserById error:', error);
            throw error;
        }
    },
};

// Export for use in other modules
window.AuthService = AuthService;
