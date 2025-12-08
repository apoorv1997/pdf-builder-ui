import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminService, userService } from '@/api';
import { dummySalesReport } from '@/data/dummyData';
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  Users,
  Loader2,
  BarChart3
} from 'lucide-react';

const SalesReport = () => {
  const user = userService.getCurrentUser();

  const { data: report, isLoading } = useQuery({
    queryKey: ['salesReportFull'],
    queryFn: async () => {
      try {
        return await adminService.getSalesReport();
      } catch {
        return dummySalesReport;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header userRole="admin" userName={user?.name} />
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="admin" userName={user?.name} />

      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-2">Sales Report</h1>
        <p className="text-muted-foreground mb-8">Overview of platform earnings and performance</p>

        {/* Total Earnings */}
        <Card className="shadow-card mb-8 bg-gradient-primary text-primary-foreground">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80">Total Earnings</p>
                <p className="text-5xl font-bold">${report?.totalEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="h-16 w-16 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Earnings by Item Type */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Earnings by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report?.earningsByItemType.map((item) => {
                  const percentage = (item.earnings / (report?.totalEarnings || 1)) * 100;
                  return (
                    <div key={item.category}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{item.category}</span>
                        <span className="text-muted-foreground">${item.earnings.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Earnings by User */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Earnings by Seller
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report?.earningsByUser.map((seller, i) => (
                  <div key={seller.userId} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="font-medium">{seller.userName}</span>
                    </div>
                    <span className="font-semibold text-primary">${seller.earnings.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Best Selling Items */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Best Selling Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report?.bestSellingItems.map((item, i) => (
                  <div key={item.itemId} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center font-bold text-accent">
                        {i + 1}
                      </span>
                      <span className="font-medium">{item.itemName}</span>
                    </div>
                    <span className="text-muted-foreground">{item.soldCount} sold</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Sellers */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Sellers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report?.bestSellingUsers.map((seller, i) => (
                  <div key={seller.userId} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center font-bold text-success">
                        {i + 1}
                      </span>
                      <span className="font-medium">{seller.userName}</span>
                    </div>
                    <span className="text-muted-foreground">{seller.totalSales} sales</span>
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

export default SalesReport;
