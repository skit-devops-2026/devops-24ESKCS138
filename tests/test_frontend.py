from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_required_files_exist():
    for name in ("front1.html", "front1.css", "script1.js"):
        assert (ROOT / name).is_file(), f"{name} is missing"


def test_html_references_css_and_js():
    html = (ROOT / "front1.html").read_text(encoding="utf-8")
    assert "front1.css" in html
    assert "script1.js" in html
