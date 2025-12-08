import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { SalesReport, CustomerRequest, AuditLog, User } from '@/types/auction';

export interface CreateCustomerRepData {
  email: string;
  password: string;
  name: string;
}

export const adminService = {
  async getSalesReport(params?: { startDate?: string; endDate?: string }): Promise<SalesReport> {
    return apiClient.get<SalesReport>(API_ENDPOINTS.salesReport, params);
  },

  async getAuditLogs(params?: { page?: number; pageSize?: number; userId?: string }): Promise<{ logs: AuditLog[]; total: number }> {
    return apiClient.get<{ logs: AuditLog[]; total: number }>(API_ENDPOINTS.auditLogs, params);
  },

  async createCustomerRep(data: CreateCustomerRepData): Promise<User> {
    return apiClient.post<User>(API_ENDPOINTS.createCustomerRep, { ...data, role: 'customer-rep' });
  },

  async getRequests(params?: { status?: string; page?: number; pageSize?: number }): Promise<{ requests: CustomerRequest[]; total: number }> {
    return apiClient.get<{ requests: CustomerRequest[]; total: number }>(API_ENDPOINTS.requests, params);
  },

  async getRequestById(id: string): Promise<CustomerRequest> {
    return apiClient.get<CustomerRequest>(API_ENDPOINTS.requestById(id));
  },

  async updateRequest(id: string, data: Partial<CustomerRequest>): Promise<CustomerRequest> {
    return apiClient.put<CustomerRequest>(API_ENDPOINTS.requestById(id), data);
  },

  async resolveRequest(id: string, resolution: string): Promise<CustomerRequest> {
    return apiClient.put<CustomerRequest>(API_ENDPOINTS.requestById(id), {
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
      resolution,
    });
  },
};
