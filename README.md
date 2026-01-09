DUFYA

Dufya is a full-stack web application built with Node.js, Express, MongoDB, and vanilla HTML/CSS/JS.
The project focuses on authentication, clean UI, and a custom backend setup without using website builders.

 🚀 Features

 User registration & login
 Custom authentication flow
 MongoDB database integration with Mongoose
 Express-powered backend
 Static frontend served from the backend
 Environment variable support using dotenv

🛠️ Tech Stack

  Backend: Node.js, Express
  Database: MongoDB, Mongoose
  Frontend: HTML, CSS, JavaScript
  Deployment: Vercel 

 📂 Project Structure


Dufya/
│
├── models/          # Mongoose schemas
├── routes/          # Express routes (auth, etc.)
├── views/           # HTML files
├── public/          # Static assets (CSS, JS, images)
├── server.js        # Main server entry point
├── package.json
└── .env             # Environment variables


⚙️ Installation & Setup

1. Clone the repository

```bash
git clone https://github.com/Ezorelle/Dufya.git
cd Dufya
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

4. Start the server

```bash
npm start
```

or (for development):

```bash
npm run dev
```

 ⚠️ Important Note (Version Compatibility)

During development, the project encountered runtime issues caused by newer versions of Express and Mongoose.

The issue was resolved by **downgrading to stable, compatible versions.

If you face unexpected errors:

- Ensure Express and Mongoose versions match those in `package.json`
- Avoid auto-upgrading dependencies unless tested


AUTHOR
--
Jeff
GitHub: [https://github.com/Ezorelle](https://github.com/Ezorelle)
* Improved UI/UX
* Better error handling & logging
