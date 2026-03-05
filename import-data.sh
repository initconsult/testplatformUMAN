#!/bin/bash

# Script om data te importeren in de MySQL database
# Gebruik: ./import-data.sh

echo "Wachten tot database beschikbaar is..."
sleep 10

echo "Data importeren uit uman-3.sql..."
docker exec -i uman_db mysql -uhomestead -psecret uman < uman-3.sql

if [ $? -eq 0 ]; then
    echo "✓ Data succesvol geïmporteerd!"
else
    echo "✗ Fout bij importeren van data"
    exit 1
fi
