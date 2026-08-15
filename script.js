function generatePalette() {
    const userInput = document.getElementById('userInput').value;
    const paletteDiv = document.getElementById('palette');
    
    paletteDiv.innerHTML = '';
    
    const colors = generateColorsFromText(userInput);
    
    colors.forEach((color, index) => {
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = color;
        colorBox.style.animationDelay = `${index * 0.1}s`;
        
        const colorCode = document.createElement('span');
        colorCode.className = 'color-code';
        colorCode.textContent = color;
        
        colorBox.appendChild(colorCode);
        colorBox.onclick = () => copyToClipboard(color);
        
        paletteDiv.appendChild(colorBox);
    });
}

function generateColorsFromText(text) {
    if (!text || text.trim() === '') {
        return Array.from({length: 5}, () => {
            return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        });
    }
    
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    
    const colors = [];
    let currentHash = Math.abs(hash);
    
    for (let i = 0; i < 5; i++) {
        const hue = (currentHash >> (i * 4)) % 360;
        const saturation = 60 + (currentHash >> (i * 3)) % 30;
        const lightness = 45 + (currentHash >> (i * 2)) % 20;
        
        const color = hslToHex(hue, saturation, lightness);
        colors.push(color);
        
        currentHash = Math.floor(currentHash / 7) + (currentHash % 13) * 100;
    }
    
    return colors;
}

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    
    const toHex = x => {
        const hex = Math.round(255 * x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`Цвет ${text} скопирован!`);
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

window.onload = function() {
    generatePalette();
    
    document.getElementById('userInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generatePalette();
        }
    });
};
