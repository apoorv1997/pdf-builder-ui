import { Header } from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { userService } from '@/api';
import { HelpCircle } from 'lucide-react';

const faqs = [
  { q: 'How do I place a bid?', a: 'Navigate to any auction page and enter your bid amount. Make sure it meets the minimum bid increment.' },
  { q: 'What is auto-bidding?', a: 'Auto-bidding automatically places bids on your behalf up to your maximum amount when someone outbids you.' },
  { q: 'How do I create an auction?', a: 'Go to Dashboard > Create Auction, fill in the item details, set your prices, and submit.' },
  { q: 'What happens when I win an auction?', a: 'You\'ll receive an email with payment instructions. Complete payment within 48 hours.' },
  { q: 'How do I contact support?', a: 'Visit the Help Center to submit a request, or email support@buyme.com.' },
];

const FAQ = () => {
  const user = userService.getCurrentUser();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8 max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">FAQ</h1>
        <p className="text-muted-foreground mb-8">Frequently asked questions</p>
        <Card className="shadow-card">
          <CardHeader><CardTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5" />Common Questions</CardTitle></CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;
