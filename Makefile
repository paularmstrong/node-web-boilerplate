all:
	@npm install -d
	@git submodule update
	@cp .scripts/githooks/* .git/hooks/
	@chmod -R +x .git/hooks/

test:
	@node .scripts/runtests.js

lint:
	@node .scripts/runlint.js

dev:
	@node .scripts/server.js

.PHONY: all test lint dev
