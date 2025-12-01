"""
Script pour extraire le HTML du dashboard et créer index.html pour Netlify
"""
from dashboard import HTML_TEMPLATE
import os
import re

# Modifier les URLs API pour pointer vers les fonctions Netlify
html_content = HTML_TEMPLATE

# IMPORTANT: Utiliser la fonction simplifiée pour /api/prices (plus fiable)
# Remplacer TOUS les formats d'URLs pour /api/prices
html_content = html_content.replace("'/api/prices'", "'/.netlify/functions/api-prices'")
html_content = html_content.replace('"/api/prices"', '"/.netlify/functions/api-prices"')
html_content = html_content.replace("fetch('/api/prices", "fetch('/.netlify/functions/api-prices")
html_content = html_content.replace('fetch("/api/prices', 'fetch("/.netlify/functions/api-prices')
html_content = html_content.replace("'/.netlify/functions/server/api/prices'", "'/.netlify/functions/api-prices'")
html_content = html_content.replace('"/.netlify/functions/server/api/prices"', '"/.netlify/functions/api-prices"')

# Autres routes API utilisent la fonction Flask complète
html_content = html_content.replace("'/api/crypto/", "'/.netlify/functions/server/api/crypto/")
html_content = html_content.replace("'/api/trading/", "'/.netlify/functions/server/api/trading/")
html_content = html_content.replace("'/api/data'", "'/.netlify/functions/server/api/data'")
html_content = html_content.replace('"/api/crypto/', '"/.netlify/functions/server/api/crypto/')
html_content = html_content.replace('"/api/trading/', '"/.netlify/functions/server/api/trading/')
html_content = html_content.replace('"/api/data"', '"/.netlify/functions/server/api/data"')
html_content = html_content.replace("fetch('/api/crypto/", "fetch('/.netlify/functions/server/api/crypto/")
html_content = html_content.replace('fetch("/api/crypto/', 'fetch("/.netlify/functions/server/api/crypto/')
html_content = html_content.replace("fetch('/api/trading/", "fetch('/.netlify/functions/server/api/trading/")
html_content = html_content.replace('fetch("/api/trading/', 'fetch("/.netlify/functions/server/api/trading/')
html_content = html_content.replace("fetch('/api/data", "fetch('/.netlify/functions/server/api/data")
html_content = html_content.replace('fetch("/api/data', 'fetch("/.netlify/functions/server/api/data')

# Logo et static
html_content = html_content.replace('"/logo"', '"/.netlify/functions/server/logo"')
html_content = html_content.replace("'/logo'", "'/.netlify/functions/server/logo'")
# Ne pas modifier /static/ car ils sont servis directement

# Créer index.html
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("✅ index.html créé avec succès!")
print("✅ /api/prices → utilise fonction simplifiée (plus fiable)")
print("✅ Autres routes API → utilisent fonction Flask complète")
