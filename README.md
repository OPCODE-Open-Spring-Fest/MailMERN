# 💌 MERN Mass Email Sender & AI Auto-Responder
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

A full-stack **MERN Starter Project** for creating an **open-source email marketing platform** — similar to **AWeber** or **Mailchimp** — that can:
- 📩 Send **mass emails** to large groups efficiently  
- 🤖 Provide **AI-powered automated replies**  
- 📅 Schedule meetings, reply to FAQs, and manage follow-up messages automatically  

---

## 🚀 Tech Stack

**Frontend:** React (Vite or CRA)  
**Backend:** Node.js + Express  
**Database:** MongoDB (Mongoose)  
**Email Service:** Nodemailer / Gmail API / SendGrid (planned)  
**AI Bot Engine:** OpenAI API / Local Model Integration (planned)  
**Styling:** CSS / Tailwind  
**Routing:** React Router v6  
**Task Scheduling:** Node Cron  

---

## 🎯 Project Goal

To create an **open-source scalable platform** where contributors can collaboratively build:
- Bulk email campaigns  
- Contact management system  
- Template-based email editor  
- AI assistant for automated replies  
- Analytics dashboard for sent & opened emails  

---

## 📁 Folder Structure
```bash
MailMERN/
│
├── backend/ # Node.js + Express API backend
│ ├── server.js # Main backend entry point
│ ├── routes/ # Express routes
│ │ ├── emailRoutes.js # Routes for sending & managing emails
│ │ ├── userRoutes.js # Routes for authentication & profiles
│ │ └── chatbotRoutes.js # Routes for AI-based auto responses
│ ├── controllers/ # Controller logic for routes
│ │ ├── emailController.js
│ │ ├── userController.js
│ │ └── chatbotController.js
│ ├── models/ # MongoDB models
│ │ ├── User.js
│ │ ├── Campaign.js
│ │ └── Message.js
│ ├── utils/ # Helper files
│ │ ├── sendEmail.js # Nodemailer logic
│ │ ├── openaiClient.js # AI chatbot integration
│ │ └── scheduler.js # Cron job for scheduled emails
│ ├── config/ # DB & server config
│ │ ├── db.js
│ │ └── dotenv.config.js
│ └── .env.example # Example environment variables
│
├── frontend/ # React frontend
│ ├── src/
│ │ ├── pages/ # App pages
│ │ │ ├── Home.jsx
│ │ │ ├── Campaigns.jsx
│ │ │ ├── Chatbot.jsx
│ │ │ ├── Analytics.jsx
│ │ │ ├── About.jsx
│ │ │ ├── Contact.jsx
│ │ │ └── NotFound.jsx
│ │ ├── components/ # Reusable components
│ │ │ ├── Navbar.jsx
│ │ │ ├── Footer.jsx
│ │ │ ├── CampaignCard.jsx
│ │ │ ├── ChatbotWidget.jsx
│ │ │ └── Loader.jsx
│ │ ├── App.jsx # Routing setup
│ │ ├── main.jsx # ReactDOM entry point
│ │ ├── assets/ # Images and icons
│ │ └── styles/ # Global styles
│ ├── package.json
│ └── vite.config.js
│
├── .gitignore
├── package.json # Root file for concurrent scripts
├── README.md # Project documentation
└── LICENSE # Open source license

```
---

## ⚙️ Environment Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/OPCODE-Open-Spring-Fest/MailMERN.git
cd MailMERN
```
2️⃣ Backend Setup
```bash
cd backend
npm install
```
Create a .env file based on .env.example:
```bash
PORT=5000
MONGO_URI=your_mongodb_uri
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_app_password
OPENAI_API_KEY=your_openai_key
```
Run the backend:
```bash
npm run dev
```
3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open:
👉 http://localhost:5173
 (Vite)
or
👉 http://localhost:3000
 (CRA)

4️⃣ Run Both (Optional)

In the root directory, add to package.json:

"scripts": {
  "start": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\""
}


Then simply run:

npm start

## 🤖 Planned Features

| Feature | Description | Status |
|----------|-------------|--------|
| 📧 Mass Email Sending | Send personalized bulk emails | ✅ Base setup |
| 🧠 AI Auto Responder | AI chatbot replies to received emails | 🧩 Planned |
| 📅 Scheduler | Schedule campaigns for future dates | 🧩 Planned |
| 📊 Dashboard | Track sent, opened, and clicked emails | 🧩 Planned |
| 📂 Contact Management | Upload and manage email lists | 🧩 Planned |
| ✉️ Template Builder | Create and edit HTML email templates | 🧩 Planned |

👩‍💻 Contribution Guide

We ❤️ contributions from the community!

Step 1: Fork the Repo from github and then clone it in local pc
```bash
git clone https://github.com/OPCODE-Open-Spring-Fest/MailMERN
```
Step 2: Create a Branch
```bash
git checkout -b feat/your-feature-name
```
Step 3: Make Changes

Add your updates inside frontend or backend folder.

Step 4: Commit & Push
```bash
git add .
git commit -m "feat: added <feature>"
git push origin feat/your-feature-name
```
Step 5: Create a Pull Request

Go to GitHub → Pull Requests → New PR
Describe your changes, link related issues, and submit 🚀

🧠 How It Works (Concept)

User uploads contact list (CSV/Excel)
→ Contacts stored in MongoDB

User creates a campaign
→ Selects template and message content

System sends emails using Nodemailer / SendGrid
→ Logs results (sent, failed, bounced)

Incoming replies trigger AI chatbot
→ Uses OpenAI API to auto-reply, schedule meetings, or answer FAQs

🧪 Scripts
Command	Description

npm run dev (backend)	Start Express server
npm run dev (frontend)	Start React frontend
npm start (root)	Run both concurrently
🧩 Future Enhancements

Add JWT authentication

Integrate email tracking via Pixel

Add custom analytics dashboard

Integrate Google Calendar API for scheduling meetings

Support multiple SMTP providers

⚖️ License

This project is open-sourced under the MIT License.
You’re free to use, modify, and distribute — just give credit.

## 👤 Maintainer

**Md Irfan Raj**  
🪪 Code Name: *Silver*  
📧 mdirfanraj88.omega@gmail.com



🌟 Support & Contribution

If you like this project:

⭐ Star this repository

💬 Share feedback in Issues

🚀 Contribute by raising PRs

Together, let’s build an open-source AI-powered mass email platform!
## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/SUJALGOYALL"><img src="https://avatars.githubusercontent.com/u/149406142?v=4?s=100" width="100px;" alt="sujalgoyall"/><br /><sub><b>sujalgoyall</b></sub></a><br /><a href="https://github.com/OPCODE-Open-Spring-Fest/MailMERN/commits?author=SUJALGOYALL" title="Code">💻</a> <a href="https://github.com/OPCODE-Open-Spring-Fest/MailMERN/commits?author=SUJALGOYALL" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!