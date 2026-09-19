import "dotenv/config";
import mongoose from "mongoose";
import { env } from "./config/env.js";
import { MenuItem } from "./models/MenuItem.js";

const MENU_IMAGE_URLS = {
  Espresso:
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
  Cappuccino:
    "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=80",
  "Caffe Latte":
    "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80",
  "Iced Coffee":
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80",
  Mocha:
    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=900&q=80",
  "Ceylon Milk Tea":
    "https://images.unsplash.com/photo-1515823064-d6e0c04616a8?auto=format&fit=crop&w=900&q=80",
  "Plain Tea":
    "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80",
  "Ginger Tea":
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80",
  "King Coconut":
    "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80",
  "Fresh Lime Juice":
    "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=900&q=80",
  "Mango Smoothie":
    "https://images.unsplash.com/photo-1572503833605-5d7c98dff0b8?auto=format&fit=crop&w=900&q=80",
  "Passion Fruit Juice":
    "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80",
  "Egg Hoppers (2)":
    "https://images.unsplash.com/photo-1604908556857-7fce5edbf2d8?auto=format&fit=crop&w=900&q=80",
  "String Hoppers Set":
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  "Toast & Omelette":
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
  "Chicken Kottu":
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80",
  "Vegetable Kottu":
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
  "Grilled Chicken Sandwich":
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80",
  "Prawn Fried Rice":
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
  "Fish Cutlet (2)":
    "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80",
  "Vegetable Roll":
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
  "French Fries":
    "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=80",
  Watalappan:
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80",
  "Chocolate Brownie":
    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80",
  "Ice Cream Scoop":
    "https://images.unsplash.com/photo-1570197788417-0e823ef4b7f4?auto=format&fit=crop&w=900&q=80",
};

const FALLBACK_CATEGORY_IMAGES = {
  Coffee:
    "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80",
  Tea: "https://images.unsplash.com/photo-1515823064-d6e0c04616a8?auto=format&fit=crop&w=900&q=80",
  "Fresh Drinks":
    "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80",
  Breakfast:
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
  Mains:
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
  Snacks:
    "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=80",
  Desserts:
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80",
};

await mongoose.connect(env.mongoUri);

const items = await MenuItem.find();
let updated = 0;

for (const item of items) {
  const imageUrl =
    MENU_IMAGE_URLS[item.name] || FALLBACK_CATEGORY_IMAGES[item.category] || "";
  if (imageUrl && item.imageUrl !== imageUrl) {
    item.imageUrl = imageUrl;
    await item.save();
    updated += 1;
  }
}

console.log(`Updated item image URLs: ${updated}`);
console.log(
  JSON.stringify(
    (await MenuItem.find().limit(3).select({ name: 1, imageUrl: 1 })).map(
      (x) => ({
        name: x.name,
        imageUrl: x.imageUrl,
      }),
    ),
    null,
    2,
  ),
);

await mongoose.disconnect();
