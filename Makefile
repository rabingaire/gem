.PHONY: deploy
deploy:
	npm run build
	rm -rf ./gem-port/dist
	mv ./dist ./gem-port/
	cd gem-port && deta deploy
