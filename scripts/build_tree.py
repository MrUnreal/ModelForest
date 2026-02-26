#!/usr/bin/env python3
"""
Merge curated and scraped data into unified output files.
Curated data takes priority on conflicts.
Outputs: data/models.json, data/relationships.json, data/tree.json, data/stats.json
"""

import json
from pathlib import Path
from datetime import datetime, timezone


ROOT = Path(__file__).parent.parent
CURATED_DIR = ROOT / "data" / "curated"
SCRAPED_FILE = ROOT / "data" / "scraped" / "huggingface.json"
DATA_DIR = ROOT / "data"


def load_curated():
    """Load all curated JSON files."""
    models = []
    relationships = []

    for f in sorted(CURATED_DIR.glob("*.json")):
        with open(f, encoding="utf-8") as fh:
            data = json.load(fh)
            if "models" in data:
                models.extend(data["models"])
            if "relationships" in data:
                relationships.extend(data["relationships"])

    return models, relationships


def load_scraped():
    """Load scraped HuggingFace data."""
    if not SCRAPED_FILE.exists():
        return [], []

    with open(SCRAPED_FILE, encoding="utf-8") as f:
        data = json.load(f)

    return data.get("models", []), data.get("relationships", [])


def merge(curated_models, curated_rels, scraped_models, scraped_rels):
    """Merge curated + scraped. Curated wins on conflicts."""
    model_map = {}

    # Curated first (higher priority)
    for m in curated_models:
        model_map[m["id"]] = m

    # Add scraped models not in curated
    for m in scraped_models:
        if m["id"] not in model_map:
            model_map[m["id"]] = m

    # Merge relationships (deduplicate)
    rel_set = set()
    merged_rels = []

    for r in curated_rels:
        key = (r["parent"], r["child"], r["type"])
        if key not in rel_set:
            rel_set.add(key)
            merged_rels.append(r)

    for r in scraped_rels:
        key = (r["parent"], r["child"], r["type"])
        if key not in rel_set:
            rel_set.add(key)
            merged_rels.append(r)

    return list(model_map.values()), merged_rels


def build_tree(models, relationships):
    """Build a nested tree structure for D3.js visualization."""
    model_map = {m["id"]: m for m in models}
    children_map = {}
    has_parent = set()

    for r in relationships:
        if r["parent"] not in children_map:
            children_map[r["parent"]] = []
        children_map[r["parent"]].append({
            "childId": r["child"],
            "type": r["type"]
        })
        has_parent.add(r["child"])

    def build_node(model_id, depth=0):
        model = model_map.get(model_id)
        if not model:
            return None

        children = []
        for c in children_map.get(model_id, []):
            node = build_node(c["childId"], depth + 1)
            if node:
                node["_relType"] = c["type"]
                children.append(node)

        result = {
            "id": model["id"],
            "name": model.get("shortName", model.get("name", model["id"])),
            "data": model,
        }
        if children:
            result["children"] = children

        return result

    roots = [m for m in models if m["id"] not in has_parent]
    root_nodes = [build_node(r["id"]) for r in roots]
    root_nodes = [n for n in root_nodes if n is not None]

    return {
        "id": "__root__",
        "name": "AI Models",
        "children": root_nodes
    }


def compute_stats(models, relationships):
    """Compute summary statistics."""
    companies = {}
    modalities = {}
    years = {}

    for m in models:
        company = m.get("company", "Unknown")
        companies[company] = companies.get(company, 0) + 1

        modality = m.get("modality", "unknown")
        modalities[modality] = modalities.get(modality, 0) + 1

        if m.get("releaseDate"):
            year = m["releaseDate"][:4]
            years[year] = years.get(year, 0) + 1

    return {
        "totalModels": len(models),
        "totalRelationships": len(relationships),
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
        "companies": companies,
        "modalities": modalities,
        "modelsByYear": years,
    }


def main():
    print("Loading curated data...")
    curated_models, curated_rels = load_curated()
    print(f"  {len(curated_models)} curated models, {len(curated_rels)} relationships")

    print("Loading scraped data...")
    scraped_models, scraped_rels = load_scraped()
    print(f"  {len(scraped_models)} scraped models, {len(scraped_rels)} relationships")

    print("Merging...")
    models, relationships = merge(
        curated_models, curated_rels,
        scraped_models, scraped_rels
    )
    print(f"  {len(models)} total models, {len(relationships)} total relationships")

    # Build outputs
    tree = build_tree(models, relationships)
    stats = compute_stats(models, relationships)

    # Save
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    outputs = {
        "models.json": models,
        "relationships.json": relationships,
        "tree.json": tree,
        "stats.json": stats,
    }

    for filename, data in outputs.items():
        path = DATA_DIR / filename
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"  Wrote {path}")

    print("\nBuild complete!")
    print(f"  Total: {stats['totalModels']} models, {stats['totalRelationships']} relationships")


if __name__ == "__main__":
    main()
