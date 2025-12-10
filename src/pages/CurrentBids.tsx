import { Link } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { userService } from '@/api';
import { useBidsWithStatus, BidWithAuction } from '@/hooks/useBidsWithStatus';
import { Loader2, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CurrentBids = () => {
  const user = userService.getCurrentUser();
  const { winning, outbid, isLoading } = useBidsWithStatus(user?.id);

  const renderBidCard = (bid: BidWithAuction, isWinning: boolean) => {
    if (!bid.auction) return null;

    return (
      <Card 
        key={bid.id} 
        className={`shadow-card hover:shadow-card-hover transition-smooth ${!isWinning ? 'border-destructive/20' : ''}`}
      >
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <img 
              src={bid.auction.imageUrl} 
              alt={bid.auction.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <Link 
                to={`/auction/${bid.auction.id}`}
                className="font-semibold hover:text-primary transition-smooth"
              >
                {bid.auction.title}
              </Link>
              <div className="flex items-center gap-4 mt-2 text-sm">
                {isWinning ? (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {formatDistanceToNow(new Date(bid.auction.endTime), { addSuffix: true })}
                  </span>
                ) : (
                  <>
                    <span className="text-muted-foreground">Your bid: ${bid.amount.toLocaleString()}</span>
                    <span className="text-destructive">Current: ${bid.auction.currentBid.toLocaleString()}</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              {isWinning ? (
                <>
                  <Badge className="bg-success text-success-foreground mb-2">Winning</Badge>
                  <p className="text-2xl font-bold text-primary">${bid.amount.toLocaleString()}</p>
                </>
              ) : (
                <>
                  <Badge variant="destructive" className="mb-2">Outbid</Badge>
                  <Button size="sm" asChild>
                    <Link to={`/auction/${bid.auction.id}`}>Bid Again</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

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
                Winning ({winning.length})
              </h2>
              {winning.length === 0 ? (
                <Card className="shadow-card">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    You're not currently winning any auctions.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {winning.map((bid) => renderBidCard(bid, true))}
                </div>
              )}
            </div>

            {/* Outbid */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Outbid ({outbid.length})
              </h2>
              {outbid.length === 0 ? (
                <Card className="shadow-card">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    You haven't been outbid on any auctions.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {outbid.map((bid) => renderBidCard(bid, false))}
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
