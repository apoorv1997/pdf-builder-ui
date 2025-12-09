export type UserRole = 'buyer' | 'seller' | 'customer-rep' | 'customer_rep' | 'admin';

// Helper to check if role is customer rep (case-insensitive, supports both formats)
export const isCustomerRepRole = (role?: string): boolean => {
  if (!role) return false;
  const normalized = role.toLowerCase().replace('-', '_');
  return normalized === 'customer_rep';
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isAnonymous?: boolean;
}

export interface Category {
  id: number;
  name: string;
  parentId?: number;
  children?: Category[];
}

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  categoryPath: string[];
  sellerId: number;
  sellerName: string;
  startingPrice: number;
  currentBid: number;
  bidIncrement: number;
  minimumPrice: number; // secret reserve price
  startTime: Date;
  endTime: Date;
  status: 'active' | 'closed' | 'sold';
  specifications?: Record<string, string>;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  isAutoBid: boolean;
  maxAutoBid?: number; // secret max for auto-bidding
  timestamp: Date;
}

export interface Alert {
  id: string;
  userId: string;
  keywords: string[];
  categoryIds: number[];
  minPrice?: number;
  maxPrice?: number;
  specifications?: Record<string, string>;
  isActive: boolean;
}

export interface SalesReport {
  totalEarnings: number;
  earningsByItem: { itemId: string; itemName: string; earnings: number }[];
  earningsByItemType: { category: string; earnings: number }[];
  earningsByUser: { userId: string; userName: string; earnings: number }[];
  bestSellingItems: { itemId: string; itemName: string; soldCount: number }[];
  bestSellingUsers: { userId: string; userName: string; totalSales: number }[];
}

export type RequestType = 'password_reset' | 'bid_removal' | 'account_issue' | 'general';
export type RequestStatus = 'pending' | 'in_progress' | 'resolved';

export interface CustomerRequest {
  id: string;
  userId: string;
  userName: string;
  type: RequestType;
  status: RequestStatus;
  description: string;
  createdAt: Date;
  resolvedAt?: Date;
  assignedRepId?: string;
  // For bid removal requests
  auctionId?: string;
  bidId?: string;
  // Resolution details
  resolution?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: Date;
}
