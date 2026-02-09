#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour ajouter facilement des appartements dans biens.json
Usage: python3 ajouter_appartement.py
"""

import json
import os
import sys
from typing import Dict, List

def charger_biens() -> Dict:
    """Charge le fichier biens.json"""
    try:
        with open('biens.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("❌ Erreur : fichier biens.json non trouvé")
        sys.exit(1)
    except json.JSONDecodeError:
        print("❌ Erreur : biens.json n'est pas un JSON valide")
        sys.exit(1)

def sauvegarder_biens(data: Dict) -> None:
    """Sauvegarde les données dans biens.json"""
    with open('biens.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("✅ Fichier biens.json mis à jour avec succès !")

def demander_texte(question: str, defaut: str = "") -> str:
    """Demande une saisie texte"""
    if defaut:
        reponse = input(f"{question} [{defaut}] : ").strip()
        return reponse if reponse else defaut
    else:
        while True:
            reponse = input(f"{question} : ").strip()
            if reponse:
                return reponse
            print("⚠️  Ce champ est obligatoire")

def demander_nombre(question: str, minimum: int = 1) -> int:
    """Demande une saisie nombre"""
    while True:
        try:
            reponse = input(f"{question} : ").strip()
            nombre = int(reponse)
            if nombre >= minimum:
                return nombre
            print(f"⚠️  La valeur doit être supérieure ou égale à {minimum}")
        except ValueError:
            print("⚠️  Veuillez entrer un nombre valide")

def demander_choix(question: str, choix: List[str]) -> str:
    """Demande un choix parmi une liste"""
    print(f"\n{question}")
    for i, option in enumerate(choix, 1):
        print(f"  {i}. {option}")
    
    while True:
        try:
            reponse = input("Votre choix (numéro) : ").strip()
            index = int(reponse) - 1
            if 0 <= index < len(choix):
                return choix[index]
            print(f"⚠️  Veuillez choisir un numéro entre 1 et {len(choix)}")
        except ValueError:
            print("⚠️  Veuillez entrer un numéro valide")

def demander_liste(question: str) -> List[str]:
    """Demande une liste d'éléments séparés par des virgules"""
    while True:
        reponse = input(f"{question} (séparés par des virgules) : ").strip()
        if reponse:
            return [item.strip() for item in reponse.split(',') if item.strip()]
        print("⚠️  Veuillez entrer au moins une caractéristique")

def generer_reference(transaction: str, biens: List[Dict]) -> str:
    """Génère une référence automatique"""
    prefixe = "VT-" if transaction == "vente" else "LC-"
    references_existantes = [
        b['reference'] for b in biens 
        if b['reference'].startswith(prefixe)
    ]
    
    if not references_existantes:
        return f"{prefixe}1001"
    
    numeros = []
    for ref in references_existantes:
        try:
            numero = int(ref.replace(prefixe, ''))
            numeros.append(numero)
        except ValueError:
            continue
    
    if numeros:
        nouveau_numero = max(numeros) + 1
        return f"{prefixe}{nouveau_numero}"
    else:
        return f"{prefixe}1001"

def afficher_banniere():
    """Affiche la bannière du script"""
    print("=" * 60)
    print("🏠  Ajouter un appartement - Henri Martin Immobilier")
    print("=" * 60)
    print()

def afficher_recapitulatif(appartement: Dict):
    """Affiche un récapitulatif de l'appartement"""
    print("\n" + "=" * 60)
    print("📋 Récapitulatif de l'appartement")
    print("=" * 60)
    print(f"Référence      : {appartement['reference']}")
    print(f"Transaction    : {appartement['transaction'].capitalize()}")
    print(f"Type           : {appartement['propertyType']}")
    print(f"Titre          : {appartement['title']}")
    print(f"Localisation   : {appartement['city']} - {appartement['district']}")
    print(f"Surface        : {appartement['surface']} m²")
    print(f"Pièces         : {appartement['rooms']}")
    
    if appartement['transaction'] == 'vente':
        print(f"Prix           : {appartement['price']:,} €".replace(',', ' '))
    else:
        print(f"Loyer          : {appartement['price']:,} €/mois".replace(',', ' '))
    
    print(f"Caractéristiques : {', '.join(appartement['features'])}")
    print(f"Image          : {appartement['image'][:50]}...")
    print(f"Fiche Canva    : {appartement['brochureUrl'][:50]}...")
    print("=" * 60)

def confirmer(question: str) -> bool:
    """Demande une confirmation"""
    while True:
        reponse = input(f"{question} (o/n) : ").strip().lower()
        if reponse in ['o', 'oui', 'y', 'yes']:
            return True
        elif reponse in ['n', 'non', 'no']:
            return False
        print("⚠️  Veuillez répondre par 'o' (oui) ou 'n' (non)")

def main():
    """Fonction principale"""
    continuer = True
    
    while continuer:
        afficher_banniere()
        
        # Charger les biens existants
        data = charger_biens()
        biens = data.get('properties', [])
        print(f"📊 Nombre de biens actuels : {len(biens)}\n")
        
        # Collecter les informations
        print("📝 Veuillez renseigner les informations de l'appartement\n")
        
        # Transaction
        transaction = demander_choix(
            "Type de transaction :",
            ["vente", "location"]
        )
        
        # Référence
        ref_auto = generer_reference(transaction, biens)
        print(f"\n💡 Suggestion de référence : {ref_auto}")
        utiliser_auto = confirmer("Utiliser cette référence ?")
        
        if utiliser_auto:
            reference = ref_auto
        else:
            reference = demander_texte("Référence personnalisée")
        
        # Type de bien
        propertyType = demander_choix(
            "\nType de bien :",
            ["Appartement", "Maison", "Villa", "Loft", "Studio", "Penthouse"]
        )
        
        # Informations de base
        print("\n📍 Informations de base")
        title = demander_texte("Titre de l'annonce")
        city = demander_texte("Ville")
        district = demander_texte("Quartier/Arrondissement")
        
        # Caractéristiques
        print("\n📐 Caractéristiques")
        surface = demander_nombre("Surface (m²)")
        rooms = demander_nombre("Nombre de pièces")
        
        # Prix
        print("\n💰 Prix")
        if transaction == "vente":
            price = demander_nombre("Prix de vente (€)")
        else:
            price = demander_nombre("Loyer mensuel (€)")
        
        # Features
        print("\n✨ Caractéristiques principales")
        print("Exemples : Balcon, Terrasse, Parking, Vue mer, Rénové, Meublé, etc.")
        features = demander_liste("Caractéristiques")
        
        # Images et Canva
        print("\n🖼️  Images et documentation")
        image = demander_texte("URL de l'image principale")
        alt = demander_texte("Description de l'image", f"{title} à {city}")
        brochureUrl = demander_texte("URL de la fiche Canva")
        
        # Créer l'objet appartement
        appartement = {
            "reference": reference,
            "transaction": transaction,
            "propertyType": propertyType,
            "title": title,
            "city": city,
            "district": district,
            "surface": surface,
            "rooms": rooms,
            "price": price,
            "features": features,
            "image": image,
            "alt": alt,
            "brochureUrl": brochureUrl
        }
        
        # Afficher le récapitulatif
        afficher_recapitulatif(appartement)
        
        # Confirmer l'ajout
        if confirmer("\n✅ Ajouter cet appartement ?"):
            biens.append(appartement)
            data['properties'] = biens
            sauvegarder_biens(data)
            print(f"\n🎉 Appartement ajouté avec succès ! Total : {len(biens)} biens")
            
            # Proposer d'en ajouter un autre
            continuer = confirmer("\n➕ Voulez-vous ajouter un autre appartement ?")
            if continuer:
                print("\n")
        else:
            print("\n❌ Ajout annulé")
            continuer = False

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Interruption par l'utilisateur")
        sys.exit(0)
