"""
Netlify Serverless Function pour π-FI Dashboard
Version complètement fonctionnelle
"""
import sys
import os
import json

# Ajouter le répertoire racine au path
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, base_dir)

print(f"📁 Base directory: {base_dir}")
print(f"📁 Current directory: {os.getcwd()}")
print(f"📁 Python path: {sys.path[:3]}")

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
    print(f"📥 Event reçu: method={event.get('httpMethod', event.get('method', 'GET'))}, path={event.get('path', event.get('rawPath', '/'))}")
    
    if app is None:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({
                'error': 'Application Flask non disponible',
                'base_dir': base_dir,
                'current_dir': os.getcwd()
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
        elif 'multiValueQueryStringParameters' in event and event['multiValueQueryStringParameters']:
            # Convertir multiValue en simple
            query_params = {k: v[0] if isinstance(v, list) else v 
                          for k, v in event['multiValueQueryStringParameters'].items()}
        
        # Extraire les headers
        headers = event.get('headers', {}) or {}
        if not isinstance(headers, dict):
            headers = {}
        
        # Extraire le body
        body = event.get('body', '') or ''
        if body and isinstance(body, str) and event.get('isBase64Encoded'):
            import base64
            body = base64.b64decode(body).decode('utf-8')
        
        # Créer l'événement Lambda pour serverless-wsgi
        lambda_event = {
            'httpMethod': http_method,
            'path': path,
            'queryStringParameters': query_params,
            'multiValueQueryStringParameters': {k: [v] if not isinstance(v, list) else v 
                                              for k, v in query_params.items()},
            'headers': headers,
            'multiValueHeaders': {k: [v] if not isinstance(v, list) else v 
                                for k, v in headers.items()},
            'body': body,
            'isBase64Encoded': False,
            'requestContext': {
                'requestId': context.get('requestId', f'netlify-{os.getpid()}'),
                'stage': '$default',
                'httpMethod': http_method,
                'path': path,
                'identity': {
                    'sourceIp': headers.get('x-forwarded-for', headers.get('x-real-ip', '127.0.0.1'))
                }
            }
        }
        
        print(f"🔄 Appel Flask avec path: {path} (raw: {raw_path})")
        print(f"🔄 Method: {http_method}")
        print(f"🔄 Query params: {query_params}")
        
        # Appeler serverless-wsgi
        response = handle_request(app, lambda_event, context)
        
        print(f"✅ Réponse reçue: statusCode={response.get('statusCode', 'N/A')}")
        
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
        body_content = response.get('body', '')
        if isinstance(body_content, str) and path.startswith('/api/'):
            # Vérifier si c'est du HTML
            body_stripped = body_content.strip()
            if body_stripped.startswith('<!DOCTYPE') or body_stripped.startswith('<html') or '<body' in body_stripped:
                print(f"⚠️ ATTENTION: La route API retourne du HTML au lieu de JSON!")
                print(f"⚠️ Body preview: {body_stripped[:300]}")
                # Retourner une erreur JSON valide
                response['body'] = json.dumps({
                    'error': 'La fonction serverless a retourné du HTML au lieu de JSON',
                    'path': path,
                    'statusCode': response.get('statusCode', 500),
                    'message': 'Utilisez Render.com pour une meilleure compatibilité Flask'
                })
                response['headers']['Content-Type'] = 'application/json; charset=utf-8'
                response['statusCode'] = 500
        
        # Retourner la réponse
        return response
            
    except ImportError as e:
        print(f"❌ ImportError: {e}")
        error_response = {
            'error': 'serverless-wsgi non disponible',
            'message': str(e),
            'solution': 'Installez serverless-wsgi dans netlify/functions/server/requirements.txt'
        }
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps(error_response)
        }
    except Exception as e:
        print(f"❌ Erreur dans le handler: {e}")
        import traceback
        error_trace = traceback.format_exc()
        print(error_trace)
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({
                'error': str(e),
                'type': type(e).__name__,
                'path': path if 'path' in locals() else 'unknown',
                'traceback': error_trace[:500]  # Limiter la taille
            })
        }
