import { useState } from "react";
import { useNavigate } from "react-router";
import { Sparkles, Shield, Package, Timer, Mail } from "lucide-react";
import { requestOtp, verifyOtp } from "../api/client";
import { useAuth } from "../auth-context";
import { BackgroundSlideshow } from "../components/BackgroundSlideshow";

const BAG_IMAGES = [
  "/bag/bag-1.png",
  "/bag/bag-2.png",
  "/bag/bag-3.png",
  "/bag/bag-4.png",
  "/bag/bag-5.png",
  "/bag/bag-6.png",
];

export function LandingPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnterAuction = () => {
    navigate("/auction");
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) return;
    setLoading(true);
    try {
      await requestOtp(email);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!otp || otp.length !== 6) return;
    setLoading(true);
    try {
      const { token, user } = await verifyOtp(email, otp);
      login(token, user);
      navigate("/auction");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Package className="w-6 h-6" />,
      title: "Carry Baby Diapers Like a Responsible Warrior",
      description: "Transform fatherhood into an epic quest with legendary storage capacity.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Emergency Storage for Sanitary Pads",
      description: "Be the hero when moments matter. Discreet, dignified, devastating.",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Can also be used as a Flesh Light When You're Feeling Lonely",
      description: "When you're feeling lonely, you can use it to light up your life.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Do Tatti in it when There's No Washroom in Sight",
      description: "Desperate times, desperate measures. Zipper shut and walk away.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section - full viewport with background slideshow */}
      <section className="relative min-h-screen flex flex-col">
        <BackgroundSlideshow
          images={BAG_IMAGES}
          className="absolute inset-0"
          overlay="darker"
        >
          <div className="relative z-10 flex flex-col min-h-screen justify-center items-center py-20 px-6 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="inline-block">
                <span className="text-primary font-medium text-sm tracking-[0.3em] uppercase drop-shadow-sm">
                  Ultra Premium Collection
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight text-white drop-shadow-lg [text-shadow:0_2px_20px_rgba(0,0,0,0.5)]">
                The Most Important
                <br />
                <span className="text-primary">Men's Clutch</span> You Will
                <br />
                Ever Own
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
                Black pebbled leather handbag clutch. Two zippers, one wrist strap, zero judgment.
                This isn't just a bag—it's a lifestyle revolution.
              </p>

              <button
                onClick={handleEnterAuction}
                className="bg-primary text-primary-foreground px-12 py-4 rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105 shadow-xl shadow-primary/40 inline-block font-bold text-lg"
              >
                Enter the Auction
              </button>
            </div>
          </div>
        </BackgroundSlideshow>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Legendary Features</h2>
            <p className="text-muted-foreground text-lg">
              Capabilities that transcend mortal understanding
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-8 hover:border-primary/50 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional comedic feature */}
          <div className="mt-8 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 border border-primary/30 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">
              Hide Receipts You Will Never Look at Again
            </h3>
            <p className="text-muted-foreground">
              Premium document organization for your financial denial. Waterproof dreams sold separately.
            </p>
          </div>
        </div>
      </section>

      {/* Condition Section - funny */}
      <section className="py-20 px-6 bg-card/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4">Condition</h2>
            <p className="text-muted-foreground text-lg">
              We tell it like it is. No corporate fluff.
            </p>
          </div>
          <div className="bg-card border-2 border-primary/30 rounded-xl p-8 space-y-4">
            <p className="text-lg">
              <span className="text-primary font-bold">Pre-loved.</span> It has held phones, keys, and at least one person&apos;s dignity. No structural damage—unlike our bidder&apos;s sleep schedule.
            </p>
            <p className="text-lg">
              <span className="text-primary font-bold">Zippers:</span> Still zipping. We tested them. They did not judge us.
            </p>
            <p className="text-lg">
              <span className="text-primary font-bold">Smell:</span> Leather. Not “what is that smell” leather. Just… leather.
            </p>
            <p className="text-lg">
              <span className="text-primary font-bold">Vibes:</span> Immaculate. The previous owner only used it for important meetings and definitely not for snacks. (We cannot confirm the snacks part.)
            </p>
            <p className="text-muted-foreground italic pt-2">
              TL;DR: It works, it looks good, and it has more character than a brand-new one. You&apos;re welcome.
            </p>
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Technical Excellence</h2>
            <p className="text-muted-foreground text-lg">
              Crafted with precision that would make Einstein weep
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-primary mb-2 font-bold">Material</div>
              <div className="text-2xl">Pebbled Black Leather</div>
              <div className="text-muted-foreground text-sm mt-1">
                Textured, durable, and 100% judge-free
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-primary mb-2 font-bold">Dimensions</div>
              <div className="text-2xl">23 × 13 × 9 cm</div>
              <div className="text-muted-foreground text-sm mt-1">
                Fits phone, keys, dignity, and one small umbrella
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-primary mb-2 font-bold">Compartments</div>
              <div className="text-2xl">Main + Front Pocket</div>
              <div className="text-muted-foreground text-sm mt-1">
                Two silver zippers. Both still work. We checked.
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-primary mb-2 font-bold">Handle</div>
              <div className="text-2xl">Wrist Strap</div>
              <div className="text-muted-foreground text-sm mt-1">
                Flat leather loop—carry by hand or slip over wrist like a legend
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Clutch Section */}
      <section className="py-20 px-6 bg-card/50">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-5xl font-bold mb-8">Why This Men's Handbag Clutch Deserves an Auction</h2>
          <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
            <p>
              Once upon a time, in a realm of ordinary bags and mundane clutches, there emerged
              a legend. This black pebbled-leather handbag clutch was discovered by people who recognized its true power.
            </p>
            <p>
              Forged in the fires of practicality and tempered in the waters of style, this clutch
              has been passed down through friends who understood its value—and its zippers.
            </p>
            <p>
              Now, the time has come for a new guardian. Will you rise to the challenge? Will you
              bid for glory? Will you become... <span className="text-primary font-bold">The Chosen One</span>?
            </p>
            <p className="text-sm italic text-primary">
              (Spoiler: It's a really nice clutch. We're having fun with it.)
            </p>
          </div>
        </div>
      </section>

      {/* Auction Preview Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary/20 via-card to-card border-2 border-primary rounded-lg p-12 text-center space-y-8">
            <div className="flex justify-center">
              <Timer className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-4xl font-bold">The Auction Awaits</h2>
            <div className="space-y-2">
              <p className="text-muted-foreground text-lg">
                Duration: <span className="text-primary font-bold">30 Minutes</span> of Pure Adrenaline
              </p>
              <p className="text-muted-foreground">
                May the highest bidder win eternal glory (and a really nice men's clutch)
              </p>
            </div>
            <button
              onClick={handleEnterAuction}
              className="bg-primary text-primary-foreground px-10 py-4 rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg shadow-primary/30"
            >
              <span className="text-xl font-bold">Join the Auction</span>
            </button>
          </div>
        </div>
      </section>

      {/* Email / OTP Section */}
      <section className="py-20 px-6 bg-card/50">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">
              {step === "email" ? "Enter Your Email" : "Enter OTP"}
            </h2>
            <p className="text-muted-foreground">
              {step === "email"
                ? "Receive your sacred OTP and join the legend"
                : "Check your email (or terminal if dev). Enter the 6-digit code."}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          {step === "email" ? (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full bg-input-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-70"
              >
                {loading ? "Sending…" : "Request OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                className="w-full bg-input-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-center text-xl tracking-widest"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-70"
              >
                {loading ? "Verifying…" : "Verify & Join Auction"}
              </button>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full text-muted-foreground text-sm hover:text-foreground"
              >
                Use a different email
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            © 2026 Legendary Clutch Auction. All rights reserved. No clutches were harmed in the making of this auction.
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Disclaimer: This clutch may or may not change your life. Results may vary.
          </p>
        </div>
      </footer>
    </div>
  );
}
