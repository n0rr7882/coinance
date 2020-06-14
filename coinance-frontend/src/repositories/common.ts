import { AxiosInstance } from "axios";
import { hasAuthToken, getAuthToken } from "../utils/token";

export abstract class AuthenticatedRepository {
  protected abstract api: AxiosInstance;

  protected initializeApiAuthInterceptor(): void {
    this.api.interceptors.request.use((config) => {
      if (hasAuthToken()) {
        config.headers.authorization = `Bearer ${getAuthToken().access}`;
      }
      return config;
    });
  }
}
