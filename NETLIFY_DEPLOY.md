# Deploying to Netlify

This guide shows you how to deploy the Beer Carbonation Calculator to Netlify.

## Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/carbonation)

## Manual Deployment

### Prerequisites

1. A [Netlify account](https://app.netlify.com/signup)
2. [Git](https://git-scm.com/) installed
3. [Node.js](https://nodejs.org/) installed (for local testing)

### Steps

1. **Fork/Clone this repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/carbonation.git
   cd carbonation
   ```

2. **Install dependencies (for local testing)**
   ```bash
   npm install
   ```

3. **Test locally with Netlify CLI (optional)**
   ```bash
   npm run netlify-dev
   ```
   This will start a local development server that mimics Netlify's environment.

4. **Deploy to Netlify**

   **Option A: Git Integration (Recommended)**
   - Push your code to GitHub/GitLab/Bitbucket
   - Log in to [Netlify](https://app.netlify.com/)
   - Click "New site from Git"
   - Connect your repository
   - Netlify will automatically detect the settings from `netlify.toml`

   **Option B: Manual Deploy**
   - Build your site locally (if needed)
   - Drag and drop the `public` folder to Netlify's deploy area

### Configuration

The app is configured through `netlify.toml`:

```toml
[build]
  publish = "public"           # Static files directory
  command = "echo 'Static site - no build needed'"

[functions]
  directory = "netlify/functions"  # Serverless functions

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables

No environment variables are needed for this application.

### Custom Domain (Optional)

1. In your Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Follow the instructions to configure your DNS

### Features on Netlify

✅ **Automatic HTTPS**  
✅ **Global CDN**  
✅ **Serverless Functions**  
✅ **Continuous Deployment**  
✅ **Branch Previews**  

### Troubleshooting

**Functions not working?**
- Check that your functions are in `netlify/functions/`
- Verify the function exports use `exports.handler`
- Check the Netlify function logs in your dashboard

**404 errors?**
- The `netlify.toml` includes redirects for SPA routing
- Make sure all files are in the `public` directory

**Build failures?**
- This is a static site with no build process
- The build command is just `echo 'Static site - no build needed'`

### Local Development

For local development that mimics Netlify:

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Run local development server
netlify dev
```

This will start:
- Static site at `http://localhost:8888`
- Functions at `http://localhost:8888/.netlify/functions/FUNCTION_NAME`

### Performance

The app on Netlify includes:
- Global CDN distribution
- Automatic compression
- Optimized static asset delivery
- Serverless function execution

Expected load times: **< 1 second** globally 🚀
