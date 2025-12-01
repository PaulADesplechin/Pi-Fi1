"""
π-FI Brand Colors Configuration
Palette colorimétrique officielle pour utilisation Python
"""

# Couleurs principales
WHITE_COLD = "#F5F9FF"
NEON_BLUE = "#00AFFF"
NIGHT_BLUE = "#06101C"
DEEP_BLUE_BLACK = "#020915"
TECH_GRAY = "#5A6C81"

# Couleurs secondaires
SCIENTIFIC_GREEN = "#4FFFA3"
STEEL_BLUE = "#13344F"
ARCTIC_BLUE = "#A1E3FF"

# Dictionnaire complet des couleurs
COLORS = {
    # Principales
    "white_cold": WHITE_COLD,
    "neon_blue": NEON_BLUE,
    "night_blue": NIGHT_BLUE,
    "deep_blue_black": DEEP_BLUE_BLACK,
    "tech_gray": TECH_GRAY,
    
    # Secondaires
    "scientific_green": SCIENTIFIC_GREEN,
    "steel_blue": STEEL_BLUE,
    "arctic_blue": ARCTIC_BLUE,
    
    # Usage sémantique
    "bg_primary": NIGHT_BLUE,
    "bg_secondary": DEEP_BLUE_BLACK,
    "text_primary": WHITE_COLD,
    "text_secondary": TECH_GRAY,
    "accent_primary": NEON_BLUE,
    "accent_secondary": SCIENTIFIC_GREEN,
    "border_color": ARCTIC_BLUE,
    "ui_bg": STEEL_BLUE,
}

# Dégradés (pour référence, format CSS)
GRADIENTS = {
    "main": "linear-gradient(90deg, #00AFFF 0%, #4FFFA3 100%)",
    "dark": "linear-gradient(135deg, #020915 0%, #06101C 50%, #020915 100%)",
}

# Typographies
FONTS = {
    "brand": "Montserrat",  # Pour titres h1, h2
    "ui": "Inter",  # Pour UI, sous-titres
    "code": "JetBrains Mono",  # Pour code, data
}

# Slogans
SLOGANS = [
    "AI Powered Finance & Intelligence",
    "Mathematics. Intelligence. Results.",
    "Automate the Next Economy",
    "π-Powered Intelligence",
]

def get_color(name: str) -> str:
    """Récupère une couleur par son nom"""
    return COLORS.get(name.lower(), NEON_BLUE)

def get_gradient(name: str) -> str:
    """Récupère un dégradé par son nom"""
    return GRADIENTS.get(name.lower(), GRADIENTS["main"])

def get_slogan(index: int = 0) -> str:
    """Récupère un slogan par index"""
    return SLOGANS[index % len(SLOGANS)]

