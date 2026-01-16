"""
Script de test pour vérifier que la fonction Netlify fonctionne localement
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from netlify.functions.server.server import handler

# Simuler un événement Netlify
test_event = {
    'httpMethod': 'GET',
    'path': '/api/prices',
    'queryStringParameters': None,
    'headers': {
        'host': 'test.netlify.app',
        'user-agent': 'test'
    },
    'body': '',
    'isBase64Encoded': False
}

test_context = {
    'requestId': 'test-123'
}

print("🧪 Test de la fonction Netlify...")
try:
    result = handler(test_event, test_context)
    print(f"✅ Résultat: statusCode={result.get('statusCode')}")
    print(f"✅ Headers: {result.get('headers', {})}")
    body = result.get('body', '')
    if isinstance(body, str):
        print(f"✅ Body type: string, length: {len(body)}")
        if body.startswith('{'):
            print(f"✅ Body est du JSON valide")
        elif body.startswith('<!DOCTYPE'):
            print(f"❌ Body est du HTML (erreur!)")
        else:
            print(f"⚠️ Body preview: {body[:200]}")
    else:
        print(f"✅ Body type: {type(body)}")
except Exception as e:
    print(f"❌ Erreur: {e}")
    import traceback
    traceback.print_exc()

