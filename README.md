<div align="center">

# 🎞️ GIF Finder

<p>Search, explore, and download GIFs with GIPHY.</p>

<p>
  <a href="https://github.com/aliveagain3228/gif-search">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository" />
  </a>
</p>

<p>
  <img src="https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/RxJS-7.8-B7178C?style=for-the-badge&logo=reactivex&logoColor=white" alt="RxJS" />
  <img src="https://img.shields.io/badge/GIPHY_API-Search-00CC99?style=for-the-badge&logo=giphy&logoColor=white" alt="GIPHY API" />
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

</div>

## About

GIF Finder is a single-page application for searching and exploring GIF animations. It uses the GIPHY API to find GIFs by keyword.

Search terms are stored in the URL, so you can refresh the page or share a search using its link.

## Features

- 🔎 Search GIFs by keyword
- 🔗 Keep the search query in the URL
- ↕️ Sort results by relevance or newest
- 🖼️ View GIF details, including creator, date, description, and source
- 📋 Copy a GIF link to the clipboard
- ⬇️ Download a GIF
- 📱 Responsive layout
- ⏳ Loading, error, and empty-result states

The app requests up to 24 results per search and uses G-rated content.

## Tech Stack

| Technology | Purpose |
|---|---|
| Angular 21 | Application framework |
| TypeScript | Application logic and types |
| RxJS | API requests and reactive data flow |
| Angular Signals | Component state |
| SCSS | Styling |
| GIPHY API | GIF search and metadata |
| Vercel | Deployment |

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
git clone https://github.com/aliveagain3228/gif-search.git
cd gif-search
npm install
