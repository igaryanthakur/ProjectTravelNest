# TravelNest

TravelNest is a Node.js + Express travel listing platform with authentication, image upload, map integration, reviews, and bookings.

Live deployment: [https://travelnest-vgaj.onrender.com/listings](https://travelnest-vgaj.onrender.com/listings)

## Tech Stack

- Node.js (18+)
- Express
- MongoDB Atlas + Mongoose
- EJS templates
- Passport (local auth)
- Cloudinary (image storage)
- Mapbox (geocoding + maps)

## Clone and Run Locally

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd ProjectTravelNest
```

### 2) Install dependencies

```bash
npm install
```

### 3) Create environment file

Create a `.env` file in the project root using `.env.example` as reference:

```env
ATLASDB_URL=
CLOUD_API_KEY=
CLOUD_API_SECRET=
CLOUD_NAME=
MAPBOX_TOKEN=
SECRET=
ADMIN=
PORT=8080
```

Notes:
- `ATLASDB_URL` should be your MongoDB connection string.
- `SECRET` is used for session encryption.
- `ADMIN` should be a valid MongoDB user `_id` string for admin-level actions.
- `PORT` is optional (defaults to `8080`).

### 4) (Optional) Seed sample data

```bash
npm run seed
```

Default seeded admin credentials:
- username: `admin`
- password: `admin`

### 5) Start the app

Production mode:

```bash
npm start
```

Development mode (auto-restart):

```bash
npm run dev
```

Open:
- `http://localhost:8080` (or your custom `PORT`)

## Available Scripts

- `npm start` - start server
- `npm run dev` - run server with nodemon
- `npm run seed` - initialize database with sample listings

## Common Issues

- Port already in use:
  - Change `PORT` in `.env` to another value (for example `5000`).
- MongoDB connection fails:
  - Verify `ATLASDB_URL`, network access, and DB user credentials.
- Maps or geocoding not working:
  - Verify `MAPBOX_TOKEN`.
- Image upload not working:
  - Verify Cloudinary keys (`CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET`).
