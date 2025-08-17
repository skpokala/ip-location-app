#!/bin/bash

# Check if GITHUB_USERNAME is provided
if [ -z "$1" ]; then
    echo "Please provide your GitHub username"
    echo "Usage: ./portainer-setup.sh GITHUB_USERNAME GITHUB_PAT"
    exit 1
fi

# Check if GITHUB_PAT is provided
if [ -z "$2" ]; then
    echo "Please provide your GitHub Personal Access Token"
    echo "Usage: ./portainer-setup.sh GITHUB_USERNAME GITHUB_PAT"
    exit 1
fi

# Login to GHCR
echo "$2" | docker login ghcr.io -u "$1" --password-stdin

# Generate NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Create .env file
cat > .env << EOL
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
EOL

echo "Setup complete! Use these values in Portainer:"
echo "NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}"
echo ""
echo "Make sure to add the registry in Portainer with:"
echo "Registry URL: ghcr.io"
echo "Username: $1"
echo "Password: [your PAT]"
