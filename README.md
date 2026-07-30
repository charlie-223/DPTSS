
  # Disaster Preparedness System

  This is a code bundle for Disaster Preparedness System. The original project is available at https://www.figma.com/design/w61it5CUO4ilvutrwCROcO/Disaster-Preparedness-System.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

## Quick start (recommended)

Using npm:
```powershell
cd "c:\Users\patricia\Downloads\Disaster Preparedness System"
npm install
npm run dev
# then open http://localhost:5173/
```

Using pnpm (if installed):
```powershell
pnpm install
pnpm dev
```

## Build for production
```powershell
npm run build
# or pnpm build
```

## Serve production build locally
Install a simple static server and serve the `dist` folder:
```powershell
npm install -g serve
serve -s dist -l 5000
# open http://localhost:5000/
```

## Troubleshooting
- If you see a missing `react`/`react-dom` error, install the peer deps:
```powershell
npm install react@18.3.1 react-dom@18.3.1
```

If you'd like, I can add a `start` script to `package.json` to serve the production build automatically.
  