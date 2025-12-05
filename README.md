# Pokedex Web App 2025

A React-based Pokedex application with Auth0 authentication and protected routes, deployed on GitHub Pages.

## 🌐 Live Demo

[https://giuseppevizzari.github.io/pokedex2022-applicazioni-web](https://giuseppevizzari.github.io/pokedex2022-applicazioni-web)

## ✨ Features

- 🔐 **Auth0 Authentication** - Secure login/logout with user profile display
- 🔒 **Protected Routes** - Pokedex and Pokemon details require authentication
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🚀 **Automated Deployment** - CI/CD with GitHub Actions
- ⚡ **Fast and Modern** - Built with Vite and React 19

## 🔐 Authentication

This app uses Auth0 for secure authentication. Users must log in to access the Pokedex and view Pokemon details. Home and Info pages remain publicly accessible.

### Setting Up Auth0

For detailed instructions on setting up Auth0 for this app, see:
- **[AUTH0_SETUP.md](AUTH0_SETUP.md)** - Step-by-step Auth0 dashboard configuration
- **[AUTH0_TUTORIAL.md](AUTH0_TUTORIAL.md)** - Complete tutorial on Auth0 + React + GitHub Pages

### Quick Setup

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Configure Auth0 credentials:**
   - Copy `.env.example` to `.env`
   - Fill in your Auth0 Domain and Client ID from your Auth0 dashboard
   
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Run locally:**
   ```bash
   npm start
   ```
   
   Open [http://localhost:5173/pokedex2022-applicazioni-web](http://localhost:5173/pokedex2022-applicazioni-web) to view it in the browser.

## 🚀 Deployment

### GitHub Pages Deployment

This app is configured for automatic deployment to GitHub Pages using GitHub Actions and the `gh-pages` package.

For a comprehensive guide on the deployment process, see:
- **[GITHUB_PAGES_DEPLOYMENT.md](GITHUB_PAGES_DEPLOYMENT.md)** - Complete deployment tutorial

### Quick Deployment Steps

1. **Set GitHub Secrets:**
   - Go to your repository: **Settings** → **Secrets and variables** → **Actions** → **Secrets**
   - Add these secrets:
     - `VITE_AUTH0_DOMAIN` - Your Auth0 domain
     - `VITE_AUTH0_CLIENT_ID` - Your Auth0 client ID

2. **Deploy:**
   
   The app will automatically deploy when you push to the `main` branch:
   
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
   
   Or deploy manually from your local machine:
   
   ```bash
   npm run deploy
   ```

3. **Configure Auth0 Callback URLs:**
   
   In your Auth0 dashboard, add these URLs:
   - **Allowed Callback URLs:** 
     ```
     http://localhost:5173/pokedex2022-applicazioni-web,
     https://giuseppevizzari.github.io/pokedex2022-applicazioni-web
     ```
   - **Allowed Logout URLs:** 
     ```
     http://localhost:5173/pokedex2022-applicazioni-web,
     https://giuseppevizzari.github.io/pokedex2022-applicazioni-web
     ```
   - **Allowed Web Origins:** 
     ```
     http://localhost:5173,
     https://giuseppevizzari.github.io
     ```

## 📦 Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:5173/pokedex2022-applicazioni-web](http://localhost:5173/pokedex2022-applicazioni-web).

### `npm run build`

Builds the app for production to the `dist` folder.

### `npm run serve`

Preview the production build locally.

### `npm run deploy`

Deploys the production build to GitHub Pages (manual deployment).

## 🛠 Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router 6** - Client-side routing (HashRouter for GitHub Pages)
- **Auth0** - Authentication and authorization
- **Bootstrap 5** - UI components and styling
- **Reactstrap** - React Bootstrap components
- **GitHub Pages** - Static site hosting
- **GitHub Actions** - CI/CD automation

## 📂 Project Structure

```
pokedex2022-applicazioni-web/
├── src/
│   ├── auth/                        # Authentication components
│   │   ├── Auth0ProviderWithNavigate.jsx
│   │   └── ProtectedRoute.jsx
│   ├── components/                  # Reusable components
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── LoginButton/
│   │   ├── LogoutButton/
│   │   ├── UserProfile/
│   │   └── MainTemplate/
│   ├── views/                       # Page components
│   │   ├── App/
│   │   ├── Home/                    # Public
│   │   ├── Info/                    # Public
│   │   ├── Pokedex/                 # Protected
│   │   └── PokemonDetail/           # Protected
│   └── main.jsx                     # App entry point
├── .github/workflows/
│   └── deploy.yml                   # GitHub Actions deployment workflow
├── .env.example                     # Environment variables template
├── AUTH0_SETUP.md                   # Auth0 configuration guide
├── AUTH0_TUTORIAL.md                # Comprehensive Auth0 tutorial
└── GITHUB_PAGES_DEPLOYMENT.md       # Deployment process tutorial
```

## 🔒 Security Notes

- Auth0 Domain and Client ID are safe to expose in the client bundle (this is by design for SPAs)
- Never commit your `.env` file to version control
- Use GitHub Secrets for deployment credentials
- Never use the Auth0 Client Secret in frontend code
- Protected routes redirect unauthenticated users to the home page

## 📚 Documentation

- **[AUTH0_SETUP.md](AUTH0_SETUP.md)** - Step-by-step Auth0 dashboard setup
- **[AUTH0_TUTORIAL.md](AUTH0_TUTORIAL.md)** - Auth0 integration tutorial with React + GitHub Pages
- **[GITHUB_PAGES_DEPLOYMENT.md](GITHUB_PAGES_DEPLOYMENT.md)** - Complete deployment guide

## 🌐 Learn More

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Auth0 Documentation](https://auth0.com/docs)
- [React Router Documentation](https://reactrouter.com/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 👨‍🏫 Course Information

**Applicazioni Web: Progettazione e Sviluppo**  
[Course Link](https://elearning.unimib.it/course/view.php?id=61231)

## 📄 License

This project is for educational purposes.
