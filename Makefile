install:
	npm ci

publish:
	npm publish --dry-run

link:
	npm link

lint: 
	npx eslint .

tst-watch:
	npx -n --experimental-vm-modules jest --watch

test:
	npm test

test-coverage:
	npx -n --experimental-vm-modules jest --coverage