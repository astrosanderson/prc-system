# PRC System – Football League Management Platform

## Project Overview

This project is a web-based football league management system designed to manage academies, players, and competition data.

The system allows:

* Academy representatives to register and manage players
* Viewing of player profiles and competition data
* Admin-level access for oversight (optional)

---

## Tech Stack

* HTML, CSS, JavaScript
* Bootstrap (for UI styling)
* Firebase (for backend: authentication, database, storage)

---

## Project Structure

```
prc-system/
│
├── index.html              # Login page
├── dashboard.html          # Academies dashboard
├── players.html            # Players list
├── profile.html            # Player profile page
├── data.html               # Data center (awards, winners)
│
├── css/
│   ├── main.css            # Global styles
│   └── components.css      # Reusable UI components
│
├── js/
│   ├── app.js              # Main entry point
│   ├── config.js           # Firebase configuration
│   ├── auth.js             # Authentication logic
│   ├── db.js               # Database operations
│   ├── players.js          # Player-related logic
│   └── ui.js               # UI rendering logic
│
├── components/
│   ├── navbar.html
│   └── footer.html
│
├── data/
│   ├── players.json
│   ├── academies.json
│   └── awards.json
│
├── assets/
│   ├── images/
│   └── docs/
│
└── README.md
```

---

## Team Structure

The team is divided into 4 groups:

### Core Dev Team

* Handles Firebase setup, authentication, and database
* Connects frontend to backend

### Frontend Team

* Builds UI pages using HTML, CSS, and Bootstrap
* Each member is assigned one HTML file

### UI/UX Team (merged into frontend team)

* Defines design system (colors, layout, consistency)
* Ensures all pages follow the same style

### Data & Content Team (merged into backend team)

* Generates and structures data (players, academies, awards)
* Provides JSON files for testing and integration

---

## Git Workflow

### Branch Structure

* `main` → Final stable version (DO NOT push directly)
* `dev` → Development branch (integration branch)

All work must go through feature branches.

---

## Branch Naming Convention

Use the format:

```
name-task
```

### Examples:

```
henry-login-page
daniel-dashboard
```

---

## How to Work (Step-by-Step)

### 1. Clone Repository

```
git clone https://github.com/astrosanderson/prc-system.git
cd prc-system
```

---

### 2. Switch to dev branch

```
git checkout dev
git pull origin dev
```

---

### 3. Create Your Branch

```
git checkout -b yourname-task
```

Example:

```
git checkout -b john-login-page
```

---

### 4. Do Your Work

* Only work on your assigned file
* Follow naming conventions

---

### 5. Commit Changes

```
git add .
git commit -m "Added login page UI"
```

---

### 6. Push Your Branch

```
git push origin yourname-task
```

---

### 7. Create Pull Request (PR)

* Go to GitHub
* Open Pull Request → target branch: `dev`

---

### 8. Review & Merge

* Project lead reviews your code
* If approved → merged into `dev`

---

### 9. Final Merge

* Only the project lead merges `dev` → `main`

---

## Rules

### DO NOT:

* Push directly to `main` or `dev`
* Edit someone else’s file
* Rename files or IDs without approval

### ALWAYS:

* Create your own branch
* Pull latest changes before starting
* Use correct naming conventions
* Keep commits small and clear

---

## Naming Conventions

### Files

* lowercase
* no spaces

### CSS Classes

* kebab-case
  Example: `player-card`

### HTML IDs

* camelCase
  Example: `playerName`

### JavaScript Variables

* camelCase
  Example: `playerList`

---

## Development Workflow Summary

```
feature branch → dev → main
```

* Work in your branch
* Submit PR to `dev`
* Lead reviews and merges
* Final version goes to `main`

---

## Final Note

This project focuses on building a **functional system**, not just a design.

Consistency, communication, and structure are key to success.
