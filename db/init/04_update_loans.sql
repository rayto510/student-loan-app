ALTER TABLE loans ADD COLUMN balance NUMERIC(12,2);
UPDATE loans SET balance = amount WHERE balance IS NULL;