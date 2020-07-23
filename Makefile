install:
	npm ci

publish:
	npm publish --dry-run

link:
	npx babel src --out-dir dist
	npm link

lint: 
	npx eslint .

tst:
	npx babel-node src/bin/gendif.js __fixtures__/file1.json __fixtures__/file2.json

jest:
	npm run test