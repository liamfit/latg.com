# Lunar and the Groove - Official Website

A modern, responsive website for the funk & soul band "Lunar and the Groove" built with React, TypeScript, and Tailwind CSS. The site dynamically fetches gig data from the band's Facebook page.

## Features

- 🎵 **Band Information** - Meet the band members and learn about their instruments
- 📅 **Dynamic Gig Calendar** - Automatically fetches upcoming performances from Facebook
- 📍 **Interactive Maps** - Click on venue locations to open Google Maps
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ♿ **Accessibility** - Built with accessibility best practices
- ⚡ **Fast Performance** - Optimized with Vite and modern React patterns
- 🔄 **Real-time Data** - Gigs are fetched from Facebook Events API
- 🧪 **Testing Mode** - Toggle between real and mock data for development

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: React Icons
- **Carousel**: React Slick
- **Build Tool**: Vite
- **Linting**: ESLint with TypeScript support

### Backend
- **Serverless**: AWS Lambda with SAM
- **API**: API Gateway with 24-hour caching
- **Data Source**: Facebook Graph API
- **Secrets**: AWS Systems Manager Parameter Store
- **Geocoding**: Postcodes.io API for UK postcodes

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- AWS CLI configured with appropriate credentials
- AWS SAM CLI
- Facebook Developer Account (for gig data)

### Frontend Development

1. Clone the repository:
```bash
git clone <repository-url>
cd latg.com
```

2. Install dependencies:
```bash
cd frontend
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Backend Development

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
cd fetch-gigs
npm install
```

3. Start the local API:
```bash
sam local start-api
```

4. The API will be available at `http://localhost:3000/gigs`

### Available Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run type-check` - Run TypeScript type checking

#### Backend
- `sam build` - Build the Lambda function
- `sam local start-api` - Start local API Gateway
- `sam deploy` - Deploy to AWS

## Project Structure

```
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Navbar.tsx      # Navigation component
│   │   │   ├── Hero.tsx        # Homepage hero section
│   │   │   ├── BandGallery.tsx # Band members gallery
│   │   │   ├── BandMemberCard.tsx # Individual band member card
│   │   │   ├── GigCarousel.tsx # Gigs carousel with API integration
│   │   │   └── GigCard.tsx     # Individual gig card with maps integration
│   │   ├── pages/          # Page components
│   │   ├── data/           # Static data
│   │   ├── types/          # TypeScript type definitions
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Utility functions including mock data
│   └── package.json
├── backend/            # AWS SAM backend
│   ├── fetch-gigs/     # Lambda function
│   │   ├── app.js      # Main Lambda handler
│   │   └── package.json
│   ├── template.yaml   # SAM template
│   └── env.json        # Local environment variables
└── README.md
```

## Deployment

### Backend Deployment

#### Prerequisites
1. AWS CLI configured with appropriate credentials
2. Facebook Page Access Token (see setup below)
3. Facebook Page ID

#### Setup Facebook Integration

1. **Get Facebook Page Access Token**:
   - Go to your band's Facebook page
   - Settings → Page Access Tokens
   - Generate token with permissions: `pages_read_engagement`, `pages_show_list`
   - Copy the generated token

2. **Create SSM Parameter** (one-time setup):
```bash
aws ssm put-parameter \
  --name "/latg/facebook/access-token" \
  --value "YOUR_FACEBOOK_PAGE_ACCESS_TOKEN" \
  --type "SecureString" \
  --description "Facebook Page Access Token for Lunar and the Groove" \
  --profile latg \
  --region eu-west-2
```

3. **Deploy Backend**:
```bash
cd backend
sam build && sam deploy \
  --parameter-overrides FacebookPageId=256098590913842 \
  --profile latg \
  --region eu-west-2 \
  --stack-name latg-backend-stack \
  --resolve-s3 \
  --capabilities CAPABILITY_IAM
```

#### Update Facebook Token (when needed)
```bash
aws ssm put-parameter \
  --name "/latg/facebook/access-token" \
  --value "NEW_FACEBOOK_TOKEN" \
  --type "SecureString" \
  --overwrite \
  --profile latg \
  --region eu-west-2
```

### Frontend Deployment

1. **Create environment file** for production:
```bash
cd frontend
echo "VITE_API_URL=https://your-api-gateway-url.amazonaws.com/Prod/gigs" > .env.production
echo "VITE_USE_MOCK_DATA=false" >> .env.production
```

2. **For development**, create `.env.development`:
```bash
echo "VITE_API_URL=http://localhost:3000/gigs" > .env.development
echo "VITE_USE_MOCK_DATA=true" >> .env.development
```

3. Build the project:
```bash
npm run build
```

4. Deploy the `dist` folder to your hosting service (Netlify, Vercel, GitHub Pages, etc.)

## Configuration

### Environment Variables

#### Backend (AWS SSM)
- `/latg/facebook/access-token` - Facebook Page Access Token (SecureString)

#### Frontend
- `USE_MOCK_DATA` - Set to `true` in `GigCarousel.tsx` for testing with mock data

### API Gateway Caching

The backend uses API Gateway caching with:
- **Cache Size**: 0.5GB
- **TTL**: 24 hours
- **Encryption**: Enabled

This provides excellent performance for low-traffic sites while keeping costs minimal.

## Development Features

### Mock Data Testing

The frontend includes a testing mode that can generate mock gig data:

1. Set `USE_MOCK_DATA = true` in `GigCarousel.tsx`
2. Use the testing controls to adjust the number of mock gigs
3. Test different carousel states (0, 1, 2, 3, 5 gigs)

### Interactive Features

- **Google Maps Integration**: Click on venue locations or postcodes to open Google Maps
- **Facebook Event Links**: Click on gig cards to open the Facebook event page
- **Responsive Carousel**: Automatically adjusts based on number of gigs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and type checking
5. Test with both real and mock data
6. Submit a pull request

## License

This project is private and proprietary to Lunar and the Groove.
