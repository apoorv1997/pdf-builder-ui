import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { adminService, userService } from '@/api';
import { dummyRequests } from '@/data/dummyData';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ManageRequests = () => {
  const user = userService.getCurrentUser();
  const { data, isLoading } = useQuery({
    queryKey: ['allRequests'],
    queryFn: async () => {
      try { return await adminService.getRequests(); } 
      catch { return { requests: dummyRequests, total: dummyRequests.length }; }
    },
  });

  const pending = data?.requests.filter(r => r.status === 'pending') || [];
  const inProgress = data?.requests.filter(r => r.status === 'in_progress') || [];
  const resolved = data?.requests.filter(r => r.status === 'resolved') || [];

  const RequestList = ({ requests }: { requests: typeof dummyRequests }) => (
    requests.length === 0 ? (
      <p className="text-muted-foreground text-center py-8">No requests.</p>
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
      <Header userRole={user?.role} userName={user?.name} />
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">Manage Requests</h1>
        {isLoading ? <Loader2 className="h-8 w-8 animate-spin mx-auto" /> : (
          <Tabs defaultValue="pending">
            <TabsList className="mb-6">
              <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress ({inProgress.length})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({resolved.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="pending"><Card className="shadow-card"><CardContent className="pt-6"><RequestList requests={pending} /></CardContent></Card></TabsContent>
            <TabsContent value="in_progress"><Card className="shadow-card"><CardContent className="pt-6"><RequestList requests={inProgress} /></CardContent></Card></TabsContent>
            <TabsContent value="resolved"><Card className="shadow-card"><CardContent className="pt-6"><RequestList requests={resolved} /></CardContent></Card></TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ManageRequests;
