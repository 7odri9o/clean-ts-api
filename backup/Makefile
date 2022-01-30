.PHONY: build-RuntimeDependenciesLayer build-lambda-common
.PHONY: build-FindSlotsByDateLambdaFunction

build-FindSlotsByDateLambdaFunction:
	$(MAKE) HANDLER=src/presentation/find-slots-by-date-lambda.ts build-lambda-common

build-lambda-common:
	npm install
	npm run build
	cp -r dist "$(ARTIFACTS_DIR)/"

build-RuntimeDependenciesLayer:
	mkdir "$(ARTIFACTS_DIR)/nodejs"
	cp package.json package-lock.json "$(ARTIFACTS_DIR)/nodejs/"
	npm install --production --prefix "$(ARTIFACTS_DIR)/nodejs/"
	rm "$(ARTIFACTS_DIR)/nodejs/package.json" # to avoid rebuilding when changes doesn't relate to dependencies
