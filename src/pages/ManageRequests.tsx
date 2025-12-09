import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { adminService, userService } from '@/api';
import { dummyRequests } from '@/data/dummyData';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ManageRequests = () => {
  const user = userService.getCurrentUser();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['allRequests'],
    queryFn: async () => {
      try { return await adminService.getRequests(); } 
      catch { return { requests: dummyRequests, total: dummyRequests.length }; }
    },
  });

  const pending = data?.requests.filter(r => r.status === 'pending') || [];
  const inProgress = data?.requests.filter(r => r.status === 'in_progress') || [];
  const resolved = data?.requests.filter(r => r.status === 'resolved') || [];

  const RequestList = ({ requests, emptyMessage }: { requests: typeof dummyRequests; emptyMessage: string }) => (
    requests.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Inbox className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">{emptyMessage}</p>
      </div>
    ) : (
      <div className="space-y-3">
        {requests.map((req) => (
          <Link key={req.id} to={`/request/${req.id}`} className="block p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
            <div className="flex justify-between mb-2">
              <span className="font-medium">{req.userName}</span>
              <Badge>{req.type.replace('_', ' ')}</Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">{req.description}</p>
            <p className="text-xs text-muted-foreground mt-2">{formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}</p>
          </Link>
        ))}
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">Manage Requests</h1>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Requests</AlertTitle>
            <AlertDescription>Failed to load customer requests. Please try again later.</AlertDescription>
          </Alert>
        ) : (
          <Tabs defaultValue="pending">
            <TabsList className="mb-6">
              <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress ({inProgress.length})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({resolved.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="pending"><Card className="shadow-card"><CardContent className="pt-6"><RequestList requests={pending} emptyMessage="No pending requests" /></CardContent></Card></TabsContent>
            <TabsContent value="in_progress"><Card className="shadow-card"><CardContent className="pt-6"><RequestList requests={inProgress} emptyMessage="No requests in progress" /></CardContent></Card></TabsContent>
            <TabsContent value="resolved"><Card className="shadow-card"><CardContent className="pt-6"><RequestList requests={resolved} emptyMessage="No resolved requests" /></CardContent></Card></TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ManageRequests;
