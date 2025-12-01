"""
Script pour extraire le HTML du dashboard et créer index.html pour Netlify
"""
from dashboard import HTML_TEMPLATE
import os

# Modifier les URLs API pour pointer vers la fonction Netlify
# Remplacer TOUS les formats d'URLs (guillemets simples et doubles)
html_content = HTML_TEMPLATE

# Remplacer avec guillemets simples
html_content = html_content.replace("'/api/prices'", "'/.netlify/functions/server/api/prices'")
html_content = html_content.replace("'/api/crypto/", "'/.netlify/functions/server/api/crypto/")
html_content = html_content.replace("'/api/trading/", "'/.netlify/functions/server/api/trading/")
html_content = html_content.replace("'/api/data'", "'/.netlify/functions/server/api/data'")

# Remplacer avec guillemets doubles
html_content = html_content.replace('"/api/prices"', '"/.netlify/functions/server/api/prices"')
html_content = html_content.replace('"/api/crypto/', '"/.netlify/functions/server/api/crypto/')
html_content = html_content.replace('"/api/trading/', '"/.netlify/functions/server/api/trading/')
html_content = html_content.replace('"/api/data"', '"/.netlify/functions/server/api/data"')

# Remplacer les URLs dans les fetch() sans guillemets (template literals)
html_content = html_content.replace("fetch('/api/prices", "fetch('/.netlify/functions/server/api/prices")
html_content = html_content.replace('fetch("/api/prices', 'fetch("/.netlify/functions/server/api/prices')
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

