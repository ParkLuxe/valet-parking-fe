# Deployment Guide - Park-Luxe Valet Parking Frontend

This document provides comprehensive instructions for deploying the Park-Luxe frontend application to AWS EC2 using the automated CI/CD pipeline.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [EC2 Instance Setup](#ec2-instance-setup)
4. [GitHub Secrets Configuration](#github-secrets-configuration)
5. [Deployment Workflow](#deployment-workflow)
6. [Environment Configuration](#environment-configuration)
7. [Troubleshooting](#troubleshooting)
8. [Staging Environment](#staging-environment)

## Overview

The deployment workflow uses GitHub Actions to automatically:
- Build the React application with optimized production settings
- Deploy to AWS EC2 via SSH and rsync
- Reload the web server (nginx)

**Triggers:**
- Automatic deployment on push to `master` branch
- Manual deployment via GitHub Actions UI

## Prerequisites

### On Your Local Machine

- SSH key pair for EC2 access
- AWS account with EC2 instance running
- GitHub repository access with admin permissions

### On EC2 Instance

- Ubuntu 20.04+ or Amazon Linux 2
- nginx web server installed
- User account with SSH access and sudo privileges

## EC2 Instance Setup

### 1. Launch EC2 Instance

1. Log in to AWS Console and navigate to EC2
2. Launch a new instance:
   - **AMI**: Ubuntu Server 20.04 LTS or newer
   - **Instance Type**: t2.micro or larger
   - **Key Pair**: Create or select existing key pair
   - **Security Group**: Allow inbound traffic on:
     - Port 22 (SSH) from your IP and GitHub IPs
     - Port 80 (HTTP) from anywhere
     - Port 443 (HTTPS) from anywhere (if using SSL)

### 2. Connect to EC2 Instance

```bash
ssh -i /path/to/your-key.pem ubuntu@your-ec2-ip
```

### 3. Install nginx

```bash
# Update package list
sudo apt update

# Install nginx
sudo apt install -y nginx

# Start and enable nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 4. Configure nginx

Create a new nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/valet-parking
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Or use _ for any domain
    
    root /var/www/valet-parking-fe;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # React Router support - redirect all requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Enable the site and test configuration:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/valet-parking /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 5. Create Deployment Directory

```bash
# Create directory
sudo mkdir -p /var/www/valet-parking-fe

# Set ownership to your user
sudo chown $USER:$USER /var/www/valet-parking-fe

# Set permissions
chmod 755 /var/www/valet-parking-fe
```

### 6. Configure Firewall (if using UFW)

```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

## GitHub Secrets Configuration

Navigate to your GitHub repository: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### Required Secrets

#### 1. EC2_HOST
- **Description**: Public IP address or DNS name of EC2 instance
- **Example**: `ec2-12-34-56-78.compute-1.amazonaws.com` or `12.34.56.78`
- **How to find**: AWS Console → EC2 → Instances → Select instance → Public IPv4 address

#### 2. EC2_USER
- **Description**: SSH username for EC2 instance
- **Values**:
  - Ubuntu AMI: `ubuntu`
  - Amazon Linux: `ec2-user`
  - Debian: `admin`
  - CentOS: `centos`

#### 3. EC2_SSH_KEY
- **Description**: Private SSH key in PEM format
- **How to get**:
  ```bash
  cat /path/to/your-key.pem
  ```
- **Format**: Include entire file content including headers:
  ```
  -----BEGIN RSA PRIVATE KEY-----
  [Your private key content]
  -----END RSA PRIVATE KEY-----
  ```
- **⚠️ Security**: Never commit this to your repository!

#### 4. EC2_TARGET_DIR
- **Description**: Deployment directory on EC2
- **Example**: `/var/www/valet-parking-fe`
- **Note**: Must match nginx root directory and have write permissions

### Optional Environment Secrets

#### REACT_APP_API_URL
- **Description**: Production backend API URL
- **Example**: `https://api.parkluxe.com/api`
- **Default**: `http://localhost:3001/api`

#### REACT_APP_WS_URL
- **Description**: Production WebSocket URL
- **Example**: `wss://api.parkluxe.com`
- **Default**: `ws://localhost:3001`

#### REACT_APP_RAZORPAY_KEY
- **Description**: Razorpay API key for payment processing
- **Example**: `rzp_live_XXXXXXXXXXXXXXXX`
- **Where to get**: https://dashboard.razorpay.com/app/keys

## Deployment Workflow

### Automatic Deployment

1. Make changes to your code
2. Commit and push to `master` branch:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin master
   ```
3. GitHub Actions automatically triggers the workflow
4. Monitor progress: **Actions** tab in GitHub repository

### Manual Deployment

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **Deploy to AWS EC2** workflow
4. Click **Run workflow** button
5. Select branch (typically `master`)
6. Click **Run workflow**

### Workflow Stages

#### Build Stage
1. Checkout code from repository
2. Setup Node.js 20 environment with npm cache
3. Install dependencies with `npm ci --legacy-peer-deps`
4. Create `.env.production` file with secrets
5. Build application with `npm run build`
6. Upload build artifacts

#### Deploy Stage
1. Download build artifacts from previous stage
2. Setup SSH connection to EC2
3. Transfer files using rsync with compression
4. Reload nginx web server
5. Clean up SSH keys

## Environment Configuration

### Development Environment

Create `.env` file in project root:

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001
REACT_APP_RAZORPAY_KEY=rzp_test_XXXXXXXXXXXXXXXX
```

### Production Environment

Environment variables are automatically created during the build stage from GitHub Secrets. No need to manually create `.env.production` on EC2.

## Troubleshooting

### Common Issues and Solutions

#### 1. SSH Connection Failed

**Error**: `Permission denied (publickey)`

**Solutions**:
- Verify EC2_SSH_KEY secret contains complete private key with headers
- Check security group allows SSH from GitHub Actions IPs
- Ensure EC2_USER matches AMI type
- Verify key permissions: `chmod 600 key.pem` locally

#### 2. rsync Permission Denied

**Error**: `rsync: mkdir "/var/www/valet-parking-fe" failed: Permission denied`

**Solutions**:
```bash
# On EC2, set correct ownership
sudo chown -R $USER:$USER /var/www/valet-parking-fe
chmod 755 /var/www/valet-parking-fe
```

#### 3. nginx Reload Failed

**Error**: `Failed to reload nginx`

**Solutions**:
```bash
# On EC2, add user to sudoers for nginx commands
sudo visudo

# Add this line:
ubuntu ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx, /usr/sbin/service nginx reload
```

#### 4. Build Failed - Dependencies

**Error**: `npm ERR! peer dependency conflicts`

**Solution**: The workflow uses `npm ci --legacy-peer-deps` which should handle this. If issues persist, update `package.json` dependencies.

#### 5. 502 Bad Gateway

**Possible causes**:
- nginx configuration error: `sudo nginx -t`
- Wrong root directory in nginx config
- Build files not properly deployed

**Solution**:
```bash
# Check nginx logs
sudo tail -f /var/log/nginx/error.log

# Verify files exist
ls -la /var/www/valet-parking-fe

# Check nginx config
sudo nginx -t
```

#### 6. React Router 404 Errors

**Issue**: Refreshing page or direct URL access returns 404

**Solution**: Ensure nginx configuration includes:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Viewing Workflow Logs

1. Go to **Actions** tab in GitHub
2. Click on the workflow run
3. Click on job name (Build Application or Deploy to EC2)
4. Expand steps to view detailed logs

### Testing Deployment

After successful deployment:

```bash
# Check nginx status
sudo systemctl status nginx

# Verify files deployed
ls -lh /var/www/valet-parking-fe

# Test application
curl http://your-ec2-ip

# Check nginx access logs
sudo tail -f /var/log/nginx/access.log
```

## Staging Environment

To set up a staging environment for testing before production:

### 1. Uncomment Staging Job

Edit `.github/workflows/deploy.yml` and uncomment the `deploy-staging` job (lines 85-115).

### 2. Configure Staging Branch

Update the condition to match your staging branch:
```yaml
if: github.ref == 'refs/heads/develop'  # Or your staging branch name
```

### 3. Add Staging Secrets

Add these additional secrets with `STAGING_` prefix:
- `STAGING_EC2_HOST`
- `STAGING_EC2_USER`
- `STAGING_EC2_SSH_KEY`
- `STAGING_EC2_TARGET_DIR`

### 4. Setup Staging EC2

Follow the same EC2 setup steps but:
- Use a separate EC2 instance or different directory
- Configure nginx on different port or subdomain
- Use staging API endpoints

### 5. Deploy to Staging

Push to staging branch:
```bash
git checkout develop  # or your staging branch
git push origin develop
```

## SSL/HTTPS Configuration (Optional)

### Using Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is configured automatically
# Test renewal:
sudo certbot renew --dry-run
```

### Update nginx Configuration

Certbot automatically updates nginx config, but verify:
```bash
sudo nano /etc/nginx/sites-available/valet-parking
```

Should include:
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # ... rest of configuration
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring and Maintenance

### Monitoring Deployment

- **GitHub Actions**: View workflow runs and logs
- **EC2 CloudWatch**: Monitor instance metrics
- **nginx Logs**: `/var/log/nginx/access.log` and `/var/log/nginx/error.log`

### Regular Maintenance

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Check disk space
df -h

# Monitor nginx
sudo systemctl status nginx

# View recent deployments
ls -lt /var/www/valet-parking-fe
```

### Rollback Procedure

If deployment fails:

1. **Via GitHub Actions**: Revert the commit and push
2. **Manual rollback**: SSH to EC2 and restore previous build
   ```bash
   # If you kept backups
   cp -r /var/www/valet-parking-fe.backup/* /var/www/valet-parking-fe/
   sudo systemctl reload nginx
   ```

## Security Best Practices

1. **Secrets Management**
   - Never commit secrets to repository
   - Rotate SSH keys periodically
   - Use least privilege principle for EC2 user

2. **EC2 Security**
   - Keep system updated
   - Use security groups to restrict access
   - Enable AWS CloudWatch monitoring
   - Regular security audits

3. **Application Security**
   - Use HTTPS in production
   - Set proper CORS policies
   - Implement rate limiting
   - Regular dependency updates

## Support

For issues or questions:
- Check GitHub Actions logs
- Review nginx error logs
- Consult AWS EC2 documentation
- Open an issue in the repository

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS EC2 User Guide](https://docs.aws.amazon.com/ec2/)
- [nginx Documentation](https://nginx.org/en/docs/)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/)
