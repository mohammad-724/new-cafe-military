import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  ChevronRight,
  Clock,
  ExternalLink,
  Facebook,
  Instagram,
  Leaf,
  MapPin,
  Menu as MenuIcon,
  MessageCircle,
  Moon,
  Phone,
  ShoppingBag,
  Star,
  Sun,
  Truck,
  Twitter,
  Utensils,
  X,
  Youtube,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SiSwiggy, SiZomato } from "react-icons/si";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";

// =============================================
// TYPES
// =============================================
interface MenuItem {
  name: string;
  description: string;
  category: string;
  price: number;
}

interface Review {
  customerName: string;
  date: bigint;
  comment: string;
  rating: number;
}

// =============================================
// STATIC DATA
// =============================================
const STATIC_MENU: MenuItem[] = [
  {
    name: "Ghee Masala Dosa",
    description:
      "Crispy golden dosa filled with spiced potato masala, drizzled with pure ghee",
    category: "Tiffins",
    price: 60,
  },
  {
    name: "Set Dosa",
    description: "Soft spongy set of 3 dosas with sambar and chutneys",
    category: "Tiffins",
    price: 40,
  },
  {
    name: "Poori Vada",
    description:
      "Fluffy deep-fried pooris served with crispy medu vadas and sambar",
    category: "Tiffins",
    price: 50,
  },
  {
    name: "Sambar Idly",
    description: "Steamed rice idlis soaked in piping hot sambar with chutneys",
    category: "Tiffins",
    price: 35,
  },
  {
    name: "Mini Meals Non-Veg",
    description:
      "Rice, sambar, rasam, pappad, pickle, curry & non-veg side dish",
    category: "Meals",
    price: 120,
  },
  {
    name: "Chicken Biryani",
    description:
      "Aromatic basmati rice slow-cooked with tender chicken & spices",
    category: "Meals",
    price: 150,
  },
  {
    name: "Crispy Babycorn",
    description:
      "Golden crispy babycorn tossed in tangy spices — a crowd favorite",
    category: "Special Items",
    price: 80,
  },
  {
    name: "Chicken Leg",
    description:
      "Marinated chicken leg piece, grilled to perfection with spices",
    category: "Special Items",
    price: 100,
  },
  {
    name: "Nested Fish",
    description: "Fresh coastal fish preparation — a Visakhapatnam specialty",
    category: "Special Items",
    price: 130,
  },
  {
    name: "Tea",
    description: "Hot ginger chai brewed strong — the way South India likes it",
    category: "Beverages",
    price: 15,
  },
  {
    name: "Coffee",
    description: "Filter coffee made with premium coffee powder, frothy & rich",
    category: "Beverages",
    price: 20,
  },
];

const STATIC_REVIEWS: (Review & { ownerReply?: string; badge?: string })[] = [
  {
    customerName: "Ravi Kumar",
    date: BigInt(Date.now() - 7 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
    rating: 5,
    comment:
      "Absolutely love this place! The Ghee Masala Dosa is crispy and perfectly spiced. Best part — the unlimited chutneys! Price is very affordable for such quality food. A must-visit in Visakhapatnam.",
  },
  {
    customerName: "Priya Sharma",
    date: BigInt(Date.now() - 14 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
    rating: 3,
    comment:
      "Food is good but service was a bit slow during peak hours. Waited 20 minutes for my order.",
    ownerReply:
      "Thank you for your feedback, Priya! We apologize for the wait. We are working on improving our service speed. Hope to serve you better next time!",
  },
  {
    customerName: "Local Guide – Suresh",
    date: BigInt(Date.now() - 30 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
    rating: 4,
    comment:
      "Been visiting for years. The unlimited chutney policy is a game-changer! Coconut chutney and tomato chutney are both excellent. Sambar is fresh and hot every time. Highly recommend for breakfast.",
    badge: "Level 5 Local Guide",
  },
];

const MENU_IMAGE_MAP: Record<string, string> = {
  "Ghee Masala Dosa": "/assets/generated/menu-ghee-masala-dosa.dim_400x300.jpg",
  "Set Dosa": "/assets/generated/menu-set-dosa.dim_400x300.jpg",
  "Poori Vada": "/assets/generated/menu-poori-vada.dim_400x300.jpg",
  "Sambar Idly": "/assets/generated/menu-sambar-idly.dim_400x300.jpg",
  "Chicken Biryani": "/assets/generated/menu-chicken-biryani.dim_400x300.jpg",
  "Mini Meals Non-Veg": "/assets/generated/menu-mini-meals.dim_400x300.jpg",
  "Crispy Babycorn": "/assets/generated/menu-crispy-babycorn.dim_400x300.jpg",
  "Chicken Leg": "/assets/generated/menu-chicken-leg.dim_400x300.jpg",
  "Nested Fish": "/assets/generated/menu-nested-fish.dim_400x300.jpg",
  Tea: "/assets/generated/menu-tea.dim_400x300.jpg",
  Coffee: "/assets/generated/menu-coffee.dim_400x300.jpg",
};

const GALLERY_ITEMS = [
  {
    src: "/assets/generated/gallery-idli.dim_600x400.jpg",
    label: "Idli",
    index: 1,
  },
  {
    src: "/assets/generated/gallery-dosa.dim_600x400.jpg",
    label: "Dosa",
    index: 2,
  },
  {
    src: "/assets/generated/gallery-tandoori-chicken.dim_600x400.jpg",
    label: "Tandoori Chicken",
    index: 3,
  },
  {
    src: "/assets/generated/gallery-ambiance.dim_600x400.jpg",
    label: "Restaurant Ambiance",
    index: 4,
  },
  {
    src: "/assets/generated/gallery-street-view.dim_600x400.jpg",
    label: "Street View",
    index: 5,
  },
];

// Popular times data (hour, busyLevel 0-100)
const POPULAR_TIMES = [
  { hour: 6, label: "6AM", level: 30 },
  { hour: 7, label: "7AM", level: 55 },
  { hour: 8, label: "8AM", level: 85 },
  { hour: 9, label: "9AM", level: 95 },
  { hour: 10, label: "10AM", level: 70 },
  { hour: 11, label: "11AM", level: 45 },
  { hour: 12, label: "12PM", level: 60 },
  { hour: 13, label: "1PM", level: 90 },
  { hour: 14, label: "2PM", level: 75 },
  { hour: 15, label: "3PM", level: 35 },
  { hour: 16, label: "4PM", level: 30 },
  { hour: 17, label: "5PM", level: 40 },
  { hour: 18, label: "6PM", level: 55 },
  { hour: 19, label: "7PM", level: 80 },
  { hour: 20, label: "8PM", level: 90 },
  { hour: 21, label: "9PM", level: 70 },
  { hour: 22, label: "10PM", level: 40 },
];

// =============================================
// HELPER COMPONENTS
// =============================================

function StarRating({
  rating,
  size = "md",
}: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass =
    size === "sm" ? "w-3 h-3" : size === "lg" ? "w-6 h-6" : "w-4 h-4";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${sizeClass} ${i <= rating ? "star-filled fill-current" : "star-empty"}`}
        />
      ))}
    </div>
  );
}

function SectionTitle({
  children,
  subtitle,
  eyebrow,
  light = false,
}: {
  children: React.ReactNode;
  subtitle?: string;
  eyebrow?: string;
  light?: boolean;
}) {
  return (
    <div className="text-center mb-12">
      {/* Eyebrow — contextual per section */}
      {eyebrow && (
        <div
          className={`inline-flex items-center gap-2.5 mb-4 text-xs font-semibold tracking-[0.2em] uppercase font-body ${light ? "opacity-70" : ""}`}
          style={{
            color: light ? "oklch(0.85 0.1 80)" : "oklch(var(--gold-dark))",
          }}
        >
          <span
            className="w-8 h-px"
            style={{
              background: light
                ? "linear-gradient(to right, transparent, oklch(0.85 0.1 80))"
                : "linear-gradient(to right, transparent, oklch(var(--gold-dark)))",
            }}
          />
          {eyebrow}
          <span
            className="w-8 h-px"
            style={{
              background: light
                ? "linear-gradient(to left, transparent, oklch(0.85 0.1 80))"
                : "linear-gradient(to left, transparent, oklch(var(--gold-dark)))",
            }}
          />
        </div>
      )}
      <h2
        className={`font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight ${light ? "text-cream" : "text-foreground"}`}
      >
        {children}
      </h2>
      {subtitle && (
        <p
          className={`text-base md:text-lg max-w-2xl mx-auto font-body leading-relaxed ${light ? "text-cream/60" : "text-muted-foreground"}`}
        >
          {subtitle}
        </p>
      )}
      {/* Ornamental divider — thicker, diamond-centered */}
      <div className="flex items-center justify-center gap-2 mt-5">
        <span
          className="block h-px w-16 md:w-24"
          style={{
            background: light
              ? "linear-gradient(to right, transparent, oklch(0.72 0.14 75 / 0.8))"
              : "linear-gradient(to right, transparent, oklch(var(--gold)))",
          }}
        />
        <span
          className="text-xs leading-none"
          style={{
            color: light ? "oklch(0.72 0.14 75)" : "oklch(var(--gold))",
          }}
        >
          ◆
        </span>
        <span
          className="block h-px w-4"
          style={{
            background: light
              ? "oklch(0.72 0.14 75 / 0.5)"
              : "oklch(var(--gold) / 0.5)",
          }}
        />
        <span
          className="text-base leading-none"
          style={{
            color: light ? "oklch(0.72 0.14 75)" : "oklch(var(--gold))",
          }}
        >
          ✦
        </span>
        <span
          className="block h-px w-4"
          style={{
            background: light
              ? "oklch(0.72 0.14 75 / 0.5)"
              : "oklch(var(--gold) / 0.5)",
          }}
        />
        <span
          className="text-xs leading-none"
          style={{
            color: light ? "oklch(0.72 0.14 75)" : "oklch(var(--gold))",
          }}
        >
          ◆
        </span>
        <span
          className="block h-px w-16 md:w-24"
          style={{
            background: light
              ? "linear-gradient(to left, transparent, oklch(0.72 0.14 75 / 0.8))"
              : "linear-gradient(to left, transparent, oklch(var(--gold)))",
          }}
        />
      </div>
    </div>
  );
}

// =============================================
// NAVBAR
// =============================================
function Navbar({
  darkMode,
  onToggleDark,
}: {
  darkMode: boolean;
  onToggleDark: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Menu", href: "#menu" },
    { label: "Reviews", href: "#reviews" },
    { label: "Gallery", href: "#gallery" },
    { label: "Location", href: "#location" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-lg backdrop-blur-md" : ""
      } ${
        darkMode
          ? scrolled
            ? "bg-card/95"
            : "bg-transparent"
          : scrolled
            ? "bg-background/95"
            : "bg-transparent"
      }`}
      style={{
        backgroundColor: scrolled
          ? undefined
          : darkMode
            ? "oklch(0.13 0.02 20 / 0.7)"
            : "oklch(0.97 0.012 75 / 0.85)",
      }}
    >
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex flex-col leading-tight group">
          <span className="font-display text-xl font-bold text-primary group-hover:text-accent transition-colors">
            New Cafe Military
          </span>
          <span className="text-xs font-body text-muted-foreground">
            న్యూ కేఫ్ మిలిటరీ
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-ocid="nav.link"
              className="text-sm font-body font-medium text-foreground hover:text-accent transition-colors relative group py-1"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleDark}
            data-ocid="nav.toggle"
            aria-label="Toggle dark mode"
            className="w-9 h-9 rounded-full flex items-center justify-center border border-border hover:border-accent hover:text-accent transition-colors"
          >
            {darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <Button
            size="sm"
            data-ocid="nav.primary_button"
            className="hidden md:flex bg-primary text-primary-foreground hover:bg-primary/90 font-body"
            asChild
          >
            <a href="#menu">View Menu</a>
          </Button>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden w-9 h-9 flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <MenuIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-card border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-body font-medium text-foreground hover:text-accent py-2 border-b border-border last:border-none transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// =============================================
// HERO SECTION
// =============================================
function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background image — scale slightly for parallax feel */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-food-spread.dim_1200x600.jpg')",
        }}
      />

      {/* Layered overlay: keep top center bright, darken bottom + sides heavily */}
      {/* Layer 1: left-side vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 70% 40%, transparent 30%, oklch(0.1 0.04 18 / 0.55) 100%)",
        }}
      />
      {/* Layer 2: bottom dark ramp — text area */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, oklch(0.08 0.04 18 / 0.97) 0%, oklch(0.1 0.04 18 / 0.82) 35%, oklch(0.12 0.04 18 / 0.45) 60%, transparent 100%)",
        }}
      />
      {/* Layer 3: top bar for nav readability */}
      <div
        className="absolute top-0 left-0 right-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.08 0.04 18 / 0.6) 0%, transparent 100%)",
        }}
      />

      {/* Warm maroon vignette corners */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, oklch(0.22 0.08 18 / 0.4) 100%)",
        }}
      />

      {/* Mandala pattern — subtler */}
      <div className="absolute inset-0 mandala-bg opacity-15" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pb-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto"
        >
          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8 text-xs font-body font-semibold tracking-[0.18em] uppercase"
            style={{
              borderColor: "oklch(0.72 0.14 75 / 0.45)",
              color: "oklch(0.88 0.1 82)",
              backgroundColor: "oklch(0.72 0.14 75 / 0.1)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Leaf
              className="w-3 h-3"
              style={{ color: "oklch(0.72 0.14 75)" }}
            />
            Authentic South Indian Cuisine · Vizag
          </motion.div>

          {/* Main title — large, dominant */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="font-display font-bold mb-1 leading-none tracking-tight"
            style={{
              fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
              color: "oklch(0.97 0.015 82)",
              textShadow:
                "0 2px 20px oklch(0.1 0.04 18 / 0.6), 0 0 60px oklch(0.72 0.14 75 / 0.12)",
            }}
          >
            New Cafe Military
          </motion.h1>

          {/* Telugu — smaller, gold-tinted, clear visual step down */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38, duration: 0.6 }}
            className="font-display font-normal mb-1"
            style={{
              fontSize: "clamp(1.1rem, 2.8vw, 1.75rem)",
              color: "oklch(0.78 0.12 78)",
              letterSpacing: "0.05em",
            }}
          >
            న్యూ కేఫ్ మిలిటరీ
          </motion.p>

          {/* Thin gold rule between name and tagline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.48, duration: 0.6 }}
            className="mx-auto my-5"
            style={{
              height: "1px",
              width: "120px",
              background:
                "linear-gradient(to right, transparent, oklch(0.72 0.14 75 / 0.9), transparent)",
            }}
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="font-body mb-10 max-w-md mx-auto leading-relaxed"
            style={{
              fontSize: "clamp(0.95rem, 2vw, 1.125rem)",
              color: "oklch(0.82 0.02 70)",
              letterSpacing: "0.02em",
            }}
          >
            Authentic South Indian Tiffins &amp; Meals at Affordable Prices
          </motion.p>

          {/* Rating & price badges — refined pill design */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="flex items-center justify-center gap-3 flex-wrap mb-10"
          >
            {/* Rating pill — gold accent */}
            <div
              className="flex items-center gap-2 px-5 py-2.5 font-body font-semibold text-sm"
              style={{
                backgroundColor: "oklch(0.72 0.14 75 / 0.18)",
                color: "oklch(0.92 0.12 82)",
                border: "1px solid oklch(0.72 0.14 75 / 0.5)",
                borderRadius: "100px",
                backdropFilter: "blur(12px)",
              }}
            >
              <Star
                className="w-4 h-4 fill-current"
                style={{ color: "oklch(0.78 0.16 78)" }}
              />
              <span>4.0</span>
              <span style={{ color: "oklch(0.72 0.14 75 / 0.6)" }}>·</span>
              <span style={{ color: "oklch(0.78 0.06 70)" }}>
                5,752 Reviews
              </span>
            </div>

            {/* Divider dot */}
            <span
              className="w-1.5 h-1.5 rounded-full hidden sm:block"
              style={{ backgroundColor: "oklch(0.72 0.14 75 / 0.4)" }}
            />

            {/* Price pill — maroon accent */}
            <div
              className="flex items-center gap-2 px-5 py-2.5 font-body font-semibold text-sm"
              style={{
                backgroundColor: "oklch(0.18 0.06 18 / 0.55)",
                color: "oklch(0.88 0.02 75)",
                border: "1px solid oklch(0.55 0.1 20 / 0.5)",
                borderRadius: "100px",
                backdropFilter: "blur(12px)",
              }}
            >
              ₹1–200 per person
            </div>
          </motion.div>

          {/* CTA Buttons — clear hierarchy */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            {/* Primary: gold filled — THE action */}
            <a
              href="#menu"
              data-ocid="hero.primary_button"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-body font-bold text-base transition-all hover:scale-105 hover:shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.15 82), oklch(0.64 0.15 72))",
                color: "oklch(0.1 0.03 20)",
                boxShadow: "0 4px 24px oklch(0.72 0.14 75 / 0.35)",
              }}
            >
              <Utensils className="w-4 h-4" />
              View Menu
            </a>

            {/* Secondary: glass outline */}
            <a
              href="https://www.swiggy.com"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="hero.secondary_button"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-body font-semibold text-base transition-all hover:scale-105"
              style={{
                backgroundColor: "oklch(1 0 0 / 0.08)",
                color: "oklch(0.92 0.01 80)",
                border: "1px solid oklch(1 0 0 / 0.25)",
                backdropFilter: "blur(10px)",
              }}
            >
              <ShoppingBag className="w-4 h-4" />
              Order Online
            </a>

            {/* Tertiary: text link style */}
            <a
              href="https://maps.google.com/?q=New+Cafe+Military,+Venkojipalem,+Visakhapatnam"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="hero.link"
              className="inline-flex items-center gap-1.5 px-4 py-3.5 font-body font-medium text-sm transition-all hover:opacity-80"
              style={{
                color: "oklch(0.72 0.04 65)",
              }}
            >
              <MapPin className="w-4 h-4" />
              Get Directions
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span
            className="text-xs font-body tracking-[0.15em] uppercase"
            style={{ color: "oklch(0.65 0.02 65)" }}
          >
            Explore
          </span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.8,
              ease: "easeInOut",
            }}
            className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
            style={{ border: "1px solid oklch(0.65 0.02 65 / 0.5)" }}
          >
            <div
              className="w-1 h-2 rounded-full"
              style={{ backgroundColor: "oklch(0.72 0.14 75 / 0.7)" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================
// ABOUT SECTION
// =============================================
function AboutSection() {
  const specialties = [
    "Ghee Masala Dosa",
    "Sambar Idly",
    "Chicken Biryani",
    "Mini Meals (Non-Veg)",
    "Tea & Coffee",
  ];

  const services = [
    {
      icon: Utensils,
      title: "Dine-in",
      desc: "Enjoy a warm, self-service dining experience",
    },
    {
      icon: ShoppingBag,
      title: "Takeaway",
      desc: "Quick pickup for your busy schedule",
    },
    {
      icon: Truck,
      title: "No-Contact Delivery",
      desc: "Safe doorstep delivery via Swiggy & Zomato",
    },
  ];

  return (
    <section id="about" className="py-20 banana-leaf-bg">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle
            eyebrow="Since Decades · Venkojipalem, Visakhapatnam"
            subtitle="A beloved tiffin and meals center in the heart of Visakhapatnam"
          >
            Our Story
          </SectionTitle>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
              New Cafe Military is a beloved tiffin and meals center in
              Venkojipalem, Visakhapatnam, serving authentic South Indian
              flavors since years. Famous for our crispy{" "}
              <strong className="text-primary font-semibold">
                Ghee Masala Dosa
              </strong>
              , fluffy{" "}
              <strong className="text-primary font-semibold">
                Sambar Idly
              </strong>
              , aromatic{" "}
              <strong className="text-primary font-semibold">
                Chicken Biryani
              </strong>
              , hearty{" "}
              <strong className="text-primary font-semibold">
                Mini Meals (Non-Veg)
              </strong>
              , and refreshing{" "}
              <strong className="text-primary font-semibold">
                Tea &amp; Coffee
              </strong>
              .
            </p>

            {/* Specialty chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {specialties.map((s) => (
                <span
                  key={s}
                  className="font-body text-sm px-3 py-1.5 rounded-full font-medium border"
                  style={{
                    borderColor: "oklch(var(--gold) / 0.5)",
                    color: "oklch(var(--maroon))",
                    backgroundColor: "oklch(var(--gold) / 0.08)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Highlight badges */}
            <div className="flex gap-3 flex-wrap mb-8">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm font-semibold"
                style={{
                  backgroundColor: "oklch(var(--maroon) / 0.08)",
                  color: "oklch(var(--maroon))",
                  border: "1px solid oklch(var(--maroon) / 0.2)",
                }}
              >
                <Award className="w-4 h-4" />
                Unlimited Chutney
              </div>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm font-semibold"
                style={{
                  backgroundColor: "oklch(var(--gold) / 0.1)",
                  color: "oklch(var(--gold-dark))",
                  border: "1px solid oklch(var(--gold) / 0.3)",
                }}
              >
                <Star className="w-4 h-4" />
                Self-Service Available
              </div>
            </div>

            {/* Online order buttons */}
            <div className="flex gap-3 flex-wrap">
              <a
                href="https://www.swiggy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-body font-semibold text-sm text-white transition-transform hover:scale-105"
                style={{ backgroundColor: "#FC8019" }}
              >
                <SiSwiggy className="w-4 h-4" />
                Order on Swiggy
              </a>
              <a
                href="https://www.zomato.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-body font-semibold text-sm text-white transition-transform hover:scale-105"
                style={{ backgroundColor: "#E23744" }}
              >
                <SiZomato className="w-4 h-4" />
                Order on Zomato
              </a>
            </div>
          </motion.div>

          {/* Info grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <div
              className="rounded-2xl p-6 space-y-4 border"
              style={{
                borderColor: "oklch(var(--gold) / 0.2)",
                backgroundColor: "oklch(var(--card))",
                boxShadow: "0 4px 24px oklch(var(--maroon) / 0.08)",
              }}
            >
              <h3 className="font-display text-lg font-bold text-primary">
                Visit Us
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "oklch(var(--maroon) / 0.1)" }}
                  >
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">
                      Address
                    </p>
                    <p className="font-body text-sm text-muted-foreground">
                      JR Nagar, Sadaram Complex, Venkojipalem,
                      <br />
                      Visakhapatnam, Andhra Pradesh – 530022
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "oklch(var(--maroon) / 0.1)" }}
                  >
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">
                      Phone
                    </p>
                    <a
                      href="tel:+918886663821"
                      className="font-body text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                      088866 63821
                    </a>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "oklch(var(--maroon) / 0.1)" }}
                  >
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">
                      Open Hours
                    </p>
                    <p className="font-body text-sm text-muted-foreground">
                      6:00 AM – 10:30 PM
                      <span
                        className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: "oklch(0.5 0.18 145 / 0.15)",
                          color: "oklch(0.4 0.18 145)",
                        }}
                      >
                        Open Today
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Services row */}
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl border group hover:border-accent transition-all duration-300"
              style={{
                backgroundColor: "oklch(var(--card))",
                borderColor: "oklch(var(--border))",
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(var(--maroon)), oklch(var(--maroon-dark)))",
                }}
              >
                <svc.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">
                {svc.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground">
                {svc.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================
// MENU SECTION
// =============================================
function MenuSection() {
  const { actor, isFetching } = useActor();
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: menuItems, isLoading } = useQuery<MenuItem[]>({
    queryKey: ["menuItems"],
    queryFn: async () => {
      if (!actor) return STATIC_MENU;
      try {
        const items = await actor.getAllMenuItems();
        return items.length > 0 ? items : STATIC_MENU;
      } catch {
        return STATIC_MENU;
      }
    },
    enabled: !isFetching,
    placeholderData: STATIC_MENU,
  });

  const items = menuItems ?? STATIC_MENU;
  const categories = ["All", "Tiffins", "Meals", "Special Items", "Beverages"];
  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((i) => i.category === activeCategory);

  const categoryColor: Record<string, string> = {
    Tiffins: "oklch(0.38 0.13 15)",
    Meals: "oklch(0.5 0.16 35)",
    "Special Items": "oklch(0.45 0.14 50)",
    Beverages: "oklch(0.42 0.1 220)",
  };

  return (
    <section
      id="menu"
      className="py-20"
      style={{ backgroundColor: "oklch(var(--maroon-dark))" }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <SectionTitle
            light
            eyebrow="Fresh Daily · 11 Signature Dishes"
            subtitle="Freshly prepared every morning with the finest South Indian ingredients"
          >
            Our Menu
          </SectionTitle>
        </motion.div>

        {/* Category tabs */}
        <div className="flex justify-center mb-10">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList
              className="flex-wrap h-auto gap-1 p-1.5 rounded-xl"
              style={{ backgroundColor: "oklch(0.25 0.05 20)" }}
            >
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  data-ocid="menu.tab"
                  className="font-body text-sm font-medium px-4 py-2 rounded-lg data-[state=active]:text-foreground transition-all"
                  style={{
                    color: "oklch(0.75 0.02 60)",
                  }}
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Menu grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((sk) => (
              <div
                key={sk}
                className="rounded-2xl overflow-hidden shimmer h-80"
                style={{ backgroundColor: "oklch(0.25 0.05 20)" }}
              />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item, idx) => (
                <motion.div
                  key={item.name}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  data-ocid={`menu.card.item.${idx + 1}`}
                  className="group rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
                  style={{
                    backgroundColor: "oklch(0.19 0.035 22)",
                    border: "1px solid oklch(0.32 0.055 22)",
                  }}
                >
                  {/* Card image — 4:3 aspect ratio, consistent across all dishes */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={
                        MENU_IMAGE_MAP[item.name] ||
                        "/assets/generated/hero-food-spread.dim_1200x600.jpg"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-600"
                      style={{ transitionDuration: "600ms" }}
                    />
                    {/* Subtle bottom fade into card body */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, oklch(0.19 0.035 22 / 0.85) 0%, transparent 45%)",
                      }}
                    />
                    {/* Category badge — frosted glass */}
                    <span
                      className="absolute top-2.5 left-2.5 text-xs font-body font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: "oklch(0.1 0.03 20 / 0.65)",
                        color: categoryColor[item.category]
                          ? "oklch(0.88 0.02 75)"
                          : "oklch(0.88 0.02 75)",
                        border: `1px solid ${categoryColor[item.category] || "oklch(0.38 0.13 15)"}`,
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      {item.category}
                    </span>
                  </div>

                  {/* Card body — generous breathing room */}
                  <div className="p-5">
                    <h3 className="menu-card-title font-display text-base font-bold mb-1.5">
                      {item.name}
                    </h3>
                    <p
                      className="font-body text-xs leading-relaxed mb-4"
                      style={{ color: "oklch(0.6 0.02 55)" }}
                    >
                      {item.description}
                    </p>

                    {/* Price row — price dominates, + button as icon */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span
                          className="font-display font-bold leading-none"
                          style={{
                            fontSize: "1.5rem",
                            color: "oklch(0.78 0.14 78)",
                          }}
                        >
                          ₹{item.price}
                        </span>
                        {/* Subtle gold underline under price */}
                        <span
                          className="block mt-0.5 rounded-full"
                          style={{
                            height: "2px",
                            width: "32px",
                            background:
                              "linear-gradient(to right, oklch(0.72 0.14 75 / 0.7), transparent)",
                          }}
                        />
                      </div>

                      {/* Compact + icon button */}
                      <button
                        type="button"
                        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg transition-all hover:scale-110 active:scale-95"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.75 0.14 80), oklch(0.62 0.14 70))",
                          color: "oklch(0.1 0.03 20)",
                          boxShadow: "0 2px 10px oklch(0.72 0.14 75 / 0.3)",
                        }}
                        aria-label={`Add ${item.name} to order`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// =============================================
// REVIEWS SECTION
// =============================================
function ReviewsSection() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    comment: "",
  });
  const [hoverStar, setHoverStar] = useState(0);

  const { data: reviews } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: async () => {
      if (!actor) return STATIC_REVIEWS;
      try {
        const r = await actor.getAllReviews();
        return r.length > 0 ? r : STATIC_REVIEWS;
      } catch {
        return STATIC_REVIEWS;
      }
    },
    enabled: !isFetching,
    placeholderData: STATIC_REVIEWS,
  });

  const mutation = useMutation({
    mutationFn: async (data: {
      name: string;
      rating: number;
      comment: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.addReview(data.name, data.rating, data.comment);
    },
    onSuccess: () => {
      toast.success("Review submitted! Thank you.");
      setNewReview({ name: "", rating: 5, comment: "" });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: () => {
      toast.error("Could not submit review. Please try again.");
    },
  });

  const displayReviews = reviews ?? STATIC_REVIEWS;
  const ownerReplies: Record<string, string> = {
    "Priya Sharma":
      "Thank you for your feedback, Priya! We apologize for the wait. We are working on improving our service speed. Hope to serve you better next time!",
  };
  const reviewBadges: Record<string, string> = {
    "Local Guide – Suresh": "Level 5 Local Guide",
  };

  const formatDate = (date: bigint) => {
    const ms = Number(date) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || "")
      .join("");

  const avatarColors = [
    "oklch(0.38 0.13 15)",
    "oklch(0.5 0.16 35)",
    "oklch(0.45 0.12 220)",
    "oklch(0.42 0.14 300)",
  ];

  return (
    <section id="reviews" className="py-20 banana-leaf-bg">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <SectionTitle eyebrow="5,752 Reviews · Avg 4.0 Stars">
            What Our Customers Say
          </SectionTitle>
        </motion.div>

        {/* Overall rating bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-6 mb-12 flex-wrap"
        >
          <div className="text-center">
            <div
              className="font-display text-6xl font-bold"
              style={{ color: "oklch(var(--maroon))" }}
            >
              4.0
            </div>
            <StarRating rating={4} size="lg" />
            <p className="font-body text-sm text-muted-foreground mt-1">
              5,752 total reviews
            </p>
          </div>
        </motion.div>

        {/* Review cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {displayReviews.map((review, idx) => {
            const ownerReply = ownerReplies[review.customerName];
            const badge = reviewBadges[review.customerName];
            return (
              <motion.div
                key={review.customerName}
                data-ocid={`reviews.item.${idx + 1}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-2xl p-6 border flex flex-col gap-4 hover:shadow-lg transition-shadow"
                style={{
                  backgroundColor: "oklch(var(--card))",
                  borderColor: "oklch(var(--border))",
                }}
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-body font-bold text-sm flex-shrink-0"
                    style={{
                      backgroundColor: avatarColors[idx % avatarColors.length],
                    }}
                  >
                    {getInitials(review.customerName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-body font-semibold text-sm text-foreground truncate">
                        {review.customerName}
                      </span>
                      {badge && (
                        <Badge
                          variant="secondary"
                          className="text-xs font-body"
                          style={{ fontSize: "0.65rem" }}
                        >
                          {badge}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="font-body text-xs text-muted-foreground">
                        {formatDate(review.date)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <p className="font-body text-sm text-muted-foreground leading-relaxed flex-1">
                  "{review.comment}"
                </p>

                {/* Owner reply */}
                {ownerReply && (
                  <div
                    className="rounded-lg p-3 border-l-4"
                    style={{
                      backgroundColor: "oklch(var(--maroon) / 0.06)",
                      borderLeftColor: "oklch(var(--maroon))",
                    }}
                  >
                    <p className="font-body text-xs font-semibold text-primary mb-1">
                      Owner's Response
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      {ownerReply}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Add review form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto rounded-2xl border p-8"
          style={{
            backgroundColor: "oklch(var(--card))",
            borderColor: "oklch(var(--gold) / 0.3)",
            boxShadow: "0 4px 30px oklch(var(--gold) / 0.08)",
          }}
        >
          <h3 className="font-display text-2xl font-bold text-foreground mb-2">
            Share Your Experience
          </h3>
          <p className="font-body text-sm text-muted-foreground mb-6">
            Your feedback helps us serve you better!
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="review-name"
                className="font-body text-sm font-medium text-foreground mb-1.5 block"
              >
                Your Name
              </label>
              <Input
                id="review-name"
                data-ocid="reviews.input"
                placeholder="Enter your name"
                value={newReview.name}
                onChange={(e) =>
                  setNewReview((p) => ({ ...p, name: e.target.value }))
                }
                className="font-body"
              />
            </div>

            <div>
              <label
                htmlFor="review-rating"
                className="font-body text-sm font-medium text-foreground mb-1.5 block"
              >
                Rating
              </label>
              <Input
                data-ocid="reviews.input"
                placeholder="Enter your name"
                value={newReview.name}
                onChange={(e) =>
                  setNewReview((p) => ({ ...p, name: e.target.value }))
                }
                className="font-body"
              />
            </div>

            <div>
              <label
                htmlFor="review-rating"
                className="font-body text-sm font-medium text-foreground mb-1.5 block"
              >
                Rating
              </label>
              <div id="review-rating" className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="text-2xl transition-transform hover:scale-110"
                    onMouseEnter={() => setHoverStar(star)}
                    onMouseLeave={() => setHoverStar(0)}
                    onClick={() =>
                      setNewReview((p) => ({ ...p, rating: star }))
                    }
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        star <= (hoverStar || newReview.rating)
                          ? "star-filled fill-current"
                          : "star-empty"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="review-comment"
                className="font-body text-sm font-medium text-foreground mb-1.5 block"
              >
                Comment
              </label>
              <Textarea
                id="review-comment"
                data-ocid="reviews.textarea"
                placeholder="Tell us about your experience..."
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview((p) => ({ ...p, comment: e.target.value }))
                }
                className="font-body min-h-[100px]"
              />
            </div>

            <Button
              data-ocid="reviews.submit_button"
              onClick={() => {
                if (!newReview.name.trim() || !newReview.comment.trim()) {
                  toast.error("Please fill in your name and comment.");
                  return;
                }
                mutation.mutate(newReview);
              }}
              disabled={mutation.isPending}
              className="w-full font-body font-semibold"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--maroon-light)), oklch(var(--maroon-dark)))",
                color: "oklch(var(--primary-foreground))",
              }}
            >
              {mutation.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================
// POPULAR TIMES SECTION
// =============================================
function PopularTimesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const currentHour = new Date().getHours();

  const getBusyLabel = (level: number) => {
    if (level >= 80) return { label: "Very Busy", color: "oklch(0.55 0.2 25)" };
    if (level >= 60) return { label: "Busy", color: "oklch(0.62 0.18 45)" };
    if (level >= 40) return { label: "Moderate", color: "oklch(0.62 0.14 70)" };
    return { label: "Not too busy", color: "oklch(0.5 0.12 145)" };
  };

  const currentTimeData = POPULAR_TIMES.find((t) => t.hour === currentHour);
  const currentStatus = currentTimeData
    ? getBusyLabel(currentTimeData.level)
    : null;

  return (
    <section
      ref={sectionRef}
      className="py-16 mandala-bg"
      style={{ backgroundColor: "oklch(var(--secondary))" }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Popular Times
          </h3>
          {currentStatus && (
            <p
              className="font-body text-sm"
              style={{ color: currentStatus.color }}
            >
              Right now: <strong>{currentStatus.label}</strong>
            </p>
          )}
        </motion.div>

        <div className="flex items-end justify-center gap-1.5 h-32 overflow-x-auto pb-2">
          {POPULAR_TIMES.map((t, i) => {
            const isActive = t.hour === currentHour;
            const height = visible ? `${(t.level / 100) * 100}%` : "0%";
            return (
              <div
                key={t.hour}
                className="flex flex-col items-center gap-1 flex-shrink-0 w-10"
              >
                <div className="flex-1 w-full flex items-end">
                  <motion.div
                    initial={{ height: "0%" }}
                    animate={visible ? { height } : { height: "0%" }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.04,
                      ease: "easeOut",
                    }}
                    className="w-full rounded-t-sm"
                    style={{
                      backgroundColor: isActive
                        ? "oklch(var(--gold))"
                        : t.level >= 80
                          ? "oklch(0.5 0.15 25)"
                          : t.level >= 50
                            ? "oklch(0.48 0.12 40)"
                            : "oklch(0.45 0.08 18)",
                      minHeight: "4px",
                    }}
                  />
                </div>
                <span
                  className="font-body text-xs"
                  style={{
                    color: isActive
                      ? "oklch(var(--gold))"
                      : "oklch(var(--muted-foreground))",
                  }}
                >
                  {t.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// =============================================
// GALLERY SECTION
// =============================================
function GallerySection() {
  return (
    <section
      id="gallery"
      className="py-20"
      style={{ backgroundColor: "oklch(var(--maroon-dark))" }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <SectionTitle
            light
            eyebrow="Food · Ambiance · Street View"
            subtitle="A visual feast of our dishes and ambiance"
          >
            Gallery
          </SectionTitle>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GALLERY_ITEMS.map((item, idx) => (
            <motion.div
              key={item.src}
              data-ocid={`gallery.item.${item.index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative group overflow-hidden rounded-2xl cursor-pointer ${
                idx === 0 ? "lg:row-span-2" : ""
              }`}
              style={{ aspectRatio: idx === 0 ? "3/4" : "4/3" }}
            >
              <img
                src={item.src}
                alt={item.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Gold overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5"
                style={{
                  background:
                    "linear-gradient(to top, oklch(0.62 0.14 70 / 0.7) 0%, transparent 60%)",
                }}
              >
                <span className="font-display text-lg font-bold text-white">
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================
// LOCATION SECTION
// =============================================
function LocationSection() {
  return (
    <section id="location" className="py-20 banana-leaf-bg">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <SectionTitle
            eyebrow="JR Nagar · Venkojipalem · 530022"
            subtitle="Come visit us in Venkojipalem, Visakhapatnam"
          >
            Find Us
          </SectionTitle>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border shadow-lg"
            style={{ borderColor: "oklch(var(--gold) / 0.2)" }}
          >
            <iframe
              src="https://maps.google.com/maps?q=Venkojipalem,+Visakhapatnam&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="New Cafe Military Location"
              data-ocid="location.map_marker"
            />
          </motion.div>

          {/* Location details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div
              className="rounded-2xl p-6 border space-y-5"
              style={{
                backgroundColor: "oklch(var(--card))",
                borderColor: "oklch(var(--gold) / 0.2)",
              }}
            >
              <h3 className="font-display text-xl font-bold text-primary">
                Location Details
              </h3>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "oklch(var(--maroon) / 0.1)" }}
                  >
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-body font-semibold text-sm text-foreground">
                      Full Address
                    </p>
                    <p className="font-body text-sm text-muted-foreground mt-0.5">
                      JR Nagar, Sadaram Complex, Venkojipalem,
                      <br />
                      Visakhapatnam, Andhra Pradesh – 530022
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-1">
                      Plus code: P8VH+Q6
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "oklch(var(--maroon) / 0.1)" }}
                  >
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-body font-semibold text-sm text-foreground">
                      Call Us
                    </p>
                    <a
                      href="tel:+918886663821"
                      className="font-body text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                      088866 63821
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "oklch(var(--maroon) / 0.1)" }}
                  >
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-body font-semibold text-sm text-foreground">
                      Hours
                    </p>
                    <p className="font-body text-sm text-muted-foreground">
                      Monday – Sunday: 6:00 AM – 10:30 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              data-ocid="location.primary_button"
              className="w-full font-body font-semibold"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--maroon-light)), oklch(var(--maroon-dark)))",
                color: "oklch(var(--primary-foreground))",
              }}
              asChild
            >
              <a
                href="https://maps.google.com/?q=New+Cafe+Military,+Venkojipalem,+Visakhapatnam"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Get Directions
                <ExternalLink className="w-3 h-3 ml-2" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// =============================================
// FOOTER
// =============================================
function Footer() {
  const currentYear = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  const quickLinks = ["Home", "About", "Menu", "Gallery", "Location"];

  return (
    <footer
      className="text-white pt-16 pb-8"
      style={{ backgroundColor: "oklch(0.12 0.03 18)" }}
    >
      {/* Top divider */}
      <div
        className="h-0.5 mx-8 mb-12 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(var(--gold)), transparent)",
        }}
      />

      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h3
                className="font-display text-2xl font-bold"
                style={{ color: "oklch(var(--gold))" }}
              >
                New Cafe Military
              </h3>
              <p
                className="font-body text-sm"
                style={{ color: "oklch(0.65 0.02 60)" }}
              >
                న్యూ కేఫ్ మిలిటరీ
              </p>
            </div>
            <p
              className="font-body text-sm leading-relaxed mb-4 max-w-xs"
              style={{ color: "oklch(0.65 0.02 60)" }}
            >
              Authentic South Indian Tiffins &amp; Meals at Affordable Prices.
              Serving Visakhapatnam with love.
            </p>
            <p
              className="font-body text-sm font-semibold italic"
              style={{ color: "oklch(var(--gold) / 0.8)" }}
            >
              "Customer satisfaction is our top priority"
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-5">
              {[
                {
                  Icon: Facebook,
                  href: "https://facebook.com",
                  label: "Facebook",
                },
                {
                  Icon: Instagram,
                  href: "https://instagram.com",
                  label: "Instagram",
                },
                {
                  Icon: Twitter,
                  href: "https://twitter.com",
                  label: "Twitter",
                },
                {
                  Icon: Youtube,
                  href: "https://youtube.com",
                  label: "YouTube",
                },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    backgroundColor: "oklch(0.22 0.04 20)",
                    color: "oklch(0.65 0.02 60)",
                  }}
                  onMouseEnter={(e) => {
                    (
                      e.currentTarget as HTMLAnchorElement
                    ).style.backgroundColor = "oklch(var(--gold))";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "oklch(0.13 0.02 20)";
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLAnchorElement
                    ).style.backgroundColor = "oklch(0.22 0.04 20)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "oklch(0.65 0.02 60)";
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4
              className="font-display text-base font-bold mb-4"
              style={{ color: "oklch(var(--gold))" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="font-body text-sm flex items-center gap-1.5 group transition-colors"
                    style={{ color: "oklch(0.6 0.02 60)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "oklch(var(--gold))";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "oklch(0.6 0.02 60)";
                    }}
                  >
                    <ChevronRight className="w-3 h-3" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="font-display text-base font-bold mb-4"
              style={{ color: "oklch(var(--gold))" }}
            >
              Contact
            </h4>
            <div className="space-y-3">
              <div className="flex gap-2 items-start">
                <MapPin
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  style={{ color: "oklch(var(--gold))" }}
                />
                <p
                  className="font-body text-xs"
                  style={{ color: "oklch(0.6 0.02 60)" }}
                >
                  JR Nagar, Sadaram Complex, Venkojipalem, Visakhapatnam, AP –
                  530022
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Phone
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "oklch(var(--gold))" }}
                />
                <a
                  href="tel:+918886663821"
                  className="font-body text-xs transition-colors"
                  style={{ color: "oklch(0.6 0.02 60)" }}
                >
                  088866 63821
                </a>
              </div>
              <div className="flex gap-2 items-center">
                <Clock
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "oklch(var(--gold))" }}
                />
                <p
                  className="font-body text-xs"
                  style={{ color: "oklch(0.6 0.02 60)" }}
                >
                  6:00 AM – 10:30 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTopColor: "oklch(0.25 0.03 20)" }}
        >
          <p
            className="font-body text-xs"
            style={{ color: "oklch(0.5 0.02 50)" }}
          >
            © {currentYear} New Cafe Military. All rights reserved.
          </p>
          <p
            className="font-body text-xs"
            style={{ color: "oklch(0.5 0.02 50)" }}
          >
            Built with ❤️ using{" "}
            <a
              href={caffeineLink}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-gold-light transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// =============================================
// FLOATING WHATSAPP BUTTON
// =============================================
function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/918886663821"
      target="_blank"
      rel="noopener noreferrer"
      data-ocid="whatsapp.primary_button"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl float-anim hover:scale-110 transition-transform"
      style={{
        background: "linear-gradient(135deg, #25D366, #128C7E)",
      }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
}

// =============================================
// ROOT APP
// =============================================
export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Navbar darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />

      <main>
        <HeroSection />
        <AboutSection />
        <MenuSection />
        <ReviewsSection />
        <PopularTimesSection />
        <GallerySection />
        <LocationSection />
      </main>

      <Footer />
      <WhatsAppButton />
      <Toaster richColors />
    </div>
  );
}
