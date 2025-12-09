// This file contains dummy data that would be served by the backend API at http://localhost:8081
// These are the expected response formats from the API endpoints

import { AuctionItem, Bid, Category, User, Alert, SalesReport, CustomerRequest, AuditLog } from '@/types/auction';

export const dummyCategories: Category[] = [
  {
    id: 1,
    name: 'Electronics',
    children: [
      {
        id: 2,
        name: 'Smartphones',
        parentId: 1,
        children: [
          { id: 3, name: 'iPhone', parentId: 2 },
          { id: 4, name: 'Android', parentId: 2 },
        ],
      },
      {
        id: 5,
        name: 'Laptops',
        parentId: 1,
        children: [
          { id: 6, name: 'Gaming Laptops', parentId: 5 },
          { id: 7, name: 'Business Laptops', parentId: 5 },
        ],
      },
      {
        id: 8,
        name: 'Tablets',
        parentId: 1,
        children: [
          { id: 9, name: 'iPad', parentId: 8 },
          { id: 10, name: 'Android Tablets', parentId: 8 },
        ],
      },
      {
        id: 11,
        name: 'Accessories',
        parentId: 1,
        children: [
          { id: 12, name: 'Headphones', parentId: 11 },
          { id: 13, name: 'Chargers', parentId: 11 },
        ],
      },
    ],
  },
];

export const dummyUsers: User[] = [
  { id: '1', email: 'john@example.com', name: 'John Doe', role: 'buyer' },
  { id: '2', email: 'jane@example.com', name: 'Jane Smith', role: 'seller' },
  { id: '3', email: 'rep@buyme.com', name: 'Sarah Johnson', role: 'customer-rep' },
  { id: '4', email: 'admin@buyme.com', name: 'Admin User', role: 'admin' },
];

export const dummyAuctions: AuctionItem[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro Max - 256GB - Titanium Blue',
    description: 'Brand new iPhone 15 Pro Max in pristine condition. Includes original box, charger, and accessories.',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
    categoryId: 3,
    categoryName: 'iPhone',
    sellerId: 2,
    sellerName: 'Jane Smith',
    startingPrice: 800,
    currentBid: 1050,
    bidIncrement: 25,
    minimumPrice: 900,
    startTime: new Date('2024-01-01'),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: 'active',
    specifications: { Storage: '256GB', Color: 'Titanium Blue', Condition: 'New' },
  },
  {
    id: '2',
    title: 'MacBook Pro 16" M3 Max - 1TB',
    description: 'Latest MacBook Pro with M3 Max chip. Perfect for professionals and creators.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    categoryId: 7,
    categoryName: 'Business Laptops',
    sellerId: 2,
    sellerName: 'Jane Smith',
    startingPrice: 2500,
    currentBid: 2850,
    bidIncrement: 50,
    minimumPrice: 2700,
    startTime: new Date('2024-01-05'),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'active',
    specifications: { Chip: 'M3 Max', RAM: '36GB', Storage: '1TB', Display: '16 inch' },
  },
  {
    id: '3',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise cancellation with exceptional sound quality.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    categoryId: 12,
    categoryName: 'Headphones',
    sellerId: 2,
    sellerName: 'Jane Smith',
    startingPrice: 250,
    currentBid: 320,
    bidIncrement: 10,
    minimumPrice: 280,
    startTime: new Date('2024-01-10'),
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    status: 'active',
    specifications: { Color: 'Black', 'Battery Life': '30 hours', 'Noise Cancellation': 'Yes' },
  },
  {
    id: '4',
    title: 'iPad Pro 12.9" M2 - 512GB WiFi + Cellular',
    description: 'The ultimate iPad experience with M2 chip and stunning Liquid Retina XDR display.',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
    categoryId: 9,
    categoryName: 'iPad',
    sellerId: 2,
    sellerName: 'Jane Smith',
    startingPrice: 1000,
    currentBid: 1180,
    bidIncrement: 25,
    minimumPrice: 1100,
    startTime: new Date('2024-01-08'),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'active',
    specifications: { Chip: 'M2', Storage: '512GB', Connectivity: 'WiFi + Cellular', Display: '12.9 inch' },
  },
  {
    id: '5',
    title: 'Samsung Galaxy S24 Ultra - 512GB',
    description: 'The latest Samsung flagship with advanced AI features and S Pen.',
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
    categoryId: 4,
    categoryName: 'Android',
    sellerId: 2,
    sellerName: 'Jane Smith',
    startingPrice: 900,
    currentBid: 1100,
    bidIncrement: 25,
    minimumPrice: 950,
    startTime: new Date('2024-01-12'),
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    status: 'active',
    specifications: { Storage: '512GB', RAM: '12GB', Color: 'Titanium Black' },
  },
  {
    id: '6',
    title: 'ASUS ROG Zephyrus G14 Gaming Laptop',
    description: 'Compact gaming powerhouse with AMD Ryzen 9 and RTX 4090.',
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
    categoryId: 6,
    categoryName: 'Gaming Laptops',
    sellerId: 2,
    sellerName: 'Jane Smith',
    startingPrice: 1800,
    currentBid: 2100,
    bidIncrement: 50,
    minimumPrice: 1900,
    startTime: new Date('2024-01-15'),
    endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    status: 'active',
    specifications: { CPU: 'AMD Ryzen 9', GPU: 'RTX 4090', RAM: '32GB', Display: '14 inch 165Hz' },
  },
  {
    id: '7',
    title: 'iPhone 14 Pro - 128GB - Space Black',
    description: 'Previous generation iPhone Pro in excellent condition.',
    imageUrl: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800',
    categoryId: 3,
    categoryName: 'iPhone',
    sellerId: 2,
    sellerName: 'Jane Smith',
    startingPrice: 600,
    currentBid: 750,
    bidIncrement: 20,
    minimumPrice: 650,
    startTime: new Date('2024-01-18'),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: 'active',
    specifications: { Storage: '128GB', Color: 'Space Black', Condition: 'Excellent' },
  },
];

export const dummyBids: Bid[] = [
  { id: '1', auctionId: '1', bidderId: '1', bidderName: 'John Doe', amount: 1050, isAutoBid: false, timestamp: new Date() },
  { id: '2', auctionId: '1', bidderId: '5', bidderName: 'Mike Wilson', amount: 1025, isAutoBid: true, maxAutoBid: 1100, timestamp: new Date(Date.now() - 3600000) },
  { id: '3', auctionId: '1', bidderId: '1', bidderName: 'John Doe', amount: 1000, isAutoBid: false, timestamp: new Date(Date.now() - 7200000) },
  { id: '4', auctionId: '2', bidderId: '1', bidderName: 'John Doe', amount: 2850, isAutoBid: false, timestamp: new Date(Date.now() - 1800000) },
  { id: '5', auctionId: '3', bidderId: '1', bidderName: 'John Doe', amount: 300, isAutoBid: true, maxAutoBid: 350, timestamp: new Date(Date.now() - 5400000) },
];

export const dummyAlerts: Alert[] = [
  { id: '1', userId: '1', keywords: ['iphone', 'pro'], categoryIds: [3], minPrice: 500, maxPrice: 1500, isActive: true },
  { id: '2', userId: '1', keywords: ['macbook'], categoryIds: [5], isActive: true },
];

export const dummySalesReport: SalesReport = {
  totalEarnings: 45680,
  earningsByItem: [
    { itemId: '1', itemName: 'iPhone 15 Pro Max', earnings: 12500 },
    { itemId: '2', itemName: 'MacBook Pro 16"', earnings: 15000 },
    { itemId: '3', itemName: 'Sony WH-1000XM5', earnings: 2800 },
  ],
  earningsByItemType: [
    { category: 'Smartphones', earnings: 18500 },
    { category: 'Laptops', earnings: 22000 },
    { category: 'Accessories', earnings: 5180 },
  ],
  earningsByUser: [
    { userId: '2', userName: 'Jane Smith', earnings: 28000 },
    { userId: '6', userName: 'Tech Store Inc', earnings: 17680 },
  ],
  bestSellingItems: [
    { itemId: '1', itemName: 'iPhone 15 Pro Max', soldCount: 15 },
    { itemId: '3', itemName: 'Sony Headphones', soldCount: 12 },
  ],
  bestSellingUsers: [
    { userId: '2', userName: 'Jane Smith', totalSales: 42 },
    { userId: '6', userName: 'Tech Store Inc', totalSales: 28 },
  ],
};

export const dummyRequests: CustomerRequest[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    type: 'bid_removal',
    status: 'pending',
    description: 'I accidentally placed a bid with wrong amount on iPhone 15 Pro Max auction. Please help remove it.',
    createdAt: new Date(Date.now() - 86400000),
    auctionId: '1',
    bidId: '1',
  },
  {
    id: '2',
    userId: '5',
    userName: 'Mike Wilson',
    type: 'password_reset',
    status: 'in_progress',
    description: 'Unable to reset password via email. The reset link is not being sent to my email address.',
    createdAt: new Date(Date.now() - 172800000),
    assignedRepId: '3',
  },
  {
    id: '3',
    userId: '1',
    userName: 'John Doe',
    type: 'general',
    status: 'resolved',
    description: 'How do I enable auto-bidding for an auction?',
    createdAt: new Date(Date.now() - 432000000),
    resolvedAt: new Date(Date.now() - 345600000),
    assignedRepId: '3',
    resolution: 'Explained the auto-bidding feature and how to enable it on the auction page.',
  },
];

// Helper to get requests for a specific user
export const getUserRequests = (userId: string): CustomerRequest[] => {
  return dummyRequests.filter(r => r.userId === userId);
};

export const dummyAuditLogs: AuditLog[] = [
  { id: '1', userId: '4', userName: 'Admin User', action: 'CREATE_REP', details: 'Created customer rep: Sarah Johnson', timestamp: new Date(Date.now() - 604800000) },
  { id: '2', userId: '3', userName: 'Sarah Johnson', action: 'RESOLVE_REQUEST', details: 'Resolved general inquiry request #3', timestamp: new Date(Date.now() - 345600000) },
  { id: '3', userId: '2', userName: 'Jane Smith', action: 'CREATE_AUCTION', details: 'Created auction: iPhone 15 Pro Max', timestamp: new Date(Date.now() - 432000000) },
  { id: '4', userId: '3', userName: 'Sarah Johnson', action: 'REMOVE_BID', details: 'Removed bid #123 from auction #1 per user request', timestamp: new Date(Date.now() - 259200000) },
  { id: '5', userId: '4', userName: 'Admin User', action: 'UPDATE_USER', details: 'Updated user permissions for Mike Wilson', timestamp: new Date(Date.now() - 172800000) },
];