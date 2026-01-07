import { authClient, orderClient } from '../clients/serviceClients';

export const dashboardTypeDefs = `#graphql
  type DashboardStats {
    totalUsers: Int!
    totalOrders: Int!
    totalRevenue: Float!
    pendingOrders: Int!
  }

  type Pagination {
    page: Int!
    limit: Int!
    total: Int!
    pages: Int!
  }

  type Query {
    dashboardStats: DashboardStats!
  }

  type Mutation {
    _empty: String
  }
`;

export const dashboardResolvers = {
  Query: {
    dashboardStats: async (_: any, __: any, context: any) => {
      try {
        // Fetch all orders (with higher limit) to properly calculate stats
        const [ordersRes, authRes] = await Promise.all([
          orderClient.get('/api/orders', { params: { page: 1, limit: 1000 } }),
          authClient
            .get('/api/auth/stats', {
              headers: context.token ? { Authorization: `Bearer ${context.token}` } : {},
            })
            .catch(() => ({ data: { data: { totalUsers: 0 } } })),
        ]);

        const ordersData = ordersRes.data.data;
        const orders = ordersData.orders || [];

        const totalOrders = ordersData.pagination?.total || orders.length;
        const totalRevenue = orders.reduce(
          (sum: number, order: any) => sum + (order.total || 0),
          0
        );
        // Count pending orders (case-insensitive check)
        const pendingOrders = orders.filter(
          (order: any) => (order.orderStatus || order.status || '').toUpperCase() === 'PENDING'
        ).length;
        const totalUsers = authRes.data.data?.totalUsers || 0;

        return {
          totalUsers,
          totalOrders,
          totalRevenue,
          pendingOrders,
        };
      } catch (error) {
        return {
          totalUsers: 0,
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0,
        };
      }
    },
  },
};
