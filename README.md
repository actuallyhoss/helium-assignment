# Localization Management System

A full-stack translation management application built with Next.js, FastAPI, and Supabase.

## Tech Stack

- Frontend: Next.js 14 + TypeScript + React Query + Zustand
- Backend: FastAPI + Python
- Database: Supabase PostgreSQL

## Setup

### Environment Variables

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=https://aeghwonjskklbwufmgbw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon-key
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

**Backend** (`api/.env`):
```
SUPABASE_SERVICE_KEY=service-role-key
```

### Installation & Running

1. **Backend**:
```bash
cd api
pip install -r requirements.txt
python -m uvicorn src.localization_management_api.main:app --reload
```

2. **Frontend**:
```bash
cd frontend
npm install
npm run dev
```

## Features

- Translation key management with search/filter
- Inline editing of translations
- Project and language selection
- Bulk updates and export functionality
- Real-time completion statistics

## Endpoints

- `GET /translation-keys` - List translation keys
- `POST /translation-keys` - Create translation key
- `PUT /translation-keys/{id}` - Update translation
- `POST /translation-keys/bulk-update` - Bulk updates
- `GET /analytics/completion` - Translation stats

Access the app at http://localhost:3000 and API docs at http://127.0.0.1:8000/docs 