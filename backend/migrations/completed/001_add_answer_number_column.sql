-- Migration to add answer_number column to question_answers table
-- Run this SQL command in your PostgreSQL database

ALTER TABLE question_answers 
ADD COLUMN answer_number INTEGER DEFAULT 1;

-- Update existing records to set answer_number based on their order
-- This script assumes you want to number them based on their creation order (id)
UPDATE question_answers 
SET answer_number = (
  SELECT ROW_NUMBER() OVER (PARTITION BY question_id ORDER BY id)
  FROM question_answers qa2 
  WHERE qa2.id = question_answers.id
);

-- Make answer_number NOT NULL after setting values
ALTER TABLE question_answers 
ALTER COLUMN answer_number SET NOT NULL;

-- Optionally, add a check constraint to ensure answer_number is between 1 and 5
ALTER TABLE question_answers 
ADD CONSTRAINT chk_answer_number CHECK (answer_number >= 1 AND answer_number <= 5);
