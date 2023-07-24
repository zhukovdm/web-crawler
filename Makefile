up:
	sudo docker compose up

down:
	sudo docker compose down

clean:
	sudo docker image rm web-crawler-frontend
	sudo docker image rm web-crawler-backend-openapi
	sudo docker image rm web-crawler-backend-graphql
	sudo docker builder prune
	sudo docker system prune --volumes
