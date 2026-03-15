import { useState, useEffect } from "react";
import { Trophy, Clock, TrendingUp, Sparkles } from "lucide-react";

const BAG_IMAGES = [
  "/bag/bag-1.png",
  "/bag/bag-2.png",
  "/bag/bag-3.png",
  "/bag/bag-4.png",
  "/bag/bag-5.png",
];

interface BidActivity {
  id: number;
  bidder: string;
  amount: number;
  timestamp: Date;
}

export function AuctionPage() {
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [currentBid, setCurrentBid] = useState(25);
  const [userBid, setUserBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState("a***@gmail.com");
  const [isWinning, setIsWinning] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [bidHistory, setBidHistory] = useState<BidActivity[]>([
    { id: 1, bidder: "Omar", amount: 20, timestamp: new Date(Date.now() - 120000) },
    { id: 2, bidder: "Ali", amount: 25, timestamp: new Date(Date.now() - 60000) },
  ]);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const userEmail = "s***@gmail.com"; // Mock user email

  // Countdown timer
  useEffect(() => {
    if (timeRemaining <= 0) {
      setAuctionEnded(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setAuctionEnded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Cooldown timer
  useEffect(() => {
    if (cooldownRemaining <= 0) return;

    const timer = setInterval(() => {
      setCooldownRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleBid = (increment: number) => {
    if (cooldownRemaining > 0 || auctionEnded) return;

    const newBid = currentBid + increment;
    setCurrentBid(newBid);
    setUserBid(newBid);
    setHighestBidder(userEmail);
    setIsWinning(true);
    setCooldownRemaining(5);

    // Add to bid history
    const newActivity: BidActivity = {
      id: bidHistory.length + 1,
      bidder: "You",
      amount: newBid,
      timestamp: new Date(),
    };
    setBidHistory([newActivity, ...bidHistory]);

    // Simulate other bidders (30% chance someone else bids after 3 seconds)
    setTimeout(() => {
      if (Math.random() < 0.3 && !auctionEnded) {
        const otherBidders = ["Ahmed", "Fatima", "Khalid", "Noura"];
        const randomBidder = otherBidders[Math.floor(Math.random() * otherBidders.length)];
        const competingBid = newBid + 5;
        
        setCurrentBid(competingBid);
        setHighestBidder(`${randomBidder.toLowerCase().charAt(0)}***@gmail.com`);
        setIsWinning(false);

        const competingActivity: BidActivity = {
          id: bidHistory.length + 2,
          bidder: randomBidder,
          amount: competingBid,
          timestamp: new Date(),
        };
        setBidHistory((prev) => [competingActivity, ...prev]);
      }
    }, 3000);
  };

  const bidIncrements = [
    { label: "+5 AED", value: 5 },
    { label: "+10 AED", value: 10 },
    { label: "+15 AED", value: 15 },
    { label: "+20 AED", value: 20 },
    { label: "+50 AED", value: 50 },
  ];

  if (auctionEnded) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            <Trophy className="w-32 h-32 text-primary mx-auto relative z-10 animate-bounce" />
          </div>
          <h1 className="text-6xl font-bold">
            {isWinning ? "Congratulations!" : "Auction Ended"}
          </h1>
          {isWinning ? (
            <div className="space-y-4">
              <p className="text-2xl text-primary">
                You are the Winner of the Legendary Men's Clutch!
              </p>
              <p className="text-xl text-muted-foreground">
                Final Bid: <span className="text-foreground font-bold">{currentBid} AED</span>
              </p>
              <p className="text-muted-foreground">
                The clutch has chosen its guardian. May it serve you well in your heroic endeavors.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-2xl text-muted-foreground">
                Winner: <span className="text-primary">{highestBidder}</span>
              </p>
              <p className="text-xl text-muted-foreground">
                Final Bid: <span className="text-foreground font-bold">{currentBid} AED</span>
              </p>
              <p className="text-muted-foreground">
                The clutch has found its new home. Better luck next time, brave warrior.
              </p>
            </div>
          )}
          <button
            onClick={() => window.location.href = "/"}
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
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold">
            The Legendary <span className="text-primary">Men's Clutch</span> Auction
          </h1>
          <p className="text-muted-foreground text-lg">
            Black pebbled leather handbag clutch. Battle for glory. Win eternal bragging rights.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Product & Timer */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Image Gallery - 5 images */}
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-lg"></div>
                <img
                  src={BAG_IMAGES[selectedImageIndex]}
                  alt="Black pebbled leather men's handbag clutch"
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

            {/* Condition Section - funny */}
            <div className="bg-card border-2 border-primary/30 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Condition</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><span className="text-primary font-medium">Pre-loved.</span> Held phones, keys, and someone&apos;s dignity. No structural damage.</li>
                <li><span className="text-primary font-medium">Zippers:</span> Still zipping. We tested. They did not judge.</li>
                <li><span className="text-primary font-medium">Smell:</span> Leather. The good kind.</li>
                <li><span className="text-primary font-medium">Vibes:</span> Immaculate. (Snacks not confirmed.)</li>
              </ul>
              <p className="text-muted-foreground italic text-xs mt-3">TL;DR: It works, it looks good. You&apos;re welcome.</p>
            </div>

            {/* Countdown Timer */}
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
                  <div className="text-sm text-muted-foreground mt-1">by {highestBidder}</div>
                </div>
              </div>
            </div>

            {/* Activity Section */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Bid Activity
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {bidHistory.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex justify-between items-center py-3 px-4 bg-secondary/50 rounded-lg border border-border"
                  >
                    <div>
                      <span className={activity.bidder === "You" ? "text-primary font-bold" : ""}>
                        {activity.bidder}
                      </span>
                      <span className="text-muted-foreground"> placed a bid</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{activity.amount} AED</div>
                      <div className="text-xs text-muted-foreground">
                        {activity.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Bidding Controls */}
          <div className="space-y-6">
            {/* User Status */}
            <div
              className={`border-2 rounded-lg p-6 ${
                isWinning
                  ? "bg-primary/10 border-primary"
                  : "bg-destructive/10 border-destructive/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {isWinning ? (
                  <Sparkles className="w-5 h-5 text-primary" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-destructive" />
                )}
                <h3 className="font-bold">Your Status</h3>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {isWinning ? (
                    <span className="text-primary">You're Winning!</span>
                  ) : (
                    <span className="text-destructive">You've Been Outbid</span>
                  )}
                </div>
                {userBid > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Your highest bid: <span className="font-bold text-foreground">{userBid} AED</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bid Controls */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Place Your Bid</h3>
              <div className="space-y-3">
                {bidIncrements.map((increment) => (
                  <button
                    key={increment.value}
                    onClick={() => handleBid(increment.value)}
                    disabled={cooldownRemaining > 0}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                      cooldownRemaining > 0
                        ? "bg-secondary text-muted-foreground cursor-not-allowed"
                        : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-lg shadow-primary/20"
                    }`}
                  >
                    {increment.label}
                  </button>
                ))}
              </div>

              {/* Cooldown Indicator */}
              {cooldownRemaining > 0 && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-center">
                  <p className="text-sm text-destructive">
                    Please wait {cooldownRemaining} seconds before placing another bid
                  </p>
                </div>
              )}

              {/* Next Bid Preview */}
              <div className="mt-6 pt-6 border-t border-border text-center">
                <div className="text-sm text-muted-foreground">Next bid will be</div>
                <div className="text-3xl font-bold text-primary mt-1">
                  {currentBid + 5} AED
                </div>
              </div>
            </div>

            {/* Motivational Message */}
            <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/30 rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground italic">
                "Fortune favors the bold. The men's clutch awaits its champion."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
