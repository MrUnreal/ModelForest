# 🌳 ModelForest

**Interactive visualization of AI model genealogy** — see how every major LLM, image model, and embedding model evolved from its ancestors.

[![Deploy](https://github.com/MrUnreal/ModelForest/actions/workflows/deploy.yml/badge.svg)](https://github.com/MrUnreal/ModelForest/actions/workflows/deploy.yml)
[![Scrape](https://github.com/MrUnreal/ModelForest/actions/workflows/scrape.yml/badge.svg)](https://github.com/MrUnreal/ModelForest/actions/workflows/scrape.yml)

> **[🔗 Live Demo →](https://mrunreal.github.io/ModelForest/)**

![ModelForest Preview](https://img.shields.io/badge/Models-150+-green) ![Relationships](https://img.shields.io/badge/Relationships-200+-blue) ![Auto Updated](https://img.shields.io/badge/Updated-Daily-orange)

---

## What is this?

ModelForest is a free, open-source, interactive family tree of AI models. Like **ancestry.com for AI models** — a zoomable, searchable, filterable tree showing:

- 🔗 **Parent → Child** relationships (base model → fine-tune)
- 🏗️ **Architecture lineages** (Transformer → BERT → RoBERTa → DeBERTa)
- 🏢 **Company timelines** (OpenAI, Meta, Google, Anthropic, Mistral...)
- 🔀 **Model merges** and distillations
- ⭐ Key milestones and breakthrough moments

## Model Families Included

| Family | Company | Models |
|--------|---------|--------|
| GPT-1 → GPT-4.1 & o1-o4 | OpenAI | 19 |
| LLaMA → Llama 4 | Meta | 19 |
| Transformer → BERT → T5 & PaLM → Gemini 2.5 | Google | 25 |
| Claude 1 → Claude 4 | Anthropic | 12 |
| Mistral → Mixtral & Codestral | Mistral AI | 12 |
| DeepSeek → R1 | DeepSeek | 8 |
| Phi-1 → Phi-4 | Microsoft | 9 |
| Qwen → Qwen 3 | Alibaba | 7 |
| Stable Diffusion → FLUX | Stability AI / BFL | 10 |

## Features

- 🌳 **D3.js Collapsible Tree** — expand/collapse model branches
- 🔍 **Fuzzy Search** — find any model instantly (Ctrl+K)
- 🎨 **Color-coded** by company
- 📊 **Detail Sidebar** — click any model for full info
- 🎛️ **Filters** — by company, modality, license, year
- 🌐 **Radial View** — alternative circular layout
- 📱 **Responsive** — works on desktop, tablet, mobile
- 🤖 **Auto-updating** — daily HuggingFace API scrape via GitHub Actions
- 🆓 **Free forever** — static site on GitHub Pages

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Visualization | D3.js v7 |
| Search | Fuse.js |
| Styling | Custom CSS (dark theme) |
| Fonts | Inter + JetBrains Mono |
| Data Pipeline | Python + huggingface_hub |
| Automation | GitHub Actions (daily cron) |
| Hosting | GitHub Pages |

## Project Structure

```
ModelForest/
├── .github/workflows/     # CI/CD & auto-scraping
├── data/
│   ├── curated/           # Hand-verified model data (9 family files)
│   ├── scraped/           # Auto-scraped from HuggingFace API
│   ├── companies.json     # Company metadata & colors
│   └── stats.json         # Summary statistics
├── scripts/
│   ├── scrape_hf.py       # HuggingFace API scraper
│   ├── build_tree.py      # Data merge & tree builder
│   └── validate_data.py   # Data integrity checks
└── src/
    ├── index.html          # Main page
    ├── css/style.css       # Styles
    └── js/
        ├── app.js          # Main entry point
        ├── tree-view.js    # D3 tree visualization
        ├── search.js       # Fuzzy search
        ├── sidebar.js      # Detail panel
        └── filters.js      # Filter controls
```

## Development

### Local Setup

```bash
# Clone
git clone git@github.com:MrUnreal/ModelForest.git
cd ModelForest

# Serve locally (any static server works)
npx serve src
# or
python -m http.server 8000 -d src
```

Open `http://localhost:8000` — the app loads data from `../data/` relative to `src/`.

### Run Data Pipeline

```bash
# Install Python deps
pip install -r scripts/requirements.txt

# Validate curated data
python scripts/validate_data.py

# Build merged data files
python scripts/build_tree.py

# Scrape HuggingFace (optional, needs HF_TOKEN)
HF_TOKEN=your_token python scripts/scrape_hf.py
```

## Contributing

### Add a Model

1. [Open an issue](https://github.com/MrUnreal/ModelForest/issues/new?template=add-model.yml) using the "Add Model" template
2. Or submit a PR adding the model to the appropriate `data/curated/*.json` file

### Model Data Format

```json
{
  "id": "org/model-name",
  "name": "Model Name",
  "shortName": "Short Name",
  "company": "Company",
  "releaseDate": "2024-01-01",
  "parameters": "7B",
  "parametersRaw": 7000000000,
  "architecture": "LlamaForCausalLM",
  "architectureFamily": "Transformer (Decoder-only)",
  "modality": "text",
  "license": "apache-2.0",
  "licenseType": "open-source",
  "contextWindow": 8192,
  "description": "Brief description.",
  "source": "curated"
}
```

### Relationship Types

| Type | Description |
|------|-------------|
| `base` | Direct next version |
| `finetune` | Instruction-tuned variant |
| `distillation` | Smaller student model |
| `merge` | Multiple models merged |
| `architecture` | Architectural derivative |
| `quantization` | Quantized variant |
| `multimodal-extension` | Added new modality |

## License

MIT — see [LICENSE](LICENSE)

---

Built by [MrUnreal](https://github.com/MrUnreal) • Data from [HuggingFace](https://huggingface.co)
