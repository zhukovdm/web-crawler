unsafe-clean:
	docker image rm web-crawler-frontend
	docker image rm web-crawler-backend-openapi
	docker image rm web-crawler-backend-graphql
	docker builder prune
	docker system prune --volumes
