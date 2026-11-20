# 🎧 The AI Music Charts

A lightweight, community-driven discovery platform and chart aggregator for **AI-generated music**.

The platform does **not** host audio files. It indexes metadata, cover art, creator links, and outbound links to where the track can be heard. This keeps storage costs low, reduces copyright exposure, and makes the platform fast and easy to maintain.

## ✨ What it does

- Discover AI-generated tracks across genres, creators, and AI tools.
- Browse Weekly, Monthly, Yearly, and Latest community charts.
- Rate tracks on a 1–10 community scale, save favorites, and flag broken or infringing links.
- Submit tracks using metadata and outbound links only.
- View creator aliases, albums, prompts/style tags, and track pages.
- Filter by genre, AI tool (Suno, Udio, Stable Audio, ElevenLabs, Riffusion), release date, and chart position.
- Highlight rising creators and #1 chart-topping tracks.

## 🚫 What it intentionally does not do

- Host or stream audio files.
- Allow direct audio uploads.
- Store copyrighted audio.
- Act as a full social network in version 1.

Tracks link out to external platforms such as Suno, Udio, YouTube, SoundCloud, Bandcamp, Spotify, or the creator’s own site.

## 🧠 Core concept

The AI Music Charts is a **discovery layer**, not a hosting platform.

```text
Creator submits track metadata
        ↓
Community discovers and rates (1–10)
        ↓
Charts update via time-decay algorithm
        ↓
Listeners click through to the original platform
```

## 🛠️ Recommended Tech Stack (Zero-Cost MVP)

- **Frontend:** Next.js (App Router) or SvelteKit + Tailwind CSS
- **Backend & Database:** Supabase (PostgreSQL + OAuth)
- **Hosting:** Vercel or Cloudflare Pages (Free Tier)
- **Monetization / Support:** Embedded Ko-fi or Buy Me a Coffee widget to cover minimal domain/database costs

## 🗄️ MVP Database Schema

To keep the initial build lean and near-zero cost, the core platform runs on two primary relational tables:

### `tracks`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary key |
| `title` | `text` | Track name |
| `artist_name` | `text` | Creator / AI alias |
| `album` | `text` | Optional album or EP title |
| `genre` | `text` | Primary genre tag (e.g., Cyberpunk, Synthwave, Lo-Fi) |
| `ai_tool` | `text` | Generator used (e.g., Suno, Udio, Stable Audio) |
| `source_platform` | `text` | Where the track is hosted (e.g., YouTube, Suno) |
| `external_url` | `text` | Outbound link to the original track |
| `cover_art_url` | `text` | Optional thumbnail URL (or auto-scraped OpenGraph image) |
| `prompt_snippet` | `text` | Optional prompt or style tags used to generate the track |
| `rating_avg` | `numeric` | Calculated average score (`1.0`–`10.0`) |
| `vote_count` | `integer` | Total number of community ratings |
| `created_at` | `timestamp` | Submission timestamp (used for time-decay charts) |

### `votes`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | Foreign key to authenticated user (prevents duplicate votes) |
| `track_id` | `uuid` | Foreign key to `tracks.id` |
| `score` | `integer` | Integer rating from `1` to `10` |
| `created_at` | `timestamp` | Vote timestamp |

## 📈 Chart Ranking Logic

Charts are segmented into **Weekly**, **Monthly**, and **Yearly** views using a time-decay gravity formula:

$$\text{Score} = \frac{\text{Average Rating} \times \log_{10}(\text{Vote Count} + 1)}{(\text{Hours Since Submission} + 2)^{G}}$$

- **$G$ (Gravity Constant):** Set higher for **Weekly** charts (e.g., `0.42`) to surface fresh submissions quickly, moderate for **Monthly** (`0.18`), and lower for **Yearly** (`0.04`) to reward sustained all-time favorites.

## 🛡️ Legal & Maintenance Safeguards

- **Outbound Linking Only:** Keeps bandwidth minimal and directs all plays/monetization to the original host platform and creator.
- **DMCA & Report Flow:** Every track entry includes a flag button for reporting dead links (`404`), non-AI audio, or copyright/impersonation takedown requests.
- **Scheduled Link Health Check:** Weekly lightweight cron job pings stored URLs and hides tracks whose source links have been deleted.

## 🚀 Version 1 Roadmap

- [ ] **Phase 1:** Set up Supabase project, database tables (`tracks`, `votes`), and OAuth login (Google/Discord).
- [ ] **Phase 2:** Build the track submission form with automatic OpenGraph title/platform detection.
- [ ] **Phase 3:** Build the main dark-mode feed with Genre/AI-tool filters and Weekly/Monthly/Yearly chart tabs.
- [ ] **Phase 4:** Implement the 1–10 rating system, report/flag modal, and Ko-fi/Buy Me a Coffee support modal.