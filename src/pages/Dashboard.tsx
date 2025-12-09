import { Link } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Gavel, 
  TrendingUp, 
  Clock, 
  Bell, 
  Settings, 
  History,
  Plus,
  ArrowRight,
  Trophy,
  AlertTriangle
} from 'lucide-react';
import { useAuctions } from '@/hooks/useAuctions';
import { userService, auctionService } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { Bid, AuctionItem } from '@/types/auction';
import { useMemo } from 'react';

interface BidWithAuction extends Bid {
  auction?: AuctionItem;
  isWinning: boolean;
}

const Dashboard = () => {
  const user = userService.getCurrentUser();

  const { data: userBids } = useQuery({
    queryKey: ['userBids', user?.id],
    queryFn: () => userService.getUserBids(user!.id),
    enabled: !!user?.id,
  });

  const { data: auctionsData } = useAuctions();

  // Combine bids with auction data and determine winning status
  const bidsWithStatus = useMemo(() => {
    if (!userBids || !auctionsData?.auctions) return { winning: [], outbid: [] };

    const enrichedBids: BidWithAuction[] = userBids.map((bid) => {
      const auction = auctionsData.auctions.find((a) => String(a.id) === String(bid.auctionId));
      const isWinning = auction ? bid.amount >= auction.currentBid : false;
      return { ...bid, auction, isWinning };
    });

    const winning = enrichedBids.filter((b) => b.isWinning && b.auction);
    const outbid = enrichedBids.filter((b) => !b.isWinning && b.auction);

    return { winning, outbid };
  }, [userBids, auctionsData]);

  const activeBidsCount = userBids?.length ?? 0;

  const stats = [
    { label: 'Active Bids', value: String(activeBidsCount), icon: TrendingUp, color: 'text-primary' },
    { label: 'Watching', value: '0', icon: Bell, color: 'text-accent' },
    { label: 'Won Auctions', value: '0', icon: Gavel, color: 'text-success' },
    { label: 'Ending Soon', value: '0', icon: Clock, color: 'text-destructive' },
  ];

  const quickActions = [
    { label: 'Browse Auctions', to: '/browse', icon: ArrowRight },
    { label: 'View History', to: '/history', icon: History },
    { label: 'My Alerts', to: '/preferences', icon: Bell },
    { label: 'Settings', to: '/settings', icon: Settings },
  ];

  if (user?.role === 'seller') {
    quickActions.unshift({ label: 'Create Auction', to: '/create-auction', icon: Plus });
  }

  const renderBidItem = (bid: BidWithAuction) => {
    if (!bid.auction) return null;
    
    return (
      <div 
        key={bid.id} 
        className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth"
      >
        <img 
          src={bid.auction.imageUrl} 
          alt={bid.auction.title}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <Link 
            to={`/auction/${bid.auction.id}`}
            className="font-medium hover:text-primary transition-smooth line-clamp-1"
          >
            {bid.auction.title}
          </Link>
          <p className="text-sm text-muted-foreground">
            Your bid: ${bid.amount.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-primary">
            ${bid.auction.currentBid.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Current</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your auctions today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="shadow-card hover:shadow-card-hover transition-smooth animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card className="shadow-card lg:col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => (
                <Button
                  key={action.to}
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to={action.to}>
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Current Bids - Winning & Outbid */}
          <Card className="shadow-card lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Current Bids</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/current-bids">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Winning Bids */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="h-4 w-4 text-success" />
                  <h3 className="font-semibold text-success">Winning Bids</h3>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    {bidsWithStatus.winning.length}
                  </Badge>
                </div>
                {bidsWithStatus.winning.length > 0 ? (
                  <div className="space-y-3">
                    {bidsWithStatus.winning.slice(0, 2).map(renderBidItem)}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-2">No winning bids yet</p>
                )}
              </div>

              {/* Outbid */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <h3 className="font-semibold text-destructive">Outbid</h3>
                  <Badge variant="secondary" className="bg-destructive/10 text-destructive">
                    {bidsWithStatus.outbid.length}
                  </Badge>
                </div>
                {bidsWithStatus.outbid.length > 0 ? (
                  <div className="space-y-3">
                    {bidsWithStatus.outbid.slice(0, 2).map(renderBidItem)}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-2">No outbid items</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
