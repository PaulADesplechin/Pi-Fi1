"""
Script pour extraire le HTML du dashboard et créer index.html pour Netlify
"""
from dashboard import HTML_TEMPLATE
import os

# Modifier les URLs API pour pointer vers la fonction Netlify
html_content = HTML_TEMPLATE.replace(
    "'/api/prices'",
    "'/.netlify/functions/server/api/prices'"
).replace(
    "'/api/crypto/",
    "'/.netlify/functions/server/api/crypto/"
).replace(
    "'/api/trading/",
    "'/.netlify/functions/server/api/trading/"
).replace(
    "'/api/data'",
    "'/.netlify/functions/server/api/data'"
).replace(
    '"/logo"',
    '"/.netlify/functions/server/logo"'
).replace(
    '"/static/',
    '"/static/'
)

# Créer index.html
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("✅ index.html créé avec succès!")

