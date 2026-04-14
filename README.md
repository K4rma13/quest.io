docker build server/ -t k4rma/backquest:latest
docker build frontend/quest/ -t k4rma/frontquest:latest
docker compose up
cat createTables.sql | mariadb -h 127.0.0.1 -P 3306 -u root -pmariadbPASSWORD
