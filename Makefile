# Makefile for the Kisan Market static frontend.
# Jenkins uses these targets for CI.

.PHONY: install test build run clean

install:
	@echo "No external dependencies required for the static frontend"

test:
	@echo "Running frontend tests..."
	@python3 -m unittest discover -s tests -p "test_*.py" -v

build:
	@rm -rf build
	@mkdir -p build
	@cp front1.html front1.css script1.js build/
	@echo "Frontend build completed successfully"

run:
	@python3 -m http.server $${PORT:-8000}

clean:
	@rm -rf build
