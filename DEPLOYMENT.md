# IP Location App - Docker Deployment

## Quick Start

### Using Docker

1. Pull the latest image:
```bash
docker pull ghcr.io/skpokala/ip-location-app:latest
```

2. Run the container:
```bash
docker run -d \
  -p 4000:4000 \
  -e NEXTAUTH_URL=http://localhost:4000 \
  -e NEXTAUTH_SECRET=your-secure-secret-here \
  ghcr.io/skpokala/ip-location-app:latest
```

### Using Docker Compose

1. Create a docker-compose.yml file:
```yaml
version: '3.8'

services:
  app:
    image: ghcr.io/skpokala/ip-location-app:latest
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - NEXTAUTH_URL=http://localhost:4000
      - NEXTAUTH_SECRET=your-secure-secret-here
    restart: unless-stopped

networks:
  default:
    name: ip-location-network
```

2. Start the application:
```bash
docker-compose up -d
```

## Environment Variables

- `NODE_ENV`: Set to `production`
- `NEXTAUTH_URL`: The base URL of your application
- `NEXTAUTH_SECRET`: Secret key for NextAuth.js (required)
- `PORT`: Server port (default: 4000)

## Health Checks

- Application: `GET /` (returns Next.js app)

## Default Credentials

- Username: `admin`
- Password: `password123`

**⚠️ Important: Change the default password after first login!**

## Ports

- `4000`: Application (Next.js)

## Updates

To update to the latest version:

```bash
docker-compose pull
docker-compose up -d
```

## Support

For issues and support, visit: https://github.com/skpokala/ip-location-app/issues
