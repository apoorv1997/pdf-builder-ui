import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/api';
import { useFeaturedAuctions } from '@/hooks/useAuctions';
import { RequestType } from '@/types/auction';
import { HelpCircle, Send, Loader2, MessageCircle, FileText, ArrowRight } from 'lucide-react';
import { z } from 'zod';

const requestSchema = z.object({
  type: z.enum(['password_reset', 'bid_removal', 'account_issue', 'general']),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
  auctionId: z.string().optional(),
});

const HelpCenter = () => {
  const user = userService.getCurrentUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: auctions } = useFeaturedAuctions();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: '' as RequestType | '',
    subject: '',
    message: '',
    auctionId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const result = requestSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to submit a request.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    setIsLoading(true);

    try {
      await userService.createRequest({
        type: formData.type as RequestType,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        auctionId: formData.auctionId || undefined,
      });

      toast({
        title: 'Request Submitted',
        description: 'Our team will review your request and get back to you soon.',
      });
      navigate('/my-requests');
    } catch {
      // Demo fallback
      toast({
        title: 'Request Submitted (Demo)',
        description: 'Your request has been recorded.',
      });
      navigate('/my-requests');
    } finally {
      setIsLoading(false);
    }
  };

  const requestTypes = [
    { value: 'general', label: 'General Question', description: 'Ask about features, policies, or get help' },
    { value: 'password_reset', label: 'Password Reset', description: 'Need help resetting your password' },
    { value: 'bid_removal', label: 'Bid Removal', description: 'Request to remove an accidental bid' },
    { value: 'account_issue', label: 'Account Issue', description: 'Problems with your account' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Help Center</h1>
          <p className="text-muted-foreground">Get help from our support team</p>
        </div>

        <div className="grid gap-6">
          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/faq">
              <Card className="shadow-card hover:shadow-card-hover transition-smooth cursor-pointer h-full">
                <CardContent className="pt-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <HelpCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">FAQ</h3>
                    <p className="text-sm text-muted-foreground">Find answers to common questions</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto mt-1" />
                </CardContent>
              </Card>
            </Link>
            <Link to="/my-requests">
              <Card className="shadow-card hover:shadow-card-hover transition-smooth cursor-pointer h-full">
                <CardContent className="pt-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">My Requests</h3>
                    <p className="text-sm text-muted-foreground">View your submitted requests</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto mt-1" />
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Submit Request Form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Submit a Request
              </CardTitle>
              <CardDescription>
                Our customer service team typically responds within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Request Type *</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(v) => setFormData({ ...formData, type: v as RequestType })}
                  >
                    <SelectTrigger className={errors.type ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select the type of request" />
                    </SelectTrigger>
                    <SelectContent>
                      {requestTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <span className="font-medium">{type.label}</span>
                            <span className="text-muted-foreground ml-2 text-xs">- {type.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                </div>

                {formData.type === 'bid_removal' && (
                  <div className="space-y-2">
                    <Label htmlFor="auctionId">Related Auction</Label>
                    <Select 
                      value={formData.auctionId} 
                      onValueChange={(v) => setFormData({ ...formData, auctionId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select the auction (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {auctions?.map((auction) => (
                          <SelectItem key={auction.id} value={auction.id}>
                            {auction.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief summary of your issue..."
                    className={errors.subject ? 'border-destructive' : ''}
                    maxLength={200}
                  />
                  {errors.subject && (
                    <p className="text-xs text-destructive">{errors.subject}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please describe your issue or question in detail..."
                    rows={5}
                    className={errors.message ? 'border-destructive' : ''}
                    maxLength={1000}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    {errors.message ? (
                      <p className="text-destructive">{errors.message}</p>
                    ) : (
                      <p>Minimum 10 characters</p>
                    )}
                    <p>{formData.message.length}/1000</p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !formData.type || !formData.subject || !formData.message}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Submit Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
