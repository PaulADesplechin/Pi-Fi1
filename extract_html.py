"""
Script pour extraire le HTML du dashboard et créer index.html pour Netlify
"""
from dashboard import HTML_TEMPLATE
import os

# Modifier les URLs API pour pointer vers la fonction Netlify
# ET ajouter une gestion d'erreur pour détecter les réponses HTML
html_content = HTML_TEMPLATE

# Fonction helper pour wrapper les fetch avec gestion d'erreur
def wrap_fetch_with_error_handling(content, api_path, netlify_path):
    """Remplace les fetch() et ajoute une gestion d'erreur pour détecter HTML"""
    import re
    
    # Pattern pour trouver fetch('/api/prices'...) puis .then(response => response.json())
    pattern = rf"(fetch\('{api_path}[^']*'\))\s*\.then\s*\(\s*response\s*=>\s*response\.json\(\)\s*\)"
    replacement = rf'''\1
                        .then(response => {{
                            const contentType = response.headers.get('content-type') || '';
                            if (contentType.includes('text/html')) {{
                                throw new Error('La fonction serverless retourne du HTML au lieu de JSON');
                            }}
                            return response.text();
                        }})
                        .then(text => {{
                            if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {{
                                console.error('❌ Réponse HTML reçue:', text.substring(0, 200));
                                throw new Error('Réponse HTML au lieu de JSON');
                            }}
                            try {{
                                return JSON.parse(text);
                            }} catch (e) {{
                                console.error('❌ Erreur parsing JSON:', e);
                                console.error('❌ Contenu:', text.substring(0, 500));
                                throw new Error('JSON invalide: ' + e.message);
                            }}
                        }})'''
    
    content = re.sub(pattern, replacement, content)
    
    # Remplacer aussi les versions simples
    content = content.replace(f"fetch('{api_path}", f"fetch('{netlify_path}")
    content = content.replace(f'fetch("{api_path}', f'fetch("{netlify_path}')
    
    return content

# Remplacer les URLs API
html_content = wrap_fetch_with_error_handling(html_content, "/api/prices", "/.netlify/functions/server/api/prices")
html_content = wrap_fetch_with_error_handling(html_content, "/api/crypto/", "/.netlify/functions/server/api/crypto/")
html_content = wrap_fetch_with_error_handling(html_content, "/api/trading/", "/.netlify/functions/server/api/trading/")
html_content = wrap_fetch_with_error_handling(html_content, "/api/data", "/.netlify/functions/server/api/data")

# Remplacer les autres formats
html_content = html_content.replace("'/api/prices'", "'/.netlify/functions/server/api/prices'")
html_content = html_content.replace("'/api/crypto/", "'/.netlify/functions/server/api/crypto/")
html_content = html_content.replace("'/api/trading/", "'/.netlify/functions/server/api/trading/")
html_content = html_content.replace("'/api/data'", "'/.netlify/functions/server/api/data'")
html_content = html_content.replace('"/api/prices"', '"/.netlify/functions/server/api/prices"')
html_content = html_content.replace('"/api/crypto/', '"/.netlify/functions/server/api/crypto/')
html_content = html_content.replace('"/api/trading/', '"/.netlify/functions/server/api/trading/')
html_content = html_content.replace('"/api/data"', '"/.netlify/functions/server/api/data"')

# Logo et static
html_content = html_content.replace('"/logo"', '"/.netlify/functions/server/logo"')
html_content = html_content.replace("'/logo'", "'/.netlify/functions/server/logo'")

# Créer index.html
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("✅ index.html créé avec succès!")

