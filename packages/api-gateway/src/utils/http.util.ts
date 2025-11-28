import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// HTTP Client pentru a face request-uri către alte servicii
// Similar cu RestTemplate sau WebClient în Spring Boot

export class HttpUtil {
  private static createClient(baseURL: string): AxiosInstance {
    return axios.create({
      baseURL,
      timeout: 10000, // 10 secunde
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Face un request către un serviciu
  static async request(
    serviceUrl: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    path: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<any> {
    const client = this.createClient(serviceUrl);
    
    const config: AxiosRequestConfig = {
      method,
      url: path,
      data,
      headers: {
        ...headers,
      },
    };

    try {
      const response = await client.request(config);
      return response.data;
    } catch (error: any) {
      // Propagă eroarea către error handler
      if (error.response) {
        // Eroare de la serviciu (4xx, 5xx)
        throw {
          status: error.response.status,
          message: error.response.data?.error?.message || error.message,
          data: error.response.data,
        };
      }
      // Eroare de rețea
      throw {
        status: 500,
        message: 'Service unavailable',
      };
    }
  }
}