import { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { AuctionCard } from '@/components/Auction/AuctionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useAuctions, useCategories } from '@/hooks/useAuctions';
import { SlidersHorizontal, Loader2, Search } from 'lucide-react';

const Browse = () => {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<'endTime' | 'currentBid' | 'createdAt'>('endTime');

  const { data: categories } = useCategories();
  const { data: auctionsData, isLoading } = useAuctions({
    search: searchQuery || undefined,
    minPrice: priceRange[0] || undefined,
    maxPrice: priceRange[1] || undefined,
    categoryId: selectedCategories.length === 1 ? selectedCategories[0].toString() : undefined,
    sortBy,
  });

  const allSubcategories = categories?.[0]?.children?.flatMap(cat => [
    { id: cat.id, name: cat.name },
    ...(cat.children?.map(sub => ({ id: sub.id, name: `${cat.name} > ${sub.name}` })) || [])
  ]) || [];

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Auctions</h1>
          <p className="text-muted-foreground">Find your next great deal on electronics</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-20 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search auctions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                  <Label>Price Range</Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={5000}
                    step={50}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <Label>Categories</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allSubcategories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cat-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <Label htmlFor={`cat-${category.id}`} className="text-sm cursor-pointer">
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="endTime">Ending Soon</SelectItem>
                      <SelectItem value="currentBid">Price: Low to High</SelectItem>
                      <SelectItem value="createdAt">Recently Added</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchQuery('');
                    setPriceRange([0, 5000]);
                    setSelectedCategories([]);
                    setSortBy('endTime');
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Auctions Grid */}
          <main className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {auctionsData?.total || 0} auctions found
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !auctionsData?.auctions || auctionsData.auctions.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <p className="text-lg font-medium mb-2">No auctions available</p>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000
                      ? 'No auctions found matching your criteria.'
                      : 'There are no auctions listed yet. Check back soon!'}
                  </p>
                  {(searchQuery || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000) && (
                    <Button 
                      variant="link" 
                      onClick={() => {
                        setSearchQuery('');
                        setPriceRange([0, 5000]);
                        setSelectedCategories([]);
                      }}
                    >
                      Clear all filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {auctionsData?.auctions.map((auction, index) => (
                  <div 
                    key={auction.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <AuctionCard auction={auction} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Browse;
