
up :
	docker compose -f docker-compose.yaml up --build -d
updev :
	docker compose -f dev.docker-compose.yaml up --build -d

down :
	docker compose -f docker-compose.yaml down
downdev :
	docker compose -f dev.docker-compose.yaml down

.PHONY : restart restartdev
restart	:
	docker compose -f docker-compose.yaml restart
restartdev :
	docker compose -f dev.docker-compose.yaml restart

.PHONY : ps psdev
ps :
	docker compose -f docker-compose.yaml ps
psdev :
	docker compose -f dev.docker-compose.yaml ps

.PHONY : log logdev
log :
	docker compose -f docker-compose.yaml logs -f ${ct}
logdev :
	docker compose -f dev.docker-compose.yaml logs -f ${ct}

.PHONY : exec execdev
exec :
	docker compose -f docker-compose.yaml exec ${ct} /bin/bash
execdev :
	docker compose -f dev.docker-compose.yaml exec ${ct} /bin/bash

clean :
	docker compose -f docker-compose.yaml down --remove-orphans --rmi all --volumes
cleandev :
	docker compose -f dev.docker-compose.yaml down --remove-orphans --rmi all --volumes

fclean : clean
	docker network prune --force
	docker volume prune --force
	docker system prune --all --force --volumes
fcleandev : cleandev
	docker network prune --force
	docker volume prune --force
	docker system prune --all --force --volumes
