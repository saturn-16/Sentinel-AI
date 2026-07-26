import axios from 'axios';
import {
  User, Device, AuthLog, ActivityLog, BehaviorProfile,
  Alert, Incident, AnalyticsOverview, PaginatedResponse
} from '../types';

const API_BASE_URL = '/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sentinel_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const userService = {
  getUsers: async (params?: { query?: string; role?: string; department?: string; page?: number; size?: number }): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/users', { params });
    return response.data;
  },
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};

export const deviceService = {
  getDevices: async (params?: { user_id?: string; is_trusted?: boolean }): Promise<Device[]> => {
    const response = await api.get('/devices', { params });
    return response.data;
  },
  getDeviceById: async (id: string): Promise<Device> => {
    const response = await api.get(`/devices/${id}`);
    return response.data;
  },
  updateTrustStatus: async (id: string, is_trusted: boolean): Promise<Device> => {
    const response = await api.patch(`/devices/${id}/trust`, { is_trusted });
    return response.data;
  },
};

export const profileService = {
  getProfileByUserId: async (userId: string): Promise<BehaviorProfile> => {
    const response = await api.get(`/profiles/user/${userId}`);
    return response.data;
  },
};

export const logService = {
  getAuthLogs: async (params?: { user_id?: string; status?: string; country?: string; is_flagged?: boolean; page?: number; size?: number }): Promise<PaginatedResponse<AuthLog>> => {
    const response = await api.get('/auth-logs', { params });
    return response.data;
  },
  getActivityLogs: async (params?: { user_id?: string; resource?: string; page?: number; size?: number }): Promise<PaginatedResponse<ActivityLog>> => {
    const response = await api.get('/activity-logs', { params });
    return response.data;
  },
};

export const alertService = {
  getAlerts: async (params?: { severity?: string; status?: string; user_id?: string; page?: number; size?: number }): Promise<PaginatedResponse<Alert>> => {
    const response = await api.get('/alerts', { params });
    return response.data;
  },
  getAlertById: async (id: string): Promise<Alert> => {
    const response = await api.get(`/alerts/${id}`);
    return response.data;
  },
  updateAlertStatus: async (id: string, status: string, assigned_to?: string): Promise<Alert> => {
    const response = await api.patch(`/alerts/${id}/status`, { status, assigned_to });
    return response.data;
  },
};

export const incidentService = {
  getIncidents: async (params?: { page?: number; size?: number }): Promise<PaginatedResponse<Incident>> => {
    const response = await api.get('/incidents', { params });
    return response.data;
  },
  createIncident: async (data: { title: string; description: string; severity: string; assigned_to?: string }): Promise<Incident> => {
    const response = await api.post('/incidents', data);
    return response.data;
  },
  updateIncident: async (id: string, data: Partial<Incident>): Promise<Incident> => {
    const response = await api.patch(`/incidents/${id}`, data);
    return response.data;
  },
};

export const analyticsService = {
  getOverview: async (): Promise<AnalyticsOverview> => {
    const response = await api.get('/analytics/overview');
    return response.data;
  },
};

export const generatorService = {
  generateDataset: async (num_users: number = 40, num_days: number = 5) => {
    const response = await api.post('/generator/generate-dataset', { num_users, num_days });
    return response.data;
  },
  simulateAttack: async (attack_type: string, target_user_id?: string, severity: string = 'High') => {
    const response = await api.post('/generator/simulate-attack', { attack_type, target_user_id, severity });
    return response.data;
  },
};
