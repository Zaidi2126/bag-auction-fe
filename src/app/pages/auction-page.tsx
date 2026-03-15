import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Trophy, Clock, TrendingUp, Sparkles } from "lucide-react";
import { getAuctionState, placeBid, getAuctionMe } from "../api/client";
import { useAuth } from "../auth-context";
import type { AuctionState, AuctionMeResponse } from "../api/types";
import { useCountdownToStart, AUCTION_START_LABEL } from "../auction-countdown";

const BAG_IMAGES = [
  "/bag/bag-1.png",
  "/bag/bag-2.png",
  "/bag/bag-3.png",
  "/bag/bag-4.png",
  "/bag/bag-5.png",
  "/bag/bag-6.png",
];

const POLL_INTERVAL_MS = 5000;
const BID_INCREMENTS = [5, 10, 15, 20, 50];

export function AuctionPage() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const countdownToStart = useCountdownToStart();
  const isBeforeStart = !countdownToStart.isStarted;

  const [state, setState] = useState<AuctionState | null>(null);
  const [me, setMe] = useState<AuctionMeResponse | null>(null);
  const [stateError, setStateError] = useState<string | null>(null);
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidLoading, setBidLoading] = useState(false);

  const fetchState = useCallback(async () => {
    try {
      const data = await getAuctionState();
      setState(data);
      setStateError(null);
    } catch (err) {
      setStateError(err instanceof Error ? err.message : "Failed to load auction.");
    }
  }, []);

  const fetchMe = useCallback(async () => {
    if (!token) {
      setMe(null);
      return;
    }
    try {
      const data = await getAuctionMe(token);
      setMe(data);
    } catch {
      logout();
      setMe(null);
      navigate("/");
    }
  }, [token, logout, navigate]);

  useEffect(() => {
    fetchState();
    fetchMe();
  }, [fetchState, fetchMe]);

  useEffect(() => {
    if (!state || state.status === "ended") return;
    const id = setInterval(fetchState, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [state?.status, fetchState]);

  useEffect(() => {
    if (!token) return;
    const id = setInterval(fetchMe, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [token, fetchMe]);

  const handleBid = async (increment: number) => {
    if (!token) return;
    setBidError(null);
    setBidLoading(true);
    try {
      const res = await placeBid(increment, token);
      setState(res.auction);
      await fetchMe();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Bid failed.";
      setBidError(msg);
      if (msg.toLowerCase().includes("token") || msg.toLowerCase().includes("log in")) {
        logout();
        navigate("/");
      }
    } finally {
      setBidLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isBeforeStart) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center space-y-8">
          <Clock className="w-20 h-20 text-primary mx-auto" />
          <h1 className="text-4xl font-bold">Auction Starts Soon</h1>
          <p className="text-muted-foreground">{AUCTION_START_LABEL}</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="bg-card border border-border rounded-lg px-6 py-4 min-w-[5rem]">
              <div className="text-4xl font-bold text-primary tabular-nums">{countdownToStart.days}</div>
              <div className="text-sm text-muted-foreground">days</div>
            </div>
            <div className="bg-card border border-border rounded-lg px-6 py-4 min-w-[5rem]">
              <div className="text-4xl font-bold text-primary tabular-nums">{countdownToStart.hours}</div>
              <div className="text-sm text-muted-foreground">hours</div>
            </div>
            <div className="bg-card border border-border rounded-lg px-6 py-4 min-w-[5rem]">
              <div className="text-4xl font-bold text-primary tabular-nums">{countdownToStart.minutes}</div>
              <div className="text-sm text-muted-foreground">min</div>
            </div>
            <div className="bg-card border border-border rounded-lg px-6 py-4 min-w-[5rem]">
              <div className="text-4xl font-bold text-primary tabular-nums">{countdownToStart.seconds}</div>
              <div className="text-sm text-muted-foreground">sec</div>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (stateError && !state) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-4">
          <p className="text-destructive">{stateError}</p>
          <button
            onClick={() => window.location.href = "/"}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <p className="text-muted-foreground">Loading auction…</p>
      </div>
    );
  }

  const ended = state.status === "ended";
  const timeRemaining = state.time_remaining_seconds ?? 0;
  const currentBid = state.current_highest_bid;
  const highestBidderEmail = state.current_highest_bidder?.email ?? null;
  const isWinning = !!token && me?.is_highest_bidder === true;
  const cooldownRemaining = me?.cooldown_remaining_seconds ?? 0;
  const myHighestBid = me?.my_highest_bid ?? 0;
  const canBid = !!token && !ended && !me?.is_highest_bidder && cooldownRemaining <= 0;

  if (ended) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <Trophy className="w-32 h-32 text-primary mx-auto relative z-10 animate-bounce" />
          </div>
          <h1 className="text-6xl font-bold">
            {isWinning ? "Congratulations!" : "Auction Ended"}
          </h1>
          {state.winner && (
            <div className="space-y-4">
              <p className="text-2xl text-muted-foreground">
                Winner: <span className="text-primary">{state.winner.email}</span>
              </p>
              <p className="text-xl text-muted-foreground">
                Final Bid: <span className="text-foreground font-bold">{currentBid} AED</span>
              </p>
            </div>
          )}
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold">
            {state.title}
          </h1>
          <p className="text-muted-foreground text-lg">
            {state.description ?? "Battle for glory. Win eternal bragging rights."}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-lg" />
                <img
                  src={BAG_IMAGES[selectedImageIndex]}
                  alt="Auction item"
                  className="relative w-full h-96 object-contain rounded-lg border border-primary/30 bg-card"
                />
              </div>
              <div className="flex justify-center gap-2 mt-4 flex-wrap">
                {BAG_IMAGES.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === i ? "border-primary ring-2 ring-primary/30" : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={src} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/20 to-card border-2 border-primary rounded-lg p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Time Remaining</div>
                    <div className="text-4xl font-bold text-primary">{formatTime(timeRemaining)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Current Highest Bid</div>
                  <div className="text-4xl font-bold">{currentBid} AED</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {highestBidderEmail ? `by ${highestBidderEmail}` : "No bids yet"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border-2 border-primary/30 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Condition</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><span className="text-primary font-medium">Pre-loved.</span> Held phones, keys, and someone&apos;s dignity. No structural damage.</li>
                <li><span className="text-primary font-medium">Zippers:</span> Still zipping. We tested. They did not judge.</li>
                <li><span className="text-primary font-medium">Smell:</span> Leather. The good kind.</li>
                <li><span className="text-primary font-medium">Vibes:</span> Immaculate. (Snacks not confirmed.)</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Current bid
              </h3>
              <div className="flex justify-between items-center py-3 px-4 bg-secondary/50 rounded-lg border border-border">
                <span className="text-muted-foreground">
                  {highestBidderEmail ? (
                    <><span className="text-foreground font-medium">{highestBidderEmail}</span> leads</>
                  ) : (
                    "Be the first to bid"
                  )}
                </span>
                <div className="font-bold">{currentBid} AED</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {token && (
              <div
                className={`border-2 rounded-lg p-6 ${
                  isWinning ? "bg-primary/10 border-primary" : "bg-card border-border"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  {isWinning ? <Sparkles className="w-5 h-5 text-primary" /> : <TrendingUp className="w-5 h-5 text-muted-foreground" />}
                  <h3 className="font-bold">Your Status</h3>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {isWinning ? (
                      <span className="text-primary">You&apos;re winning</span>
                    ) : (
                      <span className="text-muted-foreground">Your bids</span>
                    )}
                  </div>
                  {myHighestBid > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Your highest bid: <span className="font-bold text-foreground">{myHighestBid} AED</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!token && (
              <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
                <p className="text-muted-foreground text-sm mb-2">Log in to place a bid</p>
                <a href="/" className="text-primary font-medium hover:underline">Go to login</a>
              </div>
            )}

            {token && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Place Your Bid</h3>
                {bidError && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                    {bidError}
                  </div>
                )}
                <div className="space-y-3">
                  {BID_INCREMENTS.map((inc) => (
                    <button
                      key={inc}
                      onClick={() => handleBid(inc)}
                      disabled={!canBid || bidLoading}
                      className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                        !canBid || bidLoading
                          ? "bg-secondary text-muted-foreground cursor-not-allowed"
                          : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-lg shadow-primary/20"
                      }`}
                    >
                      +{inc} AED
                    </button>
                  ))}
                </div>

                {me?.is_highest_bidder && (
                  <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg text-center">
                    <p className="text-sm text-primary">You are the highest bidder. Wait for someone else to outbid you.</p>
                  </div>
                )}
                {cooldownRemaining > 0 && !me?.is_highest_bidder && (
                  <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-center">
                    <p className="text-sm text-destructive">
                      You can bid again in {Math.ceil(cooldownRemaining)}s
                    </p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-border text-center">
                  <div className="text-sm text-muted-foreground">Next bid from</div>
                  <div className="text-3xl font-bold text-primary mt-1">{currentBid + 5} AED</div>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/30 rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground italic">
                &quot;Fortune favors the bold. The men&apos;s clutch awaits its champion.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
