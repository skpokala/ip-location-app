# IP Location App - Portainer Deployment

## Quick Start

1. Create required directories and files:
```bash
mkdir -p traefik
touch traefik/acme.json
chmod 600 traefik/acme.json
```

2. Set environment variables:
```bash
export NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

3. Start the stack:
```bash
docker-compose -f docker-compose.portainer.yml up -d
```

## Access Points

- **IP Location App**: http://localhost:4000
- **Portainer**: http://localhost:9000
- **Traefik Dashboard**: http://traefik.yourdomain.com

## Default Credentials

### IP Location App
- Username: `admin`
- Password: `password123`

### Portainer
- Create admin credentials on first login

## Configuration

### Environment Variables

- `NEXTAUTH_SECRET`: Secret key for NextAuth.js
- `NEXTAUTH_URL`: Base URL of your application
- `NODE_ENV`: Set to `production`

### Ports

- `4000`: IP Location App
- `9000`: Portainer UI
- `80`: HTTP (redirects to HTTPS)
- `443`: HTTPS

### Volumes

- `portainer_data`: Portainer persistent data
- `traefik/acme.json`: Let's Encrypt certificates
- `traefik/traefik.yml`: Traefik configuration
- `traefik/config`: Additional Traefik configuration

## SSL/TLS

The setup includes Traefik with automatic SSL certificate generation via Let's Encrypt. To use it:

1. Update `traefik/traefik.yml` with your email
2. Update service labels with your domain
3. Ensure ports 80 and 443 are accessible

## Health Checks

The application includes built-in health checks:
```yaml
healthcheck:
  test: ["CMD", "wget", "--spider", "http://localhost:4000"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 20s
```

## Updates

To update to the latest version:

```bash
docker-compose -f docker-compose.portainer.yml pull
docker-compose -f docker-compose.portainer.yml up -d
```

## Troubleshooting

### Common Issues

1. Port conflicts:
   ```bash
   netstat -tulpn | grep '4000\|9000\|80\|443'
   ```

2. Certificate issues:
   ```bash
   docker-compose -f docker-compose.portainer.yml logs traefik
   ```

3. App not starting:
   ```bash
   docker-compose -f docker-compose.portainer.yml logs app
   ```
