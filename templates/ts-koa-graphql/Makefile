PORT ?= 5005

all: help

help:
	@echo ""
	@echo "  deps         - Installs dependencies"
	@echo "  dev          - Runs development server   PORT ?= $(PORT)"
	@echo ""
	@echo "  db.start     - Spin up redis, mongodb"
	@echo "  db.stop      - Bring down redis, mongodb"
	@echo "  populate     - Populate db with fixture data"
	@echo ""
	@echo "  Helper functions"
	@echo "  get.jwt      - Copy fake user's authentication jwt to clipboard"
	@echo "  port-forward - Start port forwarding prod mongodb on host machine 27117"
	@echo ""

deps:
	@yarn

dev: db.start populate deps
	@PORT=$(PORT) yarn dev

db.start: db.stop
	@docker-compose -f docker-compose.yml up -d --remove-orphans

db.stop:
	@docker-compose -f docker-compose.yml down --remove-orphans

populate:
	@NODE_PATH=./src npx ts-node ./src/mongodb/populate.ts

get.jwt:
	@curl -H "Content-Type: application/json" -X POST localhost:5005/api/authenticate \
		-d '{"email":"asd@asd","password":"asdasd"}' | jq '.jwt' -r | pbcopy

port-forward:
	@kubectl port-forward deployment/api-server-mongodb 27117:27017
