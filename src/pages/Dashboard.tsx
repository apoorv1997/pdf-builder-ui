import { Link } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Gavel, 
  TrendingUp, 
  Clock, 
  Bell, 
  Settings, 
  History,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useFeaturedAuctions } from '@/hooks/useAuctions';
import { userService } from '@/api';

const Dashboard = () => {
  const user = userService.getCurrentUser();
  const { data: auctions } = useFeaturedAuctions();

  const stats = [
    { label: 'Active Bids', value: '5', icon: TrendingUp, color: 'text-primary' },
    { label: 'Watching', value: '12', icon: Bell, color: 'text-accent' },
    { label: 'Won Auctions', value: '3', icon: Gavel, color: 'text-success' },
    { label: 'Ending Soon', value: '2', icon: Clock, color: 'text-destructive' },
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

          {/* Recent Activity */}
          <Card className="shadow-card lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Recent Bids</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/current-bids">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auctions?.slice(0, 3).map((auction) => (
                  <div 
                    key={auction.id} 
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth"
                  >
                    <img 
                      src={auction.imageUrl} 
                      alt={auction.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/auction/${auction.id}`}
                        className="font-medium hover:text-primary transition-smooth line-clamp-1"
                      >
                        {auction.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Your bid: ${(auction.currentBid - 50).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        ${auction.currentBid.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Current</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
