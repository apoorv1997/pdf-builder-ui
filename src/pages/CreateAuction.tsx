import { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '@/hooks/useAuctions';
import { auctionService, userService } from '@/api';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';
import { CalendarIcon, Loader2, ImagePlus } from 'lucide-react';

const CreateAuction = () => {
  const user = userService.getCurrentUser();
  const { data: categories } = useCategories();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    categoryId: '',
    startingPrice: '',
    bidIncrement: '',
    minimumPrice: '',
    specifications: '',
  });
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 7));

  // Flatten categories for dropdown
  const flattenCategories = (cats: typeof categories, parentPath: string[] = []): { id: string; name: string; path: string[] }[] => {
    if (!cats) return [];
    return cats.flatMap(cat => {
      const currentPath = [...parentPath, cat.name];
      const displayName = parentPath.length > 0 ? `${parentPath.join(' > ')} > ${cat.name}` : cat.name;
      return [
        { id: cat.id, name: displayName, path: currentPath },
        ...flattenCategories(cat.children, currentPath)
      ];
    });
  };
  
  const allCategories = flattenCategories(categories);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const selectedCategory = allCategories.find(c => c.id === formData.categoryId);
    
    try {
      await auctionService.createAuction({
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        categoryId: formData.categoryId,
        categoryPath: selectedCategory?.path || ['Electronics'],
        sellerId: user?.id || '1',
        sellerName: user?.name || 'Unknown Seller',
        startingPrice: parseFloat(formData.startingPrice),
        bidIncrement: parseFloat(formData.bidIncrement),
        minimumPrice: parseFloat(formData.minimumPrice),
        startTime: new Date(),
        endTime: endDate,
        specifications: formData.specifications 
          ? Object.fromEntries(formData.specifications.split('\n').map(line => {
              const [key, value] = line.split(':').map(s => s.trim());
              return [key, value];
            }))
          : undefined,
      });

      toast({
        title: 'Auction Created!',
        description: 'Your auction has been successfully listed.',
      });
      navigate('/my-auctions');
    } catch (error) {
      toast({
        title: 'Demo Mode',
        description: 'Auction created in demo mode (API not available).',
      });
      navigate('/my-auctions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8 max-w-2xl">
        <h1 className="text-4xl font-bold mb-2">Create New Auction</h1>
        <p className="text-muted-foreground mb-8">List your item for auction</p>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Auction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., iPhone 15 Pro Max - 256GB"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your item in detail..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                  <Button type="button" variant="outline" size="icon">
                    <ImagePlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={(v) => setFormData({ ...formData, categoryId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category">
                      {formData.categoryId && allCategories.find(c => c.id === formData.categoryId)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startingPrice">Starting Price ($) *</Label>
                  <Input
                    id="startingPrice"
                    type="number"
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                    placeholder="100"
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bidIncrement">Bid Increment ($) *</Label>
                  <Input
                    id="bidIncrement"
                    type="number"
                    value={formData.bidIncrement}
                    onChange={(e) => setFormData({ ...formData, bidIncrement: e.target.value })}
                    placeholder="10"
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumPrice">Min Price ($) *</Label>
                  <Input
                    id="minimumPrice"
                    type="number"
                    value={formData.minimumPrice}
                    onChange={(e) => setFormData({ ...formData, minimumPrice: e.target.value })}
                    placeholder="200"
                    min="1"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Secret reserve price</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specifications">Specifications (Optional)</Label>
                <Textarea
                  id="specifications"
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  placeholder="Storage: 256GB&#10;Color: Black&#10;Condition: New"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">One per line, format: Key: Value</p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Auction
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateAuction;
