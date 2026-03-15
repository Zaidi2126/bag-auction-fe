import { useState } from "react";
import { useNavigate } from "react-router";
import { Sparkles, Shield, Zap, Package, Timer, Mail } from "lucide-react";

const BAG_IMAGES = [
  "/bag/bag-1.png",
  "/bag/bag-2.png",
  "/bag/bag-3.png",
  "/bag/bag-4.png",
  "/bag/bag-5.png",
];

export function LandingPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleEnterAuction = () => {
    navigate("/auction");
  };

  const handleRequestOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      navigate("/auction");
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
      icon: <Zap className="w-6 h-6" />,
      title: "Protect Your Random Cables Like Family Treasure",
      description: "That USB-C cable from 2019? Now it has a palace fit for royalty.",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Store Chewing Gum, Power Bank & Emotional Damage",
      description: "Multi-compartment design holds everything except your broken dreams.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <span className="text-primary text-sm tracking-[0.3em] uppercase">
                Ultra Premium Collection
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
              The Most Important
              <br />
              <span className="text-primary">Men's Clutch</span> You Will
              <br />
              Ever Own
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Black pebbled leather handbag clutch. Two zippers, one wrist strap, zero judgment.
              This isn't just a bag—it's a lifestyle revolution.
            </p>

            {/* Product Image Gallery - 5 images */}
            <div className="py-12 max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                <img
                  src={BAG_IMAGES[selectedImageIndex]}
                  alt="Black pebbled leather men's handbag clutch"
                  className="relative w-full aspect-[4/3] object-contain rounded-lg border-2 border-primary/30 shadow-2xl shadow-primary/20 bg-card"
                />
              </div>
              <div className="flex justify-center gap-2 mt-4">
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

            <button
              onClick={handleEnterAuction}
              className="bg-primary text-primary-foreground px-12 py-4 rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg shadow-primary/30 inline-block"
            >
              <span className="text-xl font-bold">Enter the Auction</span>
            </button>
          </div>
        </div>
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

      {/* Email Entry Section */}
      <section className="py-20 px-6 bg-card/50">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Enter Your Email</h2>
            <p className="text-muted-foreground">
              Receive your sacred OTP and join the legend
            </p>
          </div>

          <form onSubmit={handleRequestOTP} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full bg-input-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-all"
            >
              Request OTP
            </button>
          </form>
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
