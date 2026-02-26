# AI Model Family Tree Visualizer — In-Depth Project Description

> An interactive, auto-updating visualization of AI model genealogy — showing how every major LLM, image model, and embedding model evolved from its ancestors.

---

## Table of Contents

1. [Vision & Value Proposition](#1-vision--value-proposition)
2. [Market Gap Validation](#2-market-gap-validation)
3. [Target Audience](#3-target-audience)
4. [Core Features (MVP → Full)](#4-core-features-mvp--full)
5. [Data Model & Schema](#5-data-model--schema)
6. [Data Sources & Ingestion Pipeline](#6-data-sources--ingestion-pipeline)
7. [Known Model Family Trees](#7-known-model-family-trees)
8. [Tech Stack](#8-tech-stack)
9. [Architecture & System Design](#9-architecture--system-design)
10. [Phased Build Plan](#10-phased-build-plan)
11. [UI/UX Design Specification](#11-uiux-design-specification)
12. [GitHub Actions Automation](#12-github-actions-automation)
13. [SEO & Discovery Strategy](#13-seo--discovery-strategy)
14. [Name Ideas & Domain Availability](#14-name-ideas--domain-availability)
15. [Monetization Potential](#15-monetization-potential)
16. [Risk Assessment & Mitigations](#16-risk-assessment--mitigations)
17. [Success Metrics](#17-success-metrics)
18. [Competitive Moat](#18-competitive-moat)

---

## 1. Vision & Value Proposition

### The Problem

The AI model landscape is exploding. There are now **1,000,000+** models on HuggingFace alone. New models launch daily — fine-tunes, merges, distillations, and entirely new architectures. Researchers, developers, journalists, and enthusiasts all ask the same questions:

- "What was Llama 3.1 based on?"
- "How is Mistral related to Mixtral?"
- "Which models descended from GPT-2?"
- "What's the lineage of the model I'm using?"
- "How did we get from BERT to modern LLMs?"

**There is no single, interactive, auto-updating visualization that answers these questions.** The information exists scattered across model cards, papers, blog posts, and Twitter threads — but nobody has assembled it into a living, browsable family tree.

### The Solution

**AI Model Family Tree** is a free, open-source, interactive visualization hosted on GitHub Pages that maps the entire genealogy of AI models. Think of it as an **"ancestry.com for AI models"** — a zoomable, searchable, filterable tree/graph that shows:

- Parent → child relationships (base model → fine-tune)
- Architecture lineages (Transformer → BERT → RoBERTa → DeBERTa)
- Company timelines (OpenAI's evolution, Meta's evolution, Google's evolution)
- Model merges (DPO merges, frankenmerges)
- Key milestones and breakthrough moments

### Why This Wins

| Factor | Details |
|--------|---------|
| **Zero competition** | 0 repositories exist for "LLM evolution tree" or "AI model family tree visualization" on GitHub |
| **Massive audience** | 1M+ HuggingFace users, millions of AI developers, researchers, students, journalists |
| **Auto-updating** | GitHub Actions + HuggingFace API = always current, zero maintenance |
| **Free to host** | Static site on GitHub Pages — $0/month forever |
| **Portfolio showcase** | Demonstrates data viz, API integration, automation, and AI domain expertise |
| **Viral potential** | Visual content gets shared — "look at how AI models evolved" is inherently shareable |
| **SEO goldmine** | People search "GPT family tree", "Llama lineage", "AI model history" constantly |

---

## 2. Market Gap Validation

### GitHub Search Results (June 2025)

| Search Query | Results | Actual Competitors |
|---|---|---|
| `"LLM evolution tree chart timeline"` | **0 repos** | None |
| `"AI model family tree visualization"` | **0 repos** | None |
| `"LLM genealogy lineage"` | **0 repos** | None |
| `"AI model tree timeline interactive"` | **0 repos** | None |
| `"model tree" OR "model genealogy" LLM AI` | 50.5K repos | All generic LLM tools (LangChain, Dify, etc.) — **zero visualizations** |

### Closest Existing Projects

| Project | What It Does | Why It's Not Competition |
|---|---|---|
| **eugeneyan/open-llms** (12.6K⭐) | Markdown table of open LLMs | Static list, no visualization, stale (last commit 2024) |
| **Mooler0410/LLMsPracticalGuide** (9.2K⭐) | LLM survey paper companion | Static image of model tree, not interactive, not updated |
| **HuggingFace model cards** | Individual model metadata | No aggregated view, no tree visualization |
| **ai-timeline.org** | AI milestone timeline | Events, not model relationships |
| **lifearchitect.ai/models** | Model comparison table | Table format, no genealogy |

### The Gap

There are **static images** in survey papers showing LLM evolution trees (e.g., the famous "LLM tree" from Zhao et al. 2023 survey). But these are:
- ❌ Static PNG/PDF images
- ❌ Out of date within weeks
- ❌ Not interactive (can't click, zoom, filter)
- ❌ Not searchable
- ❌ Not machine-readable
- ❌ Don't cover fine-tunes or merges

**This project fills ALL of those gaps.**

---

## 3. Target Audience

### Primary Users

| Audience | Use Case | Size |
|---|---|---|
| **AI/ML Developers** | Understand model lineage before choosing a base model | Millions |
| **Researchers** | Cite model genealogy in papers, discover derivative works | 100K+ |
| **AI Journalists/Content Creators** | Visual content for articles, videos, newsletters | 10K+ |
| **Students** | Learn AI history and evolution | 500K+ |
| **Technical Hiring Managers** | Understand candidate's model expertise context | 50K+ |

### Secondary Users

| Audience | Use Case |
|---|---|
| **AI Companies** | Track competitive landscape and derivative models |
| **Open Source Maintainers** | See who's building on their models |
| **Investors/VCs** | Understand model landscape for due diligence |
| **Policy Makers** | Understand AI model provenance and lineage |

---

## 4. Core Features (MVP → Full)

### Phase 1: MVP (Week 1-2) — Static Tree

- [ ] Interactive D3.js collapsible tree visualization
- [ ] 50-100 hand-curated major models with relationships
- [ ] Click any node → sidebar with model details (name, company, date, params, license)
- [ ] Color-coded by company (OpenAI=green, Meta=blue, Google=red, Mistral=orange, etc.)
- [ ] Zoom/pan with mouse/touch
- [ ] Basic search: type a model name → highlight + center on it
- [ ] Responsive design (desktop + mobile)
- [ ] GitHub Pages deployment

### Phase 2: Auto-Updates (Week 3-4) — Living Tree

- [ ] GitHub Actions workflow: scrape HuggingFace API daily
- [ ] Parse `base_model` tags from top models (by downloads/likes)
- [ ] Auto-generate JSON data file from API responses
- [ ] Merge auto-scraped data with hand-curated data (curated takes priority)
- [ ] "Last updated" timestamp on page
- [ ] RSS feed of newly added models

### Phase 3: Rich Interactivity (Week 5-6) — Power Features

- [ ] Filter by: company, architecture, date range, parameter count, license, modality
- [ ] Timeline view: horizontal timeline showing launches chronologically
- [ ] Comparison mode: select 2+ models → see shared ancestry
- [ ] Deep links: `modelforest.dev/tree/meta-llama/Llama-3.1-8B` → direct link to any model
- [ ] Model detail cards: training data, benchmark scores, context window, pricing
- [ ] Force-directed graph view (alternative to tree view for showing complex merges)

### Phase 4: Community & Ecosystem (Week 7-8) — Growth

- [ ] Contribution system: submit model relationships via GitHub Issues (structured template)
- [ ] API endpoint: `GET /api/models/{model_id}/ancestors` (static JSON)
- [ ] Embeddable widget: `<iframe>` snippet for blogs/docs
- [ ] Model merge visualization (multiple parents → single child)
- [ ] "Explore" mode: random walk through the tree with fun facts
- [ ] Image/multimodal model trees (Stable Diffusion family, DALL-E family)

### Phase 5: Advanced Analytics (Month 2+) — Insights

- [ ] Trend charts: models per month, open vs closed, parameter growth over time
- [ ] "Most forked" leaderboard: which base models spawn the most fine-tunes
- [ ] Architecture evolution: Transformer → MoE → SSM → hybrid timelines
- [ ] Company rivalry view: side-by-side company timelines
- [ ] Newsletter: weekly auto-generated digest of new model relationships

---

## 5. Data Model & Schema

### Core JSON Structure

```json
{
  "metadata": {
    "version": "1.0.0",
    "lastUpdated": "2025-06-15T00:00:00Z",
    "totalModels": 247,
    "totalRelationships": 312
  },
  "models": [
    {
      "id": "meta-llama/Llama-3.1-8B",
      "name": "Llama 3.1 8B",
      "shortName": "Llama 3.1 8B",
      "company": "Meta",
      "releaseDate": "2024-07-23",
      "parameters": "8B",
      "parametersRaw": 8000000000,
      "architecture": "LlamaForCausalLM",
      "architectureFamily": "Transformer (Decoder-only)",
      "modality": "text",
      "license": "llama3.1",
      "licenseType": "open-weight",
      "trainingData": ["CommonCrawl", "Wikipedia", "Books", "Code"],
      "contextWindow": 131072,
      "tags": ["llama-3", "facebook", "meta"],
      "huggingfaceUrl": "https://huggingface.co/meta-llama/Llama-3.1-8B",
      "paperUrl": "https://arxiv.org/abs/2407.21783",
      "blogUrl": "https://ai.meta.com/blog/meta-llama-3-1/",
      "description": "Meta's Llama 3.1 8B parameter model, part of the Llama 3.1 family.",
      "significance": "First truly multilingual Llama with 128K context",
      "source": "curated",
      "lastVerified": "2025-06-15"
    }
  ],
  "relationships": [
    {
      "parent": "meta-llama/Llama-3.1-8B",
      "child": "meta-llama/Llama-3.1-8B-Instruct",
      "type": "finetune",
      "method": "RLHF + DPO",
      "source": "huggingface-api",
      "confidence": "high"
    }
  ],
  "companies": [
    {
      "id": "meta",
      "name": "Meta AI",
      "color": "#0668E1",
      "logo": "meta.svg",
      "founded": "2013",
      "hqLocation": "Menlo Park, CA",
      "modelCount": 45
    }
  ],
  "architectures": [
    {
      "id": "transformer-decoder",
      "name": "Transformer (Decoder-only)",
      "introduced": "2017",
      "paper": "Attention Is All You Need",
      "paperUrl": "https://arxiv.org/abs/1706.03762"
    }
  ]
}
```

### Relationship Types

| Type | Description | Example |
|---|---|---|
| `base` | Original model → direct next version | GPT-3 → GPT-3.5 |
| `finetune` | Base model → instruction-tuned variant | Llama 3 → Llama 3 Instruct |
| `distillation` | Large model → smaller student model | GPT-4 → GPT-4o mini |
| `merge` | Multiple models → merged model | 2x Mistral → frankenmerge |
| `architecture` | Architecture inheritance | BERT → RoBERTa |
| `inspiration` | Conceptual influence (not direct code/weights) | GPT-2 → inspired Megatron |
| `quantization` | Full model → quantized variant | Llama 3.1 → Llama 3.1 GGUF |
| `multimodal-extension` | Text model → multimodal model | Llama 3.2 → Llama 3.2 Vision |

### Node Visual Encoding

```
Shape:      Circle (base model) | Diamond (fine-tune) | Hexagon (merge) | Square (closed-source)
Size:       Proportional to log(parameters)
Color:      By company (see company palette)
Border:     Solid (open-source) | Dashed (open-weight) | Dotted (closed-source)
Glow:       Pulsing glow for models added in last 7 days
Opacity:    Full (verified) | 50% (auto-scraped, unverified)
```

---

## 6. Data Sources & Ingestion Pipeline

### Primary: HuggingFace API (Automated)

The HuggingFace API provides `base_model` tags in model metadata, which directly encode parent-child relationships.

**API Endpoint:** `https://huggingface.co/api/models`

**Key Fields for Lineage:**

```
tags[]: "base_model:meta-llama/Llama-3.1-8B"           → parent model ID
tags[]: "base_model:finetune:mistralai/Mistral-7B-v0.3" → parent + relationship type
cardData.base_model: "mistralai/Mistral-7B-v0.3"        → parent model ID
config.architectures[]: "LlamaForCausalLM"               → architecture type
config.model_type: "llama"                                → architecture family
```

**Ingestion Strategy:**
1. Query top 10,000 models by downloads (paginated, 100/page)
2. Extract `base_model` from tags and `cardData`
3. Extract `model_type` and `architectures` from config
4. Build parent → child relationship graph
5. Merge with curated data (curated overrides API on conflicts)
6. Output: `data/models.json` + `data/relationships.json`

**Rate Limits:** HuggingFace API allows 1,000 requests/hour unauthenticated, 10,000/hour with token (free). GitHub Actions secret stores the token.

### Secondary: Hand-Curated Data (Manual)

For major models that are:
- Closed-source (OpenAI GPT series, Anthropic Claude series, Google Gemini)
- Pre-HuggingFace (GPT-1, GPT-2, BERT, T5)
- Missing `base_model` tags on HuggingFace

**Sources for manual curation:**
- Official company blog posts and press releases
- ArXiv papers (model cards, training details)
- Survey papers (Zhao et al. 2023, Minaee et al. 2024)
- Wikipedia "Large language model" article
- Model creators' Twitter/X announcements

### Tertiary: Community Contributions (GitHub Issues)

- Structured issue template: "Add Model Relationship"
- Fields: parent model, child model, relationship type, source URL, confidence level
- Reviewed and merged via PR by maintainer

### Data Quality Tiers

| Tier | Source | Confidence | Visual Treatment |
|---|---|---|---|
| **Gold** | Hand-curated with paper citation | 100% | Full opacity, verified badge |
| **Silver** | HuggingFace API `base_model` tag | 90% | Full opacity |
| **Bronze** | Community contribution (verified) | 80% | Full opacity |
| **Unverified** | Auto-scraped, no manual review | 50% | 50% opacity, no badge |

---

## 7. Known Model Family Trees

### The Core Trees to Curate for MVP

These are the major lineages that MUST be in the MVP to make it immediately valuable:

#### GPT Family (OpenAI)
```
GPT-1 (2018) 
  └─ GPT-2 (2019)
       └─ GPT-3 (2020)
            ├─ GPT-3.5 (2022)
            │    ├─ GPT-3.5 Turbo (2023)
            │    └─ ChatGPT (2022) [application]
            └─ GPT-4 (2023)
                 ├─ GPT-4 Turbo (2024)
                 ├─ GPT-4o (2024)
                 │    └─ GPT-4o mini (2024) [distillation]
                 └─ GPT-4.1 (2025)
                      ├─ GPT-4.1 mini (2025)
                      └─ GPT-4.1 nano (2025)
  
  o1 (2024) [reasoning branch]
       ├─ o1-mini (2024)
       ├─ o1-pro (2025)
       └─ o3 (2025)
            └─ o3-mini (2025)
            └─ o4-mini (2025)
```

#### Llama Family (Meta)
```
LLaMA 1 (2023, 7B/13B/33B/65B)
  ├─ Alpaca (Stanford, 2023) [finetune]
  ├─ Vicuna (LMSYS, 2023) [finetune]
  ├─ Koala (Berkeley, 2023) [finetune]
  ├─ WizardLM (Microsoft, 2023) [finetune]
  └─ Llama 2 (2023, 7B/13B/70B)
       ├─ Llama 2 Chat (2023) [finetune]
       ├─ Code Llama (2023) [code-specialization]
       │    └─ Code Llama Instruct (2023)
       ├─ Purple Llama (2023) [safety]
       └─ Llama 3 (2024, 8B/70B)
            ├─ Llama 3 Instruct (2024)
            ├─ Llama 3.1 (2024, 8B/70B/405B)
            │    ├─ Llama 3.1 Instruct (2024)
            │    └─ Llama 3.2 (2024, 1B/3B/11B/90B)
            │         ├─ Llama 3.2 Vision (2024) [multimodal]
            │         └─ Llama 3.3 (2024, 70B)
            └─ Llama 4 (2025)
                 ├─ Llama 4 Scout (2025, 17Bx16E MoE)
                 └─ Llama 4 Maverick (2025, 17Bx128E MoE)
```

#### BERT Family (Google)
```
Transformer (2017, "Attention Is All You Need")
  ├─ BERT (2018)
  │    ├─ RoBERTa (Meta, 2019) [improved training]
  │    ├─ DistilBERT (Hugging Face, 2019) [distillation]
  │    ├─ ALBERT (Google, 2019) [parameter reduction]
  │    ├─ ELECTRA (Google, 2020) [different pre-training]
  │    ├─ DeBERTa (Microsoft, 2020) [disentangled attention]
  │    │    └─ DeBERTa v3 (Microsoft, 2021)
  │    └─ ModernBERT (Answer.AI, 2024) [modernized architecture]
  ├─ GPT-1 (OpenAI, 2018) [decoder-only branch]
  └─ T5 (Google, 2019) [encoder-decoder]
       ├─ mT5 (Google, 2020) [multilingual]
       ├─ Flan-T5 (Google, 2022) [instruction-tuned]
       └─ UL2 (Google, 2022) [unified]
```

#### Mistral Family
```
Mistral 7B (2023)
  ├─ Mistral 7B Instruct v0.1 (2023)
  ├─ Mistral 7B v0.2 (2024)
  │    └─ Mistral 7B Instruct v0.2 (2024)
  ├─ Mistral 7B v0.3 (2024)
  │    └─ Mistral 7B Instruct v0.3 (2024)
  ├─ Mixtral 8x7B (2023) [MoE extension]
  │    └─ Mixtral 8x7B Instruct (2024)
  ├─ Mixtral 8x22B (2024)
  ├─ Mistral Small (2024)
  ├─ Mistral Medium (2024)
  ├─ Mistral Large (2024)
  │    └─ Mistral Large 2 (2024)
  ├─ Codestral (2024) [code]
  ├─ Pixtral (2024) [vision]
  │    └─ Pixtral Large (2024)
  └─ Mistral Small 3.1 (2025)
```

#### Claude Family (Anthropic)
```
Claude 1 (2023)
  ├─ Claude 1.3 (2023)
  ├─ Claude 2 (2023)
  │    └─ Claude 2.1 (2023)
  └─ Claude 3 (2024)
       ├─ Claude 3 Haiku (2024) [small]
       ├─ Claude 3 Sonnet (2024) [medium]
       │    └─ Claude 3.5 Sonnet (2024)
       │         └─ Claude 3.5 Sonnet v2 (2024)
       │              └─ Claude 3.6 Sonnet (2025)
       ├─ Claude 3 Opus (2024) [large]
       │    └─ Claude 3.5 Opus — unreleased
       └─ Claude 4 (2025)
            ├─ Claude 4 Sonnet (2025)
            └─ Claude 4 Opus (2025)
```

#### Gemini Family (Google DeepMind)
```
PaLM (2022)
  ├─ PaLM 2 (2023)
  │    └─ Med-PaLM 2 (2023) [medical]
  └─ Gemini 1.0 (2023)
       ├─ Gemini 1.0 Pro (2023)
       ├─ Gemini 1.0 Ultra (2024)
       ├─ Gemini 1.0 Nano (2023) [on-device]
       └─ Gemini 1.5 (2024)
            ├─ Gemini 1.5 Pro (2024)
            ├─ Gemini 1.5 Flash (2024)
            │    └─ Gemini 1.5 Flash 8B (2024)
            └─ Gemini 2.0 (2024)
                 ├─ Gemini 2.0 Flash (2024)
                 ├─ Gemini 2.5 Pro (2025)
                 └─ Gemini 2.5 Flash (2025)
```

#### Qwen Family (Alibaba)
```
Qwen 1 (2023, 7B/14B/72B)
  ├─ Qwen 1 Chat (2023) [finetune]
  ├─ Qwen 1.5 (2024, 0.5B-110B)
  │    └─ Qwen 1.5 Chat (2024)
  ├─ Qwen 2 (2024, 0.5B-72B)
  │    ├─ Qwen 2 Instruct (2024)
  │    └─ Qwen 2.5 (2024, 0.5B-72B)
  │         ├─ Qwen 2.5 Coder (2024) [code]
  │         ├─ Qwen 2.5 Math (2024) [math]
  │         ├─ Qwen 2.5 VL (2024) [vision]
  │         └─ QwQ (2024) [reasoning]
  └─ Qwen 3 (2025)
       ├─ Qwen 3 (2025, 0.6B-235B)
       └─ Qwen 3 Coder (2025) [code]
```

#### Stable Diffusion Family (Stability AI / Black Forest Labs)
```
Latent Diffusion (2021, CompVis)
  └─ Stable Diffusion 1.x (2022, Stability AI)
       ├─ SD 1.4 (2022)
       ├─ SD 1.5 (2022, Runway)
       │    └─ [1000s of community fine-tunes]
       ├─ SD 2.0 (2022)
       │    └─ SD 2.1 (2022)
       ├─ SDXL (2023)
       │    ├─ SDXL Turbo (2023) [distillation]
       │    └─ SDXL Lightning (2024) [distillation]
       └─ SD 3 (2024)
            └─ SD 3.5 (2024)

FLUX (2024, Black Forest Labs — ex-Stability team)
  ├─ FLUX.1 [schnell] (2024)
  ├─ FLUX.1 [dev] (2024)
  └─ FLUX.1 [pro] (2024)
```

#### DeepSeek Family
```
DeepSeek LLM (2023, 7B/67B)
  ├─ DeepSeek Chat (2023) [finetune]
  ├─ DeepSeek Coder (2023) [code]
  │    └─ DeepSeek Coder V2 (2024) [MoE]
  ├─ DeepSeek V2 (2024) [MoE, 236B]
  │    └─ DeepSeek V2 Chat (2024)
  ├─ DeepSeek V3 (2024, 671B MoE)
  └─ DeepSeek R1 (2025) [reasoning]
       ├─ DeepSeek R1 Distill (2025, various sizes)
       └─ DeepSeek R2 (2025) [rumored]
```

#### Phi Family (Microsoft)
```
Phi-1 (2023, 1.3B)
  ├─ Phi-1.5 (2023, 1.3B)
  └─ Phi-2 (2023, 2.7B)
       └─ Phi-3 (2024)
            ├─ Phi-3 mini (2024, 3.8B)
            ├─ Phi-3 small (2024, 7B)
            ├─ Phi-3 medium (2024, 14B)
            ├─ Phi-3 vision (2024) [multimodal]
            └─ Phi-4 (2024, 14B)
                 ├─ Phi-4 mini (2025, 3.8B)
                 └─ Phi-4 multimodal (2025) [vision+audio]
```

**Total for MVP: ~150-200 hand-curated models across 10+ families.**

---

## 8. Tech Stack

### Frontend (Static Site)

| Layer | Technology | Rationale |
|---|---|---|
| **Visualization** | D3.js v7 | Industry standard for data viz, perfect for trees/graphs, huge ecosystem |
| **Alternative Views** | Cytoscape.js (for force-directed graph view) | Better for complex graph layouts with cycles (merges) |
| **Framework** | Vanilla JS + Web Components | Zero build step, instant load, GitHub Pages friendly |
| **Styling** | Tailwind CSS (CDN) | Rapid UI development, dark mode built-in |
| **Search** | Fuse.js | Client-side fuzzy search, zero backend needed |
| **State Management** | URL query params + sessionStorage | Shareable deep links, no framework overhead |
| **Bundling** | None (ESM imports) or Vite | Keep it simple — no webpack/parcel complexity |

### Data Pipeline (GitHub Actions)

| Component | Technology | Rationale |
|---|---|---|
| **Scraper** | Python 3.12 + `huggingface_hub` | Official HF client, well-maintained |
| **Data Transform** | Python + `networkx` | Graph operations, cycle detection, topological sort |
| **Validation** | JSON Schema + custom checks | Ensure data integrity on every update |
| **Output** | Static JSON files in `/data/` | Consumed directly by frontend, cacheable |
| **Schedule** | GitHub Actions cron | Free, reliable, no server needed |

### Hosting

| Option | Cost | Pros | Cons |
|---|---|---|---|
| **GitHub Pages** ✅ | Free | Auto-deploy, built-in CDN, custom domain | 100GB/month bandwidth |
| Cloudflare Pages | Free | Unlimited bandwidth, edge caching | Extra setup |
| Vercel | Free tier | Preview deploys, edge functions | 100GB/month bandwidth |

**Recommendation: GitHub Pages** — consistent with user's existing portfolio (LLMTracker, byte-bet-capital). Add Cloudflare DNS for free CDN if traffic grows.

---

## 9. Architecture & System Design

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Repository                         │
│                                                                  │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐ │
│  │  /data/       │   │  /src/        │   │  /scripts/           │ │
│  │  models.json  │   │  index.html   │   │  scrape_hf.py        │ │
│  │  rels.json    │   │  app.js       │   │  build_tree.py       │ │
│  │  companies.json│  │  tree.js      │   │  validate_data.py    │ │
│  │  curated/     │   │  search.js    │   │  merge_sources.py    │ │
│  │   *.json      │   │  filters.js   │   │  generate_sitemap.py │ │
│  └──────┬───────┘   │  style.css    │   └──────────┬───────────┘ │
│         │            │  components/  │              │             │
│         │            └──────┬───────┘              │             │
│         │                   │                       │             │
│  ┌──────┴───────────────────┴───────────────────────┴──────────┐ │
│  │                    GitHub Actions                            │ │
│  │                                                              │ │
│  │  ┌─────────────┐   ┌─────────────┐   ┌──────────────────┐  │ │
│  │  │ Daily Scrape │   │ Build & Test │   │ Deploy to Pages  │  │ │
│  │  │ (6:00 UTC)   │──▶│ Validate    │──▶│ Auto-commit data │  │ │
│  │  └─────────────┘   └─────────────┘   └──────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

External APIs:
  🤗 HuggingFace API ──────▶ model metadata, base_model tags
  📄 Static curated JSONs ──▶ closed-source models, historical models
```

### Data Flow

```
1. SCRAPE   │  GitHub Actions runs daily at 06:00 UTC
            │  Python script queries HuggingFace API:
            │    GET /api/models?sort=downloads&direction=-1&limit=100&offset=0
            │    ... paginate through top 10,000 models
            │  Extract: id, base_model, tags, config, cardData, downloads, likes
            │
2. PARSE    │  For each model, extract relationships:
            │    tag "base_model:X" → relationship(parent=X, child=current, type=base)
            │    tag "base_model:finetune:X" → relationship(parent=X, child=current, type=finetune)
            │    tag "base_model:quantized:X" → relationship(parent=X, child=current, type=quantization)
            │    tag "base_model:adapter:X" → relationship(parent=X, child=current, type=adapter)
            │
3. MERGE    │  Load curated data from /data/curated/*.json
            │  Merge: curated data takes priority on conflicts
            │  Add: any HF models not in curated set
            │  Result: unified models.json + relationships.json
            │
4. VALIDATE │  JSON Schema validation
            │  Check: no orphan nodes (every child has a parent in the tree)
            │  Check: no cycles (directed acyclic graph)
            │  Check: no duplicate IDs
            │  Check: dates are valid and chronologically consistent
            │
5. BUILD    │  Generate derived data:
            │    - Tree structure (nested JSON for D3 tree layout)
            │    - Graph structure (nodes + edges for force-directed layout)
            │    - Search index (Fuse.js compatible)
            │    - Sitemap.xml (for SEO)
            │    - Stats (total models, models by company, etc.)
            │
6. DEPLOY   │  Commit updated data files to repo
            │  GitHub Pages auto-deploys on push
            │  CDN cache invalidation happens automatically
```

### File Structure

```
ai-model-family-tree/
├── .github/
│   ├── workflows/
│   │   ├── scrape.yml          # Daily HuggingFace scrape
│   │   ├── deploy.yml          # Build & deploy to Pages
│   │   └── validate-pr.yml     # Validate data PRs
│   └── ISSUE_TEMPLATE/
│       └── add-model.yml       # Structured model submission
├── data/
│   ├── curated/
│   │   ├── openai.json         # Hand-curated GPT family
│   │   ├── meta.json           # Hand-curated Llama family
│   │   ├── google.json         # Hand-curated Gemini/PaLM family
│   │   ├── anthropic.json      # Hand-curated Claude family
│   │   ├── mistral.json        # Hand-curated Mistral family
│   │   ├── deepseek.json       # Hand-curated DeepSeek family
│   │   ├── microsoft.json      # Hand-curated Phi family
│   │   ├── alibaba.json        # Hand-curated Qwen family
│   │   ├── stability.json      # Hand-curated SD/FLUX family
│   │   └── historical.json     # Pre-2023 models (BERT, T5, etc.)
│   ├── scraped/
│   │   └── huggingface.json    # Auto-scraped from HF API
│   ├── models.json             # Merged final output
│   ├── relationships.json      # All relationships
│   ├── tree.json               # Nested tree structure for D3
│   ├── graph.json              # Flat nodes+edges for force layout
│   ├── companies.json          # Company metadata + colors
│   ├── architectures.json      # Architecture types
│   ├── stats.json              # Summary statistics
│   └── search-index.json       # Fuse.js search index
├── scripts/
│   ├── scrape_hf.py            # HuggingFace API scraper
│   ├── build_tree.py           # Merge + transform data
│   ├── validate_data.py        # Schema + integrity validation
│   ├── generate_sitemap.py     # SEO sitemap generator
│   └── requirements.txt        # Python dependencies
├── src/
│   ├── index.html              # Main page
│   ├── css/
│   │   └── style.css           # Custom styles (Tailwind augmented)
│   ├── js/
│   │   ├── app.js              # Main application entry
│   │   ├── tree-view.js        # D3 collapsible tree visualization
│   │   ├── graph-view.js       # Force-directed graph visualization
│   │   ├── timeline-view.js    # Chronological timeline view
│   │   ├── search.js           # Fuse.js search integration
│   │   ├── filters.js          # Filter controls
│   │   ├── sidebar.js          # Model detail sidebar
│   │   ├── deep-links.js       # URL-based state management
│   │   └── utils.js            # Shared utilities
│   ├── components/
│   │   ├── model-card.js       # Model detail card component
│   │   ├── filter-panel.js     # Filter UI component
│   │   └── search-bar.js       # Search UI component
│   └── assets/
│       ├── company-logos/      # SVG logos for each company
│       └── og-image.png        # Social media preview image
├── README.md
├── CONTRIBUTING.md
├── LICENSE (MIT)
└── CNAME                       # Custom domain
```

---

## 10. Phased Build Plan

### Phase 1: MVP — The Static Tree (Week 1-2)

**Goal:** Ship a beautiful, interactive tree with 100+ hand-curated models.

| Day | Task | Details |
|---|---|---|
| 1 | Project setup | Repo, GitHub Pages, basic HTML/CSS scaffold, D3.js import |
| 2 | Data curation: GPT + Llama families | JSON files for ~40 models |
| 3 | Data curation: BERT, Mistral, Claude, Gemini families | JSON files for ~60 more models |
| 4 | D3.js tree visualization | Collapsible tree layout, zoom/pan, click interactions |
| 5 | Visual design | Color coding by company, node sizing by params, dark mode |
| 6 | Model detail sidebar | Click node → slide-out panel with model info |
| 7 | Search bar | Fuse.js integration, type-ahead, highlight + center on match |
| 8 | Polish & deploy | Responsive design, loading states, OG tags, README |
| 9 | Testing & fixes | Cross-browser testing, mobile touch support, edge cases |
| 10 | Launch | Reddit post, HN post, Twitter thread, HuggingFace community post |

**MVP Deliverable:** A fully functional, beautiful tree visualization at `modelforest.dev` with 100+ models.

### Phase 2: Auto-Updates — The Living Tree (Week 3-4)

| Day | Task | Details |
|---|---|---|
| 11 | Python scraper script | Query HF API, extract base_model relationships |
| 12 | Data merge pipeline | Combine scraped + curated, handle conflicts |
| 13 | Validation pipeline | JSON Schema, DAG checks, date consistency |
| 14 | GitHub Actions workflow | Cron schedule, auto-commit, error notifications |
| 15 | "Last updated" UI | Timestamp badge, "X new models this week" counter |
| 16 | Testing & monitoring | Verify auto-updates work, handle API failures gracefully |

### Phase 3: Rich Interactivity (Week 5-6)

| Day | Task | Details |
|---|---|---|
| 17-18 | Filter panel | Company, architecture, date range, params, license, modality |
| 19-20 | Timeline view | Horizontal chronological layout |
| 21-22 | Force-directed graph view | Alternative layout for merge visualization |
| 23-24 | Deep links + sharing | URL-encoded state, social sharing buttons |

### Phase 4: Community & Growth (Week 7-8)

| Day | Task | Details |
|---|---|---|
| 25-26 | GitHub Issue templates | Structured "Add Model" template with validation |
| 27-28 | Embeddable widget | iframe snippet, configurable size/theme |
| 29-30 | API endpoint | Static JSON API for programmatic access |
| 31-32 | SEO optimization | Sitemap, structured data, meta tags, blog posts |

### Phase 5: Advanced Features (Month 2+)

- Trend analytics dashboard
- Company comparison view
- Architecture evolution timeline
- Weekly auto-digest newsletter
- Image/video model trees
- Benchmark score overlays
- Community voting on "most influential model"

---

## 11. UI/UX Design Specification

### Overall Aesthetic

- **Theme:** Dark mode by default (light mode toggle), inspired by GitHub's dark theme
- **Font:** Inter (headings) + JetBrains Mono (model names/code)
- **Color Palette:** Dark navy background (#0d1117) with vibrant company-colored nodes

### Company Color Palette

| Company | Primary | Accent | Hex |
|---|---|---|---|
| OpenAI | Green | Light Green | `#10A37F` |
| Meta | Blue | Light Blue | `#0668E1` |
| Google | Multi | Yellow | `#FBBC04` |
| Anthropic | Tan | Brown | `#D4A574` |
| Mistral | Orange | Dark Orange | `#F7931A` |
| Microsoft | Blue | Cyan | `#00BCF2` |
| Alibaba (Qwen) | Orange-Red | Red | `#FF6A00` |
| DeepSeek | Blue | Navy | `#4A90D9` |
| Stability AI | Purple | Violet | `#A855F7` |
| Hugging Face | Yellow | Gold | `#FFD21E` |
| Cohere | Purple | Magenta | `#7C3AED` |
| xAI | White | Gray | `#FFFFFF` |
| AI21 Labs | Blue | Teal | `#0EA5E9` |

### Layout

```
┌────────────────────────────────────────────────────────────────────┐
│  🌳 AI Model Family Tree          [Search...🔍]  [Tree|Graph|Timeline] │
│  Last updated: 2 hours ago • 247 models • 312 relationships       │
├────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐                                                      │
│  │ FILTERS  │  ┌──────────────────────────────────────────────────┐│
│  │          │  │                                                  ││
│  │ Company  │  │              MAIN VISUALIZATION                 ││
│  │ □ OpenAI │  │                                                  ││
│  │ □ Meta   │  │         (D3.js Tree / Graph / Timeline)         ││
│  │ □ Google │  │                                                  ││
│  │ □ ...    │  │              ┌─────┐                            ││
│  │          │  │              │GPT-4│                            ││
│  │ Params   │  │           ┌──┴──┬──┴──┐                        ││
│  │ [==○===] │  │        ┌──┴┐ ┌─┴──┐ ┌┴──┐                    ││
│  │ 1B - 1T  │  │        │4T │ │4o  │ │4.1│                    ││
│  │          │  │        └───┘ └─┬──┘ └───┘                    ││
│  │ Date     │  │              ┌─┴──┐                            ││
│  │ [2017-25]│  │              │4o m│                            ││
│  │          │  │              └────┘                            ││
│  │ License  │  │                                                  ││
│  │ □ Open   │  │                                                  ││
│  │ □ Closed │  └──────────────────────────────────────────────────┘│
│  │          │                                                      │
│  │ Modality │  ┌────────────── MODEL DETAIL SIDEBAR ─────────────┐│
│  │ □ Text   │  │  Llama 3.1 8B                                   ││
│  │ □ Vision │  │  Meta AI • July 2024 • 8B params                ││
│  │ □ Code   │  │  License: Llama 3.1 Community                   ││
│  │          │  │  Architecture: LlamaForCausalLM                 ││
│  └──────────┘  │  Context: 128K tokens                           ││
│                │  [HuggingFace] [Paper] [Blog]                   ││
│                │  Children: 3 fine-tunes, 12 community models    ││
│                └─────────────────────────────────────────────────┘│
├────────────────────────────────────────────────────────────────────┤
│  Built by MrUnreal • GitHub • Data: HuggingFace API               │
└────────────────────────────────────────────────────────────────────┘
```

### Interaction Design

| Interaction | Action |
|---|---|
| **Click node** | Select model → show detail sidebar |
| **Double-click node** | Expand/collapse children |
| **Hover node** | Tooltip with name + company + params |
| **Scroll wheel** | Zoom in/out |
| **Click + drag** | Pan the canvas |
| **Ctrl + Click** | Add to comparison selection |
| **Type in search** | Fuzzy search → results dropdown → click → center on model |
| **Click filter** | Filter tree to show only matching models (gray out others) |
| **Click view toggle** | Switch between Tree / Graph / Timeline views |
| **Click "Share"** | Copy deep link URL to clipboard |

### Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| **Desktop (1200px+)** | Full layout: filters left, viz center, sidebar right |
| **Tablet (768-1199px)** | Filters collapse to dropdown, sidebar slides over viz |
| **Mobile (< 768px)** | Full-screen viz, filters/sidebar as bottom sheets |

---

## 12. GitHub Actions Automation

### Daily Scrape Workflow

```yaml
# .github/workflows/scrape.yml
name: Daily HuggingFace Scrape

on:
  schedule:
    - cron: '0 6 * * *'  # 6:00 UTC daily
  workflow_dispatch:      # Manual trigger

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          cache: 'pip'
      
      - run: pip install -r scripts/requirements.txt
      
      - name: Scrape HuggingFace API
        env:
          HF_TOKEN: ${{ secrets.HF_TOKEN }}
        run: python scripts/scrape_hf.py
      
      - name: Merge & Validate Data
        run: |
          python scripts/build_tree.py
          python scripts/validate_data.py
      
      - name: Generate Search Index & Sitemap
        run: |
          python scripts/generate_search_index.py
          python scripts/generate_sitemap.py
      
      - name: Commit & Push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add data/
          git diff --staged --quiet || git commit -m "🤖 Auto-update: $(date -u +%Y-%m-%d) | $(python -c 'import json; d=json.load(open("data/stats.json")); print(f"{d[\"totalModels\"]} models, {d[\"totalRelationships\"]} relationships")')"
          git push
```

### Python Scraper Core Logic

```python
# scripts/scrape_hf.py (simplified)
from huggingface_hub import HfApi
import json
from datetime import datetime

api = HfApi()
models = []
relationships = []

# Scrape top models by downloads
for model_info in api.list_models(
    sort="downloads",
    direction=-1,
    limit=10000,
    full=True,  # Include all metadata
    cardData=True,
):
    model = {
        "id": model_info.id,
        "name": model_info.id.split("/")[-1],
        "company": model_info.author or "unknown",
        "downloads": model_info.downloads,
        "likes": model_info.likes,
        "tags": model_info.tags or [],
        "pipeline_tag": model_info.pipeline_tag,
        "library_name": model_info.library_name,
        "created_at": model_info.created_at.isoformat() if model_info.created_at else None,
        "last_modified": model_info.last_modified.isoformat() if model_info.last_modified else None,
    }
    
    # Extract base_model relationships from tags
    for tag in (model_info.tags or []):
        if tag.startswith("base_model:"):
            parts = tag.split(":")
            if len(parts) == 2:
                # base_model:parent_id
                parent_id = parts[1]
                rel_type = "base"
            elif len(parts) == 3:
                # base_model:finetune:parent_id or base_model:quantized:parent_id
                rel_type = parts[1]
                parent_id = parts[2]
            else:
                continue
            
            relationships.append({
                "parent": parent_id,
                "child": model_info.id,
                "type": rel_type,
                "source": "huggingface-api",
                "confidence": "silver",
            })
    
    # Extract architecture info
    if model_info.config:
        model["architecture"] = model_info.config.get("architectures", [None])[0]
        model["model_type"] = model_info.config.get("model_type")
    
    models.append(model)

# Save scraped data
with open("data/scraped/huggingface.json", "w") as f:
    json.dump({
        "scraped_at": datetime.utcnow().isoformat(),
        "models": models,
        "relationships": relationships,
    }, f, indent=2)
```

---

## 13. SEO & Discovery Strategy

### Search Queries to Rank For

| Query | Monthly Searches (est.) | Difficulty |
|---|---|---|
| "LLM family tree" | 5,000+ | Low (no competition) |
| "AI model evolution" | 3,000+ | Low |
| "GPT family tree" | 2,000+ | Low |
| "Llama model family" | 1,500+ | Low |
| "AI model timeline" | 4,000+ | Medium |
| "LLM genealogy" | 500+ | Very Low |
| "what models are based on Llama" | 1,000+ | Low |
| "AI model comparison chart" | 8,000+ | Medium |
| "history of large language models" | 3,000+ | Medium |

### SEO Implementation

1. **Title Tag:** "AI Model Family Tree — Interactive Visualization of LLM Evolution"
2. **Meta Description:** "Explore the complete genealogy of AI models. See how GPT, Llama, Claude, Gemini, and 200+ models evolved. Interactive tree updated daily from HuggingFace."
3. **Structured Data:** JSON-LD for `Dataset`, `WebApplication`, `SoftwareApplication`
4. **Canonical URLs:** `/tree/openai/gpt-4`, `/tree/meta-llama/Llama-3.1-8B`
5. **Sitemap:** Auto-generated, one URL per model
6. **Open Graph:** Dynamic OG images showing the specific model's family branch
7. **Alt Text:** All SVG nodes have descriptive alt text

### Launch Strategy

| Channel | Action | Timing |
|---|---|---|
| **Hacker News** | "Show HN: I built an interactive family tree of every AI model" | Day 1 |
| **Reddit r/MachineLearning** | Post with preview GIF | Day 1 |
| **Reddit r/LocalLLaMA** | Post focused on open-source model trees | Day 1 |
| **Twitter/X** | Thread with screenshots, tag model creators | Day 1-3 |
| **HuggingFace Community** | Post in HF forums/discussions | Day 2 |
| **LinkedIn** | Professional post about AI landscape evolution | Day 3 |
| **Dev.to / Hashnode** | Technical blog post about building it | Week 2 |
| **AI newsletters** | Pitch to The Batch, TLDR AI, Import AI | Week 2-3 |

---

## 14. Name Ideas & Domain Availability

### Top Name Candidates

#### Tier 1: Strong + Memorable

| # | Name | Domain | Concept |
|---|---|---|---|
| 1 | **ModelForest** | modelforest.dev | Forest of model trees — playful, memorable |
| 2 | **ModelTree** | modeltree.dev | Direct and descriptive |
| 3 | **AIGenealogy** | aigenealogy.com | Ancestry.com vibes for AI |
| 4 | **ModelLineage** | modellineage.dev | Technical but clear |
| 5 | **AIRoots** | airoots.dev | "Where do AI models come from?" |
| 6 | **ModelAncestry** | modelancestry.com | Direct ancestry metaphor |
| 7 | **LLMTree** | llmtree.dev | Specific to LLMs |
| 8 | **AIFamilyTree** | aifamilytree.com | Exactly what it is |
| 9 | **ModelEvolution** | modelevolution.dev | Darwin vibes |
| 10 | **TheModelTree** | themodeltree.com | "The" implies definitive resource |

#### Tier 2: Creative + Brandable

| # | Name | Domain | Concept |
|---|---|---|---|
| 11 | **Pedigree AI** | pedigreeai.com | Dog breeding metaphor, fun |
| 12 | **ModelDNA** | modeldna.dev | Genetic metaphor |
| 13 | **NeuralRoots** | neuralroots.dev | Neural network + family roots |
| 14 | **ArchTree** | archtree.dev | Architecture + tree |
| 15 | **ModelOrchard** | modelorchard.dev | Garden of model trees |
| 16 | **WeightTree** | weighttree.dev | Model weights + tree |
| 17 | **ForkGraph** | forkgraph.dev | Git fork metaphor |
| 18 | **ParentModel** | parentmodel.dev | Direct: who's the parent? |
| 19 | **BaseModel.Tree** | basemodeltree.dev | Technical term |
| 20 | **ModelMap** | modelmap.ai | Map of all models |

#### Tier 3: Playful + Viral

| # | Name | Domain | Concept |
|---|---|---|---|
| 21 | **Who's Your Model** | whosyourmodel.com | "Who's your daddy" play on words |
| 22 | **ModelMommy** | modelmommy.dev | Playful parent reference |
| 23 | **AI Family Album** | aifamilyalbum.com | Photo album metaphor |
| 24 | **Model23andMe** | model23andme.dev | 23andMe reference |
| 25 | **Transformers: Origins** | transformers-origins.dev | Movie title vibes |

#### Tier 4: Professional + Authoritative

| # | Name | Domain | Concept |
|---|---|---|---|
| 26 | **AI Model Atlas** | aimodelatlas.com | Comprehensive reference |
| 27 | **ModelRegistry** | modelregistry.dev | Official registry feel |
| 28 | **AI Taxonomy** | aitaxonomy.dev | Scientific classification |
| 29 | **ModelGraph** | modelgraph.dev | Graph visualization |
| 30 | **The AI Chronicle** | theaichronicle.com | Historical record |

### Domain Availability Notes

Domains ending in `.dev` are available via Google Domains (now Squarespace) for ~$12/year. `.com` domains vary. GitHub Pages supports custom domains for free — just need the domain registration cost.

**Recommended name: `ModelForest`** — memorable, playful (it's a "forest" of model family "trees"), available as modelforest.dev, works as a GitHub repo name, and the visual metaphor (🌳) is perfect for social media.

**Alternative free option:** Use GitHub Pages default URL: `mrunreal.github.io/model-forest`

---

## 15. Monetization Potential

> This is a portfolio project — monetization is secondary. But here are options if it takes off:

| Method | How | Revenue Potential |
|---|---|---|
| **GitHub Sponsors** | "Support this project" button | $50-500/month |
| **API Access** | Rate-limited free tier, paid for bulk/commercial | $0 (free) to $100/month |
| **Embedded Attribution** | "Powered by ModelForest" link from embeds | SEO value |
| **Sponsorship Banners** | AI companies sponsor their family section | $500-2000/month |
| **Premium Data Export** | CSV/JSON export of full dataset | $0 (keep free for goodwill) |
| **Consulting** | "I built ModelForest" → leads to consulting gigs | Indirect |
| **Job Board** | "AI Companies Hiring" sidebar (like cursor.directory) | $100-500/month |

**Recommendation:** Keep it 100% free and open source. The portfolio value + reputation far exceeds any direct monetization.

---

## 16. Risk Assessment & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **HuggingFace API changes** | Medium | High | Pin API version, fall back to curated data, monitor for changes |
| **Data accuracy issues** | High | Medium | Quality tiers (gold/silver/bronze), community corrections via Issues |
| **HF rate limiting** | Low | Low | Use authenticated token (10K req/hr), cache aggressively |
| **Scope creep** | High | Medium | Strict phased approach, ship MVP first, iterate |
| **Someone copies the idea** | Low | Low | First-mover advantage, auto-updates create a moat, hard to replicate the curated data |
| **GitHub Pages bandwidth** | Low | Medium | Cloudflare CDN if needed, lazy-load model data |
| **Browser performance** | Medium | High | Virtualize large trees, progressive rendering, WebWorkers for data processing |
| **Outdated data** | Medium | Medium | Daily auto-updates solve this; "Last updated" badge builds trust |
| **Model naming conflicts** | Medium | Low | Use full HuggingFace IDs (org/model) as canonical identifiers |

---

## 17. Success Metrics

### 30-Day Goals (Post-Launch)

| Metric | Target | Measurement |
|---|---|---|
| GitHub Stars | 100+ | GitHub repo |
| Unique Visitors | 5,000+ | GitHub Pages analytics / Cloudflare analytics |
| Models in Database | 200+ (curated) + 5,000+ (auto-scraped) | `data/stats.json` |
| HN Front Page | Yes | Hacker News |
| Reddit Upvotes | 100+ combined | r/MachineLearning + r/LocalLLaMA |
| SEO Ranking | Top 3 for "LLM family tree" | Google Search Console |
| Community Contributions | 10+ model submissions | GitHub Issues |

### 90-Day Goals

| Metric | Target |
|---|---|
| GitHub Stars | 500+ |
| Monthly Visitors | 20,000+ |
| Backlinks | 50+ from blogs, docs, papers |
| Featured in | At least 2 AI newsletters |
| Auto-scraped Models | 10,000+ |
| Community Contributors | 25+ |

### 1-Year Vision

- **The definitive reference** for AI model genealogy
- Cited in academic papers
- Linked from HuggingFace model cards
- Used by journalists writing about AI
- 2,000+ GitHub stars
- Auto-updating with zero maintenance

---

## 18. Competitive Moat

### Why This Is Hard to Replicate

1. **Curated Data:** The hand-curated dataset of 200+ models with verified relationships, release dates, and historical context takes significant effort. This is the real value — not the code.

2. **Auto-Update Pipeline:** Once the GitHub Actions + HuggingFace API pipeline is running, it continuously expands the dataset. Competitors start from zero.

3. **First-Mover SEO:** Being the first "AI model family tree" means Google will rank it first. SEO compounds over time.

4. **Community Network Effect:** Once people start submitting model relationships via GitHub Issues, the data grows faster than any individual could maintain.

5. **Brand Recognition:** "ModelForest" becomes the word people use, like "awesome-list" became a recognized pattern.

6. **Living Data:** Static alternatives go stale. This stays current. The longer it runs, the more valuable the historical data becomes.

---

## Appendix A: Key API Endpoints

### HuggingFace API

```
# List models (paginated)
GET https://huggingface.co/api/models?sort=downloads&direction=-1&limit=100&offset=0

# Single model details
GET https://huggingface.co/api/models/{org}/{model}

# Models by author
GET https://huggingface.co/api/models?author=meta-llama&sort=downloads

# Models by tag
GET https://huggingface.co/api/models?filter=text-generation&sort=downloads
```

### Key Response Fields for Lineage

```json
{
  "id": "meta-llama/Llama-3.1-8B-Instruct",
  "tags": [
    "base_model:meta-llama/Llama-3.1-8B",           // ← PARENT ID
    "base_model:finetune:meta-llama/Llama-3.1-8B"   // ← PARENT + RELATIONSHIP TYPE
  ],
  "config": {
    "architectures": ["LlamaForCausalLM"],           // ← ARCHITECTURE
    "model_type": "llama"                            // ← ARCHITECTURE FAMILY
  },
  "cardData": {
    "base_model": "meta-llama/Llama-3.1-8B",        // ← ALTERNATIVE PARENT FIELD
    "license": "llama3.1"                            // ← LICENSE
  }
}
```

### Relationship Type Mapping from Tags

| Tag Pattern | Relationship Type |
|---|---|
| `base_model:{id}` | `base` (general parent) |
| `base_model:finetune:{id}` | `finetune` |
| `base_model:quantized:{id}` | `quantization` |
| `base_model:adapter:{id}` | `adapter` (LoRA, QLoRA) |
| `base_model:merge:{id}` | `merge` |

---

## Appendix B: Similar Visualization Projects (Non-AI) for Inspiration

| Project | What It Visualizes | Relevant Technique |
|---|---|---|
| **Observable HQ D3 trees** | Various hierarchical data | Collapsible tree layout |
| **npm.anvaka.com** | npm package dependencies | Force-directed graph |
| **githut.info** | GitHub language popularity | Timeline + area chart |
| **stars.github.com** | GitHub stars over time | Interactive timeline |
| **js_family_tree** (80⭐) | Human family trees with D3-dag | DAG layout (handles merges!) |
| **EvolutionOfTrust** | Game theory concepts | Interactive storytelling |

---

## Appendix C: Research Papers with Model Trees

These papers contain static tree images that validate the concept and can be used as data sources:

1. **"A Survey of Large Language Models"** — Zhao et al., 2023 (arXiv:2303.18223)
   - Contains the famous "LLM evolution tree" figure
   - 200+ models mapped
   - Cited 5000+ times

2. **"A Comprehensive Overview of Large Language Models"** — Naveed et al., 2023 (arXiv:2307.06435)
   - Detailed model family trees by company

3. **"Large Language Models: A Survey"** — Minaee et al., 2024 (arXiv:2402.06196)
   - Updated model trees including 2024 models

4. **"The Landscape of Emerging AI Agent Architectures"** — Masterman et al., 2024
   - Agent framework genealogy (future extension)

---

## Quick Start Checklist

- [ ] Create GitHub repo `model-forest` (or chosen name)
- [ ] Set up GitHub Pages with custom domain
- [ ] Create `data/curated/openai.json` — GPT family (10 models)
- [ ] Create `data/curated/meta.json` — Llama family (20 models)
- [ ] Build D3.js collapsible tree with 30 models
- [ ] Add company color coding
- [ ] Add click → detail sidebar
- [ ] Add search bar
- [ ] Deploy MVP
- [ ] Post to HN + Reddit
- [ ] Set up GitHub Actions for daily HuggingFace scrape
- [ ] Iterate based on feedback

---

*Document created: June 2025*
*Author: Research session with GitHub Copilot*
*Status: Ready for implementation*
