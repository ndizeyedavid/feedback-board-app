# GTA VI Feedback Board

A community-driven feedback platform for GTA VI built with Next.js, Prisma, and PostgreSQL.

## Features

- 🎮 **GTA VI Specific Categories**: Gameplay, Story, Graphics, Multiplayer, Mechanics, World Design
- 👍 **Upvoting System**: Vote on feedback with duplicate prevention
- 💬 **Comment System**: Discuss feedback with the community
- 🔍 **Search & Filter**: Find feedback by category, keywords, and sort options
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎨 **Modern UI**: Clean design with Tailwind CSS and Radix UI components
- 🗄️ **Database Integration**: PostgreSQL with Prisma ORM
- ⚡ **Real-time Updates**: Toast notifications for user actions

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod
- **Animations**: Canvas Confetti, Custom CSS animations
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd feedback-board-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your database URL:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/gta_feedback_db"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with sample data (optional)
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Scripts

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with sample data

## API Endpoints

### Feedback
- `GET /api/feedback` - Get all feedback (with filtering/sorting)
- `POST /api/feedback` - Create new feedback

### Upvotes
- `POST /api/feedback/[id]/upvote` - Toggle upvote on feedback

### Comments
- `POST /api/feedback/[id]/comments` - Add comment to feedback

### Users
- `GET /api/user/[username]/upvotes` - Get user's upvoted feedback IDs

## Database Schema

### Models
- **User**: Username, email, timestamps
- **Feedback**: Title, description, category, upvote count, author
- **Comment**: Content, author, feedback relation
- **Upvote**: User-feedback relationship (unique constraint)

### Categories
- GAMEPLAY - Core game mechanics and controls
- STORY - Narrative, characters, and missions
- GRAPHICS - Visual effects and art style
- MULTIPLAYER - Online modes and features
- MECHANICS - Game systems and physics
- WORLD - Open world design and activities

## Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── BG/                  # Background components
│   ├── FeedbackCard.tsx     # Feedback card component
│   ├── FeedbackForm.tsx     # Feedback submission form
│   ├── FeedbackFilters.tsx  # Search and filter controls
│   ├── CommentSection.tsx   # Comment display and form
│   └── ViewToggle.tsx       # Card/List view toggle
├── types/
│   └── feedback.ts          # TypeScript type definitions
└── lib/
    ├── api.ts               # Frontend API client
    ├── prisma.ts            # Prisma client configuration
    └── utils.ts             # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
