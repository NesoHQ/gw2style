# 🧥 GW2STYLE

**A community-driven fashion archive for Guild Wars 2 players.**
Players can showcase their character outfits, browse creative looks, and get inspired by the fashion of Tyria — all in one place.
The platform is free, open-source, and built to celebrate creativity within the GW2 community.

---

## 🎯 Project Goals

Build a central, free hub for Guild Wars 2 fashion — where players share, explore, and inspire each other.
Ensure full accessibility and open contribution: anyone can browse, and contributors can help improve the project.
Maintain a self-hosted, low-cost, transparent architecture, built with open tools and community-managed infrastructure.
Encourage collaboration through clear documentation, easy setup, and friendly contribution workflows.


## 🌟 Features

### **Core Features**

* Log in using your **Guild Wars 2 API key** (no password system).
* Create and share posts with:

* Title, Description, Armor Info, Weapons, Backpack, Extra Cosmetics, Tags, and Images.
* Browse all player submissions in a dynamic gallery.
* Infinite scrolling with the latest posts shown first.
* Clean, responsive UI.

### **Extended Features (Planned)**

* Search and filter posts by tags (e.g., race, armor type, theme).
* Like and favorite posts.
* Leaderboard of most-liked posts.
* Lightweight user galleries (all posts by one player).

### **Admin & Moderation**

* Delete your own submissions.
* Report inappropriate content.
* Optional admin dashboard for reviewing reported posts.

## ⚙️ Technical / Infrastructure Features

### **Frontend**

* Responsive layout for desktop and mobile.
* Infinite scrolling gallery and post detail pages.
* Accessible design (alt text, high contrast, keyboard-friendly).

### **Backend**

* REST API (CRUD for posts) written in **Go**.
* Input validation and basic rate limiting.

### **Database**

* **PostgreSQL** Each post linked to the GW2 user via API key username.
* Supports pagination and tag-based queries.

### **Performance**

* External image hosting (Imgur/Google drive/etc links only).
* Optimized database queries for smooth infinite scrolling.
* Caching/static rendering for homepage and common queries.

### **Hosting & Deployment**

* Hosted on a **Managed k3s cloud**.
* PostgreSQL on a dedicated node; app services deployed as containers.
* CI/CD with automatic builds and deployments from GitHub.

## 🤝 Contributing

Contributions are welcome!
You can help with:

* UI design & accessibility
* Backend endpoints (Go)
* Database optimizations
* Documentation & testing

> Join the discussion on [Discord](https://discord.com/invite/xvArbFbh34)
