HOSTNAME=http://localhost:3000

curl --location --request POST "${HOSTNAME}/api/department/create" \
-H "Content-Type: application/json" \
-d '{
	"name":"Inward"
}'

curl --location --request POST "${HOSTNAME}/api/department/create" \
-H "Content-Type: application/json" \
-d '{
	"name":"Outward"
}'

curl --location --request POST "${HOSTNAME}/api/department/create" \
-H "Content-Type: application/json" \
-d '{
	"name":"Market Place Inward"
}'

curl --location --request POST "${HOSTNAME}/api/department/create" \
-H "Content-Type: application/json" \
-d '{
	"name":"Market Place RTV"
}'

curl --location --request POST "${HOSTNAME}/api/department/create" \
-H "Content-Type: application/json" \
-d '{
	"name":"Storage 1"
}'

curl --location --request POST "${HOSTNAME}/api/department/create" \
-H "Content-Type: application/json" \
-d '{
	"name":"Storage 2"
}'

curl --location --request POST "${HOSTNAME}/api/department/create" \
-H "Content-Type: application/json" \
-d '{
	"name":"Storage 3"
}'

curl --location --request POST "${HOSTNAME}/api/department/create" \
-H "Content-Type: application/json" \
-d '{
	"name":"Dispatch Hub"
}'