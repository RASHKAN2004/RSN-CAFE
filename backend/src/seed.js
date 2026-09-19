import 'dotenv/config';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import { User } from './models/User.js';
import { MenuItem } from './models/MenuItem.js';
import { normalizePhone } from './utils/phone.js';

const fresh = process.argv.includes('--fresh');

// [category, name, price, emoji, description, isVeg, isPopular]
const MENU = [
  ['Coffee', 'Espresso', 450, '☕', 'Short, strong and honest.', true, false],
  ['Coffee', 'Cappuccino', 650, '☕', 'Espresso, steamed milk, thick foam.', true, true],
  ['Coffee', 'Caffe Latte', 700, '🥛', 'Smooth and milky with a light shot.', true, false],
  ['Coffee', 'Iced Coffee', 750, '🧊', 'Cold-brewed, served over ice.', true, true],
  ['Coffee', 'Mocha', 800, '🍫', 'Espresso, chocolate and steamed milk.', true, false],
  ['Tea', 'Ceylon Milk Tea', 300, '🍵', 'Strong Ceylon leaf, sweet and creamy.', true, true],
  ['Tea', 'Plain Tea', 200, '🍵', 'Fresh Ceylon black tea.', true, false],
  ['Tea', 'Ginger Tea', 350, '🫚', 'Fresh ginger, gentle heat.', true, false],
  ['Fresh Drinks', 'King Coconut', 300, '🥥', 'Straight from the tree.', true, true],
  ['Fresh Drinks', 'Fresh Lime Juice', 350, '🍋', 'Sharp, cold and refreshing.', true, false],
  ['Fresh Drinks', 'Mango Smoothie', 650, '🥭', 'Ripe mango, blended with milk.', true, false],
  ['Fresh Drinks', 'Passion Fruit Juice', 500, '🍹', 'Tangy and tropical.', true, false],
  ['Breakfast', 'Egg Hoppers (2)', 450, '🥚', 'Crisp-edged hoppers with a soft egg.', false, true],
  ['Breakfast', 'String Hoppers Set', 550, '🍜', 'With coconut sambol and dhal curry.', true, false],
  ['Breakfast', 'Toast & Omelette', 600, '🍞', 'Buttered toast with a 2-egg omelette.', false, false],
  ['Mains', 'Chicken Kottu', 1250, '🍗', 'Chopped roti, chicken, egg and vegetables.', false, true],
  ['Mains', 'Vegetable Kottu', 950, '🥬', 'Chopped roti with mixed vegetables.', true, false],
  ['Mains', 'Grilled Chicken Sandwich', 1100, '🥪', 'Toasted bread, grilled chicken, salad.', false, false],
  ['Mains', 'Prawn Fried Rice', 1500, '🍤', 'Wok-fried rice with fresh prawns.', false, false],
  ['Snacks', 'Fish Cutlet (2)', 350, '🐟', 'Crumb-fried, spicy and golden.', false, true],
  ['Snacks', 'Vegetable Roll', 180, '🥟', 'Crispy pastry with a spiced filling.', true, false],
  ['Snacks', 'French Fries', 500, '🍟', 'Salted and crisp.', true, false],
  ['Desserts', 'Watalappan', 450, '🍮', 'Coconut milk, jaggery and spices.', true, true],
  ['Desserts', 'Chocolate Brownie', 550, '🍫', 'Warm and fudgy.', true, false],
  ['Desserts', 'Ice Cream Scoop', 300, '🍨', 'Vanilla, chocolate or strawberry.', true, false],
];

await mongoose.connect(env.mongoUri);

// Admin
const phone = normalizePhone(env.admin.phone);
if (!phone || env.admin.password.length < 8) {
  console.error('❌ Set ADMIN_PHONE and ADMIN_PASSWORD (8+ chars) in .env first.');
  process.exit(1);
}
let admin = await User.findOne({ phone });
if (admin) {
  admin.role = 'admin';
  admin.isVerified = true;
  await admin.save();
  console.log(`ℹ️  Admin already exists (${phone}) — password unchanged.`);
} else {
  await User.create({ name: env.admin.name, phone, password: env.admin.password, role: 'admin', isVerified: true });
  console.log(`✅ Admin created → phone: ${phone}  password: ${env.admin.password}`);
}

// Menu
if (fresh) await MenuItem.deleteMany({});
if ((await MenuItem.countDocuments()) === 0) {
  await MenuItem.insertMany(
    MENU.map(([category, name, price, emoji, description, isVeg, isPopular]) => ({
      category, name, price, emoji, description, isVeg, isPopular,
    }))
  );
  console.log(`✅ Seeded ${MENU.length} menu items.`);
} else {
  console.log('ℹ️  Menu already has items (use `npm run seed:fresh` to reset).');
}
await mongoose.disconnect();
