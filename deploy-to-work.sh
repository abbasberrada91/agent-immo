#!/bin/bash
# Script de déploiement automatique
# Ce script pousse les changements vers la branche work pour déclencher GitHub Pages

echo "🚀 Déploiement vers la branche work..."

# Sauvegarder la branche actuelle
CURRENT_BRANCH=$(git branch --show-current)
echo "Branche actuelle: $CURRENT_BRANCH"

# Créer ou mettre à jour la branche work
if git show-ref --verify --quiet refs/heads/work; then
    echo "✓ Branche work existe, mise à jour..."
    git checkout work
    git merge $CURRENT_BRANCH --no-edit
else
    echo "✓ Création de la branche work..."
    git checkout -b work
fi

# Pousser vers GitHub
echo "📤 Push vers origin/work..."
git push -u origin work --force

# Retourner sur la branche d'origine
git checkout $CURRENT_BRANCH

echo "✅ Déploiement lancé ! Vérifiez sur:"
echo "   https://github.com/abbasberrada91/agent-immo/actions"
echo "   https://abbasberrada91.github.io/agent-immo/"
