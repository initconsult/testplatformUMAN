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

echo "Stap 1: Ontbrekende tabellen aanmaken en kolommen toevoegen..."
docker exec -i uman_db mysql -uhomestead -psecret uman < add-timestamps.sql

if [ $? -eq 0 ]; then
    echo "✓ Tabellen en kolommen succesvol toegevoegd!"
else
    echo "✗ Fout bij toevoegen van tabellen/kolommen"
    exit 1
fi

echo ""
echo "Stap 2: Data importeren uit uman-3.sql..."
docker exec -i uman_db mysql -uhomestead -psecret uman < uman-3.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Data succesvol geïmporteerd!"
    echo ""
    echo "Import voltooid! Uw database is nu volledig gevuld met data."
else
    echo ""
    echo "✗ Fout bij importeren van data"
    echo ""
    echo "Controleer de foutmelding hierboven voor meer details."
    exit 1
fi
