.PHONY: create-test-data unsafe-clean-volumes unsafe-clean-check unsafe-clean

create-test-data:
	./tests/create-records.sh

unsafe-clean-volumes:
	docker system prune --volumes

unsafe-clean-check:
	@echo -n "Are you sure? [y/N] " && read ans && [ $${ans:-N} = y ]

unsafe-clean: unsafe-clean-check unsafe-clean-volumes
	docker image rm web-crawler-frontend
	docker image rm web-crawler-backend-openapi
	docker image rm web-crawler-backend-graphql
	docker builder prune
