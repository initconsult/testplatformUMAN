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

echo "Stap 1: Ontbrekende tabellen aanmaken..."
docker exec -i uman_db mysql -uhomestead -psecret uman < add-timestamps.sql

if [ $? -eq 0 ]; then
    echo "✓ Tabellen succesvol aangemaakt!"
else
    echo "✗ Fout bij aanmaken van tabellen"
    exit 1
fi

echo ""
echo "Stap 2: Timestamps toevoegen aan bestaande tabellen..."

# Voeg timestamps toe aan permission_role (negeer fout als kolom al bestaat)
docker exec uman_db mysql -uhomestead -psecret uman -e "ALTER TABLE permission_role ADD COLUMN created_at timestamp NULL DEFAULT NULL, ADD COLUMN updated_at timestamp NULL DEFAULT NULL;" 2>/dev/null || echo "  (permission_role heeft al timestamps)"

# Voeg timestamps toe aan role_user (negeer fout als kolom al bestaat)
docker exec uman_db mysql -uhomestead -psecret uman -e "ALTER TABLE role_user ADD COLUMN created_at timestamp NULL DEFAULT NULL, ADD COLUMN updated_at timestamp NULL DEFAULT NULL;" 2>/dev/null || echo "  (role_user heeft al timestamps)"

echo "✓ Timestamp kolommen verwerkt!"

echo ""
echo "Stap 3: Data importeren uit uman-3.sql..."
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
