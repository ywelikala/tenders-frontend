# Deployment Guide

This guide covers different deployment options for the Tenders Frontend application.

## 🚀 Quick Start

### Using Docker

```bash
# Build the image
docker build -t tenders-frontend .

# Run with environment variables
docker run -p 80:80 \
  -e API_BASE_URL="https://api.yourdomain.com" \
  -e APP_NAME="Tenders Portal" \
  -e APP_VERSION="1.0.0" \
  tenders-frontend
```

### Using Docker Compose

1. Copy the environment file:
```bash
cp .env.example .env
```

2. Update `.env` with your configuration:
```env
API_BASE_URL=https://api.yourdomain.com
APP_NAME=Your Tenders Portal
APP_VERSION=1.0.0
```

3. Start the application:
```bash
docker-compose up -d
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `API_BASE_URL` | Backend API endpoint | `https://lankatender.com/api` | ✅ |
| `APP_NAME` | Application display name | `Tenders Portal` | ❌ |
| `APP_VERSION` | Application version | `1.0.0` | ❌ |

### Runtime Configuration

The application uses a runtime configuration system that injects environment variables at container startup. The configuration is available at `/config.js` and contains:

```javascript
window.ENV = {
  API_BASE_URL: 'https://api.yourdomain.com',
  APP_NAME: 'Tenders Portal',
  APP_VERSION: '1.0.0',
  NODE_ENV: 'production'
};
```

## 🌐 Production Deployment

### Docker Hub

1. **Build and push to Docker Hub:**
```bash
docker build -t yourusername/tenders-frontend .
docker push yourusername/tenders-frontend
```

2. **Deploy on server:**
```bash
docker pull yourusername/tenders-frontend
docker run -d \
  --name tenders-frontend \
  --restart unless-stopped \
  -p 80:80 \
  -e API_BASE_URL="https://api.yourdomain.com" \
  yourusername/tenders-frontend
```

### AWS ECS

1. **Create task definition** with the Docker image
2. **Set environment variables** in the container definition
3. **Configure load balancer** to route traffic to port 80

### Google Cloud Run

```bash
# Deploy to Cloud Run
gcloud run deploy tenders-frontend \
  --image gcr.io/your-project/tenders-frontend \
  --platform managed \
  --region us-central1 \
  --set-env-vars API_BASE_URL=https://api.yourdomain.com
```

### Azure Container Instances

```bash
az container create \
  --resource-group myResourceGroup \
  --name tenders-frontend \
  --image yourusername/tenders-frontend \
  --dns-name-label tenders-frontend \
  --ports 80 \
  --environment-variables API_BASE_URL=https://api.yourdomain.com
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tenders-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: tenders-frontend
  template:
    metadata:
      labels:
        app: tenders-frontend
    spec:
      containers:
      - name: tenders-frontend
        image: yourusername/tenders-frontend:latest
        ports:
        - containerPort: 80
        env:
        - name: API_BASE_URL
          value: "https://api.yourdomain.com"
        - name: APP_NAME
          value: "Tenders Portal"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: tenders-frontend-service
spec:
  selector:
    app: tenders-frontend
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

### Reverse Proxy (Nginx/Apache)

If deploying behind a reverse proxy, make sure to configure:

1. **Proxy pass** to the container port
2. **Static file serving** optimization
3. **SSL termination** at the proxy level
4. **Health check** forwarding

Example Nginx configuration:
```nginx
upstream tenders-frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://tenders-frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        proxy_pass http://tenders-frontend/health;
        access_log off;
    }
}
```

## 🔍 Health Monitoring

The application provides a health check endpoint at `/health` that returns:

- **200 OK**: Application is healthy
- **Response**: `healthy\n`

Use this endpoint for:
- Docker health checks
- Load balancer health checks  
- Kubernetes liveness/readiness probes
- Monitoring systems

## 🚨 Troubleshooting

### Common Issues

1. **"vite: not found" error**
   - Ensure dev dependencies are installed during build
   - Check Dockerfile uses `npm ci` instead of `npm ci --only=production`

2. **API calls failing**
   - Verify `API_BASE_URL` environment variable is set correctly
   - Check CORS configuration on backend
   - Ensure backend API is accessible from frontend domain

3. **Container not starting**
   - Check Docker logs: `docker logs <container-name>`
   - Verify nginx configuration syntax
   - Ensure all required files are copied correctly

4. **Environment variables not working**
   - Check if `/config.js` is accessible: `curl http://localhost/config.js`
   - Verify docker-entrypoint.sh has execute permissions
   - Ensure environment variables are passed to container

### Debug Commands

```bash
# Check container logs
docker logs <container-name>

# Execute shell in running container
docker exec -it <container-name> /bin/bash

# Test nginx configuration
docker exec <container-name> nginx -t

# Check environment injection
curl http://localhost/config.js

# Test health endpoint
curl http://localhost/health
```

## 📊 Performance Optimization

### Production Recommendations

1. **Enable gzip compression** (included in nginx.conf)
2. **Set up CDN** for static assets
3. **Configure caching headers** appropriately
4. **Use HTTP/2** for improved performance
5. **Implement monitoring** and alerts

### Resource Requirements

- **Minimum**: 256MB RAM, 0.1 CPU
- **Recommended**: 512MB RAM, 0.25 CPU
- **Storage**: ~100MB for container image

## 🔐 Security Considerations

1. **HTTPS only** in production
2. **Security headers** (included in nginx.conf)
3. **Regular image updates** for security patches
4. **Secrets management** for environment variables
5. **Network isolation** between services

---

For more information, see the main [README.md](README.md) file.