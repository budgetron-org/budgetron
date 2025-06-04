-- Insert parent categories and capture their IDs
WITH parent_categories AS (
  INSERT INTO categories (id, name, icon, type, parent_id, group_id, user_id, created_at, updated_at)
  VALUES
    -- Expense categories
    (gen_random_uuid(), 'Housing', 'icon:home', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Utilities', 'icon:plug', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Food', 'icon:salad', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Transportation', 'icon:car', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Health', 'icon:heart-rate-monitor', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Family & Childcare', 'icon:users', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Education', 'icon:school', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Entertainment', 'icon:confetti', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Personal & Lifestyle', 'icon:user', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Shopping', 'icon:shopping-bag', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Digital & Subscriptions', 'icon:device-desktop', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Banking & Fees', 'icon:building-bank', 'EXPENSE', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Other Expense', 'icon:circle-dashed', 'EXPENSE', NULL, NULL, NULL, now(), now()),

    -- Income categories
    (gen_random_uuid(), 'Salary & Wages', 'icon:currency-dollar', 'INCOME', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Business Income', 'icon:briefcase', 'INCOME', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Investment Income', 'icon:chart-bar', 'INCOME', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Gifts & Transfers', 'icon:gift', 'INCOME', NULL, NULL, NULL, now(), now()),
    (gen_random_uuid(), 'Other Income', 'icon:circle-dashed', 'INCOME', NULL, NULL, NULL, now(), now()),

    -- Transfer categories
    (gen_random_uuid(), 'Transfers', 'icon:arrows-left-right', 'TRANSFER', NULL, NULL, NULL, now(), now())
  RETURNING id, name
)

-- Insert subcategories using parent category names
INSERT INTO categories (id, name, icon, type, parent_id, group_id, user_id, created_at, updated_at)
VALUES
  -- Expense categories
  -- Insert Housing subcategories
  (gen_random_uuid(), 'Rent/Mortgage', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Housing'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Property Taxes', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Housing'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Home Insurance', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Housing'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'HOA Fees', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Housing'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Repairs & Maintenance', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Housing'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Housing', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Housing'), NULL, NULL, now(), now()),

  -- Insert Utilities subcategories
  (gen_random_uuid(), 'Electricity', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Water & Sewer', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Gas/Heat', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Trash', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Internet', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Phone', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Utilities', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Utilities'), NULL, NULL, now(), now()),

  -- Insert Food subcategories
  (gen_random_uuid(), 'Groceries', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Food'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Dining Out', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Food'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Coffee Shops', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Food'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Meal Delivery', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Food'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Food', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Food'), NULL, NULL, now(), now()),

  -- Insert Transportation subcategories
  (gen_random_uuid(), 'Car Payment', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Gas & Fuel', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Car Insurance', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Public Transit', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Parking', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Tolls', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Repairs & Maintenance', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Vehicle Registration', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Transportation', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Transportation'), NULL, NULL, now(), now()),

  -- Insert Health subcategories
  (gen_random_uuid(), 'Health Insurance', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Health'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Medical Bills', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Health'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Prescriptions', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Health'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Dental', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Health'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Vision', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Health'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Mental Health', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Health'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Health', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Health'), NULL, NULL, now(), now()),

  -- Insert Family & Childcare subcategories
  (gen_random_uuid(), 'Childcare', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Family & Childcare'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'School Supplies', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Family & Childcare'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Kids’ Activities', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Family & Childcare'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Baby Supplies', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Family & Childcare'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Child Support', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Family & Childcare'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Family & Childcare', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Family & Childcare'), NULL, NULL, now(), now()),

  -- Insert Education subcategories
  (gen_random_uuid(), 'Tuition', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Education'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Books & Supplies', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Education'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Online Courses', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Education'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Education', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Education'), NULL, NULL, now(), now()),

  -- Insert Entertainment subcategories
  (gen_random_uuid(), 'Streaming Services', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Movies', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Hobbies', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Events', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Video Games', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Vacations', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Entertainment', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Entertainment'), NULL, NULL, now(), now()),

  -- Insert Personal & Lifestyle subcategories
  (gen_random_uuid(), 'Clothing', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Personal & Lifestyle'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Haircuts & Beauty', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Personal & Lifestyle'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Fitness & Gym', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Personal & Lifestyle'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Gifts', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Personal & Lifestyle'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Donations', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Personal & Lifestyle'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Pet Care', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Personal & Lifestyle'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Laundry & Dry Cleaning', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Personal & Lifestyle'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Personal & Lifestyle', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Personal & Lifestyle'), NULL, NULL, now(), now()),

  -- Insert Shopping subcategories
  (gen_random_uuid(), 'Household Supplies', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Shopping'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Electronics', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Shopping'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Furniture', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Shopping'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Appliances', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Shopping'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Tools & Hardware', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Shopping'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Shopping', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Shopping'), NULL, NULL, now(), now()),

  -- Insert Digital & Subscriptions subcategories
  (gen_random_uuid(), 'Domain Registration & Hosting', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Digital & Subscriptions'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Cloud Storage & Backup', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Digital & Subscriptions'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Software & App Subscriptions', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Digital & Subscriptions'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'AI & SaaS Services', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Digital & Subscriptions'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Digital & Subscriptions', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Digital & Subscriptions'), NULL, NULL, now(), now()),

  -- Insert Banking & Fees subcategories
  (gen_random_uuid(), 'Bank Fees', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Banking & Fees'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'ATM Fees', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Banking & Fees'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Overdraft Fees', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Banking & Fees'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Banking & Fees', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Banking & Fees'), NULL, NULL, now(), now()),

  -- Insert Other Expense subcategories
  (gen_random_uuid(), 'Miscellaneous', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Other Expense'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Taxes', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Other Expense'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'To Be Categorized', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Other Expense'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other', 'icon:dots', 'EXPENSE', (SELECT id FROM parent_categories WHERE name = 'Other Expense'), NULL, NULL, now(), now()),


  -- Income categories
  -- Insert Salary & Wages subcategories
  (gen_random_uuid(), 'Primary Job', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Salary & Wages'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Secondary Job', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Salary & Wages'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Bonuses & Commissions', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Salary & Wages'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Overtime', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Salary & Wages'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Salary & Wages', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Salary & Wages'), NULL, NULL, now(), now()),

  -- Insert Business Income subcategories
  (gen_random_uuid(), 'Self-Employment', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Business Income'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Freelance / Contract', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Business Income'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Business Profits', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Business Income'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Business Income', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Business Income'), NULL, NULL, now(), now()),

  -- Insert Investment Income subcategories
  (gen_random_uuid(), 'Dividends', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Investment Income'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Interest', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Investment Income'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Capital Gains', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Investment Income'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Rental Income', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Investment Income'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Investment Income', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Investment Income'), NULL, NULL, now(), now()),

  -- Insert Gifts & Transfers subcategories
  (gen_random_uuid(), 'Gifts Received', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Gifts & Transfers'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Inheritance', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Gifts & Transfers'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Tax Refunds', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Gifts & Transfers'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Gifts & Transfers', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Gifts & Transfers'), NULL, NULL, now(), now()),

  -- Insert Other Income subcategories
  (gen_random_uuid(), 'Government Benefits', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Other Income'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Scholarships & Grants', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Other Income'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Refunds & Rebates', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Other Income'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Lottery', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Other Income'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Miscellaneous Income', 'icon:dots', 'INCOME', (SELECT id FROM parent_categories WHERE name = 'Other Income'), NULL, NULL, now(), now()),

  -- Transfer categories
  -- Insert Transfers subcategories
  (gen_random_uuid(), 'Between Checking & Savings', 'icon:arrows-left-right', 'TRANSFER', (SELECT id FROM parent_categories WHERE name = 'Transfers'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'To Investment Accounts', 'icon:chart-line', 'TRANSFER', (SELECT id FROM parent_categories WHERE name = 'Transfers'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'To Credit Card Payments', 'icon:credit-card', 'TRANSFER', (SELECT id FROM parent_categories WHERE name = 'Transfers'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'From Credit Card Credits/Refunds', 'icon:arrow-left-right', 'TRANSFER', (SELECT id FROM parent_categories WHERE name = 'Transfers'), NULL, NULL, now(), now()),
  (gen_random_uuid(), 'Other Transfers', 'icon:dots', 'TRANSFER', (SELECT id FROM parent_categories WHERE name = 'Transfers'), NULL, NULL, now(), now());
