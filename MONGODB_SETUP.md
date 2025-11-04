# MongoDB Setup Guide for Infera AI

## Option 1: Local MongoDB Installation (Recommended for Development)

### Windows Installation:
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Make sure to install MongoDB as a Windows Service
4. MongoDB will start automatically after installation

### Alternative - Using Chocolatey:
```powershell
# Install Chocolatey if not already installed
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install MongoDB
choco install mongodb
```

### Verify Installation:
```bash
mongod --version
mongo --version
```

### Start MongoDB Service:
```powershell
# Start MongoDB service
net start MongoDB

# Check if running
Get-Service MongoDB
```

## Option 2: MongoDB Atlas (Cloud Database)

### Setup Steps:
1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster (free tier available)
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string

### Update .env file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/infera_ai?retryWrites=true&w=majority
```

## Option 3: Docker (Alternative)

```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# With persistent data
docker run -d -p 27017:27017 -v mongodb_data:/data/db --name mongodb mongo:latest
```

## Testing Connection

After setting up MongoDB, restart your backend server:

```bash
cd backend
npm run dev
```

You should see: "✅ MongoDB connected successfully"

## Troubleshooting

### Connection Issues:
- Make sure MongoDB service is running
- Check firewall settings
- Verify connection string in .env file
- For Atlas: check IP whitelist and credentials

### Port Issues:
- Default MongoDB port is 27017
- Make sure no other service is using this port
- Use `netstat -an | findstr 27017` to check

## Default Users Created

The backend will automatically create these users:
- **Admin**: admin@inferaai.com / Admin123!
- **Demo User**: demo@inferaai.com / Demo123!

## Next Steps

Once MongoDB is connected:
1. Test API endpoints using Postman or similar
2. Integrate with frontend
3. Test full application flow