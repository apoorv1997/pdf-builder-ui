import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { adminService, userService } from '@/api';
import { dummySalesReport, dummyAuditLogs, dummyRequests } from '@/data/dummyData';
import { 
  Users, 
  DollarSign, 
  FileText, 
  Shield,
  TrendingUp,
  UserPlus,
  ClipboardList,
  BarChart3,
  ArrowRight,
  Loader2
} from 'lucide-react';

const AdminDashboard = () => {
  const user = userService.getCurrentUser();

  const { data: salesReport, isLoading: salesLoading } = useQuery({
    queryKey: ['salesReport'],
    queryFn: async () => {
      try {
        return await adminService.getSalesReport();
      } catch {
        return dummySalesReport;
      }
    },
  });

  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: async () => {
      try {
        return await adminService.getAuditLogs({ pageSize: 5 });
      } catch {
        return { logs: dummyAuditLogs, total: dummyAuditLogs.length };
      }
    },
  });

  const { data: requestsData } = useQuery({
    queryKey: ['pendingRequests'],
    queryFn: async () => {
      try {
        return await adminService.getRequests({ status: 'pending' });
      } catch {
        return { requests: dummyRequests.filter(r => r.status === 'pending'), total: 1 };
      }
    },
  });

  const stats = [
    { 
      label: 'Total Earnings', 
      value: `$${(salesReport?.totalEarnings || 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-success' 
    },
    { 
      label: 'Active Users', 
      value: '1,234', 
      icon: Users, 
      color: 'text-primary' 
    },
    { 
      label: 'Pending Requests', 
      value: requestsData?.total || 0, 
      icon: ClipboardList, 
      color: 'text-accent' 
    },
    { 
      label: 'Customer Reps', 
      value: '5', 
      icon: Shield, 
      color: 'text-secondary' 
    },
  ];

  const quickActions = [
    { label: 'View Sales Report', to: '/sales-report', icon: BarChart3 },
    { label: 'Audit Logs', to: '/audit-logs', icon: FileText },
    { label: 'Create Customer Rep', to: '/create-customer-rep', icon: UserPlus },
    { label: 'Manage Requests', to: '/manage-requests', icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="admin" userName={user?.name} />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage the BuyMe platform</p>
        </div>

        {/* Stats */}
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
          <Card className="shadow-card">
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
                    <action.icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Best Sellers */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Sellers
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/sales-report">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {salesLoading ? (
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              ) : (
                <div className="space-y-3">
                  {salesReport?.bestSellingUsers.map((seller, i) => (
                    <div key={seller.userId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="font-medium">{seller.userName}</span>
                      </div>
                      <span className="text-muted-foreground">{seller.totalSales} sales</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Logs */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/audit-logs">
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              ) : (
                <div className="space-y-3">
                  {logsData?.logs.slice(0, 4).map((log) => (
                    <div key={log.id} className="text-sm">
                      <p className="font-medium">{log.action}</p>
                      <p className="text-muted-foreground text-xs">{log.userName}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
