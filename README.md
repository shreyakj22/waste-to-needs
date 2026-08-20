\# Waste2Need – Bridging Technology, Sustainability, and Humanity



A full-stack MERN donation platform that connects donors with people who need reusable items — reducing waste while helping communities.







\## Features

\- Secure user authentication for donors and receivers

\- End-to-end item management via CRUD workflows (list, request, manage items)

\- Responsive, accessible React.js interfaces designed for usability across devices

\- Separate frontend apps for donors and receivers, backed by a shared Express/MongoDB API

\- Email notifications via SendGrid



\## Tech Stack

\- \*\*Frontend:\*\* React.js

\- \*\*Backend:\*\* Node.js, Express.js

\- \*\*Database:\*\* MongoDB Atlas

\- \*\*Email:\*\* SendGrid

\- \*\*Deployment:\*\* Vercel



\## Project Structure

```

waste-to-needs/

├── backend/              # Express API, MongoDB models, routes

├── frontend-donorss/     # React app for donors

├── frontend-receivers/   # React app for receivers

```



\## Getting Started



\### Prerequisites

\- Node.js installed

\- A MongoDB Atlas connection string

\- A SendGrid API key



\### Setup



1\. Clone the repo

&#x20;  ```bash

&#x20;  git clone https://github.com/shreyakj22/waste-to-needs.git

&#x20;  cd waste-to-needs

&#x20;  ```



2\. Install dependencies for each part

&#x20;  ```bash

&#x20;  cd backend \&\& npm install

&#x20;  cd ../frontend-donorss \&\& npm install

&#x20;  cd ../frontend-receivers \&\& npm install

&#x20;  ```



3\. Set up environment variables

&#x20;  Copy `.env.example` to `.env` in `backend/` and `frontend-donorss/`, then fill in your own values:

&#x20;  ```bash

&#x20;  cp .env.example backend/.env

&#x20;  cp .env.example frontend-donorss/.env

&#x20;  ```



4\. Run the backend

&#x20;  ```bash

&#x20;  cd backend

&#x20;  npm start

&#x20;  ```



5\. Run a frontend (in a separate terminal)

&#x20;  ```bash

&#x20;  cd frontend-donorss

&#x20;  npm start

&#x20;  ```




\## What I Built

This was a team project. My contributions:

\- Designed and implemented the responsive, accessible React interfaces for listing, requesting, and managing donated items

\- Worked on parts of the backend (API routes/logic connecting the frontend to MongoDB), alongside a teammate who led the backend implementation



\## Team

Built collaboratively as part of a team project.

