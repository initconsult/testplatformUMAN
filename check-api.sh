#!/bin/bash

# Script om de API en database connectie te controleren

echo "Controleren of containers draaien..."
echo "===================================="
docker ps --filter "name=uman" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "Controleren backend logs..."
echo "==========================="
docker logs uman_backend --tail 20
echo ""

echo "Testen API endpoints..."
echo "======================="
echo ""

echo "1. Root endpoint:"
curl -s http://localhost:8000/ | jq . || echo "Fout bij ophalen root endpoint"
echo ""

echo "2. Advisors endpoint:"
curl -s http://localhost:8000/api/advisors | jq '. | length' || echo "Fout bij ophalen advisors"
echo ""

echo "3. Clients endpoint:"
curl -s http://localhost:8000/api/clients | jq '. | length' || echo "Fout bij ophalen clients"
echo ""

echo "4. Tests endpoint:"
curl -s http://localhost:8000/api/tests | jq '. | length' || echo "Fout bij ophalen tests"
echo ""

echo "Directe database query (via backend container)..."
echo "=================================================="
docker exec uman_db mysql -uhomestead -psecret uman -e "SELECT COUNT(*) as clients FROM clients; SELECT COUNT(*) as advisors FROM advisors;"
