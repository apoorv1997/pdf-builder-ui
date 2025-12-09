import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { userService } from '@/api';
import { dummyAuctions } from '@/data/dummyData';
import { Loader2, Package, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const OrderHistory = () => {
  const user = userService.getCurrentUser();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orderHistory', user?.id],
    queryFn: async () => {
      try {
        return await userService.getUserOrders(user?.id || '');
      } catch {
        return dummyAuctions.filter(a => a.status === 'sold').slice(0, 3);
      }
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-2">Order History</h1>
        <p className="text-muted-foreground mb-8">View your completed purchases and their status</p>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orders?.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">You haven't made any purchases yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders?.map((order, index) => (
              <Card 
                key={order.id} 
                className="shadow-card hover:shadow-card-hover transition-smooth animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="py-6">
                  <div className="flex items-start gap-6">
                    <img 
                      src={order.imageUrl} 
                      alt={order.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{order.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Order #{order.id.toUpperCase()} • {format(new Date(order.endTime), 'PPP')}
                          </p>
                        </div>
                        <Badge className="bg-success text-success-foreground">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Delivered
                        </Badge>
                      </div>
                      
                      <div className="mt-4 flex items-center gap-8">
                        <div>
                          <p className="text-sm text-muted-foreground">Seller</p>
                          <p className="font-medium">{order.sellerName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Final Price</p>
                          <p className="font-semibold text-primary text-lg">${order.currentBid.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
