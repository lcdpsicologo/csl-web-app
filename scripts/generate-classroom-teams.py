from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

import pdfplumber


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data" / "horarios-y-funcionarios" / "Correos Área Académica 2026.pdf"
OUTPUT = ROOT / "src" / "lib" / "classroom-teams.ts"


def clean(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def search_key(value: str) -> str:
    decomposed = unicodedata.normalize("NFD", clean(value).lower())
    return re.sub(r"[^a-z0-9]+", "", "".join(char for char in decomposed if not unicodedata.combining(char)))


def app_course_name(value: str) -> str:
    compact = search_key(value)
    section_match = re.search(r"([abc])$", compact)
    section = section_match.group(1).upper() if section_match else ""
    if compact.startswith(("pk", "prekinder")):
        return f"Prekínder {section}".strip()
    if compact.startswith(("k", "kinder")):
        return f"Kínder {section}".strip()
    roman_match = re.match(r"(iv|iii|ii|i)", compact)
    if roman_match:
        return f"{roman_match.group(1).upper()}° Medio {section}".strip()
    level_match = re.match(r"([1-8])", compact)
    if level_match:
        return f"{level_match.group(1)}° Básico {section}".strip()
    return clean(value)


def extract_teams() -> dict[str, list[dict[str, str]]]:
    teams: dict[str, list[dict[str, str]]] = {}
    with pdfplumber.open(SOURCE) as document:
        for page in document.pages:
            for table in page.extract_tables():
                header_index = next(
                    (
                        index
                        for index, row in enumerate(table)
                        if row and search_key(row[0]) == "curso" and any("profesor" in search_key(cell) for cell in row)
                    ),
                    None,
                )
                if header_index is None:
                    continue

                current_course = ""
                current_subject = ""
                for row in table[header_index + 1 :]:
                    cells = [clean(cell) for cell in (row or [])]
                    cells += [""] * max(0, 4 - len(cells))
                    course, subject, teacher, email = cells[:4]
                    if course:
                        current_course = app_course_name(course)
                        current_subject = ""
                    if not current_course:
                        continue
                    if subject:
                        current_subject = subject
                    if not teacher:
                        continue

                    member = {
                        "name": teacher,
                        "email": email,
                        "subject": current_subject,
                    }
                    existing = teams.setdefault(current_course, [])
                    duplicate = next((item for item in existing if search_key(item["name"]) == search_key(teacher)), None)
                    if duplicate:
                        subjects = [part.strip() for part in duplicate["subject"].split(" / ") if part.strip()]
                        if current_subject and current_subject not in subjects:
                            duplicate["subject"] = " / ".join([*subjects, current_subject])
                        if not duplicate["email"] and email:
                            duplicate["email"] = email
                    else:
                        existing.append(member)
    return teams


def render_typescript(teams: dict[str, list[dict[str, str]]]) -> str:
    payload = json.dumps(teams, ensure_ascii=False, indent=2)
    return (
        "// Auto-generated from data/horarios-y-funcionarios/Correos Área Académica 2026.pdf.\n"
        "// Run `python scripts/generate-classroom-teams.py` after replacing the source PDF.\n\n"
        "export type ClassroomTeamSeed = {\n"
        "  name: string;\n"
        "  email: string;\n"
        "  subject: string;\n"
        "};\n\n"
        "export const CLASSROOM_TEAMS_BY_COURSE: Record<string, ClassroomTeamSeed[]> = "
        f"{payload};\n"
    )


def main() -> None:
    teams = extract_teams()
    OUTPUT.write_text(render_typescript(teams), encoding="utf-8")
    member_count = sum(len(members) for members in teams.values())
    print(f"Generated {OUTPUT.relative_to(ROOT)} with {len(teams)} courses and {member_count} members.")
    for course, members in teams.items():
        print(f"- {course}: {len(members)}")


if __name__ == "__main__":
    main()
