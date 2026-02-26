#!/usr/bin/env python3
"""
Scrape HuggingFace API for model metadata and base_model relationships.
Outputs data to data/scraped/huggingface.json
"""

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

try:
    from huggingface_hub import HfApi
except ImportError:
    print("ERROR: huggingface_hub not installed. Run: pip install huggingface_hub")
    sys.exit(1)


def scrape_models(max_models=10000):
    """Scrape top models from HuggingFace by downloads."""
    token = os.environ.get("HF_TOKEN")
    api = HfApi(token=token)

    models = []
    relationships = []
    seen_ids = set()

    print(f"Scraping top {max_models} models from HuggingFace...")

    try:
        model_iter = api.list_models(
            sort="downloads",
            direction=-1,
            limit=max_models,
            full=True,
            cardData=True,
        )

        for i, model_info in enumerate(model_iter):
            if i >= max_models:
                break

            if i % 500 == 0 and i > 0:
                print(f"  Processed {i} models...")

            model_id = model_info.id
            if model_id in seen_ids:
                continue
            seen_ids.add(model_id)

            # Build model record
            model = {
                "id": model_id,
                "name": model_id.split("/")[-1] if "/" in model_id else model_id,
                "company": model_info.author or "unknown",
                "downloads": model_info.downloads or 0,
                "likes": model_info.likes or 0,
                "tags": list(model_info.tags or []),
                "pipeline_tag": model_info.pipeline_tag,
                "library_name": getattr(model_info, "library_name", None),
                "created_at": (
                    model_info.created_at.isoformat()
                    if model_info.created_at
                    else None
                ),
                "last_modified": (
                    model_info.last_modified.isoformat()
                    if model_info.last_modified
                    else None
                ),
                "source": "huggingface-api",
            }

            # Extract architecture from config
            if model_info.config:
                config = model_info.config
                archs = config.get("architectures", [])
                model["architecture"] = archs[0] if archs else None
                model["model_type"] = config.get("model_type")

            # Extract base_model relationships from tags
            for tag in model_info.tags or []:
                if not tag.startswith("base_model:"):
                    continue

                parts = tag.split(":")
                if len(parts) == 2:
                    # base_model:parent_id
                    parent_id = parts[1]
                    rel_type = "base"
                elif len(parts) == 3:
                    # base_model:finetune:parent_id
                    rel_type = parts[1]
                    parent_id = parts[2]
                elif len(parts) == 4:
                    # base_model:finetune:org/model
                    rel_type = parts[1]
                    parent_id = f"{parts[2]}:{parts[3]}"
                else:
                    continue

                # Normalize relationship type
                rel_type = rel_type.lower().strip()
                if rel_type not in (
                    "base",
                    "finetune",
                    "quantized",
                    "adapter",
                    "merge",
                ):
                    rel_type = "base"

                # Map quantized -> quantization for consistency
                if rel_type == "quantized":
                    rel_type = "quantization"

                relationships.append(
                    {
                        "parent": parent_id,
                        "child": model_id,
                        "type": rel_type,
                        "source": "huggingface-api",
                        "confidence": "silver",
                    }
                )

            # Extract base_model from cardData
            if model_info.card_data:
                card_base = None
                if hasattr(model_info.card_data, "base_model"):
                    card_base = model_info.card_data.base_model
                elif isinstance(model_info.card_data, dict):
                    card_base = model_info.card_data.get("base_model")

                if card_base and isinstance(card_base, str):
                    # Check if we already have this relationship
                    existing = any(
                        r["parent"] == card_base and r["child"] == model_id
                        for r in relationships
                    )
                    if not existing:
                        relationships.append(
                            {
                                "parent": card_base,
                                "child": model_id,
                                "type": "base",
                                "source": "huggingface-carddata",
                                "confidence": "silver",
                            }
                        )

            models.append(model)

    except Exception as e:
        print(f"ERROR during scraping: {e}")
        if models:
            print(f"  Saving {len(models)} models collected so far...")

    return models, relationships


def save_results(models, relationships):
    """Save scraped data to JSON file."""
    output_dir = Path(__file__).parent.parent / "data" / "scraped"
    output_dir.mkdir(parents=True, exist_ok=True)

    output = {
        "scraped_at": datetime.now(timezone.utc).isoformat(),
        "total_models": len(models),
        "total_relationships": len(relationships),
        "models": models,
        "relationships": relationships,
    }

    output_path = output_dir / "huggingface.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\nSaved {len(models)} models and {len(relationships)} relationships")
    print(f"Output: {output_path}")


def main():
    max_models = int(os.environ.get("MAX_MODELS", "10000"))
    models, relationships = scrape_models(max_models)
    save_results(models, relationships)


if __name__ == "__main__":
    main()
