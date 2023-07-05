version_current:
	cat package.json | jq -r '.version'

version_patch:
	pnpm version patch

build:
	pnpm run build

pack:
	pnpm pack --pack-destination .build

publish:
	npm publish .build/*.tgz --access public

deploy:
	make build
	make pack
	make publish
