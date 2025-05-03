-- Insert parent categories and capture their IDs
WITH parent_categories AS (
  INSERT INTO categories (id, name, icon, type, parent_id, group_id, user_id, created_at, updated_at)
  VALUES
    (gen_random_uuid(), 'Entertainment', 'icon:confetti', 'expense', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Food and drink', 'icon:pizza', 'expense', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Home', 'icon:home', 'expense', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Life', 'icon:heart', 'expense', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Transportation', 'icon:car', 'expense', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Uncategorized', 'icon:question-mark', 'expense', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Utilities', 'icon:plug', 'expense', NULL, NULL, NULL, now(), now())
  RETURNING id, name
)

-- Insert subcategories using parent category names
INSERT INTO categories (id, name, icon, type, parent_id, group_id, user_id, created_at, updated_at)
VALUES
  -- Entertainment
  (gen_random_uuid(), 'Games', 'icon:gamepad-2', 'expense', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Movies', 'icon:movie', 'expense', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Music', 'icon:music', 'expense', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other', 'icon:dots', 'expense', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Sports', 'icon:trophy', 'expense', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),

  -- Food and drink
  (gen_random_uuid(), 'Dining out', 'icon:restaurant', 'expense', (SELECT id FROM parent_categories WHERE name = 'Food and drink'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Groceries', 'icon:shopping-cart', 'expense', (SELECT id FROM parent_categories WHERE name = 'Food and drink'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Liquor', 'icon:wine', 'expense', (SELECT id FROM parent_categories WHERE name = 'Food and drink'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other', 'icon:dots', 'expense', (SELECT id FROM parent_categories WHERE name = 'Food and drink'), NULL, NULL, now(), now()),

  -- Home
  (gen_random_uuid(), 'Electronics', 'icon:device-tv', 'expense', (SELECT id FROM parent_categories WHERE name = 'Home'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Furniture', 'icon:sofa', 'expense', (SELECT id FROM parent_categories WHERE name = 'Home'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Household supplies', 'icon:bucket', 'expense', (SELECT id FROM parent_categories WHERE name = 'Home'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Maintenance', 'icon:tools', 'expense', (SELECT id FROM parent_categories WHERE name = 'Home'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Mortgage', 'icon:building-bank', 'expense', (SELECT id FROM parent_categories WHERE name = 'Home'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other', 'icon:dots', 'expense', (SELECT id FROM parent_categories WHERE name = 'Home'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Pets', 'icon:paw', 'expense', (SELECT id FROM parent_categories WHERE name = 'Home'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Rent', 'icon:home-dollar', 'expense', (SELECT id FROM parent_categories WHERE name = 'Home'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Services', 'icon:tool', 'expense', (SELECT id FROM parent_categories WHERE name = 'Home'), NULL, NULL, now(), now()),

  -- Life
  (gen_random_uuid(), 'Childcare', 'icon:baby-carriage', 'expense', (SELECT id FROM parent_categories WHERE name = 'Life'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Clothing', 'icon:shirt', 'expense', (SELECT id FROM parent_categories WHERE name = 'Life'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Education', 'icon:school', 'expense', (SELECT id FROM parent_categories WHERE name = 'Life'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Gifts', 'icon:gift', 'expense', (SELECT id FROM parent_categories WHERE name = 'Life'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Insurance', 'icon:shield-check', 'expense', (SELECT id FROM parent_categories WHERE name = 'Life'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Medical expenses', 'icon:stethoscope', 'expense', (SELECT id FROM parent_categories WHERE name = 'Life'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other', 'icon:dots', 'expense', (SELECT id FROM parent_categories WHERE name = 'Life'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Taxes', 'icon:receipt-tax', 'expense', (SELECT id FROM parent_categories WHERE name = 'Life'), NULL, NULL, now(), now()),

  -- Transportation
  (gen_random_uuid(), 'Bicycle', 'icon:bike', 'expense', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Bus/train', 'icon:bus', 'expense', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Car', 'icon:car', 'expense', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Gas/fuel', 'icon:gas-station', 'expense', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Hotel', 'icon:hotel-service', 'expense', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other', 'icon:dots', 'expense', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Parking', 'icon:parking', 'expense', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Plane', 'icon:plane', 'expense', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Taxi', 'icon:steering-wheel', 'expense', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),

  -- Uncategorized
  (gen_random_uuid(), 'Other', 'icon:dots', 'expense', (SELECT id FROM parent_categories WHERE name = 'Uncategorized'), NULL, NULL, now(), now()),

  -- Utilities
  (gen_random_uuid(), 'Cleaning', 'icon:broom', 'expense', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Electricity', 'icon:bolt', 'expense', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Heat/gas', 'icon:flame', 'expense', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other', 'icon:dots', 'expense', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Trash', 'icon:trash', 'expense', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'TV/Phone/Internet', 'icon:device-desktop', 'expense', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Water', 'icon:droplet', 'expense', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now());
