import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { adminService, userService } from '@/api';
import { dummyRequests, dummyAuctions, dummyBids } from '@/data/dummyData';
import { RequestStatus, isOpenStatus } from '@/types/auction';
import { 
  ArrowLeft, 
  Loader2, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Key,
  Trash2,
  MessageSquare,
  Send
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

const RequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const user = userService.getCurrentUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [resolution, setResolution] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  const { data: request, isLoading } = useQuery({
    queryKey: ['request', id],
    queryFn: async () => {
      try {
        return await adminService.getRequestById(id || '');
      } catch {
        return dummyRequests.find(r => r.id === id);
      }
    },
    enabled: !!id,
  });

  const resolveMutation = useMutation({
    mutationFn: async (action: string) => {
      return await adminService.resolveRequest(id || '', action);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['request', id] });
      queryClient.invalidateQueries({ queryKey: ['allRequests'] });
      toast({ title: 'Request resolved successfully' });
      navigate('/manage-requests');
    },
    onError: () => {
      toast({ title: 'Request resolved (Demo)' });
      navigate('/manage-requests');
    },
  });

  const handleResolve = () => {
    if (!resolution.trim()) {
      toast({ title: 'Please provide a resolution', variant: 'destructive' });
      return;
    }
    setIsResolving(true);
    resolveMutation.mutate(resolution);
  };

  const handleQuickAction = (action: string) => {
    setIsResolving(true);
    resolveMutation.mutate(action);
  };

  const getStatusBadge = (status: string, resolution?: string | null) => {
    const normalized = status.toLowerCase();
    if (isOpenStatus(status, resolution)) {
      return <Badge variant="destructive"><Clock className="h-3 w-3 mr-1" />Open</Badge>;
    }
    if (normalized === 'in_progress') {
      return <Badge className="bg-accent text-accent-foreground"><AlertCircle className="h-3 w-3 mr-1" />In Progress</Badge>;
    }
    return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Resolved</Badge>;
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

  // Get related auction/bid if applicable
  const relatedAuction = request?.auctionId ? dummyAuctions.find(a => a.id === request.auctionId) : null;
  const relatedBid = request?.bidId ? dummyBids.find(b => b.id === request.bidId) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Request not found</h1>
          <Button asChild>
            <Link to="/manage-requests">Back to Requests</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8 max-w-3xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/manage-requests">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Requests
          </Link>
        </Button>

        {/* Request Info */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Request #{request.id}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Submitted {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                </p>
              </div>
              {getStatusBadge(request.status, request.resolution)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{request.userName || `User #${request.userId}`}</p>
                <p className="text-sm text-muted-foreground">User ID: {request.userId}</p>
              </div>
            </div>

            <Separator />

            {/* Request Details */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">{getTypeLabel(request.type)}</Badge>
              </div>
              {request.subject && (
                <h3 className="font-semibold text-lg mb-2">{request.subject}</h3>
              )}
              <p className="text-foreground whitespace-pre-wrap">
                {request.message || request.description || 'No message provided'}
              </p>
            </div>

            {/* Related Auction (for bid removal) */}
            {relatedAuction && (
              <>
                <Separator />
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Related Auction</Label>
                  <div className="flex items-center gap-4 p-3 rounded-lg border">
                    <img 
                      src={relatedAuction.imageUrl} 
                      alt={relatedAuction.title}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <Link 
                        to={`/auction/${relatedAuction.id}`}
                        className="font-medium hover:text-primary transition-smooth"
                      >
                        {relatedAuction.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Current bid: ${relatedAuction.currentBid.toLocaleString()}
                      </p>
                      {relatedBid && (
                        <p className="text-sm text-destructive">
                          User's bid: ${relatedBid.amount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Already Resolved */}
            {request.status === 'resolved' && request.resolution && (
              <>
                <Separator />
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <p className="font-medium text-success mb-2">Resolution</p>
                  <p className="text-muted-foreground">{request.resolution}</p>
                  {request.resolvedAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Resolved on {format(new Date(request.resolvedAt), 'PPP')}
                    </p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Actions (only for open/in_progress) */}
        {isOpenStatus(request.status, request.resolution) || request.status.toLowerCase() === 'in_progress' ? (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Take Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Actions based on type */}
              {request.type === 'password_reset' && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleQuickAction('Password has been reset. A new temporary password has been sent to the user\'s email.')}
                  disabled={isResolving}
                >
                  <Key className="mr-2 h-4 w-4" />
                  Reset Password & Notify User
                </Button>
              )}

              {request.type === 'bid_removal' && relatedBid && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => handleQuickAction(`Bid of $${relatedBid.amount.toLocaleString()} has been removed from the auction.`)}
                  disabled={isResolving}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Bid (${relatedBid.amount.toLocaleString()})
                </Button>
              )}

              <Separator />

              {/* Resolution Notes */}
              <div className="space-y-2">
                <Label htmlFor="resolution">Resolution Notes</Label>
                <Textarea
                  id="resolution"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Describe how you resolved this request..."
                  rows={4}
                />
              </div>

              <Button 
                className="w-full" 
                onClick={handleResolve}
                disabled={isResolving || !resolution.trim()}
              >
                {isResolving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Mark as Resolved
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default RequestDetails;
