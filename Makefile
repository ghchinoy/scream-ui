.PHONY: help build build-lib samples-gallery samples-live-connection samples-reference-agent samples-a2a-showcase

# Default target
.DEFAULT_GOAL := help

help: ## Show this help message
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-25s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build the entire workspace (library + all samples)
	npm run build

build-lib: ## Build only the lit-audio-ui library
	npm --workspace=@ghchinoy/lit-audio-ui run build

samples-gallery: ## Run the Gallery sample locally
	npm --workspace=@scream-ui/gallery run dev

samples-live-connection: ## Run the Live Connection sample locally
	npm --workspace=@scream-ui/live-connection run dev

samples-reference-agent: ## Run the Reference Agent sample locally
	npm --workspace=@scream-ui/reference-agent run dev

samples-a2a-showcase: ## Run the A2A Showcase sample locally
	npm --workspace=@scream-ui/a2a-showcase run dev
