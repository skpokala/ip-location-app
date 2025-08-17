# IP Location App

A modern web application that displays your public IP address and location information. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔒 Secure authentication
- 🌍 Real-time IP location information
- 🎨 Modern UI with Tailwind CSS
- 🔐 Password management
- 🐳 Docker support

## Self-Hosting Guide

### Prerequisites

- Docker and Docker Compose installed on your system
- A domain name (optional, but recommended for production)

### Quick Start

1. Create a `.env` file in the root directory:
   ```env
   NEXTAUTH_SECRET=your-secure-random-string  # Generate this securely
   NEXTAUTH_URL=http://localhost:4000         # Change to your domain in production
   ```

2. Start the application:
   ```bash
   docker compose up -d
   ```

3. Access the application at `http://localhost:4000`

### Default Login Credentials

- Username: admin
- Password: password123

⚠️ **Important**: Change the default password after first login in production!

### Production Deployment

For production deployment, make sure to:

1. Generate a secure random string for `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

2. Update `NEXTAUTH_URL` to your domain:
   ```env
   NEXTAUTH_URL=https://your-domain.com
   ```

3. Set up SSL/TLS using a reverse proxy (e.g., Nginx, Traefik) for HTTPS.

4. Configure proper firewall rules to only expose port 4000.

### Updating the Application

To update to the latest version:

```bash
# Pull the latest image
docker compose pull

# Restart the containers
docker compose up -d
```

### Monitoring

Check application status:
```bash
# View logs
docker compose logs -f

# Check container status
docker compose ps
```

### Backup

The application is stateless, but make sure to backup your `.env` file and any custom configurations.

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