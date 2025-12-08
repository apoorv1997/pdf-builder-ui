import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { userService } from '@/api';
import { getUserRequests } from '@/data/dummyData';
import { RequestStatus } from '@/types/auction';
import { FileText, Plus, Loader2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

const MyRequests = () => {
  const user = userService.getCurrentUser();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['myRequests', user?.id],
    queryFn: async () => {
      try {
        return await userService.getUserRequests(user?.id || '');
      } catch {
        return getUserRequests(user?.id || '1');
      }
    },
    enabled: !!user?.id,
  });

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="destructive" className="flex items-center gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case 'in_progress':
        return <Badge className="bg-accent text-accent-foreground flex items-center gap-1"><AlertCircle className="h-3 w-3" />In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-success text-success-foreground flex items-center gap-1"><CheckCircle className="h-3 w-3" />Resolved</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      password_reset: 'Password Reset',
      bid_removal: 'Bid Removal',
      account_issue: 'Account Issue',
      general: 'General Question',
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={user?.role} userName={user?.name} />

      <div className="container py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Requests</h1>
            <p className="text-muted-foreground">Track your support requests</p>
          </div>
          <Button asChild>
            <Link to="/help">
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !requests || requests.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">You haven't submitted any requests yet.</p>
              <Button asChild>
                <Link to="/help">Submit Your First Request</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request, index) => (
              <Card 
                key={request.id} 
                className="shadow-card hover:shadow-card-hover transition-smooth animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="py-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{getTypeLabel(request.type)}</Badge>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Request #{request.id} • Submitted {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <p className="text-foreground mb-4 line-clamp-2">{request.description}</p>

                  {request.status === 'resolved' && request.resolution && (
                    <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                      <p className="text-sm font-medium text-success mb-1">Resolution</p>
                      <p className="text-sm text-muted-foreground">{request.resolution}</p>
                      {request.resolvedAt && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Resolved on {format(new Date(request.resolvedAt), 'PPP')}
                        </p>
                      )}
                    </div>
                  )}

                  {request.status === 'in_progress' && (
                    <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                      <p className="text-sm text-muted-foreground">
                        A customer representative is currently working on your request.
                      </p>
                    </div>
                  )}

                  {request.status === 'pending' && (
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-sm text-muted-foreground">
                        Your request is in the queue. We typically respond within 24 hours.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
