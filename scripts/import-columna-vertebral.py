#!/usr/bin/env python3
"""Importa la columna vertebral FDC 2026 desde el Excel oficial a src/lib.

Uso:
    python3 scripts/import-columna-vertebral.py [ruta_al_xlsx]

Lee la hoja "Columna vertebral" (secuencia oficial de talleres pendientes por
curso) y regenera src/lib/columna-vertebral-data.ts. La lógica de sugerencias
vive en src/lib/columna-vertebral.ts y no se toca al regenerar.
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

DEFAULT_XLSX = Path.home() / "Downloads" / "columna_vertebral_fdc_2026_todos_los_cursos_nomina_oficial.xlsx"
PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT = PROJECT_ROOT / "src" / "lib" / "columna-vertebral-data.ts"


def course_key(name: str) -> str:
    normalized = unicodedata.normalize("NFD", name.lower())
    normalized = "".join(ch for ch in normalized if unicodedata.category(ch) != "Mn")
    return re.sub(r"[^a-z0-9]", "", normalized)


def main() -> None:
    import openpyxl

    xlsx_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_XLSX
    if not xlsx_path.exists():
        raise SystemExit(f"No se encontró el Excel: {xlsx_path}")

    workbook = openpyxl.load_workbook(xlsx_path, data_only=True)
    sheet = workbook["Columna vertebral"]
    rows = list(sheet.iter_rows(values_only=True))

    courses: dict[str, dict] = {}
    for row in rows[3:]:
        if not row[0] or str(row[0]).strip() == "Curso":
            continue
        name = str(row[0]).strip()
        key = course_key(name)
        entry = courses.setdefault(key, {"name": name, "classes": []})
        entry["classes"].append({
            "order": int(row[1]),
            "title": str(row[6]).strip(),
            "block": str(row[3] or "").strip(),
            "strength": str(row[4] or "").strip(),
            "priority": str(row[7] or "").strip(),
            "objective": str(row[12] or "").strip(),
        })

    total = sum(len(entry["classes"]) for entry in courses.values())
    body = ",\n".join(
        f'  "{key}": {json.dumps(entry["classes"], ensure_ascii=False, indent=2)}'
        for key, entry in courses.items()
    )
    names = json.dumps({key: entry["name"] for key, entry in courses.items()}, ensure_ascii=False, indent=2)

    OUTPUT.write_text(
        "// Archivo generado por scripts/import-columna-vertebral.py — no editar a mano.\n"
        f"// Fuente: {xlsx_path.name} · hoja \"Columna vertebral\".\n"
        f"// {total} talleres pendientes en {len(courses)} cursos (I Ciclo, Colegio San Lucas, FDC 2026).\n\n"
        "export type ColumnaClass = {\n"
        "  order: number;\n"
        "  title: string;\n"
        "  block: string;\n"
        "  strength: string;\n"
        "  priority: string;\n"
        "  objective: string;\n"
        "};\n\n"
        f"export const COLUMNA_COURSE_NAMES: Record<string, string> = {names};\n\n"
        f"export const COLUMNA_VERTEBRAL: Record<string, ColumnaClass[]> = {{\n{body}\n}};\n",
        encoding="utf-8",
    )
    print(f"OK: {OUTPUT.relative_to(PROJECT_ROOT)} · {total} clases en {len(courses)} cursos")


if __name__ == "__main__":
    main()
