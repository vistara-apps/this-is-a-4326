# AdSpark AI - Generate & Test Ad Creative Variations Instantly

AdSpark AI is a powerful web application that helps marketers and creators generate multiple ad creative variations from a single product image using AI, and automatically test them on social media platforms like Instagram and TikTok.

## 🚀 Features

### Core Features
- **AI-Powered Ad Generation**: Upload a single product image and generate 3-5 distinct ad creative variations with AI-generated visuals and copy
- **Platform-Specific Optimization**: Automatically adapt generated ads for TikTok and Instagram formats and best practices
- **Automated Test Posting**: Seamlessly publish generated variations to designated test accounts for performance monitoring

### Additional Features
- **User Authentication**: Secure sign-up/sign-in with Supabase Auth
- **Project Management**: Organize and track your ad generation projects
- **Real-time Generation**: Watch as AI creates your ad variations in real-time
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Modern UI**: Beautiful, intuitive interface with smooth animations

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### Backend & Services
- **Supabase** - Backend-as-a-Service for database, auth, and storage
- **OpenAI API** - AI-powered image analysis and text generation
- **Instagram Graph API** - Social media posting integration
- **TikTok API** - Social media posting integration

### Database
- **PostgreSQL** (via Supabase) - Robust relational database
- **Row Level Security** - Secure data access policies

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Supabase account and project
- An OpenAI API key
- (Optional) Instagram and TikTok developer accounts for social media posting

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/vistara-apps/this-is-a-4326.git
cd this-is-a-4326
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Copy the example environment file and fill in your credentials:
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Social Media API Keys (Optional)
VITE_INSTAGRAM_CLIENT_ID=your_instagram_client_id
VITE_INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
VITE_TIKTOK_CLIENT_ID=your_tiktok_client_id
VITE_TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
```

### 4. Set Up Database
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Run the SQL to create all necessary tables and policies

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── AdConfigurator.jsx
│   ├── CreativePreview.jsx
│   ├── Dashboard.jsx
│   ├── Header.jsx
│   ├── ImageUploader.jsx
│   ├── LoadingSpinner.jsx
│   ├── ProjectGenerator.jsx
│   ├── RecentProjects.jsx
│   ├── Sidebar.jsx
│   ├── StatsCard.jsx
│   └── TestManager.jsx
├── context/             # React context providers
│   ├── AppContext.jsx   # Main app state
│   └── AuthContext.jsx  # Authentication state
├── services/            # API and service integrations
│   ├── openai.js        # OpenAI API integration
│   ├── socialMedia.js   # Social media APIs
│   └── supabase.js      # Supabase client and helpers
├── App.jsx              # Main app component
├── main.jsx             # App entry point
└── index.css            # Global styles
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the SQL schema from `database-schema.sql`
3. Set up storage buckets for images
4. Configure authentication providers if needed

### OpenAI Setup
1. Get an API key from OpenAI
2. Add it to your environment variables
3. Monitor usage to stay within limits

### Social Media APIs (Optional)
For production social media posting:
1. Set up Instagram Developer Account
2. Set up TikTok Developer Account
3. Configure OAuth flows
4. Add credentials to environment variables

## 🎯 Usage

### Basic Workflow
1. **Sign Up/Sign In**: Create an account or sign in to existing one
2. **Upload Product Image**: Go to "Generate" and upload your product image
3. **Configure Settings**: Choose platforms, number of variations, and ad type
4. **Generate Variations**: Let AI create multiple ad variations
5. **Review & Edit**: Review generated content and make adjustments
6. **Test Post**: (Optional) Post to test social media accounts
7. **Analyze Performance**: Track how your variations perform

### Subscription Tiers
- **Free**: 5 generations/month, 2 test posts/month
- **Pro ($29/mo)**: 50 generations/month, 10 test posts/month
- **Premium ($79/mo)**: Unlimited generations, 50 test posts/month

## 🔒 Security

- **Row Level Security**: Database access is secured with RLS policies
- **Authentication**: Secure user authentication via Supabase Auth
- **API Key Protection**: Sensitive API keys are server-side only in production
- **Data Encryption**: All data is encrypted in transit and at rest

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Docker
```bash
# Build the image
docker build -t adspark-ai .

# Run the container
docker run -p 3000:3000 adspark-ai
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 API Documentation

### OpenAI Integration
- **Image Analysis**: Analyze product images to extract key information
- **Ad Copy Generation**: Generate platform-specific ad copy variations
- **Hashtag Generation**: Create relevant hashtags for each platform

### Supabase Integration
- **Authentication**: User sign-up, sign-in, and session management
- **Database**: Store projects, variations, and test posts
- **Storage**: Upload and manage product images and generated assets

### Social Media APIs
- **Instagram**: Post images with captions to test accounts
- **TikTok**: Post videos with descriptions to test accounts

## 🐛 Troubleshooting

### Common Issues

**"Missing environment variables" error**
- Ensure all required environment variables are set in `.env`
- Check that variable names match exactly (including `VITE_` prefix)

**Database connection issues**
- Verify Supabase URL and anon key are correct
- Check that database schema has been applied
- Ensure RLS policies are properly configured

**OpenAI API errors**
- Verify API key is valid and has sufficient credits
- Check rate limits and usage quotas
- Ensure proper error handling is in place

**Social media posting fails**
- Verify API credentials are correct
- Check that test accounts are properly configured
- Ensure content meets platform requirements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing powerful AI capabilities
- Supabase for excellent backend-as-a-service
- The React and Vite communities for amazing tools
- All contributors who help improve this project

## 📞 Support

For support, please:
1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Contact us at support@adspark-ai.com

---

**Built with ❤️ by the AdSpark AI team**
