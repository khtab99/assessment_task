export interface Item {
  id: number;
  title: string;
  description: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}