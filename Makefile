all:
	@npm install -d
	@cp scripts/githooks/* .git/hooks/
	@chmod -R +x .git/hooks/

tests := $(shell find . -name '*.test.js' ! -path "*node_modules/*" ! -path "*dist/*")
reporter = skip_passed
test:
	@node_modules/nodeunit/bin/nodeunit --reporter ${reporter} ${tests}

files := $(shell find . -name '*.js' ! -path "*node_modules/*")
lint:
	@node_modules/nodelint/nodelint ${files} --config=config/config-lint.js

dev:
	@node scripts/server.js

.PHONY: all test lint dev
