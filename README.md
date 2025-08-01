# URL Shortener

A clean, responsive web application that allows users to shorten long URLs instantly without requiring any signup. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Instant URL Shortening**: Paste any long URL and get a shortened version in seconds
- **No Signup Required**: Start shortening URLs immediately without any registration
- **Never Expires**: Shortened links are permanent and will never expire
- **Copy to Clipboard**: One-click copy functionality for shortened URLs
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Dark Mode Support**: Automatic dark mode detection and support
- **URL Validation**: Automatic validation and formatting of input URLs

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **URL Generation**: nanoid for secure, unique short codes
- **Storage**: File-based storage (JSON) for simplicity

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd url-shortner
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## How It Works

1. **URL Input**: Users paste a long URL into the input field
2. **Validation**: The app validates and formats the URL (adds https:// if missing)
3. **Shortening**: A unique 8-character code is generated using nanoid
4. **Storage**: The URL mapping is stored in a JSON file
5. **Redirection**: When someone visits the shortened URL, they're redirected to the original URL

## API Endpoints

### POST /api/shorten

Shortens a long URL.

**Request Body:**
```json
{
  "url": "https://example.com/very-long-url"
}
```

**Response:**
```json
{
  "originalUrl": "https://example.com/very-long-url",
  "shortUrl": "http://localhost:3000/abc12345",
  "shortCode": "abc12345"
}
```

### GET /[shortCode]

Redirects to the original URL associated with the short code.

## File Structure

```
├── app/
│   ├── api/
│   │   └── shorten/
│   │       └── route.ts          # API endpoint for URL shortening
│   ├── [shortCode]/
│   │   └── page.tsx              # Dynamic route for URL redirection
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main application page
│   └── globals.css               # Global styles
├── lib/
│   └── urlStorage.ts             # URL storage utility
├── public/                       # Static assets
└── package.json
```

## Storage

The application uses a simple file-based storage system (`urls.json`) for storing URL mappings. In a production environment, you would want to replace this with a proper database like PostgreSQL, MongoDB, or Redis.

## Customization

### Changing Short Code Length

Edit the `nanoid(8)` call in `lib/urlStorage.ts` to change the length of generated short codes.

### Styling

The application uses Tailwind CSS for styling. You can customize the design by modifying the classes in `app/page.tsx`.

### Storage Backend

To use a different storage backend, modify the `UrlStorage` class in `lib/urlStorage.ts` to implement your preferred storage solution.

## Deployment

The application can be deployed to any platform that supports Next.js:

- **Vercel**: Recommended for Next.js applications
- **Netlify**: Supports Next.js with some configuration
- **Railway**: Easy deployment with database support
- **Self-hosted**: Deploy to your own server

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
#   L i n k - F o r g e - A i  
 #   L i n k - F o r g e - A i  
 