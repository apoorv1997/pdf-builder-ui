import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, TrendingUp } from 'lucide-react';
import { AuctionItem } from '@/types/auction';
import { formatDistanceToNow } from 'date-fns';

interface AuctionCardProps {
  auction: AuctionItem;
}

export const AuctionCard = ({ auction }: AuctionCardProps) => {
  const endTime = new Date(auction.endTime);
  const timeRemaining = formatDistanceToNow(endTime, { addSuffix: true });
  const isEndingSoon = endTime.getTime() - Date.now() < 24 * 60 * 60 * 1000;
  const bidCount = Math.floor(Math.random() * 15) + 1;

  return (
    <Card className="overflow-hidden shadow-card hover:shadow-card-hover transition-smooth group">
      <Link to={`/auction/${auction.id}`}>
        <div className="relative overflow-hidden aspect-square">
          <img
            src={auction.imageUrl}
            alt={auction.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-smooth"
          />
          <Badge 
            className={`absolute top-3 right-3 ${
              auction.status === 'active' 
                ? 'bg-success text-success-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {auction.status === 'active' ? 'Live' : 'Closed'}
          </Badge>
          {isEndingSoon && auction.status === 'active' && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground animate-pulse-glow">
              Ending Soon!
            </Badge>
          )}
        </div>
      </Link>

      <CardHeader className="pb-3">
        <Link to={`/auction/${auction.id}`}>
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-smooth">
            {auction.title}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground">
          {auction.categoryName}
        </p>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Current Bid</span>
            <span className="text-2xl font-bold text-primary">
              ${auction.currentBid.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>{bidCount} bids</span>
            </div>
            <div className={`flex items-center gap-1 ${isEndingSoon ? 'text-accent font-medium' : ''}`}>
              <Clock className={`h-4 w-4 ${isEndingSoon ? 'animate-countdown' : ''}`} />
              <span className="truncate">{timeRemaining}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button asChild className="w-full">
          <Link to={`/auction/${auction.id}`}>Place Bid</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
