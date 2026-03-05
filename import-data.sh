#!/bin/bash

# Script om data te importeren in de MySQL database
# Gebruik: ./import-data.sh

echo "Wachten tot database volledig geïnitialiseerd is..."
sleep 15

echo "Controleren of database beschikbaar is..."
until docker exec uman_db mysqladmin ping -h localhost -uhomestead -psecret --silent; do
    echo "Database nog niet klaar, wachten..."
    sleep 2
done

echo "Database is beschikbaar!"
echo ""
echo "Data importeren uit uman-3.sql..."
docker exec -i uman_db mysql -uhomestead -psecret uman < uman-3.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Data succesvol geïmporteerd!"
else
    echo ""
    echo "✗ Fout bij importeren van data"
    echo ""
    echo "Tip: Controleer of uman-3.sql INSERT statements bevat die overeenkomen met de tabelstructuur in uman-2.sql"
    exit 1
fi
