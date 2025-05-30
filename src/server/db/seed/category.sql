-- Insert parent categories and capture their IDs
WITH parent_categories AS (
  INSERT INTO categories (id, name, icon, type, parent_id, group_id, user_id, created_at, updated_at)
  VALUES
    -- Expense categories
    (gen_random_uuid(), 'Housing', 'icon:home', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Utilities', 'icon:plug', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Food', 'icon:food', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Transportation', 'icon:car', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Health', 'icon:heart-pulse', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Family & Childcare', 'icon:users', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Education', 'icon:school', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Entertainment', 'icon:device-tv', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Personal & Lifestyle', 'icon:user', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Shopping', 'icon:shopping-cart', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Digital & Subscriptions', 'icon:cloud', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Banking & Fees', 'icon:wallet', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Other Expense', 'icon:circle-dashed', 'EXPENSE', NULL, NULL, NULL, now(), now()),

    -- Income categories
    (gen_random_uuid(), 'Salary & Wages', 'icon:coins', 'INCOME', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Business Income', 'icon:briefcase', 'INCOME', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Investment Income', 'icon:trending-up', 'INCOME', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Gifts & Transfers', 'icon:gift', 'INCOME', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Other Income', 'icon:dots-circle-horizontal', 'INCOME', NULL, NULL, NULL, now(), now()),

    -- Transfer categories
    (gen_random_uuid(), 'Transfers', 'icon:arrow-transfer', 'TRANSFER', NULL, NULL, NULL, now(), now())
  RETURNING id, name
)

-- Insert subcategories using parent category names
INSERT INTO categories (id, name, icon, type, parent_id, group_id, user_id, created_at, updated_at)
VALUES
  -- Expense subcategories
  (gen_random_uuid(), 'Rent/Mortgage', 'icon:building', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Housing'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Property Taxes', 'icon:currency-dollar', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Housing'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Home Insurance', 'icon:shield-check', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Housing'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'HOA Fees', 'icon:building-warehouse', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Housing'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Repairs & Maintenance', 'icon:tools', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Housing'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Housing', 'icon:circle-dashed', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Housing'), NULL, NULL, now(), now()),

  (gen_random_uuid(), 'Electricity', 'icon:plug', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Water & Sewer', 'icon:droplet', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Gas', 'icon:brand-gas', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Trash', 'icon:trash', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Internet', 'icon:wifi', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Phone', 'icon:device-mobile', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Utilities', 'icon:circle-dashed', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),

  (gen_random_uuid(), 'Groceries', 'icon:basket', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Food'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Dining Out', 'icon:chef-hat', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Food'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Coffee Shops', 'icon:cup', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Food'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Meal Delivery', 'icon:truck-delivery', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Food'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Food', 'icon:circle-dashed', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Food'), NULL, NULL, now(), now()),

  (gen_random_uuid(), 'Car Payment', 'icon:car', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Gas & Fuel', 'icon:fuel', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Car Insurance', 'icon:shield-car', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Public Transit', 'icon:bus', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Parking', 'icon:parking', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Tolls', 'icon:toll', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Repairs & Maintenance', 'icon:tools', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Vehicle Registration', 'icon:badge', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Transportation', 'icon:circle-dashed', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),

  (gen_random_uuid(), 'Health Insurance', 'icon:shield-medical', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Health'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Medical Bills', 'icon:hospital', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Health'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Prescriptions', 'icon:pill', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Health'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Dental', 'icon:tooth', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Health'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Vision', 'icon:eye', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Health'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Mental Health', 'icon:mood-smile', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Health'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Health', 'icon:circle-dashed', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Health'), NULL, NULL, now(), now()),

  (gen_random_uuid(), 'Childcare', 'icon:baby', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Family & Childcare'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Child Support', 'icon:users', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Family & Childcare'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Elder Care', 'icon:users', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Family & Childcare'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Tuition', 'icon:school', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Education'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Books & Supplies', 'icon:books', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Education'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Student Loans', 'icon:currency-dollar', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Education'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Education', 'icon:circle-dashed', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Education'), NULL, NULL, now(), now()),

  (gen_random_uuid(), 'Movies', 'icon:movie', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Concerts & Events', 'icon:ticket', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Video Games', 'icon:device-gamepad', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Streaming Services', 'icon:brand-netflix', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Entertainment', 'icon:circle-dashed', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),

  (gen_random_uuid(), 'Clothing', 'icon:t-shirt', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Personal & Lifestyle'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Hair & Grooming', 'icon:scissors', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Personal & Lifestyle'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Gym & Fitness', 'icon:dumbbell', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Personal & Lifestyle'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Laundry', 'icon:washing-machine', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Personal & Lifestyle'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Personal & Lifestyle', 'icon:circle-dashed', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Personal & Lifestyle'), NULL, NULL, now(), now()),

  (gen_random_uuid(), 'Household Supplies', 'icon:bottle', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Shopping'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Electronics', 'icon:devices', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Shopping'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Furniture', 'icon:chair', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Shopping'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Shopping', 'icon:circle-dashed', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Shopping'), NULL, NULL, now(), now()),

  (gen_random_uuid(), 'Domain Registration & Renewal', 'icon:certificate', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Digital & Subscriptions'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Pro Subscriptions', 'icon:star', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Digital & Subscriptions'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Digital & Subscriptions', 'icon:circle-dashed', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Digital & Subscriptions'), NULL, NULL, now(), now()),

  (gen_random_uuid(), 'Bank Fees', 'icon:currency-dollar', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Banking & Fees'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Banking & Fees', 'icon:circle-dashed', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Banking & Fees'), NULL, NULL, now(), now()),

  (gen_random_uuid(), 'Other Expense', 'icon:circle-dashed', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Other Expense'), NULL, NULL, now(), now()),

  -- Income subcategories
  (gen_random_uuid(), 'Regular Salary', 'icon:coins', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Salary & Wages'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Bonus & Overtime', 'icon:gift', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Salary & Wages'), NULL, NULL, now(), now()),

  (gen_random_uuid(), 'Freelance & Consulting', 'icon:briefcase', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Business Income'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Business Profits', 'icon:cash', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Business Income'), NULL, NULL, now(), now()),

  (gen_random_uuid(), 'Dividends', 'icon:trending-up', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Investment Income'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Interest', 'icon:currency-dollar', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Investment Income'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Capital Gains', 'icon:chart-line', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Investment Income'), NULL, NULL, now(), now()),

  (gen_random_uuid(), 'Gifts', 'icon:gift', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Gifts & Transfers'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Lottery', 'icon:dice', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Gifts & Transfers'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Gifts & Transfers', 'icon:circle-dashed', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Gifts & Transfers'), NULL, NULL, now(), now()),

  (gen_random_uuid(), 'Other Income', 'icon:dots-circle-horizontal', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Other Income'), NULL, NULL, now(), now()),

  -- Transfer subcategories
  (gen_random_uuid(), 'Between Checking & Savings', 'icon:arrows-left-right', 'TRANSFER', (SELECT id FROM parent_categories WHERE name = 'Transfers'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'To Investment Accounts', 'icon:arrow-up-right', 'TRANSFER', (SELECT id FROM parent_categories WHERE name = 'Transfers'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'To Credit Card Payments', 'icon:credit-card', 'TRANSFER', (SELECT id FROM parent_categories WHERE name = 'Transfers'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'From Credit Card Credits/Refunds', 'icon:arrow-up-left', 'TRANSFER', (SELECT id FROM parent_categories WHERE name = 'Transfers'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Transfers', 'icon:circle-dashed', 'TRANSFER', (SELECT id FROM parent_categories WHERE name = 'Transfers'), NULL, NULL, now(), now());
