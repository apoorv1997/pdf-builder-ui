import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useAuction } from '@/hooks/useAuctions';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  TrendingUp, 
  User, 
  ChevronRight, 
  Loader2,
  Gavel,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { dummyBids } from '@/data/dummyData';

const AuctionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: auction, isLoading } = useAuction(id || '');
  const { toast } = useToast();
  
  const [bidAmount, setBidAmount] = useState('');
  const [isAutoBid, setIsAutoBid] = useState(false);
  const [maxAutoBid, setMaxAutoBid] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceBid = async () => {
    if (!auction) return;
    
    const amount = parseFloat(bidAmount);
    const minBid = auction.currentBid + auction.bidIncrement;
    
    if (isNaN(amount) || amount < minBid) {
      toast({
        title: 'Invalid bid',
        description: `Minimum bid is $${minBid.toLocaleString()}`,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Bid placed successfully!',
        description: `Your bid of $${amount.toLocaleString()} has been placed.`,
      });
      setBidAmount('');
      setIsSubmitting(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header userRole="buyer" userName="John Doe" />
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-background">
        <Header userRole="buyer" userName="John Doe" />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Auction not found</h1>
          <Button asChild>
            <Link to="/browse">Back to Browse</Link>
          </Button>
        </div>
      </div>
    );
  }

  const endTime = new Date(auction.endTime);
  const timeRemaining = formatDistanceToNow(endTime, { addSuffix: true });
  const isEndingSoon = endTime.getTime() - Date.now() < 24 * 60 * 60 * 1000;
  const minBid = auction.currentBid + auction.bidIncrement;

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="buyer" userName="John Doe" />

      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-smooth">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/browse" className="hover:text-foreground transition-smooth">Browse</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{auction.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-card">
              <img
                src={auction.imageUrl}
                alt={auction.title}
                className="object-cover w-full h-full"
              />
              <Badge 
                className={`absolute top-4 right-4 ${
                  auction.status === 'active' 
                    ? 'bg-success text-success-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {auction.status === 'active' ? 'Live Auction' : 'Closed'}
              </Badge>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {auction.categoryPath.join(' > ')}
              </p>
              <h1 className="text-3xl font-bold mb-4">{auction.title}</h1>
              <p className="text-muted-foreground">{auction.description}</p>
            </div>

            {/* Current Bid */}
            <Card className="shadow-card border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Bid</p>
                    <p className="text-4xl font-bold text-primary">
                      ${auction.currentBid.toLocaleString()}
                    </p>
                  </div>
                  <div className={`text-right ${isEndingSoon ? 'text-accent' : ''}`}>
                    <div className="flex items-center gap-2 justify-end">
                      <Clock className={`h-5 w-5 ${isEndingSoon ? 'animate-countdown' : ''}`} />
                      <span className="font-medium">Time Left</span>
                    </div>
                    <p className="text-lg font-semibold">{timeRemaining}</p>
                    <p className="text-xs text-muted-foreground">
                      Ends {format(endTime, 'PPp')}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Bidding Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bidAmount">Your Bid (min: ${minBid.toLocaleString()})</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="bidAmount"
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder={minBid.toString()}
                          className="pl-7"
                          min={minBid}
                          step={auction.bidIncrement}
                        />
                      </div>
                      <Button onClick={handlePlaceBid} disabled={isSubmitting}>
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Gavel className="h-4 w-4 mr-2" />
                            Place Bid
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Auto-bid */}
                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="autoBid" 
                        checked={isAutoBid}
                        onCheckedChange={(checked) => setIsAutoBid(checked === true)}
                      />
                      <Label htmlFor="autoBid" className="cursor-pointer">
                        Enable Auto-Bidding
                      </Label>
                    </div>
                    {isAutoBid && (
                      <div className="space-y-2">
                        <Label htmlFor="maxAutoBid">Maximum Auto-Bid Amount</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            id="maxAutoBid"
                            type="number"
                            value={maxAutoBid}
                            onChange={(e) => setMaxAutoBid(e.target.value)}
                            placeholder="Enter your max"
                            className="pl-7"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          We'll automatically bid for you up to this amount
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{auction.sellerName}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-success" />
                      Verified Seller
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            {auction.specifications && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    {Object.entries(auction.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b last:border-0">
                        <dt className="text-muted-foreground">{key}</dt>
                        <dd className="font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Bid History */}
        <Card className="mt-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Bid History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dummyBids.map((bid) => (
                <div key={bid.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{bid.bidderName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(bid.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">${bid.amount.toLocaleString()}</p>
                    {bid.isAutoBid && (
                      <Badge variant="secondary" className="text-xs">Auto-bid</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuctionDetails;
