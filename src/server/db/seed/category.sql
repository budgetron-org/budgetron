-- Insert parent categories and capture their IDs
WITH parent_categories AS (
  INSERT INTO categories (id, name, icon, type, parent_id, group_id, user_id, created_at, updated_at)
  VALUES
    -- Expense categories
    (gen_random_uuid(), 'Entertainment', 'icon:confetti', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Food and drink', 'icon:pizza', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Home', 'icon:home', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Life', 'icon:heart', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Transportation', 'icon:car', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Uncategorized Expense', 'icon:question-mark', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Utilities', 'icon:plug', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    
    -- Income categories
    (gen_random_uuid(), 'Salary', 'icon:briefcase', 'INCOME', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Business', 'icon:building', 'INCOME', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Investments', 'icon:chart-bar', 'INCOME', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Gifts', 'icon:gift', 'INCOME', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Uncategorized Income', 'icon:question-mark', 'INCOME', NULL, NULL, NULL, now(), now()),
    
    -- Transfer categories
    (gen_random_uuid(), 'Transfer', 'icon:transfer', 'TRANSFER', NULL, NULL, NULL, now(), now())
  RETURNING id, name
)

-- Insert subcategories using parent category names
INSERT INTO categories (id, name, icon, type, parent_id, group_id, user_id, created_at, updated_at)
VALUES
  -- Entertainment
  (gen_random_uuid(), 'Games', 'icon:gamepad-2', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Movies', 'icon:movie', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Music', 'icon:music', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Sports', 'icon:trophy', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),

  -- Food and drink
  (gen_random_uuid(), 'Dining out', 'icon:restaurant', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Food and drink'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Groceries', 'icon:shopping-cart', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Food and drink'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Liquor', 'icon:wine', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Food and drink'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Food and drink'), NULL, NULL, now(), now()),

  -- Home
  (gen_random_uuid(), 'Electronics', 'icon:device-tv', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Home'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Furniture', 'icon:sofa', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Home'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Household supplies', 'icon:bucket', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Home'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Maintenance', 'icon:tools', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Home'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Mortgage', 'icon:building-bank', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Home'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Pets', 'icon:paw', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Home'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Rent', 'icon:home-dollar', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Home'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Services', 'icon:tool', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Home'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Home'), NULL, NULL, now(), now()),

  -- Life
  (gen_random_uuid(), 'Childcare', 'icon:baby-carriage', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Life'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Clothing', 'icon:shirt', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Life'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Education', 'icon:school', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Life'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Gifts', 'icon:gift', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Life'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Insurance', 'icon:shield-check', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Life'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Medical Expenses', 'icon:stethoscope', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Life'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Taxes', 'icon:receipt-tax', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Life'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Life'), NULL, NULL, now(), now()),

  -- Transportation
  (gen_random_uuid(), 'Bicycle', 'icon:bike', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Bus/train', 'icon:bus', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Car', 'icon:car', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Gas/fuel', 'icon:gas-station', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Hotel', 'icon:hotel-service', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Parking', 'icon:parking', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Plane', 'icon:plane', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Taxi', 'icon:steering-wheel', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),

  -- Uncategorized
  (gen_random_uuid(), 'Other', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Uncategorized Expense'), NULL, NULL, now(), now()),

  -- Utilities
  (gen_random_uuid(), 'Cleaning', 'icon:broom', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Electricity', 'icon:bolt', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Heat/gas', 'icon:flame', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Trash', 'icon:trash', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'TV/Phone/Internet', 'icon:device-desktop', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Water', 'icon:droplet', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),

  -- Salary
  (gen_random_uuid(), 'Primary job', 'icon:briefcase', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Salary'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Side job', 'icon:hammer', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Salary'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Salary'), NULL, NULL, now(), now()),

  -- Business
  (gen_random_uuid(), 'Sales', 'icon:shopping-bag', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Business'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Services', 'icon:tool', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Business'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Business'), NULL, NULL, now(), now()),

  -- Investments
  (gen_random_uuid(), 'Dividends', 'icon:coins', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Investments'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Interest', 'icon:percent', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Investments'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Capital gains', 'icon:trending-up', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Investments'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Investments'), NULL, NULL, now(), now()),

  -- Gifts
  (gen_random_uuid(), 'Family', 'icon:users', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Gifts'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Friends', 'icon:user', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Gifts'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Gifts'), NULL, NULL, now(), now()),

  -- Uncategorized
  (gen_random_uuid(), 'Refunds', 'icon:rotate-ccw', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Uncategorized Income'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Lottery', 'icon:star', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Uncategorized Income'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Uncategorized Income'), NULL, NULL, now(), now()),
  
  -- Transfer
  (gen_random_uuid(), 'Transfer', 'icon:transfer', 'TRANSFER', (SELECT id FROM parent_categories WHERE name = 'Transfer'), NULL, NULL, now(), now());