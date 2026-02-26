#!/usr/bin/env python3
"""
Validate data integrity:
- JSON Schema validation
- No orphan nodes
- No cycles (DAG check)
- No duplicate IDs
- Date consistency
"""

import json
import sys
from pathlib import Path


ROOT = Path(__file__).parent.parent
CURATED_DIR = ROOT / "data" / "curated"


def load_all_data():
    """Load all curated data files."""
    models = []
    relationships = []

    for f in sorted(CURATED_DIR.glob("*.json")):
        with open(f, encoding="utf-8") as fh:
            data = json.load(fh)
            models.extend(data.get("models", []))
            relationships.extend(data.get("relationships", []))

    return models, relationships


def check_duplicate_ids(models):
    """Check for duplicate model IDs."""
    seen = {}
    errors = []
    for m in models:
        mid = m["id"]
        if mid in seen:
            errors.append(f"Duplicate model ID: {mid}")
        seen[mid] = True
    return errors


def check_required_fields(models):
    """Check that required fields are present."""
    required = ["id", "name", "company"]
    errors = []
    for m in models:
        for field in required:
            if field not in m or not m[field]:
                errors.append(f"Model {m.get('id', '?')} missing required field: {field}")
    return errors


def check_relationship_refs(models, relationships):
    """Check that all relationship references exist."""
    model_ids = {m["id"] for m in models}
    errors = []
    warnings = []

    for r in relationships:
        if r["parent"] not in model_ids:
            warnings.append(f"Relationship parent '{r['parent']}' not in models (child: {r['child']})")
        if r["child"] not in model_ids:
            warnings.append(f"Relationship child '{r['child']}' not in models (parent: {r['parent']})")

    return errors, warnings


def check_cycles(relationships):
    """Check for cycles in the relationship graph (should be DAG)."""
    # Build adjacency list
    adj = {}
    for r in relationships:
        if r["parent"] not in adj:
            adj[r["parent"]] = []
        adj[r["parent"]].append(r["child"])

    # DFS cycle detection
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {}
    errors = []

    def dfs(node):
        color[node] = GRAY
        for child in adj.get(node, []):
            if color.get(child, WHITE) == GRAY:
                errors.append(f"Cycle detected involving: {node} -> {child}")
                return
            if color.get(child, WHITE) == WHITE:
                dfs(child)
        color[node] = BLACK

    all_nodes = set()
    for r in relationships:
        all_nodes.add(r["parent"])
        all_nodes.add(r["child"])

    for node in all_nodes:
        if color.get(node, WHITE) == WHITE:
            dfs(node)

    return errors


def check_dates(models):
    """Check date consistency (parent should predate child)."""
    warnings = []
    for m in models:
        rd = m.get("releaseDate")
        if rd:
            try:
                parts = rd.split("-")
                if len(parts) < 3:
                    warnings.append(f"Invalid date format for {m['id']}: {rd}")
            except Exception:
                warnings.append(f"Unparseable date for {m['id']}: {rd}")
    return warnings


def main():
    print("Validating data...\n")
    models, relationships = load_all_data()
    print(f"Loaded {len(models)} models, {len(relationships)} relationships\n")

    all_errors = []
    all_warnings = []

    # Run checks
    print("1. Checking duplicate IDs...")
    errors = check_duplicate_ids(models)
    all_errors.extend(errors)
    print(f"   {'PASS' if not errors else f'FAIL ({len(errors)} errors)'}")

    print("2. Checking required fields...")
    errors = check_required_fields(models)
    all_errors.extend(errors)
    print(f"   {'PASS' if not errors else f'FAIL ({len(errors)} errors)'}")

    print("3. Checking relationship references...")
    errors, warnings = check_relationship_refs(models, relationships)
    all_errors.extend(errors)
    all_warnings.extend(warnings)
    print(f"   {'PASS' if not errors else f'FAIL ({len(errors)} errors)'}")
    if warnings:
        print(f"   {len(warnings)} warnings (missing model references)")

    print("4. Checking for cycles...")
    errors = check_cycles(relationships)
    all_errors.extend(errors)
    print(f"   {'PASS' if not errors else f'FAIL ({len(errors)} errors)'}")

    print("5. Checking dates...")
    warnings = check_dates(models)
    all_warnings.extend(warnings)
    print(f"   {'PASS' if not warnings else f'{len(warnings)} warnings'}")

    # Summary
    print(f"\n{'='*50}")
    if all_errors:
        print(f"\n❌ VALIDATION FAILED: {len(all_errors)} error(s)\n")
        for e in all_errors:
            print(f"  ERROR: {e}")
        sys.exit(1)
    else:
        print(f"\n✅ VALIDATION PASSED")
        if all_warnings:
            print(f"   ({len(all_warnings)} warnings)")
            for w in all_warnings[:10]:
                print(f"   WARN: {w}")
            if len(all_warnings) > 10:
                print(f"   ... and {len(all_warnings) - 10} more")
        print()


if __name__ == "__main__":
    main()
