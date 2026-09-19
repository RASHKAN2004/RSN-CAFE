import "dotenv/config";
import mongoose from "mongoose";
import { env } from "./config/env.js";
import { User } from "./models/User.js";
import { MenuItem } from "./models/MenuItem.js";
import { normalizePhone } from "./utils/phone.js";

const fresh = process.argv.includes("--fresh");

// [category, name, price, emoji, description, isVeg, isPopular]
const MENU = [
  ["Coffee", "Espresso", 450, "☕", "Short, strong and honest.", true, false],
  [
    "Coffee",
    "Cappuccino",
    650,
    "☕",
    "Espresso, steamed milk, thick foam.",
    true,
    true,
  ],
  [
    "Coffee",
    "Caffe Latte",
    700,
    "🥛",
    "Smooth and milky with a light shot.",
    true,
    false,
  ],
  [
    "Coffee",
    "Iced Coffee",
    750,
    "🧊",
    "Cold-brewed, served over ice.",
    true,
    true,
  ],
  [
    "Coffee",
    "Mocha",
    800,
    "🍫",
    "Espresso, chocolate and steamed milk.",
    true,
    false,
  ],
  [
    "Tea",
    "Ceylon Milk Tea",
    300,
    "🍵",
    "Strong Ceylon leaf, sweet and creamy.",
    true,
    true,
  ],
  ["Tea", "Plain Tea", 200, "🍵", "Fresh Ceylon black tea.", true, false],
  ["Tea", "Ginger Tea", 350, "🫚", "Fresh ginger, gentle heat.", true, false],
  [
    "Fresh Drinks",
    "King Coconut",
    300,
    "🥥",
    "Straight from the tree.",
    true,
    true,
  ],
  [
    "Fresh Drinks",
    "Fresh Lime Juice",
    350,
    "🍋",
    "Sharp, cold and refreshing.",
    true,
    false,
  ],
  [
    "Fresh Drinks",
    "Mango Smoothie",
    650,
    "🥭",
    "Ripe mango, blended with milk.",
    true,
    false,
  ],
  [
    "Fresh Drinks",
    "Passion Fruit Juice",
    500,
    "🍹",
    "Tangy and tropical.",
    true,
    false,
  ],
  [
    "Breakfast",
    "Egg Hoppers (2)",
    450,
    "🥚",
    "Crisp-edged hoppers with a soft egg.",
    false,
    true,
  ],
  [
    "Breakfast",
    "String Hoppers Set",
    550,
    "🍜",
    "With coconut sambol and dhal curry.",
    true,
    false,
  ],
  [
    "Breakfast",
    "Toast & Omelette",
    600,
    "🍞",
    "Buttered toast with a 2-egg omelette.",
    false,
    false,
  ],
  [
    "Mains",
    "Chicken Kottu",
    1250,
    "🍗",
    "Chopped roti, chicken, egg and vegetables.",
    false,
    true,
  ],
  [
    "Mains",
    "Vegetable Kottu",
    950,
    "🥬",
    "Chopped roti with mixed vegetables.",
    true,
    false,
  ],
  [
    "Mains",
    "Grilled Chicken Sandwich",
    1100,
    "🥪",
    "Toasted bread, grilled chicken, salad.",
    false,
    false,
  ],
  [
    "Mains",
    "Prawn Fried Rice",
    1500,
    "🍤",
    "Wok-fried rice with fresh prawns.",
    false,
    false,
  ],
  [
    "Snacks",
    "Fish Cutlet (2)",
    350,
    "🐟",
    "Crumb-fried, spicy and golden.",
    false,
    true,
  ],
  [
    "Snacks",
    "Vegetable Roll",
    180,
    "🥟",
    "Crispy pastry with a spiced filling.",
    true,
    false,
  ],
  ["Snacks", "French Fries", 500, "🍟", "Salted and crisp.", true, false],
  [
    "Desserts",
    "Watalappan",
    450,
    "🍮",
    "Coconut milk, jaggery and spices.",
    true,
    true,
  ],
  ["Desserts", "Chocolate Brownie", 550, "🍫", "Warm and fudgy.", true, false],
  [
    "Desserts",
    "Ice Cream Scoop",
    300,
    "🍨",
    "Vanilla, chocolate or strawberry.",
    true,
    false,
  ],
];

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

const getImageUrl = (category, name) =>
  MENU_IMAGE_URLS[name] ||
  FALLBACK_CATEGORY_IMAGES[category] ||
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80";

await mongoose.connect(env.mongoUri);

// Admin
const phone = normalizePhone(env.admin.phone);
if (!phone || env.admin.password.length < 8) {
  console.error(
    "❌ Set ADMIN_PHONE and ADMIN_PASSWORD (8+ chars) in .env first.",
  );
  process.exit(1);
}
let admin = await User.findOne({ phone });
if (admin) {
  admin.role = "admin";
  admin.isVerified = true;
  await admin.save();
  console.log(`ℹ️  Admin already exists (${phone}) — password unchanged.`);
} else {
  await User.create({
    name: env.admin.name,
    phone,
    password: env.admin.password,
    role: "admin",
    isVerified: true,
  });
  console.log(
    `✅ Admin created → phone: ${phone}  password: ${env.admin.password}`,
  );
}

// Menu
if (fresh) await MenuItem.deleteMany({});
if ((await MenuItem.countDocuments()) === 0) {
  await MenuItem.insertMany(
    MENU.map(
      ([category, name, price, emoji, description, isVeg, isPopular]) => ({
        category,
        name,
        price,
        emoji,
        imageUrl: getImageUrl(category, name),
        description,
        isVeg,
        isPopular,
      }),
    ),
  );
  console.log(`✅ Seeded ${MENU.length} menu items.`);
} else {
  console.log(
    "ℹ️  Menu already has items (use `npm run seed:fresh` to reset).",
  );
}
await mongoose.disconnect();
