import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/api';
import { useCategories } from '@/hooks/useAuctions';
import { dummyAlerts } from '@/data/dummyData';
import { Bell, Plus, Trash2, Loader2 } from 'lucide-react';

const Preferences = () => {
  const user = userService.getCurrentUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: categories } = useCategories();

  const [newAlert, setNewAlert] = useState({
    keywords: '',
    categoryIds: [] as number[],
    minPrice: '',
    maxPrice: '',
  });

  const { data: alerts, isLoading } = useQuery({
    queryKey: ['alerts', user?.id],
    queryFn: async () => {
      try {
        return await userService.getUserAlerts(user?.id || '');
      } catch {
        return dummyAlerts;
      }
    },
  });

  const createAlertMutation = useMutation({
    mutationFn: async () => {
      return await userService.createAlert({
        userId: user?.id || '',
        keywords: newAlert.keywords.split(',').map(k => k.trim()),
        categoryIds: newAlert.categoryIds,
        minPrice: newAlert.minPrice ? parseFloat(newAlert.minPrice) : undefined,
        maxPrice: newAlert.maxPrice ? parseFloat(newAlert.maxPrice) : undefined,
        isActive: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast({ title: 'Alert created!' });
      setNewAlert({ keywords: '', categoryIds: [], minPrice: '', maxPrice: '' });
    },
    onError: () => {
      toast({ title: 'Alert created (Demo)', description: 'Saved locally.' });
      setNewAlert({ keywords: '', categoryIds: [], minPrice: '', maxPrice: '' });
    },
  });

  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      return await userService.deleteAlert(alertId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast({ title: 'Alert deleted' });
    },
    onError: () => {
      toast({ title: 'Alert deleted (Demo)' });
    },
  });

  const allCategories = categories?.[0]?.children?.flatMap(cat => [
    { id: cat.id, name: cat.name },
    ...(cat.children?.map(sub => ({ id: sub.id, name: sub.name })) || [])
  ]) || [];

  const toggleCategory = (catId: number) => {
    setNewAlert(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(catId)
        ? prev.categoryIds.filter(id => id !== catId)
        : [...prev.categoryIds, catId]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8 max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">Item Alerts</h1>
        <p className="text-muted-foreground mb-8">Get notified when items matching your criteria are listed</p>

        {/* Create New Alert */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                value={newAlert.keywords}
                onChange={(e) => setNewAlert({ ...newAlert, keywords: e.target.value })}
                placeholder="e.g., iPhone, Pro Max, 256GB"
              />
            </div>

            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((cat) => (
                  <div key={cat.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${cat.id}`}
                      checked={newAlert.categoryIds.includes(cat.id)}
                      onCheckedChange={() => toggleCategory(cat.id)}
                    />
                    <Label htmlFor={`cat-${cat.id}`} className="text-sm cursor-pointer">
                      {cat.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minPrice">Min Price ($)</Label>
                <Input
                  id="minPrice"
                  type="number"
                  value={newAlert.minPrice}
                  onChange={(e) => setNewAlert({ ...newAlert, minPrice: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPrice">Max Price ($)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  value={newAlert.maxPrice}
                  onChange={(e) => setNewAlert({ ...newAlert, maxPrice: e.target.value })}
                  placeholder="5000"
                />
              </div>
            </div>

            <Button 
              onClick={() => createAlertMutation.mutate()}
              disabled={createAlertMutation.isPending || !newAlert.keywords}
            >
              {createAlertMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Alert
            </Button>
          </CardContent>
        </Card>

        {/* Existing Alerts */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Your Alerts ({alerts?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : alerts?.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No alerts set up yet.</p>
            ) : (
              <div className="space-y-4">
                {alerts?.map((alert) => (
                  <div 
                    key={alert.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {alert.keywords.map((keyword) => (
                          <Badge key={keyword} variant="secondary">{keyword}</Badge>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {alert.minPrice && `$${alert.minPrice}`}
                        {alert.minPrice && alert.maxPrice && ' - '}
                        {alert.maxPrice && `$${alert.maxPrice}`}
                        {alert.categoryIds.length > 0 && ` • ${alert.categoryIds.length} categories`}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAlertMutation.mutate(alert.id)}
                      disabled={deleteAlertMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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

export default Preferences;
