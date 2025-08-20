#!/bin/bash

echo "Testing production IP Location App..."
echo "====================================="

# Wait for the app to be ready
echo "Waiting for app to be ready..."
sleep 10

# Test the main page
echo "Testing main page..."
curl -s -o /dev/null -w "Main page status: %{http_code}\n" http://localhost:4000/

# Test the login page
echo "Testing login page..."
curl -s -o /dev/null -w "Login page status: %{http_code}\n" http://localhost:4000/login

# Test the API endpoint
echo "Testing API endpoint..."
curl -s -o /dev/null -w "API endpoint status: %{http_code}\n" http://localhost:4000/api/ip

# Test with verbose output for debugging
echo "====================================="
echo "Verbose test results:"
echo "Main page content (first 200 chars):"
curl -s http://localhost:4000/ | head -c 200
echo ""

echo "Login page content (first 200 chars):"
curl -s http://localhost:4000/login | head -c 200
echo ""

echo "API response:"
curl -s http://localhost:4000/api/ip | head -c 200
echo ""
