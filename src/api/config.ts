export const API_BASE_URL = 'http://localhost:8081';

export const API_ENDPOINTS = {
  // Auctions
  auctions: '/api/auctions',
  auctionById: (id: string) => `/api/auctions/${id}`,
  featuredAuctions: '/api/auctions/featured',
  
  // Categories
  categories: '/api/categories',
  
  // Bids
  bids: '/api/bids',
  bidsByAuction: (auctionId: string) => `/api/auctions/${auctionId}/bids`,
  placeBid: (auctionId: string) => `/api/auctions/${auctionId}/bids`,
  
  // Users
  users: '/api/users',
  userById: (id: string) => `/api/users/${id}`,
  login: '/api/auth/login',
  register: '/api/auth/register',
  logout: '/api/auth/logout',
  
  // Alerts
  alerts: '/api/alerts',
  userAlerts: (userId: string) => `/api/users/${userId}/alerts`,
  
  // Customer Rep
  requests: '/api/requests',
  requestById: (id: string) => `/api/requests/${id}`,
  
  // Admin
  salesReport: '/api/admin/sales-report',
  auditLogs: '/api/admin/audit-logs',
  createCustomerRep: '/api/admin/customer-reps',
  allUsers: '/api/admin/users',
  allBids: '/api/admin/bids',
  
  // User History
  userAuctions: (userId: string) => `/api/users/${userId}/auctions`,
  userBids: (userId: string) => `/api/users/${userId}/bids`,
  userOrders: (userId: string) => `/api/users/${userId}/orders`,
};
