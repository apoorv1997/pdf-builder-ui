import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { userService } from '@/api';
import { dummyAuctions, dummyBids } from '@/data/dummyData';
import { Loader2, ShoppingBag, Gavel, Clock } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { Link } from 'react-router-dom';

const UserHistory = () => {
  const user = userService.getCurrentUser();

  const { data: bids, isLoading: bidsLoading } = useQuery({
    queryKey: ['userBids', user?.id],
    queryFn: async () => {
      try {
        return await userService.getUserBids(user?.id || '');
      } catch {
        return dummyBids;
      }
    },
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['userOrders', user?.id],
    queryFn: async () => {
      try {
        return await userService.getUserOrders(user?.id || '');
      } catch {
        return dummyAuctions.filter(a => a.status === 'sold').slice(0, 2);
      }
    },
  });

  const isLoading = bidsLoading || ordersLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={user?.role} userName={user?.name} />

      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-2">Auction History</h1>
        <p className="text-muted-foreground mb-8">View your past bids and purchases</p>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="bids">
            <TabsList className="mb-6">
              <TabsTrigger value="bids" className="flex items-center gap-2">
                <Gavel className="h-4 w-4" />
                Bid History ({bids?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="purchases" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Purchases ({orders?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bids">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Your Bids</CardTitle>
                </CardHeader>
                <CardContent>
                  {bids?.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No bid history yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {bids?.map((bid) => {
                        const auction = dummyAuctions.find(a => a.id === bid.auctionId);
                        return (
                          <div 
                            key={bid.id} 
                            className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth"
                          >
                            <img 
                              src={auction?.imageUrl} 
                              alt={auction?.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <Link 
                                to={`/auction/${bid.auctionId}`}
                                className="font-medium hover:text-primary transition-smooth"
                              >
                                {auction?.title}
                              </Link>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(new Date(bid.timestamp), { addSuffix: true })}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-primary">${bid.amount.toLocaleString()}</p>
                              {bid.isAutoBid && (
                                <Badge variant="secondary" className="text-xs">Auto-bid</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="purchases">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Your Purchases</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders?.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No purchases yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {orders?.map((auction) => (
                        <div 
                          key={auction.id} 
                          className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                        >
                          <img 
                            src={auction.imageUrl} 
                            alt={auction.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{auction.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Purchased {format(new Date(auction.endTime), 'PPP')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">${auction.currentBid.toLocaleString()}</p>
                            <Badge className="bg-success text-success-foreground">Completed</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default UserHistory;
