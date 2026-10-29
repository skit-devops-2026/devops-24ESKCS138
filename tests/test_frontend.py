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


class FullStackStructureTests(unittest.TestCase):

    def test_mern_architecture_files_exist(self):
        required_paths = [
            "server/server.js",
            "server/app.js",
            "server/package.json",
            "client/package.json",
            "client/src/App.jsx",
            "client/src/main.jsx",
        ]
        for rel_path in required_paths:
            self.assertTrue((ROOT / rel_path).is_file(), f"{rel_path} is missing")


if __name__ == "__main__":
    unittest.main()

