import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { adminService, userService } from '@/api';
import { dummyAuditLogs } from '@/data/dummyData';
import { FileText, Search, Loader2, AlertCircle, Inbox } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatDistanceToNow } from 'date-fns';

const AuditLogs = () => {
  const user = userService.getCurrentUser();
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['auditLogsFull'],
    queryFn: async () => {
      try {
        return await adminService.getAuditLogs({ pageSize: 100 });
      } catch {
        return { logs: dummyAuditLogs, total: dummyAuditLogs.length };
      }
    },
  });

  const filteredLogs = data?.logs.filter(log => 
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.userName.toLowerCase().includes(search.toLowerCase()) ||
    log.details.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-success text-success-foreground';
    if (action.includes('DELETE') || action.includes('REMOVE')) return 'bg-destructive text-destructive-foreground';
    if (action.includes('UPDATE') || action.includes('RESOLVE')) return 'bg-primary text-primary-foreground';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-2">Audit Logs</h1>
        <p className="text-muted-foreground mb-8">Track all administrative actions on the platform</p>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Activity Log ({filteredLogs.length})
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : isError ? (
              <Alert variant="destructive" className="my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Logs</AlertTitle>
                <AlertDescription>Failed to load audit logs. Please try again later.</AlertDescription>
              </Alert>
            ) : filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Inbox className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No audit logs found</p>
                <p className="text-sm">{search ? 'Try adjusting your search terms' : 'Activity logs will appear here'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log, index) => (
                  <div 
                    key={log.id} 
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 animate-fade-in"
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    <Badge className={getActionColor(log.action)}>
                      {log.action}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-medium">{log.details}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>By: {log.userName}</span>
                        <span>{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuditLogs;
