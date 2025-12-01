"""
Netlify Serverless Function pour π-FI Dashboard
Version corrigée et fonctionnelle
"""
import sys
import os
import json

# Ajouter le répertoire racine au path
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, base_dir)

print(f"📁 Base directory: {base_dir}")
print(f"📁 Current directory: {os.getcwd()}")
print(f"📁 Python path: {sys.path}")

# Importer Flask app
app = None
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
    """
    print(f"📥 Event reçu: {json.dumps(event, indent=2, default=str)}")
    
    if app is None:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({
                'error': 'Application Flask non disponible',
                'base_dir': base_dir,
                'current_dir': os.getcwd(),
                'python_path': sys.path
            })
        }
    
    try:
        from serverless_wsgi import handle_request
        
        # Extraire les informations de l'événement Netlify
        http_method = event.get('httpMethod') or event.get('method', 'GET')
        raw_path = event.get('path') or event.get('rawPath', '/')
        
        # Netlify ajoute le préfixe de la fonction, le retirer
        path = raw_path
        if path.startswith('/.netlify/functions/server'):
            path = path.replace('/.netlify/functions/server', '', 1)
        if not path:
            path = '/'
        if not path.startswith('/'):
            path = '/' + path
        
        # Extraire les query parameters
        query_params = {}
        if 'queryStringParameters' in event and event['queryStringParameters']:
            query_params = event['queryStringParameters']
        elif 'query' in event and event['query']:
            query_params = event['query']
        
        # Extraire les headers
        headers = event.get('headers', {}) or {}
        
        # Extraire le body
        body = event.get('body', '') or ''
        
        # Créer l'événement Lambda pour serverless-wsgi
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
                'requestId': context.get('requestId', 'netlify-' + str(os.getpid())),
                'stage': '$default',
                'httpMethod': http_method,
                'path': path,
                'identity': {
                    'sourceIp': headers.get('x-forwarded-for', '127.0.0.1')
                }
            }
        }
        
        print(f"🔄 Appel Flask avec path: {path} (raw: {raw_path})")
        print(f"🔄 Method: {http_method}")
        print(f"🔄 Query params: {query_params}")
        
        # Appeler serverless-wsgi
        response = handle_request(app, lambda_event, context)
        
        print(f"✅ Réponse reçue: statusCode={response.get('statusCode', 'N/A')}")
        print(f"✅ Headers: {response.get('headers', {})}")
        print(f"✅ Body type: {type(response.get('body', ''))}")
        
        # S'assurer que les headers sont présents
        if 'headers' not in response:
            response['headers'] = {}
        
        # Ajouter CORS pour toutes les routes API
        if path.startswith('/api/'):
            response['headers']['Access-Control-Allow-Origin'] = '*'
            response['headers']['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
            response['headers']['Access-Control-Allow-Headers'] = 'Content-Type'
            # S'assurer que le Content-Type est application/json pour les API
            if 'Content-Type' not in response['headers']:
                response['headers']['Content-Type'] = 'application/json; charset=utf-8'
        
        # Vérifier si le body contient du HTML au lieu de JSON (erreur)
        body = response.get('body', '')
        if isinstance(body, str) and path.startswith('/api/') and body.strip().startswith('<!DOCTYPE'):
            print(f"⚠️ ATTENTION: La route API retourne du HTML au lieu de JSON!")
            print(f"⚠️ Body preview: {body[:200]}")
            # Retourner une erreur JSON valide
            response['body'] = json.dumps({
                'error': 'La fonction serverless a retourné du HTML au lieu de JSON',
                'path': path,
                'statusCode': response.get('statusCode', 500)
            })
            response['headers']['Content-Type'] = 'application/json; charset=utf-8'
            response['statusCode'] = 500
        
        # Retourner la réponse
        return response
            
    except ImportError as e:
        print(f"❌ ImportError: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'text/html; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
            },
            'body': f'''
            <!DOCTYPE html>
            <html>
            <head>
                <title>π-FI Dashboard - Erreur</title>
                <meta charset="UTF-8">
                <style>
                    body {{ font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #020915; color: #F5F9FF; }}
                    h1 {{ color: #00AFFF; }}
                    .error {{ color: #ef4444; }}
                    code {{ background: #06101C; padding: 2px 6px; border-radius: 4px; }}
                </style>
            </head>
            <body>
                <h1>π-FI | AI Powered Finance & Intelligence</h1>
                <p class="error">❌ Erreur: serverless-wsgi non disponible</p>
                <p>Vérifiez que <code>serverless-wsgi>=0.8.2</code> est dans <code>netlify/functions/server/requirements.txt</code></p>
                <p><strong>Erreur:</strong> {str(e)}</p>
            </body>
            </html>
            '''
        }
    except Exception as e:
        print(f"❌ Erreur dans le handler: {e}")
        import traceback
        error_trace = traceback.format_exc()
        print(error_trace)
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({
                'error': str(e),
                'type': type(e).__name__,
                'path': path if 'path' in locals() else 'unknown',
                'traceback': error_trace
            })
        }
