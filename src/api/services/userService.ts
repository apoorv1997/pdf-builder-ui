import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { User, Alert, AuctionItem, Bid, CustomerRequest } from '@/types/auction';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'buyer' | 'seller';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CreateRequestData {
  type: 'password_reset' | 'bid_removal' | 'account_issue' | 'general';
  subject: string;
  message: string;
  auctionId?: string;
  bidId?: string;
}

export const userService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.login, credentials);
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.register, data);
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  },

  async logout(): Promise<void> {
    await apiClient.post<void>(API_ENDPOINTS.logout);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  async getUserById(id: string): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.userById(id));
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return apiClient.put<User>(API_ENDPOINTS.userById(id), data);
  },

  async getUserAlerts(userId: string): Promise<Alert[]> {
    return apiClient.get<Alert[]>(API_ENDPOINTS.userAlerts(userId));
  },

  async createAlert(alert: Omit<Alert, 'id'>): Promise<Alert> {
    return apiClient.post<Alert>(API_ENDPOINTS.alerts, alert);
  },

  async deleteAlert(alertId: string): Promise<void> {
    return apiClient.delete<void>(`${API_ENDPOINTS.alerts}/${alertId}`);
  },

  async getUserAuctions(userId: string): Promise<AuctionItem[]> {
    return apiClient.get<AuctionItem[]>(API_ENDPOINTS.userAuctions(userId));
  },

  async getUserBids(userId: string): Promise<Bid[]> {
    return apiClient.get<Bid[]>(API_ENDPOINTS.userBids(userId));
  },

  async getUserOrders(userId: string): Promise<AuctionItem[]> {
    return apiClient.get<AuctionItem[]>(API_ENDPOINTS.userOrders(userId));
  },

  // Customer Requests
  async getUserRequests(userId: string): Promise<CustomerRequest[]> {
    return apiClient.get<CustomerRequest[]>(`/api/users/${userId}/requests`);
  },

  async createRequest(data: CreateRequestData): Promise<CustomerRequest> {
    return apiClient.post<CustomerRequest>(API_ENDPOINTS.requests, {
      type: data.type,
      subject: data.subject,
      message: data.message,
      ...(data.auctionId && { auctionId: data.auctionId }),
      ...(data.bidId && { bidId: data.bidId }),
    });
  },
};
