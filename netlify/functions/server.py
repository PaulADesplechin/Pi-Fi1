"""
Netlify Serverless Function pour π-FI Dashboard
Cette fonction permet de faire fonctionner Flask sur Netlify
"""
import sys
import os
import json

# Ajouter le répertoire parent au path
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, base_dir)

# Importer Flask app
try:
    from dashboard import app
except Exception as e:
    print(f"Erreur lors de l'import de dashboard: {e}")
    app = None

def handler(event, context):
    """
    Handler Netlify Function pour Flask
    Netlify Functions utilise un format spécifique pour les événements
    """
    if app is None:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': json.dumps({'error': 'Application Flask non disponible'})
        }
    
    try:
        # Utiliser serverless-wsgi pour adapter Flask à Netlify
        from serverless_wsgi import handle_request
        
        # Adapter l'événement Netlify au format attendu par serverless-wsgi
        # Netlify Functions utilise un format différent de AWS Lambda
        if 'httpMethod' not in event:
            # Convertir le format Netlify au format Lambda
            event['httpMethod'] = event.get('method', 'GET')
            event['path'] = event.get('path', '/')
            event['queryStringParameters'] = event.get('queryStringParameters', {}) or {}
            event['headers'] = event.get('headers', {}) or {}
            event['body'] = event.get('body', '') or ''
            event['isBase64Encoded'] = False
        
        response = handle_request(app, event, context)
        
        # Adapter la réponse au format Netlify
        if isinstance(response, dict):
            return response
        else:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'text/html',
                },
                'body': str(response)
            }
            
    except ImportError:
        # Fallback si serverless_wsgi n'est pas disponible
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'text/html',
            },
            'body': '''
            <!DOCTYPE html>
            <html>
            <head>
                <title>π-FI Dashboard</title>
                <meta charset="UTF-8">
            </head>
            <body>
                <h1>π-FI | AI Powered Finance & Intelligence</h1>
                <p>Configuration Netlify en cours...</p>
                <p>Veuillez installer serverless-wsgi: pip install serverless-wsgi</p>
            </body>
            </html>
            '''
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': json.dumps({'error': str(e)})
        }

