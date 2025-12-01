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
    print("✅ Application Flask importée avec succès")
except Exception as e:
    print(f"❌ Erreur lors de l'import de dashboard: {e}")
    import traceback
    traceback.print_exc()
    app = None

def handler(event, context):
    """
    Handler Netlify Function pour Flask
    Format Netlify Functions: https://docs.netlify.com/functions/build-with-javascript/
    """
    if app is None:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': json.dumps({
                'error': 'Application Flask non disponible',
                'message': 'Vérifiez les logs pour plus de détails'
            })
        }
    
    try:
        # Utiliser serverless-wsgi pour adapter Flask à Netlify
        from serverless_wsgi import handle_request
        
        # Netlify Functions passe les événements dans un format spécifique
        # Adapter au format attendu par serverless-wsgi (format Lambda)
        lambda_event = {
            'httpMethod': event.get('httpMethod', event.get('method', 'GET')),
            'path': event.get('path', event.get('rawPath', '/')),
            'queryStringParameters': event.get('queryStringParameters', event.get('query', {}) or {}),
            'multiValueQueryStringParameters': event.get('multiValueQueryStringParameters', {}),
            'headers': event.get('headers', {}),
            'multiValueHeaders': event.get('multiValueHeaders', {}),
            'body': event.get('body', '') or '',
            'isBase64Encoded': event.get('isBase64Encoded', False),
            'requestContext': {
                'requestId': context.get('requestId', ''),
                'stage': '$default',
                'httpMethod': event.get('httpMethod', 'GET'),
                'path': event.get('path', '/'),
            }
        }
        
        # Gérer le path pour les routes Flask
        path = lambda_event['path']
        if not path.startswith('/'):
            path = '/' + path
        
        lambda_event['path'] = path
        
        # Appeler serverless-wsgi
        response = handle_request(app, lambda_event, context)
        
        # Adapter la réponse au format Netlify
        if isinstance(response, dict):
            # Si c'est déjà un dict avec statusCode, le retourner tel quel
            if 'statusCode' in response:
                return response
            # Sinon, wrapper dans une réponse HTTP
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                },
                'body': json.dumps(response)
            }
        else:
            # Si c'est une réponse WSGI, la convertir
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'text/html; charset=utf-8',
                },
                'body': str(response)
            }
            
    except ImportError as e:
        # Fallback si serverless_wsgi n'est pas disponible
        print(f"⚠️ serverless-wsgi non disponible: {e}")
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'text/html; charset=utf-8',
            },
            'body': f'''
            <!DOCTYPE html>
            <html>
            <head>
                <title>π-FI Dashboard - Configuration</title>
                <meta charset="UTF-8">
                <style>
                    body {{ font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }}
                    h1 {{ color: #00AFFF; }}
                    .error {{ color: #ef4444; }}
                </style>
            </head>
            <body>
                <h1>π-FI | AI Powered Finance & Intelligence</h1>
                <p class="error">⚠️ Configuration Netlify en cours...</p>
                <p>Le module <code>serverless-wsgi</code> doit être installé.</p>
                <p>Vérifiez que <code>serverless-wsgi>=0.8.2</code> est dans <code>requirements.txt</code></p>
                <p><strong>Erreur:</strong> {str(e)}</p>
            </body>
            </html>
            '''
        }
    except Exception as e:
        print(f"❌ Erreur dans le handler: {e}")
        import traceback
        traceback.print_exc()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': json.dumps({
                'error': str(e),
                'type': type(e).__name__
            })
        }
