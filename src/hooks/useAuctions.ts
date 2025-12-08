import { useQuery } from '@tanstack/react-query';
import { auctionService } from '@/api';
import { AuctionItem, Category } from '@/types/auction';
import { dummyAuctions, dummyCategories } from '@/data/dummyData';

// Hook to fetch featured auctions
export const useFeaturedAuctions = () => {
  return useQuery<AuctionItem[]>({
    queryKey: ['auctions', 'featured'],
    queryFn: async () => {
      try {
        return await auctionService.getFeaturedAuctions();
      } catch (error) {
        console.warn('API unavailable, using dummy data:', error);
        return dummyAuctions.slice(0, 6);
      }
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Hook to fetch all auctions with filters
export const useAuctions = (filters?: {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: 'active' | 'closed' | 'sold';
  sortBy?: 'endTime' | 'currentBid' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: ['auctions', filters],
    queryFn: async () => {
      try {
        return await auctionService.getAuctions(filters);
      } catch (error) {
        console.warn('API unavailable, using dummy data:', error);
        let filtered = [...dummyAuctions];
        
        if (filters?.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(a => 
            a.title.toLowerCase().includes(search) || 
            a.description.toLowerCase().includes(search)
          );
        }
        
        if (filters?.minPrice) {
          filtered = filtered.filter(a => a.currentBid >= filters.minPrice!);
        }
        
        if (filters?.maxPrice) {
          filtered = filtered.filter(a => a.currentBid <= filters.maxPrice!);
        }
        
        if (filters?.categoryId) {
          filtered = filtered.filter(a => 
            a.categoryId === filters.categoryId || 
            a.categoryPath.some(c => c.toLowerCase().includes(filters.categoryId!.toLowerCase()))
          );
        }
        
        return {
          auctions: filtered,
          total: filtered.length,
          page: filters?.page || 1,
          pageSize: filters?.pageSize || 12,
        };
      }
    },
    staleTime: 1000 * 60 * 2,
  });
};

// Hook to fetch single auction
export const useAuction = (id: string) => {
  return useQuery<AuctionItem>({
    queryKey: ['auction', id],
    queryFn: async () => {
      try {
        return await auctionService.getAuctionById(id);
      } catch (error) {
        console.warn('API unavailable, using dummy data:', error);
        const auction = dummyAuctions.find(a => a.id === id);
        if (!auction) throw new Error('Auction not found');
        return auction;
      }
    },
    enabled: !!id,
  });
};

// Hook to fetch categories
export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        return await auctionService.getCategories();
      } catch (error) {
        console.warn('API unavailable, using dummy data:', error);
        return dummyCategories;
      }
    },
    staleTime: 1000 * 60 * 30,
  });
};
