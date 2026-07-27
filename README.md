# AI Sales Assistant – Natural Language to SQL

An AI-powered web application that allows users to ask questions in natural language and receive answers generated from a SQL Server database. The application converts user questions into SQL queries using a Large Language Model (LLM), executes them on the AdventureWorks2022 database, and presents both the answer and interactive business dashboards.

---

## Features

- Natural Language to SQL using AI
- AI-generated business insights
- Interactive dashboard with charts and KPIs
- SQL Server integration (AdventureWorks2022)
- AI-generated SQL query visualization
- Chat history saved in browser (Local Storage)
- Modern React UI
- ASP.NET Core API
- FastAPI AI service
- Ollama Local LLM integration

---

## System Architecture

```
React (Vite)
      │
      ▼
ASP.NET Core API
      │
      ▼
FastAPI
      │
      ▼
Ollama (Qwen2.5-Coder 7B)
      │
      ▼
SQL Server (AdventureWorks2022)
```

---

## Technologies Used

### Frontend
- React
- Vite
- React Router
- Recharts
- CSS

### Backend
- ASP.NET Core Web API
- FastAPI
- Python

### AI
- Ollama
- Qwen2.5-Coder 7B

### Database
- Microsoft SQL Server
- AdventureWorks2022

---

## Project Structure

```
AI-Sales-Assistant
│
├── Frontend (React)
│   ├── Chat Page
│   ├── Dashboard
│   └── Charts
│
├── ASP.NET Core API
│   ├── Chat Endpoint
│   └── Dashboard Endpoint
│
├── FastAPI
│   ├── SQL Generation
│   ├── SQL Execution
│   ├── AI Response Generation
│   └── Dashboard Analytics
│
└── SQL Server
    └── AdventureWorks2022
```

---

## Dashboard

The dashboard provides:

- Total Customers
- Total Products
- Total Orders
- Total Revenue
- Average Order Value
- Monthly Revenue Chart
- Monthly Orders Chart
- Top Selling Products
- Product Categories
- Recent Orders

---

## Chat Examples

Example questions:

- Show all products that are out of stock.
- What is the total revenue?
- List the top 10 customers by sales.
- Show monthly sales.
- Which products have the highest inventory?
- How many orders were placed this year?

---

## API Endpoints

### Chat

```
POST /chat
```

Request

```json
{
    "question": "What is the total revenue?"
}
```

Response

```json
{
    "generated_sql": "...",
    "answer": "The total revenue is $..."
}
```

---

### Dashboard

```
GET /dashboard
```

Returns

- KPI Cards
- Revenue by Month
- Orders by Month
- Top Products
- Categories
- Recent Orders

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/AI-Sales-Assistant.git
```

---

### 2. Install Frontend

```bash
cd Frontend

npm install

npm run dev
```

Runs on

```
http://localhost:5173
```

---

### 3. Run ASP.NET Core

```bash
dotnet run
```

Runs on

```
http://localhost:5097
```

---

### 4. Run FastAPI

```bash
uvicorn main:app --reload
```

Runs on

```
http://localhost:8000
```

---

### 5. Start Ollama

```bash
ollama run qwen2.5-coder:7b
```

---

## Future Improvements

- User authentication
- Export reports to Excel/PDF
- Conversation history in database
- Role-based access
- Better SQL validation
- Streaming AI responses
- Docker deployment

---

## Screenshots

Add screenshots here:

![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)
---

## Author

**Hammami Souha**

Internship Project

AI Sales Assistant using React, ASP.NET Core, FastAPI, Ollama, and SQL Server.