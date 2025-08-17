# IP Location App

A modern web application that displays your public IP address and location information. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔒 Secure authentication
- 🌍 Real-time IP location information
- 🎨 Modern UI with Tailwind CSS
- 🔐 Password management
- 🐳 Docker support

## Running with Docker

### Using GitHub Container Registry

```bash
# Pull the image
docker pull ghcr.io/[your-username]/ip-location-app:latest

# Run the container
docker run -p 4000:4000 \
  -e NEXTAUTH_URL=http://localhost:4000 \
  -e NEXTAUTH_SECRET=your-secret-key-here \
  ghcr.io/[your-username]/ip-location-app:latest
```

### Using Docker Compose

```bash
# Clone the repository
git clone https://github.com/[your-username]/ip-location-app.git
cd ip-location-app

# Start the application
docker compose up
```

## Environment Variables

- `NEXTAUTH_URL`: The base URL of your application (default: http://localhost:4000)
- `NEXTAUTH_SECRET`: Secret key for NextAuth.js session encryption
- `PORT`: The port to run the application on (default: 4000)

## Default Login Credentials

- Username: admin
- Password: password123

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
