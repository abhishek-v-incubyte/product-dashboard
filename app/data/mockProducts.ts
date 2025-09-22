import type { Product } from "~/types/product";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description:
      "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 199.99,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    tags: ["wireless", "bluetooth", "noise-cancellation"],
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    description:
      "Comfortable office chair with lumbar support and adjustable height.",
    price: 299.99,
    category: "Furniture",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    rating: 4.2,
    reviewCount: 89,
    inStock: true,
    tags: ["office", "ergonomic", "adjustable"],
  },
  {
    id: "3",
    name: "Stainless Steel Water Bottle",
    description:
      "Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 29.99,
    category: "Kitchen",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 203,
    inStock: true,
    tags: ["insulated", "eco-friendly", "durable"],
  },
  {
    id: "4",
    name: "Smartphone Stand",
    description:
      "Adjustable phone stand perfect for video calls and watching content.",
    price: 19.99,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop",
    rating: 4.1,
    reviewCount: 67,
    inStock: false,
    tags: ["adjustable", "phone", "stand"],
  },
  {
    id: "5",
    name: "Gaming Mechanical Keyboard",
    description:
      "RGB backlit mechanical keyboard with customizable keys and macros.",
    price: 149.99,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 156,
    inStock: true,
    tags: ["gaming", "mechanical", "rgb", "customizable"],
  },
  {
    id: "6",
    name: "Yoga Mat",
    description:
      "Non-slip yoga mat with extra cushioning for comfortable practice.",
    price: 39.99,
    category: "Sports",
    image:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=300&fit=crop",
    rating: 4.3,
    reviewCount: 92,
    inStock: true,
    tags: ["yoga", "non-slip", "exercise"],
  },
  {
    id: "7",
    name: "Coffee Maker",
    description:
      "Programmable coffee maker with 12-cup capacity and auto-shutoff feature.",
    price: 89.99,
    category: "Kitchen",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    rating: 4.0,
    reviewCount: 145,
    inStock: true,
    tags: ["coffee", "programmable", "12-cup"],
  },
  {
    id: "8",
    name: "LED Desk Lamp",
    description:
      "Adjustable LED desk lamp with touch control and USB charging port.",
    price: 59.99,
    category: "Lighting",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    rating: 4.4,
    reviewCount: 78,
    inStock: true,
    tags: ["led", "adjustable", "usb-charging", "touch-control"],
  },
  {
    id: "9",
    name: "Wireless Mouse",
    description:
      "Ergonomic wireless mouse with precision tracking and long battery life.",
    price: 34.99,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
    rating: 4.2,
    reviewCount: 234,
    inStock: true,
    tags: ["wireless", "ergonomic", "precision"],
  },
  {
    id: "10",
    name: "Backpack",
    description:
      "Durable backpack with laptop compartment and multiple pockets.",
    price: 79.99,
    category: "Bags",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    rating: 4.5,
    reviewCount: 167,
    inStock: false,
    tags: ["laptop", "durable", "multiple-pockets"],
  },
  {
    id: "11",
    name: "Bluetooth Speaker",
    description:
      "Portable Bluetooth speaker with 360-degree sound and waterproof design.",
    price: 79.99,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 189,
    inStock: true,
    tags: ["bluetooth", "portable", "waterproof", "360-sound"],
  },
  {
    id: "12",
    name: "Reading Glasses",
    description: "Blue light blocking reading glasses with anti-glare coating.",
    price: 24.99,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=300&fit=crop",
    rating: 4.1,
    reviewCount: 95,
    inStock: true,
    tags: ["blue-light-blocking", "anti-glare", "reading"],
  },
];

export const categories = [
  "All",
  "Electronics",
  "Furniture",
  "Kitchen",
  "Accessories",
  "Sports",
  "Lighting",
  "Bags",
];
