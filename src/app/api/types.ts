/** API types matching Be/API.md */

export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface AuthVerifyResponse {
  token: string;
  user: User;
}

export interface AuctionBidder {
  id: number;
  email: string;
}

export interface AuctionState {
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  current_highest_bid: number;
  current_highest_bidder: AuctionBidder | null;
  status: "active" | "ended";
  time_remaining_seconds: number | null;
  winner: AuctionBidder | null;
}

export interface AuctionMeResponse {
  user: User;
  is_highest_bidder: boolean;
  my_highest_bid: number | null;
  cooldown_remaining_seconds: number;
}

export interface PlaceBidResponse {
  message: string;
  auction: AuctionState;
  your_bid: number;
}

/** Error detail can be string or validation array */
export type ApiErrorDetail = string | { loc: (string | number)[]; msg: string; type?: string }[];

export interface ApiErrorBody {
  detail: ApiErrorDetail;
}
