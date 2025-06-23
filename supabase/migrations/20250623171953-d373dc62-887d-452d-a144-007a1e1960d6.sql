
-- Make title field optional in complaints table since the form doesn't collect it separately
ALTER TABLE complaints ALTER COLUMN title DROP NOT NULL;
