import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, User, Gavel, Menu, HelpCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserRole } from '@/types/auction';

interface HeaderProps {
  userRole?: UserRole;
  userName?: string;
}

export const Header = ({ userRole, userName }: HeaderProps) => {
  const navLinks = [
    { to: '/browse', label: 'Browse' },
    ...(userRole ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
    ...(userRole === 'seller' ? [{ to: '/create-auction', label: 'Sell Item' }] : []),
    ...(userRole === 'customer-rep' ? [{ to: '/customer-rep', label: 'Rep Dashboard' }] : []),
    ...(userRole === 'admin' ? [{ to: '/admin', label: 'Admin Panel' }] : []),
    { to: '/help', label: 'Help' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl">
            <Gavel className="h-7 w-7 text-primary" />
            <span className="text-gradient-primary">BuyMe</span>
          </Link>

          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-foreground/60 hover:text-foreground transition-smooth"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search auctions..." className="pl-10" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {userRole ? (
            <>
              <Button variant="ghost" size="icon" className="relative hidden md:flex">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground">
                  3
                </Badge>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{userName}</span>
                      <span className="text-xs font-normal text-muted-foreground capitalize">
                        {userRole}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">My Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/current-bids">Current Bids</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/history">Auction History</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-requests">My Requests</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/preferences">Item Alerts</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/login">Logout</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden md:flex">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-lg font-medium text-foreground/80 hover:text-foreground transition-smooth"
                  >
                    {link.label}
                  </Link>
                ))}
                {userRole && (
                  <>
                    <Link to="/my-requests" className="text-lg font-medium text-foreground/80">
                      My Requests
                    </Link>
                    <Link to="/preferences" className="text-lg font-medium text-foreground/80">
                      Item Alerts
                    </Link>
                  </>
                )}
                {!userRole && (
                  <Link to="/login" className="text-lg font-medium text-foreground/80">
                    Sign In
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
