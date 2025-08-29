export type UploadFile = {
  type: string;
  url: string;
};

export type RefundRequestUser = {
  username?: string;
  email?: string;
  avatar_url?: string | null;
  phone_number?: string;
  address?: string;
};

export type RefundRequestOrder = {
  id?: number;
  order_code?: string;
  total_price?: number;
  payment_type?: string;
  shipping_address?: string;
  productStatus?: string;
  payment_status?: string;
};

export type RefundRequest = {
  id: number;
  user?: RefundRequestUser;
  order?: RefundRequestOrder;
  amount?: number;
  status: string;
  created_at?: string;
  reason?: string;
  uploadFiles?: UploadFile[];
  paymentMethod?: string;
  toAccountNumber?: string;
  toBin?: string;
  bank?: string;
  times?: number;
};