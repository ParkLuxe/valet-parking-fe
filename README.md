# Park-Luxe - Valet Parking Management System

A complete React frontend application for managing valet parking operations with real-time updates and comprehensive analytics.

## 🚀 Features

### Authentication & User Management
- **Multi-Role Login System**: Separate login flows for Hosts, Host Users (Valets), and Super Admin
- **Host Registration**: New hosts can register with business details
- **Profile Management**: Edit profile, change password, upload profile picture
- **Role-Based Access Control**: Different features based on user roles

### QR Code & Vehicle Management
- **Dynamic QR Code Generation**: Auto-refreshing QR codes for each customer
- **Vehicle Entry Form**: Complete vehicle and customer details capture
- **Real-time Status Tracking**: Being Assigned → Parking In Progress → Parked → Out for Delivery → Delivered
- **Valet Assignment**: Assign available valets to parking tasks
- **Parking Slot Management**: Track and assign available parking slots

### Analytics Dashboard
- **Key Metrics Cards**: Active valets, cars parked, average parking/delivery times
- **Valet Performance Tracking**: Individual valet statistics and rankings
- **Recent Activity Feed**: Live updates of parking/delivery events

### Subscription Management
- **Usage Tracking**: Visual display of scan usage
- **Pay-as-you-go Billing**: ₹1,000 for 100 scans, ₹10 per additional scan
- **Grace Period**: 3-day buffer after limit exceeded
- **Payment History**: Track all payments
- **Razorpay Integration**: Ready for payment gateway

## 🛠️ Tech Stack

- **React 19** with hooks
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Material-UI (MUI)** for UI components
- **Axios** with JWT interceptors
- **Socket.io Client** for real-time updates
- **QRCode.react** for QR generation

## 🚦 Getting Started

### Installation

```bash
npm install --legacy-peer-deps
```

### Development

```bash
npm start
```

### Build

```bash
npm run build
```

## 🔐 Development Credentials

**Super Admin:** admin@parkluxe.com / Admin@123
**Host:** host@example.com / Host@123
**Valet:** valet@example.com / Valet@123

⚠️ Change these in production!

## 📝 API Integration

Currently using mock data. To integrate with backend:
1. Update API_BASE_URL in .env
2. Uncomment API calls in service files
3. Replace mock responses with actual API calls

## 🚀 Deployment to AWS EC2

This project includes automated CI/CD deployment to AWS EC2 using GitHub Actions.

### Prerequisites on EC2 Instance

1. **Install nginx** (or Apache):
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Configure nginx** to serve the application:
   ```bash
   sudo nano /etc/nginx/sites-available/valet-parking
   ```
   
   Example configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       root /var/www/valet-parking-fe;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```
   
   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/valet-parking /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. **Create deployment directory**:
   ```bash
   sudo mkdir -p /var/www/valet-parking-fe
   sudo chown $USER:$USER /var/www/valet-parking-fe
   ```

### Setting Up GitHub Secrets

Configure the following secrets in your GitHub repository (Settings → Secrets and variables → Actions):

#### Required Secrets:

- **`EC2_HOST`**: The public IP address or DNS name of your EC2 instance
  - Example: `ec2-12-34-56-78.compute-1.amazonaws.com` or `12.34.56.78`

- **`EC2_USER`**: SSH username for your EC2 instance
  - For Ubuntu AMIs: `ubuntu`
  - For Amazon Linux: `ec2-user`
  - For Debian: `admin`

- **`EC2_SSH_KEY`**: The private SSH key (PEM format) for connecting to EC2
  - Copy the entire contents of your `.pem` file including the header and footer:
    ```
    -----BEGIN RSA PRIVATE KEY-----
    [Your private key content]
    -----END RSA PRIVATE KEY-----
    ```

- **`EC2_TARGET_DIR`**: The deployment directory path on the EC2 instance
  - Example: `/var/www/valet-parking-fe`

#### Optional Environment Secrets:

- **`REACT_APP_API_URL`**: Production API URL (defaults to `http://localhost:3001/api`)
- **`REACT_APP_WS_URL`**: Production WebSocket URL (defaults to `ws://localhost:3001`)
- **`REACT_APP_RAZORPAY_KEY`**: Razorpay API key for payment processing

### SSH Key Setup

1. **Generate a new SSH key pair** (or use existing):
   ```bash
   ssh-keygen -t rsa -b 4096 -f ~/.ssh/valet-parking-deploy -N ""
   ```

2. **Add public key to EC2 instance**:
   ```bash
   ssh-copy-id -i ~/.ssh/valet-parking-deploy.pub ubuntu@your-ec2-ip
   ```
   
   Or manually:
   ```bash
   cat ~/.ssh/valet-parking-deploy.pub
   # Copy the output and add to ~/.ssh/authorized_keys on EC2
   ```

3. **Add private key to GitHub Secrets**:
   ```bash
   cat ~/.ssh/valet-parking-deploy
   # Copy the entire output (including BEGIN/END lines) to EC2_SSH_KEY secret
   ```

### Deployment Workflow

The deployment workflow is triggered:
- **Automatically**: When code is pushed to the `master` branch
- **Manually**: Via GitHub Actions UI (Actions → Deploy to AWS EC2 → Run workflow)

The workflow includes two stages:
1. **Build Stage**: Installs dependencies, creates production environment, and builds the React application
2. **Deploy Stage**: Deploys built files to EC2 via rsync and reloads nginx

### Staging Environment (Optional)

To set up a staging environment:
1. Uncomment the `deploy-staging` job in `.github/workflows/deploy.yml`
2. Add staging-specific secrets with `STAGING_` prefix
3. Configure the staging branch name (e.g., `develop`)

### Troubleshooting

- **Permission denied**: Ensure the EC2_USER has write access to EC2_TARGET_DIR
- **SSH connection failed**: Verify security group allows SSH (port 22) from GitHub IPs
- **Build failed**: Check Node.js version compatibility and dependencies
- **nginx not reloading**: Ensure EC2_USER has sudo permissions for nginx commands

## 📄 License

MIT License - see LICENSE file for details.
