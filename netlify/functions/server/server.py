"""
Netlify Serverless Function pour π-FI Dashboard
Format Netlify Functions Python
"""
import sys
import os
import json

# Ajouter le répertoire racine au path
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, base_dir)

print(f"📁 Base directory: {base_dir}")
print(f"📁 Current directory: {os.getcwd()}")

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
    Format Netlify Functions Python
    """
    print(f"📥 Event reçu: {json.dumps(event, indent=2)}")
    
    if app is None:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': json.dumps({
                'error': 'Application Flask non disponible',
                'base_dir': base_dir,
                'current_dir': os.getcwd()
            })
        }
    
    try:
        from serverless_wsgi import handle_request
        
        # Adapter l'événement Netlify au format Lambda pour serverless-wsgi
        http_method = event.get('httpMethod') or event.get('method', 'GET')
        path = event.get('path') or event.get('rawPath', '/')
        query_params = event.get('queryStringParameters') or event.get('query', {}) or {}
        headers = event.get('headers', {}) or {}
        body = event.get('body', '') or ''
        
        # Créer l'événement Lambda
        lambda_event = {
            'httpMethod': http_method,
            'path': path,
            'queryStringParameters': query_params,
            'multiValueQueryStringParameters': {},
            'headers': headers,
            'multiValueHeaders': {},
            'body': body,
            'isBase64Encoded': False,
            'requestContext': {
                'requestId': context.get('requestId', ''),
                'stage': '$default',
                'httpMethod': http_method,
                'path': path,
            }
        }
        
        print(f"🔄 Appel de handle_request avec path: {path}")
        
        # Appeler serverless-wsgi
        response = handle_request(app, lambda_event, context)
        
        print(f"✅ Réponse reçue: {type(response)}")
        
        # Retourner la réponse
        return response
            
    except ImportError as e:
        print(f"❌ ImportError: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'text/html; charset=utf-8',
            },
            'body': f'''
            <!DOCTYPE html>
            <html>
            <head>
                <title>π-FI Dashboard - Erreur</title>
                <meta charset="UTF-8">
                <style>
                    body {{ font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }}
                    h1 {{ color: #00AFFF; }}
                    .error {{ color: #ef4444; }}
                </style>
            </head>
            <body>
                <h1>π-FI | AI Powered Finance & Intelligence</h1>
                <p class="error">❌ Erreur: serverless-wsgi non disponible</p>
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
                'type': type(e).__name__,
                'traceback': traceback.format_exc()
            })
        }

