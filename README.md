# DocQA

A powerful document question-answering application that allows you to generate Q&A sets and chat with your PDF documents using AI.

## 🚀 Features

- **PDF Document Upload**: Upload and process PDF files with automatic text extraction
- **AI-Powered Q&A Generation**: Generate custom question sets from your documents
  - **Subjective Questions**: Detailed questions with comprehensive answers
  - **Multiple Choice Questions (MCQ)**: Questions with options, correct answers, and explanations
- **Interactive Chat**: Ask specific questions about your documents and get AI-powered responses
- **Vector Search**: Advanced semantic search using Pinecone vector database
- **User Authentication**: Secure authentication with Kinde
- **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS
- **Real-time Processing**: Stream responses for better user experience

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Kinde Auth
- **Database**: PostgreSQL with Prisma ORM
- **Vector Database**: Pinecone
- **AI/ML**: OpenAI GPT-4, LangChain
- **File Upload**: UploadThing
- **State Management**: tRPC, React Query
- **PDF Processing**: pdf-parse, react-pdf

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- PostgreSQL database
- OpenAI API key
- Pinecone API key
- Kinde Auth account
- UploadThing account

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd DocQA
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/docqa"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Pinecone
PINECONE_API_KEY="your-pinecone-api-key"
PINECONE_ENVIRONMENT="your-pinecone-environment"

# Kinde Auth
KINDE_CLIENT_ID="your-kinde-client-id"
KINDE_CLIENT_SECRET="your-kinde-client-secret"
KINDE_ISSUER_URL="your-kinde-issuer-url"
KINDE_SITE_URL="http://localhost:3000"
KINDE_POST_LOGOUT_REDIRECT_URL="http://localhost:3000"
KINDE_POST_LOGIN_REDIRECT_URL="http://localhost:3000"

# UploadThing
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Next.js
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) View your database with Prisma Studio
npx prisma studio
```

### 5. Start the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📖 How to Use

### 1. Sign Up/Login
- Create an account or sign in using Kinde authentication
- You'll be redirected to the dashboard after successful authentication

### 2. Upload Documents
- Click the "Upload" button in the dashboard
- Select a PDF file from your device
- The file will be processed and indexed for search

### 3. Generate Q&A Sets
- Click on any uploaded file to open the document viewer
- Use the Q&A generation feature to create custom question sets
- Choose between subjective questions or multiple choice questions
- Specify the number of questions you want to generate

### 4. Chat with Documents
- Ask specific questions about your documents
- Get AI-powered responses based on the document content
- View conversation history

## 🏗️ Project Structure

```
DocQA/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard pages
│   │   └── auth-callback/  # Authentication callback
│   ├── components/         # React components
│   │   ├── chat/          # Chat-related components
│   │   ├── ui/            # Reusable UI components
│   │   └── ...            # Other components
│   ├── lib/               # Utility libraries
│   ├── db/                # Database configuration
│   ├── trpc/              # tRPC configuration
│   └── types/             # TypeScript type definitions
├── prisma/                # Database schema and migrations
├── public/                # Static assets
└── ...
```

## 🔧 API Endpoints

- `POST /api/generateqna` - Generate Q&A sets from documents
- `POST /api/message` - Handle chat messages
- `POST /api/uploadthing` - File upload handling
- `GET /api/trpc/*` - tRPC API routes

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**DocQA** - Making document interaction smarter with AI! 🚀
