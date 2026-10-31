-- Seed data (docs/data-model.md → Seed data). Runs once per database. Colors from docs/design-system.md.
INSERT INTO `accounts` (`id`, `name`, `color`, `icon`, `sort_order`) VALUES
	(1, 'Bank', 'slate', 'bank', 0),
	(2, 'Cash', 'green', 'wallet', 1),
	(3, 'bKash', 'rose', 'mobile', 2);
--> statement-breakpoint
INSERT INTO `categories` (`id`, `name`, `kind`, `color`, `sort_order`) VALUES
	(1, 'Rent', 'expense', 'indigo', 0),
	(2, 'Food', 'expense', 'amber', 1),
	(3, 'Electricity & Bills', 'expense', 'slate', 2),
	(4, 'Travel', 'expense', 'sky', 3),
	(5, 'Shopping', 'expense', 'rose', 4),
	(6, 'Health', 'expense', 'teal', 5),
	(7, 'Family', 'expense', 'purple', 6),
	(8, 'Other', 'expense', 'gray', 7),
	(9, 'Salary', 'income', 'green', 0),
	(10, 'Other Income', 'income', 'teal', 1);
