import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { adminService, userService } from '@/api';
import { dummyRequests } from '@/data/dummyData';
import { ClipboardList, Loader2, ArrowRight, Users, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CustomerRepDashboard = () => {
  const user = userService.getCurrentUser();

  const { data, isLoading } = useQuery({
    queryKey: ['repRequests'],
    queryFn: async () => {
      try {
        return await adminService.getRequests();
      } catch {
        return { requests: dummyRequests, total: dummyRequests.length };
      }
    },
  });

  const pending = data?.requests.filter(r => r.status === 'pending') || [];
  const inProgress = data?.requests.filter(r => r.status === 'in_progress') || [];

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="customer-rep" userName={user?.name} />
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">Customer Rep Dashboard</h1>
        
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-card">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold">{pending.length}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-accent" />
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold">{inProgress.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved Today</p>
                <p className="text-3xl font-bold">5</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Requests</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/manage-requests">View All <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            ) : (
              <div className="space-y-3">
                {data?.requests.slice(0, 5).map((req) => (
                  <Link key={req.id} to={`/request/${req.id}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                    <div>
                      <p className="font-medium">{req.userName}</p>
                      <p className="text-sm text-muted-foreground">{req.type.replace('_', ' ')}</p>
                    </div>
                    <Badge variant={req.status === 'pending' ? 'destructive' : 'secondary'}>{req.status}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerRepDashboard;
