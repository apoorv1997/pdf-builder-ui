import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import AuctionDetails from "./pages/AuctionDetails";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserHistory from "./pages/UserHistory";
import AccountSettings from "./pages/AccountSettings";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerRepDashboard from "./pages/CustomerRepDashboard";
import AuditLogs from "./pages/AuditLogs";
import CreateAuction from "./pages/CreateAuction";
import CreateCustomerRep from "./pages/CreateCustomerRep";
import CurrentBids from "./pages/CurrentBids";
import FAQ from "./pages/FAQ";
import HelpCenter from "./pages/HelpCenter";
import ManageRequests from "./pages/ManageRequests";
import MyAuctions from "./pages/MyAuctions";
import MyRequests from "./pages/MyRequests";
import OrderHistory from "./pages/OrderHistory";
import Preferences from "./pages/Preferences";
import Profile from "./pages/Profile";
import RequestDetails from "./pages/RequestDetails";
import SalesReport from "./pages/SalesReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/auction/:id" element={<AuctionDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/history" element={<UserHistory />} />
          <Route path="/settings" element={<AccountSettings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/customer-rep" element={<CustomerRepDashboard />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/create-auction" element={<CreateAuction />} />
          <Route path="/create-customer-rep" element={<CreateCustomerRep />} />
          <Route path="/current-bids" element={<CurrentBids />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/manage-requests" element={<ManageRequests />} />
          <Route path="/my-auctions" element={<MyAuctions />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/request/:id" element={<RequestDetails />} />
          <Route path="/sales-report" element={<SalesReport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
