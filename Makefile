install:
	npm ci

publish:
	npm publish --dry-run

link:
	npm link

lint: 
	npx eslint .

tst:
	npx -n --experimental-vm-modules jest --watch

test:
	npm test

test-coverage:
	npm test --coverage