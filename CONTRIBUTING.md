# Contributing to ModelForest

Thanks for your interest in contributing! Here's how you can help:

## Adding Models

The easiest way to contribute is by adding model data:

1. **Via Issue**: [Open an issue](https://github.com/MrUnreal/ModelForest/issues/new?template=add-model.yml) with the "Add Model" template
2. **Via PR**: Add the model to the appropriate file in `data/curated/`

### Which file to edit?

| Company | File |
|---------|------|
| OpenAI | `data/curated/openai.json` |
| Meta | `data/curated/meta.json` |
| Google | `data/curated/google.json` |
| Anthropic | `data/curated/anthropic.json` |
| Mistral | `data/curated/mistral.json` |
| DeepSeek | `data/curated/deepseek.json` |
| Microsoft | `data/curated/microsoft.json` |
| Alibaba/Qwen | `data/curated/alibaba.json` |
| Stability AI / BFL | `data/curated/stability.json` |

For other companies, create a new file or add to the closest match.

### Data Quality

- Include a source URL (paper, blog, model card) for every relationship
- Set appropriate confidence levels
- Use HuggingFace model IDs when available
- Follow the existing JSON format exactly

## Code Contributions

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test locally: `npx serve src`
5. Run validation: `python scripts/validate_data.py`
6. Submit a PR

## Reporting Issues

- Use GitHub Issues for bugs and feature requests
- Include browser/OS info for visual bugs
- Screenshots are very helpful!

## Code Style

- JavaScript: ES modules, vanilla JS, no frameworks
- CSS: Custom properties, BEM-ish naming
- Python: Standard library preferred, type hints welcome
- JSON: 2-space indent, sorted keys where practical
