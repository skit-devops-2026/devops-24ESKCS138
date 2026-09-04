# Makefile for the Kisan Market static frontend.
# Jenkins uses these targets for CI.

.PHONY: install test build run clean

install:
	@echo "No external dependencies required for the static frontend"

test:
	@echo "Checking required frontend files..."
	@test -f front1.html
	@test -f front1.css
	@test -f script1.js
	@echo "All required frontend files are present"

build:
	@rm -rf build
	@mkdir -p build
	@cp front1.html front1.css script1.js build/
	@echo "Frontend build completed successfully"

run:
	@python3 -m http.server $${PORT:-8000}

clean:
	@rm -rf build
