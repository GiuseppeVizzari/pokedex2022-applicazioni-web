# Pokedex Web App 2025

A React-based Pokedex application with Auth0 authentication, deployed on GitHub Pages.

## 🌐 Live Demo

[https://giuseppevizzari.github.io/pokedex2022-applicazioni-web](https://giuseppevizzari.github.io/pokedex2022-applicazioni-web)

## 🔐 Authentication

This app uses Auth0 for secure authentication. Users can log in to access personalized features.

### Setting Up Auth0

For detailed instructions on setting up Auth0 for this app, see:
- **[AUTH0_SETUP.md](AUTH0_SETUP.md)** - Step-by-step Auth0 dashboard configuration
- **[AUTH0_TUTORIAL.md](AUTH0_TUTORIAL.md)** - Complete tutorial on Auth0 + React + GitHub Pages

### Quick Setup

1. **Install dependencies:**
   ```bash
   npm install
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
   
   Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## 🚀 Deployment

### GitHub Pages Deployment

This app is configured for automatic deployment to GitHub Pages using GitHub Actions.

1. **Set GitHub Secrets:**
   - Go to your repository: **Settings** → **Secrets and variables** → **Actions**
   - Add these secrets:
     - `VITE_AUTH0_DOMAIN` - Your Auth0 domain
     - `VITE_AUTH0_CLIENT_ID` - Your Auth0 client ID

2. **Deploy:**
   
   The app will automatically deploy when you push to the `main` branch, or you can deploy manually:
   
   ```bash
   npm run deploy
   ```

3. **Configure Auth0 Callback URLs:**
   
   In your Auth0 dashboard, add these URLs:
   - **Allowed Callback URLs:** `https://giuseppevizzari.github.io/pokedex2022-applicazioni-web`
   - **Allowed Logout URLs:** `https://giuseppevizzari.github.io/pokedex2022-applicazioni-web`
   - **Allowed Web Origins:** `https://giuseppevizzari.github.io`

## 📦 Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:5173](http://localhost:5173).

### `npm run build`

Builds the app for production to the `dist` folder.

### `npm run serve`

Preview the production build locally.

### `npm run deploy`

Deploys the production build to GitHub Pages.

## 🛠 Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router 6** - Client-side routing (HashRouter for GitHub Pages)
- **Auth0** - Authentication and authorization
- **Bootstrap 5** - UI components and styling
- **Reactstrap** - React Bootstrap components
- **GitHub Pages** - Static site hosting

## 📂 Project Structure

```
pokedex2022-applicazioni-web/
├── src/
│   ├── auth/                     # Authentication components
│   │   ├── Auth0ProviderWithNavigate.jsx
│   │   └── ProtectedRoute.jsx
│   ├── components/               # Reusable components
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── LoginButton/
│   │   ├── LogoutButton/
│   │   └── UserProfile/
│   ├── views/                    # Page components
│   │   ├── App/
│   │   ├── Home/
│   │   ├── Pokedex/
│   │   ├── PokemonDetail/
│   │   └── Info/
│   └── main.jsx                  # App entry point
├── .env.example                  # Environment variables template
├── .github/workflows/deploy.yml  # GitHub Actions deployment
├── AUTH0_SETUP.md               # Auth0 configuration guide
└── AUTH0_TUTORIAL.md            # Comprehensive Auth0 tutorial
```

## 🔒 Security Notes

- Auth0 Domain and Client ID are safe to expose in the client bundle (this is by design for SPAs)
- Never commit your `.env` file to version control
- Use GitHub Secrets for deployment credentials
- Never use the Auth0 Client Secret in frontend code

## 📚 Learn More

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Auth0 Documentation](https://auth0.com/docs)
- [React Router Documentation](https://reactrouter.com/)

## 👨‍🏫 Course Information

**Applicazioni Web: Progettazione e Sviluppo**  
[Course Link](https://elearning.unimib.it/course/view.php?id=61231)

## 📄 License

This project is for educational purposes.
