import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class FrontendTests(unittest.TestCase):

    def test_required_files_exist(self):
        for name in ("front1.html", "front1.css", "script1.js"):
            self.assertTrue((ROOT / name).is_file(), f"{name} is missing")

    def test_html_references_css_and_js(self):
        html = (ROOT / "front1.html").read_text(encoding="utf-8")
        self.assertIn("front1.css", html)
        self.assertIn("script1.js", html)


if __name__ == "__main__":
    unittest.main()
