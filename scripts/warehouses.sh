HOSTNAME=http://localhost:3000

curl --location --request POST "${HOSTNAME}/api/warehouse/create" \
-H "Content-Type: application/json" \
-d '{
	"warehouse": "Myntra FC",
	"location": "Binola",
	"departments": ["Inward","Outward","Market Place Inward","Market Place RTV","Storage 1","Storage 2","Storage 3","Dispatch Hub"]
}'

curl --location --request POST "${HOSTNAME}/api/warehouse/create" \
-H "Content-Type: application/json" \
-d '{
	"warehouse": "Myntra FC",
	"location": "Bilaspur",
	"departments": ["Inward","Outward","Market Place Inward","Market Place RTV","Storage 1","Storage 2","Storage 3","Dispatch Hub"]
}'

curl --location --request POST "${HOSTNAME}/api/warehouse/create" \
-H "Content-Type: application/json" \
-d '{
	"warehouse": "Myntra FC",
	"location": "Bangalore",
	"departments": ["Inward","Outward","Market Place Inward","Market Place RTV","Storage 1","Storage 2","Storage 3","Dispatch Hub"]
}'

curl --location --request POST "${HOSTNAME}/api/warehouse/create" \
-H "Content-Type: application/json" \
-d '{
	"warehouse": "Myntra FC",
	"location": "Mumbai",
	"departments": ["Inward","Outward","Market Place Inward","Market Place RTV","Storage 1","Storage 2","Storage 3","Dispatch Hub"]
}'