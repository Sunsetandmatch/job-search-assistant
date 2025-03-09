# AI Job Search Assistant

A modern, AI-powered job search assistant that helps users find relevant job opportunities based on their LinkedIn profile and preferences. Built with Next.js, Firebase, and Make.com integration.

## Features

- 🤖 AI-powered job recommendations
- 🔐 Secure email-based authentication
- 💼 LinkedIn profile integration
- 💬 ChatGPT-style conversational interface
- 🌓 Dark/light mode support
- 📱 Responsive design
- 📋 Job listings sidebar
- 🔄 Real-time updates

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Authentication**: Firebase Auth (Magic Link)
- **Database**: Firebase Firestore
- **API Integration**: Make.com webhook
- **Styling**: shadcn/ui components
- **State Management**: React Context
- **Theme**: next-themes

## Prerequisites

1. Node.js 18.17 or later
2. Firebase account and project
3. Make.com account and scenario setup

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Make.com Webhook
NEXT_PUBLIC_MAKE_WEBHOOK_URL=your_webhook_url
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/job-search-assistant.git
   cd job-search-assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a new Firebase project
   - Enable Authentication with Email Link (passwordless) sign-in
   - Create a Firestore database
   - Add your Firebase config to `.env.local`

4. Set up Make.com:
   - Create a new scenario
   - Add the webhook trigger
   - Configure the scenario to process job search requests
   - Add the webhook URL to `.env.local`

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Make.com Scenario Setup

The Make.com scenario should:

1. Receive webhook requests with:
   - User message
   - LinkedIn profile URL
   - User preferences

2. Process the data to:
   - Extract job preferences
   - Search for relevant jobs
   - Generate AI responses

3. Return:
   - AI response message
   - Job listings
   - Updated user preferences

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT License - feel free to use this project for your own purposes. 