# 🗺️ Roadmap: GW2STYLE MVP & Beyond

## Overview

- **MVP Goal**: Launch a functional fashion archive platform that enables Guild Wars 2 players to share and discover character outfits
- **Launch Timeline**: Q1 2026
- **Success Metrics**: 
  - 5000+ outfit posts uploaded
  - 1,000+ monthly active visitors
  - 80%+ user retention after first post
  - Average session duration 15+ minutes

---

## Feature Prioritization (MoSCoW Method)

Use this table to triage features. Focus on **Must-Haves** for MVP launch.

| Priority | Feature Name | Description | Status | Est. Effort (SP) | Dependencies |
|----------|--------------|-------------|--------|------------------|--------------|
| **Must-Have (MVP Core)** | GW2 API Authentication | Login system using Guild Wars 2 API keys. Enables user identification without passwords. | ✅ Completed | 5 | None |
| **Must-Have (MVP Core)** | Post Creation System | Form to create posts with title, description, armor info, tags, and image links. Core feature for content generation. | 📅 Planned (v0.1) | 8 | Authentication |
| **Must-Have (MVP Core)** | Homepage Feed with Pagination | Display latest posts with infinite scrolling. Essential for content discovery. | 📅 Planned (v0.1) | 5 | Post Creation |
| **Must-Have (MVP Core)** | Post Deletion | Allow users to delete their own posts. Required for user control over content. | 📅 Planned (v0.1) | 3 | Authentication, Post Creation |
| **Must-Have (MVP Core)** | Basic UI/UX | Responsive layout for desktop and mobile. Clean, accessible interface. | 📅 Planned (v0.1) | 8 | None |
| **Should-Have (Post-MVP)** | Tag Search & Filtering | Filter posts by tags (race, armor type, theme). Significantly improves discoverability. | 📅 Planned (v0.2) | 5 | Post Creation |
| **Should-Have (Post-MVP)** | Likes/Reactions System | Let users like posts to show appreciation. Drives engagement and community. | 📅 Planned (v0.2) | 5 | Post Creation |
| **Should-Have (Post-MVP)** | Reporting & Moderation | User reporting with admin review queue. Essential for content quality. | 📅 Planned (v0.2) | 8 | Authentication |
| **Could-Have (Nice-to-Have)** | Leaderboard by Likes | Showcase most popular posts and creators. Gamification element. | 📅 Planned (v0.3) | 3 | Likes System |
| **Could-Have (Nice-to-Have)** | Search Bar & Advanced Filters | Full-text search across titles, descriptions, tags. Enhanced discovery. | 📅 Planned (v0.3) | 8 | Tag Filtering |
| **Could-Have (Nice-to-Have)** | User Galleries | View all posts from a specific creator. Community building feature. | 📅 Planned (v0.3) | 5 | Post Creation |
| **Could-Have (Nice-to-Have)** | Post Editing | Edit existing posts after creation. Improved user experience. | 📅 Planned (v0.3) | 5 | Post Creation |
| **Could-Have (Nice-to-Have)** | Admin Dashboard | Comprehensive moderation tools and analytics. Too complex for initial launch. | 📅 Future (v0.4+) | 13 | Reporting System |
| **Won't-Have (Out of Scope)** | Comments System | User comments on posts. Adds complexity and moderation overhead. | ❌ Not Planned | 13 | Authentication |
| **Won't-Have (Out of Scope)** | Direct Image Uploads | Self-hosted image storage. Cost and infrastructure complexity too high. | ❌ Not Planned | 21 | N/A |

**Legend:**
- ✅ Completed - Feature is implemented and tested
- 🚧 In Progress - Currently being developed
- 📅 Planned - Scheduled for development
- ❌ Not Planned - Outside current scope

---

## Development Phases

### Phase 1: MVP Launch (v0.1.0) — Q1 2026

**Goal:** Launch a functional minimum viable product for community validation.

**Core Features:**
- 📅 GW2 API Authentication (login/logout)
- 📅 Post creation with full outfit details
- 📅 Homepage feed with infinite scrolling
- 📅 Post deletion (user-owned only)
- 📅 Responsive UI polish (desktop + mobile)
- 📅 Basic accessibility features (alt text, keyboard navigation)

**Technical Deliverables:**
- Go backend REST API deployed to k3s cluster
- PostgreSQL database with posts and users tables
- Frontend with Next.js or similar framework
- CI/CD pipeline for automated deployments
- Basic error handling and input validation

**Testing & Quality:**
- Unit tests for backend endpoints
- Integration tests for authentication flow
- Beta testing with 20-30 GW2 community members
- Performance testing (page load < 2s, API response < 200ms)

**Known Risks:**
- GW2 API rate limits under heavy load → **Mitigation:** Implement caching layer
- Low initial adoption → **Mitigation:** Pre-launch community building on Discord/Reddit
- Image hosting links breaking → **Mitigation:** Validate URLs on submission, consider fallback images

**Launch Checklist:**
- [ ] All MVP features tested and working
- [ ] Documentation complete (README, CONTRIBUTING)
- [ ] Privacy policy and terms of service drafted
- [ ] Community Discord server set up
- [ ] Soft launch with beta testers (2 weeks)
- [ ] Public announcement on r/Guildwars2

---

### Phase 2: Community Growth (v0.2.0) — Q2 2026

**Goal:** Enhance discoverability and community engagement based on MVP feedback.

**Target Metrics:**
- 2,000+ outfit posts
- 5,000+ monthly visitors
- 50+ daily active users

**Features:**
- 📅 Tag search & filtering system
- 📅 Likes/reactions on posts
- 📅 User reporting and basic moderation
- 📅 Improved post editor with preview
- 📅 User profile pages (lightweight galleries)

**Community Initiatives:**
- Weekly featured outfits
- Community contests (best themed outfit)
- Partnership with GW2 content creators
- Regular feedback surveys

**Timeline:** 8-12 weeks post-MVP launch

**Dependencies:**
- Stable MVP with consistent uptime
- Active community providing feedback
- At least 200+ posts for meaningful filtering

---

### Phase 3: Advanced Features (v0.3.0) — Q3 2026

**Goal:** Provide power-user features and enhance content discovery.

**Features:**
- 📅 Leaderboard (most-liked posts/creators)
- 📅 Full-text search with autocomplete
- 📅 Advanced filters (date range, armor weight, race)
- 📅 Post editing functionality
- 📅 User galleries and profiles
- 📅 "Favorite" posts collection

**Technical Improvements:**
- Performance optimization (caching layer)
- Database indexing improvements
- CDN integration for faster loading
- Analytics dashboard (public stats)

**Timeline:** 12-16 weeks post-v0.2.0

---

### Phase 4: Platform Maturity (v0.4.0+) — Q4 2026

**Goal:** Build robust moderation tools and scale infrastructure.

**Features:**
- Admin dashboard with full moderation suite
- Automated content flagging
- User management tools
- Advanced analytics and insights
- API webhooks for third-party integrations
- Mobile app (possible)

**Infrastructure:**
- Multi-region deployment
- Automated backups and disaster recovery
- Monitoring and alerting system
- Load balancing for high traffic

**Timeline:** 6+ months post-v0.3.0

---

## Current Sprint (Active Development)

**Sprint Goal:** Complete MVP v0.1.0 for beta launch

**In Progress:**
- 🚧 UI/UX polish and responsive design
- 🚧 Accessibility improvements (WCAG 2.1 AA compliance)
- 🚧 Beta testing feedback integration
- 🚧 Documentation updates

**Next Up:**
- Performance testing and optimization
- Security audit and penetration testing
- Deployment to production environment
- Community announcement materials

---

## Feature Requests & Voting

We use **GitHub Issues** for feature proposals and community voting.

### How to Propose a Feature
1. Check existing [feature requests](https://github.com/NesoHQ/gw2style/issues?q=is%3Aissue+is%3Aopen+label%3Afeature)
2. Create a new issue using the [feature request template](https://github.com/NesoHQ/gw2style/issues/new?template=feature_request.md)
3. Describe the problem, proposed solution, and expected impact

### How to Vote on Features
- 👍 **High Priority** - I need this feature!
- ❤️ **Nice to Have** - This would improve my experience
- 🚀 **Game Changer** - This would make me use the platform more

**Most-Requested Features** (updated monthly):
- _Will be populated after MVP launch based on community feedback_

---

## Success Metrics & KPIs

We track these metrics to measure platform health and growth:

### User Engagement
- Monthly Active Users (MAU)
- Daily Active Users (DAU)
- Average session duration
- Posts created per user
- Return visitor rate

### Content Quality
- Total outfit posts
- Posts with complete information (%)
- Image link success rate
- Average likes per post
- Report rate (lower is better)

### Technical Performance
- Page load time (target: < 2s)
- API response time (target: < 200ms)
- Uptime percentage (target: 99.5%)
- Error rate (target: < 0.5%)

### Community Health
- Discord member count
- GitHub contributors
- Community sentiment (qualitative)
- Feature request engagement

---

## How to Contribute

### Code Contributions
- Check the [CONTRIBUTING.md](CONTRIBUTING.md) guide
- Pick an issue labeled `good first issue` or `help wanted`
- Join our [Discord](https://discord.com/invite/xvArbFbh34) to discuss your approach

### Non-Code Contributions
- Beta test new features
- Report bugs and suggest improvements
- Share the platform with your guild
- Create tutorial content or guides
- Help moderate the community

### Roadmap Feedback
- Comment on this roadmap via GitHub Issues
- Share your priorities in Discord #feedback channel
- Participate in quarterly community surveys

---

## Changelog

### v0.1.0 (MVP) — Target: Q1 2026
- Initial launch with core features
- Authentication, post creation, feed, deletion
- Responsive UI for desktop and mobile

---

**Last Updated:** October 13, 2025  
**Next Review:** Monthly (after MVP launch)

💬 **Feedback welcome!** Join our [Discord](https://discord.com/invite/xvArbFbh34) or open a [GitHub Issue](https://github.com/NesoHQ/gw2style/issues/new)