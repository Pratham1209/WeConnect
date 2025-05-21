# 🌐 WeConnect


![Status](https://img.shields.io/badge/status-live-success)
![Tech](https://img.shields.io/badge/built%20with-React%2C%20Node%2C%20MongoDB-blue)

> 👥 A full-stack platform to bridge the gap between people in need and volunteers — powered by real-time location & role-based services.

---

## 🚀 Live Demo

- 🖥️ **Frontend (Netlify)**: [https://weconnect-mp.netlify.app](https://weconnect-mp.netlify.app)

---

## 📦 Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Toastify, Animate.css
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Deployment**: Netlify (frontend), Render (backend)
- **Extras**: Geolocation API, JWT, Role-Based Routing

---

## 🛠️ Local Development Setup

### 📁 Clone the Repository

```bash
git clone https://github.com/Pratham1209/WeConnect.git
cd WeConnect
```

### 🔧 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with the following:

```env
MONGO_URI=your_mongodb_connection_string
PORT=10000
```

Start the backend server:

```bash
node server.js
```

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## ⚙️ Configuration Notes

- `vite.config.js` can be updated for proxy settings during development.
- Ensure geolocation permissions are granted for full functionality.
- User roles determine redirection: volunteers → dashboard, requesters → help page.

---

## 🧩 Key Features

- 🔐 **Role-Based Authentication**: Different flows for volunteers and users in need
- 📍 **Real-Time Location**: Tracks volunteer location during login
- 🆘 **Help Request System**: Requesters can easily submit help requests
- 🧭 **Dynamic Navigation**: Responsive routing based on role
- 🖼️ **Beautiful UI**: Clean and animated interface with TailwindCSS + Animate.css

---

## 🧪 Routes Overview

| Method | Endpoint                    | Description                    |
|--------|-----------------------------|--------------------------------|
| POST   | `/api/auth/login`          | User login with geolocation    |
| POST   | `/api/auth/register`       | New user registration          |
| POST   | `/api/help/helprequest`    | Submit a new help request      |

---

## 🙋‍♂️ Contributing

Pull requests are welcome! If you want to contribute:

1. Fork the repo
2. Create a new branch
3. Commit your changes
4. Open a pull request

---

## 🤝 Author & Maintainer

- 👨‍💻 [@Pratham](https://github.com/Pratham1209)
- 👨‍💻 [@Maitreyee](https://github.com/Maitreyee-D)

---
> 💡 _"Together, we connect. Together, we help."_ — **WeConnect**

