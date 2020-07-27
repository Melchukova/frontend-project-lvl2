install:
	npm ci

publish:
	npm publish --dry-run

link:
	npm link

lint: 
	npx eslint .

tst:
	node --experimental-json-modules src/bin/gendif.js __fixtures__/before.json __fixtures__/after.json

test:
	npm test

test-coverage:
	npm test --coverage