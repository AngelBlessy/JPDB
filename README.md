# Student Enrollment Form Using JsonPowerDB

## Table of Contents

1. [Title of the Project](#title-of-the-project)
2. [Description](#description)
3. [Benefits of using JsonPowerDB](#benefits-of-using-jsonpowerdb)
4. [Scope of Functionalities](#scope-of-functionalities)
5. [Illustration](#illustration)
6. [Examples of Use](#examples-of-use)
7. [Evaluator Instructions](#evaluator-instructions)
8. [Project Status](#project-status)
9. [Release History](#release-history)
10. [Sources](#sources)

## Title of the Project

Student Enrollment Form that stores and updates student records in JsonPowerDB.

## Description

This micro project implements a Student Enrollment Form for the SCHOOL-DB database and STUDENT-TABLE relation.

- Database Name: SCHOOL-DB
- Relation Name: STUDENT-TABLE
- Primary Key: Roll-No
- Input Fields: Roll-No, Full-Name, Class, Birth-Date, Address, Enrollment-Date

The form follows the required assignment workflow:

1. On page load, only Roll-No is enabled and cursor is focused on Roll-No.
2. If Roll-No does not exist in database, user can enter full data and Save.
3. If Roll-No exists, data is fetched, Roll-No is locked, and user can Update remaining fields.
4. Reset returns form to initial state.
5. Validation prevents save/update with empty fields.

## Benefits of using JsonPowerDB

1. Simple REST API based access for fast integration with frontend forms.
2. No complex DB setup required for basic CRUD operations.
3. High performance key-based retrieval (useful for primary key search like Roll-No).
4. Lightweight and developer-friendly for micro projects.
5. Easy cloud-hosted data access for demonstration and evaluation.

## Scope of Functionalities

1. Primary key lookup using Roll-No.
2. Save a new student record to JsonPowerDB.
3. Update an existing student record.
4. Reset form state and controls.
5. Field-level validation for mandatory inputs.
6. Clear runtime messages for success/error states.

## Illustration

Main files in this project:

- [index.html](index.html): UI structure for Student Enrollment Form
- [styles.css](styles.css): Styling for form layout and controls
- [app.js](app.js): JsonPowerDB logic for key-check, save, update, reset, and validation

## Examples of Use

1. Open [index.html](index.html).
2. Paste JPDB connection token in the JPDB Token field.
3. Enter Roll-No and move out of the field.
4. For a new Roll-No, fill all fields and click Save.
5. For an existing Roll-No, modify details and click Update.
6. Click Reset to return to initial form state.

## Evaluator Instructions

1. Open [demo.html](demo.html) first.
2. This validates the complete form workflow (Save/Update/Reset/state logic) without requiring any token.
3. For JsonPowerDB cloud verification, open [index.html](index.html).
4. Use your own JPDB account token by logging in to JPDB and generating a connection token from Tools -> Tokens.
5. Paste that token in the JPDB Token input field and test Save/Update flow.

## Project Status

Completed and working.

- Save operation: Working
- Update operation: Working
- Reset and control-flow logic: Working
- JsonPowerDB integration: Working

## Release History

- v1.0.0 - Initial Student Enrollment Form with Save, Update, Reset, and validation workflow.
- v1.1.0 - Integrated JsonPowerDB API flow for primary key lookup, insert, and update.
- v1.2.0 - Improved UX behavior, token-based runtime input, and assignment-aligned form control states.

## Sources

1. Writing a good readme: https://guides.github.com/features/mastering-markdown/
2. Template example: https://github.com/dbader/readme-template
3. README example: https://github.com/amitmerchant1990/electron-markdownify#readme
4. JsonPowerDB example: https://github.com/BeAgarwal/JsonPowerDB#readme
