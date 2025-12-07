const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Always check localStorage for token (in case it was updated)
    const token = this.token || localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Handle 401 Unauthorized - clear token and redirect to login
      if (response.status === 401) {
        this.setToken(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
        // Don't redirect here - let the component handle it
      }
      const error = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
      // NestJS returns error in 'message' field, but sometimes it's nested
      const errorMessage = error.message || error.error?.message || error.error || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Auth
  async register(email: string, password: string, fullName?: string) {
    return this.request<{ access_token: string; id: string; email: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ access_token: string; id: string; email: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getProfile() {
    return this.request<any>('/auth/profile');
  }

  // Products
  async getProducts(isActive?: boolean) {
    const query = isActive !== undefined ? `?isActive=${isActive}` : '';
    return this.request<any[]>(`/products${query}`);
  }

  async getProduct(id: string) {
    return this.request<any>(`/products/${id}`);
  }

  async clickProduct(productId: string) {
    return this.request<{
      clickId: string;
      paymentId: string;
      confirmationUrl: string;
      priceBefore: number;
      priceAfter: number;
      newPrice: number;
      isMock?: boolean;
    }>(`/products/${productId}/click`, {
      method: 'POST',
    });
  }

  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    minPrice: number;
    imageUrl?: string;
  }) {
    return this.request<any>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: Partial<any>) {
    return this.request<any>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getMyProducts() {
    return this.request<any[]>('/products/partner/my-products');
  }

  // Orders
  async createOrder(productId: string, balanceToUse?: number) {
    return this.request<{
      order: any;
      payment: { id: string; confirmationUrl: string } | null;
    }>('/orders', {
      method: 'POST',
      body: JSON.stringify({ productId, balanceToUse }),
    });
  }

  async getOrders() {
    return this.request<any[]>('/orders');
  }

  async getOrder(id: string) {
    return this.request<any>(`/orders/${id}`);
  }

  async confirmOrderPayment(orderId: string, paymentId: string) {
    return this.request<any>(`/orders/${orderId}/confirm-payment`, {
      method: 'POST',
      body: JSON.stringify({ paymentId }),
    });
  }

  async getPaymentStatus(paymentId: string) {
    return this.request<any>(`/payments/status/${paymentId}`);
  }

  async confirmClickPayment(productId: string, clickId: string, paymentId: string) {
    return this.request<any>(`/products/${productId}/click/${clickId}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ paymentId }),
    });
  }

  // Balance
  async getBalance() {
    return this.request<{ balance: number }>('/balance');
  }

  async getBalanceHistory(limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.request<any[]>(`/balance/history${query}`);
  }

  async topUpBalance(amount: number) {
    return this.request<{
      paymentId: string;
      confirmationUrl: string;
      amount: number;
      isMock?: boolean;
    }>('/balance/topup', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async confirmTopUp(paymentId: string, amount?: number) {
    return this.request<{
      success: boolean;
      balance?: number;
      message?: string;
    }>('/balance/topup/confirm', {
      method: 'POST',
      body: JSON.stringify({ paymentId, amount }),
    });
  }

  // Analytics
  async getOverallStats() {
    return this.request<any>('/analytics');
  }

  async getProductStats(productId: string) {
    return this.request<any>(`/analytics/product/${productId}`);
  }

  async getPartnerStats(partnerId?: string) {
    if (partnerId) {
      return this.request<any>(`/analytics/partner/${partnerId}`);
    }
    return this.request<any>('/analytics/my-stats');
  }

  // Payouts
  async getPayoutHistory() {
    return this.request<any[]>('/payouts');
  }
}

export const api = new ApiClient(API_BASE_URL);

