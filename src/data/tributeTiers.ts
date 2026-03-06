export interface TributeTier {
  id: string;
  tier: "base" | "standard" | "premium";
  name: string;
  icon: string;
  price: number;
  description: string;
  animated: boolean;
  duration?: string;
}

export const tributeTiers: TributeTier[] = [
  {
    id: "base",
    tier: "base",
    name: "Messaggio",
    icon: "✉️",
    price: 0,
    description: "Lascia un messaggio di condoglianze",
    animated: false,
  },
  {
    id: "standard-candle",
    tier: "standard",
    name: "Candela",
    icon: "🕯️",
    price: 2,
    description: "Una candela accesa in memoria",
    animated: false,
  },
  {
    id: "standard-flower",
    tier: "standard",
    name: "Fiori",
    icon: "🌹",
    price: 2,
    description: "Un omaggio floreale",
    animated: false,
  },
  {
    id: "premium-candle",
    tier: "premium",
    name: "Candela Eterna",
    icon: "🕯️",
    price: 5,
    description: "Resta in cima al guestbook per 30 giorni",
    animated: true,
    duration: "30 giorni",
  },
];
