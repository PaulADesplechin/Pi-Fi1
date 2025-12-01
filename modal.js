/**
 * Système complet de modal crypto - Style Binance/OKX
 * Compatible avec toutes les structures API
 */

let tradingChart = null;
let tradingUpdateInterval = null;
let currentSymbol = null;

/**
 * Fonction principale pour récupérer les données crypto
 * Gère toutes les structures API possibles
 */
async function fetchCryptoData(symbol) {
    try {
        const response = await fetch(`/api/crypto/${symbol}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Normaliser les données selon différentes structures possibles
        let price = data.price || data.prices || data.market_data?.current_price?.usd || 0;
        let change = data.change || data.change_24h || data.price_change_percentage_24h || data.market_data?.price_change_percentage_24h || 0;
        let high = data.high || data.high_24h || data.market_data?.high_24h?.usd || price;
        let low = data.low || data.low_24h || data.market_data?.low_24h?.usd || price;
        let volume = data.volume || data.volume_24h || data.market_data?.total_volume?.usd || 0;
        let history = data.history || data.price_history || [];
        
        // Convertir en nombres
        price = parseFloat(price) || 0;
        change = parseFloat(change) || 0;
        high = parseFloat(high) || price;
        low = parseFloat(low) || price;
        volume = parseFloat(volume) || 0;
        
        // Générer un historique fallback si nécessaire (24h avec 48 points)
        if (!history || history.length < 10) {
            history = generateFallbackHistory(price, change, high, low, 48);
        }
        
        return {
            price,
            change,
            high,
            low,
            volume,
            history
        };
    } catch (error) {
        console.error('Erreur fetchCryptoData:', error);
        throw error;
    }
}

/**
 * Génère un historique fallback réaliste sur 24h
 */
function generateFallbackHistory(currentPrice, change24h, high24h, low24h, numPoints = 48) {
    const history = [];
    const now = new Date();
    const trend = change24h / 100; // Tendance en décimal
    const priceRange = high24h - low24h;
    
    for (let i = numPoints - 1; i >= 0; i--) {
        const pointTime = new Date(now.getTime() - i * 30 * 60000); // 30 minutes entre chaque point
        const progress = i / numPoints; // 0 à 1
        
        // Variation sinusoïdale avec tendance
        const sineVariation = Math.sin(progress * Math.PI * 2) * 0.015;
        const trendVariation = trend * (1 - progress);
        const randomVariation = (Math.random() - 0.5) * 0.01;
        
        let price = currentPrice * (1 - trendVariation - sineVariation + randomVariation);
        
        // S'assurer que le prix reste dans la fourchette 24h
        price = Math.max(low24h * 0.995, Math.min(high24h * 1.005, price));
        
        history.push({
            time: pointTime.toISOString(),
            price: parseFloat(price.toFixed(2))
        });
    }
    
    return history;
}

/**
 * Ouvre le modal crypto avec les données
 */
async function openCryptoModal(symbol, name) {
    currentSymbol = symbol;
    
    // Mettre à jour le titre du modal
    document.getElementById('modal-symbol').textContent = symbol;
    document.getElementById('modal-name').textContent = name || symbol;
    document.getElementById('tradingModal').classList.add('active');
    
    // Attendre que le modal soit complètement visible
    setTimeout(async () => {
        // Initialiser le graphique
        const canvas = document.getElementById('tradingChart');
        if (!canvas) {
            console.error('Canvas tradingChart non trouvé');
            return;
        }
        
        const container = canvas.parentElement;
        if (container) {
            container.style.display = 'block';
            container.style.height = '400px';
            container.style.minHeight = '400px';
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Impossible d\'obtenir le contexte 2D');
            return;
        }
        
        // Détruire l'ancien graphique
        if (tradingChart) {
            tradingChart.destroy();
            tradingChart = null;
        }
        
        // Créer le nouveau graphique avec ligne lissée
        tradingChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: symbol,
                    data: [],
                    borderColor: '#00AFFF',
                    backgroundColor: 'rgba(0, 175, 255, 0.15)',
                    borderWidth: 2.5,
                    tension: 0.3, // Ligne lissée style TradingView
                    fill: true,
                    pointRadius: 0, // Pas de points visibles
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#00AFFF',
                    pointHoverBorderColor: '#F5F9FF',
                    pointHoverBorderWidth: 2,
                    pointBackgroundColor: 'transparent',
                    pointBorderColor: 'transparent'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 800,
                    easing: 'easeInOutQuart'
                },
                layout: {
                    padding: {
                        top: 10,
                        bottom: 10,
                        left: 10,
                        right: 10
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false // Pas de légende
                    },
                    tooltip: {
                        backgroundColor: 'rgba(2, 9, 21, 0.98)',
                        titleColor: '#F5F9FF',
                        bodyColor: '#5A6C81',
                        borderColor: 'rgba(0, 175, 255, 0.6)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.y.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 8});
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(161, 227, 255, 0.08)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#5A6C81',
                            font: {
                                size: 11
                            },
                            callback: function(value) {
                                return '$' + value.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#5A6C81',
                            font: {
                                size: 11
                            },
                            maxTicksLimit: 8
                        }
                    }
                }
            }
        });
        
        // Charger les données initiales
        await updateCryptoModal(symbol);
        
        // Mettre à jour toutes les 3 secondes
        if (tradingUpdateInterval) {
            clearInterval(tradingUpdateInterval);
        }
        tradingUpdateInterval = setInterval(async () => {
            if (currentSymbol === symbol) {
                await updateCryptoModal(symbol);
            }
        }, 3000);
    }, 300);
}

/**
 * Met à jour le modal avec les données crypto
 */
async function updateCryptoModal(symbol) {
    try {
        const data = await fetchCryptoData(symbol);
        
        // Mettre à jour les statistiques
        document.getElementById('stat-price').textContent = '$' + data.price.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 8});
        
        const changeClass = data.change >= 0 ? 'positive' : 'negative';
        const changeSign = data.change >= 0 ? '+' : '';
        const changeElement = document.getElementById('stat-change');
        changeElement.textContent = `${changeSign}${data.change.toFixed(2)}%`;
        changeElement.className = `trading-stat-value ${changeClass}`;
        
        document.getElementById('stat-high').textContent = '$' + data.high.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        document.getElementById('stat-low').textContent = '$' + data.low.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        
        const volume = data.volume || 0;
        let volumeText = '';
        if (volume >= 1000000000) {
            volumeText = '$' + (volume / 1000000000).toFixed(2) + 'B';
        } else if (volume >= 1000000) {
            volumeText = '$' + (volume / 1000000).toFixed(2) + 'M';
        } else if (volume >= 1000) {
            volumeText = '$' + (volume / 1000).toFixed(2) + 'K';
        } else {
            volumeText = '$' + volume.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }
        document.getElementById('stat-volume').textContent = volumeText;
        
        // Mettre à jour le graphique
        if (tradingChart && data.history && data.history.length > 0) {
            const labels = data.history.map(item => {
                try {
                    const date = new Date(item.time);
                    return date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
                } catch (e) {
                    return '';
                }
            });
            const prices = data.history.map(item => parseFloat(item.price) || 0);
            
            if (labels.length > 0 && prices.length > 0 && labels.length === prices.length) {
                const validPrices = prices.filter(p => !isNaN(p) && p > 0);
                const validLabels = labels.slice(0, validPrices.length);
                
                if (validPrices.length > 0) {
                    tradingChart.data.labels = validLabels;
                    tradingChart.data.datasets[0].data = validPrices;
                    tradingChart.data.datasets[0].label = symbol;
                    
                    // Ajuster les échelles
                    const minPrice = Math.min(...validPrices);
                    const maxPrice = Math.max(...validPrices);
                    const padding = (maxPrice - minPrice) * 0.1;
                    
                    tradingChart.options.scales.y.min = Math.max(0, minPrice - padding);
                    tradingChart.options.scales.y.max = maxPrice + padding;
                    
                    tradingChart.update('active');
                }
            }
        }
    } catch (error) {
        console.error('Erreur updateCryptoModal:', error);
    }
}

/**
 * Ferme le modal proprement
 */
function closeTradingModal() {
    document.getElementById('tradingModal').classList.remove('active');
    if (tradingUpdateInterval) {
        clearInterval(tradingUpdateInterval);
        tradingUpdateInterval = null;
    }
    currentSymbol = null;
    if (tradingChart) {
        tradingChart.destroy();
        tradingChart = null;
    }
}

// Fermer le modal en cliquant en dehors
document.addEventListener('click', function(event) {
    const modal = document.getElementById('tradingModal');
    if (event.target === modal) {
        closeTradingModal();
    }
});

// Fermer avec la touche Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeTradingModal();
    }
});

