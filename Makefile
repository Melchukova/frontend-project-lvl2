install:
	npm ci

publish:
	npm publish --dry-run

link:
	npm link

lint: 
	npx eslint .

tst:
	node --experimental-json-modules src/bin/gendif.js __fixtures__/file1.json __fixtures__/file2.json

test:
	npm test

test-coverage:
	npm test --coverage