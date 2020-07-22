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
	npx babel-node src/bin/gendif.js /test-files/file1.json /test-files/file2.json