import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { AuctionItem, Bid, Category } from '@/types/auction';

export interface AuctionsResponse {
  auctions: AuctionItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AuctionFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: 'active' | 'closed' | 'sold';
  sortBy?: 'endTime' | 'currentBid' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export const auctionService = {
  async getAuctions(filters?: AuctionFilters): Promise<AuctionsResponse> {
    return apiClient.get<AuctionsResponse>(API_ENDPOINTS.auctions, filters as Record<string, string | number | boolean | undefined>);
  },

  async getFeaturedAuctions(): Promise<AuctionItem[]> {
    return apiClient.get<AuctionItem[]>(API_ENDPOINTS.featuredAuctions);
  },

  async searchAuctions(query: string, filters?: Omit<AuctionFilters, 'search'>): Promise<AuctionsResponse> {
    return apiClient.get<AuctionsResponse>(API_ENDPOINTS.searchAuctions, { 
      q: query, 
      ...filters as Record<string, string | number | boolean | undefined> 
    });
  },

  async getAuctionById(id: string): Promise<AuctionItem> {
    return apiClient.get<AuctionItem>(API_ENDPOINTS.auctionById(id));
  },

  async createAuction(auction: Omit<AuctionItem, 'id' | 'currentBid' | 'status'>): Promise<AuctionItem> {
    return apiClient.post<AuctionItem>(API_ENDPOINTS.auctions, auction);
  },

  async updateAuction(id: string, auction: Partial<AuctionItem>): Promise<AuctionItem> {
    return apiClient.put<AuctionItem>(API_ENDPOINTS.auctionById(id), auction);
  },

  async deleteAuction(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.auctionById(id));
  },

  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>(API_ENDPOINTS.categories);
  },

  async getBidsByAuction(auctionId: string): Promise<Bid[]> {
    return apiClient.get<Bid[]>(API_ENDPOINTS.bidsByAuction(auctionId));
  },

  async placeBid(auctionId: string, bid: { amount: number; isAutoBid: boolean; maxAutoBid?: number }): Promise<Bid> {
    return apiClient.post<Bid>(API_ENDPOINTS.placeBid(auctionId), bid);
  },
};
