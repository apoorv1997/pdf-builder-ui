import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { userService } from '@/api';
import { dummyAuctions, dummyBids } from '@/data/dummyData';
import { Loader2, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CurrentBids = () => {
  const user = userService.getCurrentUser();

  const { data: bids, isLoading } = useQuery({
    queryKey: ['currentBids', user?.id],
    queryFn: async () => {
      try {
        return await userService.getUserBids(user?.id || '');
      } catch {
        return dummyBids;
      }
    },
    enabled: !!user?.id,
  });

  const bidsWithAuctions = bids?.map(bid => ({
    ...bid,
    auction: dummyAuctions.find(a => a.id === bid.auctionId),
  })) || [];

  const winningBids = bidsWithAuctions.filter(b => 
    b.auction && b.amount === b.auction.currentBid
  );
  const outbidBids = bidsWithAuctions.filter(b => 
    b.auction && b.amount < b.auction.currentBid
  );

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={user?.role} userName={user?.name} />

      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-2">Current Bids</h1>
        <p className="text-muted-foreground mb-8">Track your active bids across all auctions</p>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Winning Bids */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Winning ({winningBids.length})
              </h2>
              {winningBids.length === 0 ? (
                <Card className="shadow-card">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    You're not currently winning any auctions.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {winningBids.map((bid) => (
                    <Card key={bid.id} className="shadow-card hover:shadow-card-hover transition-smooth">
                      <CardContent className="py-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={bid.auction?.imageUrl} 
                            alt={bid.auction?.title}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <Link 
                              to={`/auction/${bid.auctionId}`}
                              className="font-semibold hover:text-primary transition-smooth"
                            >
                              {bid.auction?.title}
                            </Link>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {bid.auction && formatDistanceToNow(new Date(bid.auction.endTime), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-success text-success-foreground mb-2">Winning</Badge>
                            <p className="text-2xl font-bold text-primary">${bid.amount.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Outbid */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Outbid ({outbidBids.length})
              </h2>
              {outbidBids.length === 0 ? (
                <Card className="shadow-card">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    You haven't been outbid on any auctions.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {outbidBids.map((bid) => (
                    <Card key={bid.id} className="shadow-card hover:shadow-card-hover transition-smooth border-destructive/20">
                      <CardContent className="py-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={bid.auction?.imageUrl} 
                            alt={bid.auction?.title}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <Link 
                              to={`/auction/${bid.auctionId}`}
                              className="font-semibold hover:text-primary transition-smooth"
                            >
                              {bid.auction?.title}
                            </Link>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="text-muted-foreground">Your bid: ${bid.amount.toLocaleString()}</span>
                              <span className="text-destructive">Current: ${bid.auction?.currentBid.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="destructive" className="mb-2">Outbid</Badge>
                            <Button size="sm" asChild>
                              <Link to={`/auction/${bid.auctionId}`}>Bid Again</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentBids;
