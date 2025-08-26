# Database Migrations

This folder contains database migration scripts for the MCQ Master application.

## Structure

- `completed/` - Contains migrations that have been successfully applied to the database
- `pending/` - Contains new migrations that need to be applied (create this folder when needed)

## Migration History

### Completed Migrations

1. **001_add_answer_number_column.sql** - Added `answer_number` column to `question_answers` table
   - Adds answer numbering support (1-5)
   - Updates existing records with sequential numbers
   - Adds validation constraints

2. **002_cleanup_answer_text.js** - Cleanup script for answer text formatting
   - Removes extra whitespace from answer options
   - Standardizes text formatting

## Running Migrations

⚠️ **Important:** Migrations in the `completed/` folder have already been applied to the database. 
Do not run them again unless you're setting up a fresh database.

### For Fresh Database Setup
1. Run migrations in numerical order
2. Start with `001_` and proceed sequentially

### For Production
- Only run new migrations from `pending/` folder
- Test migrations on development environment first
- Backup database before applying migrations

## Notes

- All migrations are one-time operations
- Keep migration files for documentation and team collaboration
- Version numbers help maintain proper execution order
