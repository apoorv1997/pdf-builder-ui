import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService, auctionService } from '@/api';
import { Bid, AuctionItem } from '@/types/auction';
import { dummyBids, dummyAuctions } from '@/data/dummyData';

export interface BidWithAuction extends Bid {
  auction?: AuctionItem;
  isWinning: boolean;
}

export interface BidsWithStatus {
  winning: BidWithAuction[];
  outbid: BidWithAuction[];
  all: BidWithAuction[];
  isLoading: boolean;
}

export const useBidsWithStatus = (userId: string | undefined): BidsWithStatus => {
  // Fetch user's bids
  const { data: userBids, isLoading: bidsLoading } = useQuery({
    queryKey: ['userBids', userId],
    queryFn: async () => {
      try {
        return await userService.getUserBids(userId!);
      } catch (error) {
        console.warn('API unavailable for bids, using dummy data:', error);
        return dummyBids.filter(b => b.bidderId === userId);
      }
    },
    enabled: !!userId,
  });

  // Fetch all auctions to get current bid info
  const { data: auctionsData, isLoading: auctionsLoading } = useQuery({
    queryKey: ['allAuctions'],
    queryFn: async () => {
      try {
        const response = await auctionService.getAuctions({ pageSize: 1000 });
        return response.auctions;
      } catch (error) {
        console.warn('API unavailable for auctions, using dummy data:', error);
        return dummyAuctions;
      }
    },
  });

  const bidsWithStatus = useMemo(() => {
    if (!userBids || !auctionsData) {
      return { winning: [], outbid: [], all: [] };
    }

    const enrichedBids: BidWithAuction[] = userBids.map((bid) => {
      // Match by auction ID (handle both string and number IDs)
      const auction = auctionsData.find((a) => String(a.id) === String(bid.auctionId));
      
      // A bid is winning if it equals or exceeds the current highest bid
      const isWinning = auction ? bid.amount >= auction.currentBid : false;
      
      return { ...bid, auction, isWinning };
    });

    // Only include bids that have matching auction data and are for active auctions
    const activeBids = enrichedBids.filter(
      (b) => b.auction && b.auction.status?.toLowerCase() === 'active'
    );

    const winning = activeBids.filter((b) => b.isWinning);
    const outbid = activeBids.filter((b) => !b.isWinning);

    return { winning, outbid, all: enrichedBids };
  }, [userBids, auctionsData]);

  return {
    ...bidsWithStatus,
    isLoading: bidsLoading || auctionsLoading,
  };
};
