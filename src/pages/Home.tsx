import { Link } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { AuctionCard } from '@/components/Auction/AuctionCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFeaturedAuctions, useCategories } from '@/hooks/useAuctions';
import { ArrowRight, Zap, Shield, Clock, TrendingUp, Loader2 } from 'lucide-react';

const Home = () => {
  const { data: featuredAuctions, isLoading: auctionsLoading } = useFeaturedAuctions();
  const { data: categories } = useCategories();

  const subcategories = categories?.[0]?.children || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 px-4">
        <div className="container mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-medium text-sm animate-fade-in">
            <Zap className="h-4 w-4" />
            <span>Over 10,000 Active Auctions</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Buy & Sell Electronics
            <br />
            <span className="text-gradient-primary">Through Live Auctions</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Join thousands of buyers and sellers in the premier marketplace for electronics.
            Fair prices, secure transactions, and automatic bidding.
          </p>

          <div className="flex gap-4 justify-center flex-wrap animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/browse">
                Browse Auctions <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link to="/register">Start Selling</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-card hover:shadow-card-hover transition-smooth">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Auto-Bidding</h3>
                <p className="text-muted-foreground">
                  Set your maximum bid and let our system automatically bid for you up to your limit.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-card-hover transition-smooth">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Secure Transactions</h3>
                <p className="text-muted-foreground">
                  Protected payments and verified sellers ensure safe and trustworthy transactions.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-card-hover transition-smooth">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Live Notifications</h3>
                <p className="text-muted-foreground">
                  Get instant alerts when you're outbid or when new items matching your interests are listed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Auctions</h2>
              <p className="text-muted-foreground">Ending soon - don't miss out!</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/browse">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {auctionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAuctions?.map((auction, index) => (
                <div 
                  key={auction.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <AuctionCard auction={auction} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {subcategories.map((category, index) => (
              <Link key={category.id} to={`/browse?category=${category.id}`}>
                <Card 
                  className="shadow-card hover:shadow-card-hover transition-smooth cursor-pointer group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="pt-6 text-center space-y-2">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-smooth">
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.children?.length || 0} subcategories
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary">
        <div className="container mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold text-primary-foreground">Ready to Start Bidding?</h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Join BuyMe today and discover amazing deals on electronics from trusted sellers.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">Create Account</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
