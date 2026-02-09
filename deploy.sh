#!/bin/bash

# Script de déploiement pour Henri Martin Immobilier
# Ce script crée/met à jour la branche work pour déclencher le déploiement GitHub Pages

echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║         🚀 Script de Déploiement - Henri Martin Immobilier       ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""

# Vérifier qu'on est dans le bon repo
if [ ! -d ".git" ]; then
    echo "❌ Erreur : Ce script doit être exécuté depuis la racine du repo git"
    exit 1
fi

echo "📋 Branche actuelle :"
git branch --show-current
echo ""

echo "🔄 Création/Mise à jour de la branche work..."
echo ""

# Sauvegarder la branche actuelle
CURRENT_BRANCH=$(git branch --show-current)

# Créer ou checkout la branche work
if git show-ref --verify --quiet refs/heads/work; then
    echo "✓ La branche work existe déjà"
    git checkout work
    git merge $CURRENT_BRANCH --no-edit
else
    echo "✓ Création de la branche work"
    git checkout -b work
fi

echo ""
echo "📤 Push vers GitHub..."
echo ""

# Pousser vers GitHub
if git push origin work; then
    echo ""
    echo "╔═══════════════════════════════════════════════════════════════════╗"
    echo "║                    ✅ DÉPLOIEMENT LANCÉ !                         ║"
    echo "╚═══════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "🎯 Prochaines étapes :"
    echo ""
    echo "1. Attendez 1-2 minutes que GitHub Actions déploie le site"
    echo ""
    echo "2. Vérifiez le déploiement sur :"
    echo "   https://github.com/abbasberrada91/agent-immo/actions"
    echo ""
    echo "3. Une fois terminé, vos changements seront visibles sur :"
    echo "   https://abbasberrada91.github.io/agent-immo/"
    echo ""
    echo "4. Testez la connexion avec :"
    echo "   Login : abbasberrada"
    echo "   Password : Abbasberr1991"
    echo ""
else
    echo ""
    echo "╔═══════════════════════════════════════════════════════════════════╗"
    echo "║                    ❌ ERREUR DE DÉPLOIEMENT                       ║"
    echo "╚═══════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "⚠️  Le push a échoué. Causes possibles :"
    echo ""
    echo "• Vous n'avez pas les permissions sur le repo"
    echo "• Vous n'êtes pas authentifié avec GitHub"
    echo "• Il y a un conflit à résoudre"
    echo ""
    echo "📖 Solution alternative :"
    echo ""
    echo "1. Allez sur https://github.com/abbasberrada91/agent-immo"
    echo "2. Créez une Pull Request de votre branche vers 'work'"
    echo "3. Mergez la Pull Request"
    echo ""
    echo "Consultez DEPLOIEMENT.md pour plus de détails."
    echo ""
fi

# Retourner sur la branche d'origine
git checkout $CURRENT_BRANCH
