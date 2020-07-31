install:
	npm ci

publish:
	npm publish --dry-run

link:
	npm link

lint: 
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage

test-w:
	npm test -- --watch