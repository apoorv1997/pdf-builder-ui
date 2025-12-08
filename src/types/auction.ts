export type UserRole = 'buyer' | 'seller' | 'customer-rep' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isAnonymous?: boolean;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  children?: Category[];
}

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  categoryPath: string[];
  sellerId: string;
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
  categoryIds: string[];
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
