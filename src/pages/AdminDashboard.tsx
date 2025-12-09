import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { adminService, userService } from '@/api';
import { 
  dummySalesReport, 
  dummyAuditLogs, 
  dummyRequests, 
  dummyUsers, 
  dummyBids, 
  dummyAuctions 
} from '@/data/dummyData';
import { User, Bid, AuctionItem } from '@/types/auction';
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
  Loader2,
  Gavel,
  History,
  Store
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

const AdminDashboard = () => {
  const user = userService.getCurrentUser();
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);

  // Fetch all users
  const { data: allUsers = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      try {
        return await adminService.getAllUsers();
      } catch {
        return dummyUsers;
      }
    },
  });

  // Fetch all bids
  const { data: allBids = [], isLoading: bidsLoading } = useQuery<Bid[]>({
    queryKey: ['admin', 'bids'],
    queryFn: async () => {
      try {
        return await adminService.getAllBids();
      } catch {
        return dummyBids;
      }
    },
  });

  // Fetch sales report
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

  // Fetch audit logs
  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: async () => {
      try {
        return await adminService.getAuditLogs({ pageSize: 10 });
      } catch {
        return { logs: dummyAuditLogs, total: dummyAuditLogs.length };
      }
    },
  });

  // Fetch pending requests count
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

  // Filter users by role
  const buyers = allUsers.filter(u => u.role === 'buyer');
  const sellers = allUsers.filter(u => u.role === 'seller');

  // Get seller auctions (from dummy data for now)
  const getSellerAuctions = (sellerId: string): AuctionItem[] => {
    return dummyAuctions.filter(a => a.sellerId.toString() === sellerId);
  };

  const stats = [
    { 
      label: 'Total Earnings', 
      value: `$${(salesReport?.totalEarnings || 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-success' 
    },
    { 
      label: 'Total Buyers', 
      value: buyers.length, 
      icon: Users, 
      color: 'text-primary' 
    },
    { 
      label: 'Total Sellers', 
      value: sellers.length, 
      icon: Store, 
      color: 'text-secondary' 
    },
    { 
      label: 'Pending Requests', 
      value: requestsData?.total || 0, 
      icon: ClipboardList, 
      color: 'text-accent' 
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
      <Header />

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

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Sales Report
            </TabsTrigger>
            <TabsTrigger value="bids" className="flex items-center gap-2">
              <Gavel className="h-4 w-4" />
              Bid History
            </TabsTrigger>
            <TabsTrigger value="sellers" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Seller History
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Buyers */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Buyers ({buyers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : buyers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No buyers found</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {buyers.map((buyer) => (
                          <TableRow key={buyer.id}>
                            <TableCell className="font-medium">{buyer.name}</TableCell>
                            <TableCell>{buyer.email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Sellers */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-secondary" />
                    Sellers ({sellers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : sellers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No sellers found</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sellers.map((seller) => (
                          <TableRow key={seller.id}>
                            <TableCell className="font-medium">{seller.name}</TableCell>
                            <TableCell>{seller.email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sales Report Tab */}
          <TabsContent value="sales">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Earnings by Category */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    Earnings by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {salesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {salesReport?.earningsByItemType.map((item) => (
                        <div key={item.category} className="flex items-center justify-between">
                          <span className="font-medium">{item.category}</span>
                          <span className="text-success font-semibold">
                            ${item.earnings.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Earnings by User */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Earnings by Seller
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {salesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {salesReport?.earningsByUser.map((user) => (
                        <div key={user.userId} className="flex items-center justify-between">
                          <span className="font-medium">{user.userName}</span>
                          <span className="text-primary font-semibold">
                            ${user.earnings.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Best Selling Items */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gavel className="h-5 w-5 text-accent" />
                    Best Selling Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {salesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {salesReport?.bestSellingItems.map((item, i) => (
                        <div key={item.itemId} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                              {i + 1}
                            </span>
                            <span className="font-medium">{item.itemName}</span>
                          </div>
                          <Badge variant="secondary">{item.soldCount} sold</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Best Selling Users */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-secondary" />
                    Top Sellers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {salesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {salesReport?.bestSellingUsers.map((seller, i) => (
                        <div key={seller.userId} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-xs font-bold text-secondary">
                              {i + 1}
                            </span>
                            <span className="font-medium">{seller.userName}</span>
                          </div>
                          <Badge variant="outline">{seller.totalSales} sales</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bid History Tab */}
          <TabsContent value="bids">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-primary" />
                  All Bid History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bidsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : allBids.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No bids found</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bidder</TableHead>
                        <TableHead>Auction ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allBids.map((bid) => (
                        <TableRow key={bid.id}>
                          <TableCell className="font-medium">{bid.bidderName}</TableCell>
                          <TableCell>
                            <Link 
                              to={`/auction/${bid.auctionId}`}
                              className="text-primary hover:underline"
                            >
                              #{bid.auctionId}
                            </Link>
                          </TableCell>
                          <TableCell className="text-success font-semibold">
                            ${bid.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {bid.isAutoBid ? (
                              <Badge variant="secondary">Auto-bid</Badge>
                            ) : (
                              <Badge variant="outline">Manual</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDistanceToNow(new Date(bid.timestamp), { addSuffix: true })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seller History Tab */}
          <TabsContent value="sellers">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Seller List */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-secondary" />
                    Select Seller
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : sellers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No sellers found</p>
                  ) : (
                    <div className="space-y-2">
                      {sellers.map((seller) => (
                        <Button
                          key={seller.id}
                          variant={selectedSeller === seller.id ? 'default' : 'ghost'}
                          className="w-full justify-start"
                          onClick={() => setSelectedSeller(seller.id)}
                        >
                          <Store className="mr-2 h-4 w-4" />
                          {seller.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Seller Auctions */}
              <Card className="shadow-card lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    {selectedSeller 
                      ? `Auctions by ${sellers.find(s => s.id === selectedSeller)?.name}`
                      : 'Seller Auction History'
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedSeller ? (
                    <p className="text-muted-foreground text-center py-8">
                      Select a seller to view their auction history
                    </p>
                  ) : (
                    (() => {
                      const sellerAuctions = getSellerAuctions(selectedSeller);
                      return sellerAuctions.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          No auctions found for this seller
                        </p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Current Bid</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>End Time</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sellerAuctions.map((auction) => (
                              <TableRow key={auction.id}>
                                <TableCell>
                                  <Link 
                                    to={`/auction/${auction.id}`}
                                    className="font-medium text-primary hover:underline"
                                  >
                                    {auction.title}
                                  </Link>
                                </TableCell>
                                <TableCell>{auction.categoryName}</TableCell>
                                <TableCell className="text-success font-semibold">
                                  ${auction.currentBid.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={auction.status === 'active' ? 'default' : 'secondary'}
                                    className={auction.status === 'active' ? 'bg-success' : ''}
                                  >
                                    {auction.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {format(new Date(auction.endTime), 'PPp')}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      );
                    })()
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="shadow-card mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.to}
                  variant="outline"
                  asChild
                >
                  <Link to={action.to}>
                    <action.icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;