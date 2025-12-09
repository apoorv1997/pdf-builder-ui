import { Header } from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { userService } from '@/api';
import { User, Mail, Calendar, Award, ShoppingBag, Gavel } from 'lucide-react';
import { format } from 'date-fns';

const Profile = () => {
  const user = userService.getCurrentUser();

  const stats = [
    { label: 'Auctions Won', value: '12', icon: Award },
    { label: 'Items Sold', value: '8', icon: ShoppingBag },
    { label: 'Total Bids', value: '45', icon: Gavel },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8 max-w-3xl">
        <Card className="shadow-card mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{user?.name || 'User'}</h1>
                  <Badge className="capitalize">{user?.role}</Badge>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user?.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Member since {format(new Date(), 'MMMM yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-card">
              <CardContent className="pt-6 text-center">
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Won auction for iPhone 15 Pro Max</p>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Gavel className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Placed bid on MacBook Pro 16"</p>
                  <p className="text-sm text-muted-foreground">3 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Listed Sony WH-1000XM5 for auction</p>
                  <p className="text-sm text-muted-foreground">5 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
