![Status](https://img.shields.io/badge/status-completed-blue)
![License](https://img.shields.io/badge/license-MIT-blue)(./LICENSE)
# ⚡️ Quest.IO


A real-time web application where users can create questionnaires, host interactive rooms, and analyze results live with visual feedback.

---

## 🚀 Features

* 🔐 User authentication (account creation & login)
* 📝 Create custom questionnaires
* 🏠 Create public or password-protected rooms
* 💬 Real-time text chat inside rooms
* 🎯 Live questionnaire gameplay
* 📊 Results visualization using bar graphs
* 👑 Room admin controls (start game, reveal results)

---

## 🧠 How It Works

1. Users create an account and log in
2. Create a questionnaire with multiple questions
3. Host a room:

   * Public (anyone can join)
   * Private (password protected)
4. Players join the room and chat
5. The admin starts the game
6. Players answer all questions
7. After completion, results are displayed as bar charts

---

## 📸 Screenshots


### 🏠 Rooms Page

<img width="930" height="988" alt="screenshot-2026-04-14_16-48-13" src="https://github.com/user-attachments/assets/432b87cf-3385-48f6-9ebb-043827f031f6" />

### 📝 Questionnaire Creation

<img width="933" height="992" alt="screenshot-2026-04-14_16-50-13" src="https://github.com/user-attachments/assets/e6c74faa-981b-44c0-9ed9-307c2f20c9f9" />
<img width="933" height="992" alt="screenshot-2026-04-14_16-51-22" src="https://github.com/user-attachments/assets/a6274985-2716-4b05-af13-4aaa1583d082" />

### ➕ Create Room

<img width="933" height="992" alt="screenshot-2026-04-14_16-52-01" src="https://github.com/user-attachments/assets/074617f1-612e-4731-9189-06817f5e7343" />
<img width="933" height="992" alt="screenshot-2026-04-14_16-52-15" src="https://github.com/user-attachments/assets/ff731268-c34a-495d-9725-5d3624a5a27a" />

### 🎮 Gameplay

<img width="1506" height="781" alt="screenshot-2026-04-14_16-54-16" src="https://github.com/user-attachments/assets/f0515e15-06e1-4c7f-bf11-30bd581accab" />
<img width="1506" height="781" alt="screenshot-2026-04-14_16-54-32" src="https://github.com/user-attachments/assets/a752d301-5321-4fd3-a1ac-ea7a459d827c" />
<img width="1506" height="781" alt="screenshot-2026-04-14_16-55-12" src="https://github.com/user-attachments/assets/729b801a-c3fe-4896-82cd-6a0bb2add7ea" />

---

## 🛠️ Tech Stack

### 🎨 Frontend

* React (with TypeScript)
* Vite (build tool & dev server)
* React Router (client-side routing)
* Bootstrap + Bootstrap Icons (UI styling)
* Sass (custom styling)
* Axios (HTTP requests)
* Chart.js + react-chartjs-2 (data visualization)

### ⚙️ Backend

* Node.js
* Express.js

### 🔄 Real-Time Communication

* Socket.IO (client & server)

### 🗄️ Database

* MariaDB

### 🔐 Authentication & Security

* bcrypt (password hashing)
* cookie-parser (session handling)

### 🌐 Other Tools & Libraries

* CORS (cross-origin requests)
* dotenv (environment configuration)
* http-proxy-middleware (API proxying)

---

## ⚙️ Installation

```bash
docker build server/ -t k4rma/backquest:latest
docker build frontend/quest/ -t k4rma/frontquest:latest
docker compose up
cat createTables.sql | mariadb -h 127.0.0.1 -P 3306 -u root -pmariadbPASSWORD
```
* The page will be accessible on localhost:5173. You can change the port on `compose.yaml`
> [!WARNING]
> This was made as a proof of concept. It should NOT be used for commercial use or anything more than learning and testing.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
