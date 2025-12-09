import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { AuctionCard } from '@/components/Auction/AuctionCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { userService } from '@/api';
import { dummyAuctions } from '@/data/dummyData';
import { Plus, Loader2 } from 'lucide-react';

const MyAuctions = () => {
  const user = userService.getCurrentUser();

  const { data: auctions, isLoading } = useQuery({
    queryKey: ['myAuctions', user?.id],
    queryFn: async () => {
      try {
        return await userService.getUserAuctions(user?.id || '');
      } catch {
        return dummyAuctions.filter(a => a.sellerId === '2');
      }
    },
    enabled: !!user?.id,
  });

  const activeAuctions = auctions?.filter(a => a.status === 'active') || [];
  const closedAuctions = auctions?.filter(a => a.status !== 'active') || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Auctions</h1>
            <p className="text-muted-foreground">Manage your auction listings</p>
          </div>
          <Button asChild>
            <Link to="/create-auction">
              <Plus className="mr-2 h-4 w-4" />
              Create Auction
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="active">
            <TabsList className="mb-6">
              <TabsTrigger value="active">Active ({activeAuctions.length})</TabsTrigger>
              <TabsTrigger value="closed">Closed ({closedAuctions.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              {activeAuctions.length === 0 ? (
                <Card className="shadow-card">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">You don't have any active auctions.</p>
                    <Button asChild>
                      <Link to="/create-auction">Create Your First Auction</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeAuctions.map((auction, index) => (
                    <div key={auction.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <AuctionCard auction={auction} />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="closed">
              {closedAuctions.length === 0 ? (
                <Card className="shadow-card">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No closed auctions yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {closedAuctions.map((auction, index) => (
                    <div key={auction.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <AuctionCard auction={auction} />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default MyAuctions;
