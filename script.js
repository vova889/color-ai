const moodPalettes = {
    "ночь": ["#0B1026", "#1B2A4A", "#2C3E50", "#34495E", "#5D6D7E"],
    "космос": ["#0F0C29", "#302B63", "#24243E", "#1A1A40", "#4B0082"],
    "клубника": ["#E74C3C", "#C0392B", "#F1948A", "#F5B7B1", "#922B21"],
    "лес": ["#1E5128", "#4E9F3D", "#7DCEA0", "#A9DFBF", "#145A32"],
    "солнце": ["#F1C40F", "#F39C12", "#E67E22", "#F7DC6F", "#FAD7A0"],
    "океан": ["#154360", "#1A5276", "#2980B9", "#5DADE2", "#85C1E9"],
    "закат": ["#F39C12", "#E74C3C", "#8E44AD", "#D35400", "#F5B041"],
    "осень": ["#6E2C00", "#AF601A", "#D35400", "#E67E22", "#F5B041"],
    "весна": ["#A9DFBF", "#7DCEA0", "#52BE80", "#2ECC71", "#D5F5E3"],
    "зима": ["#E5E7E9", "#CCD1D1", "#99A3A4", "#7F8C8D", "#BDC3C7"],
    "любовь": ["#E74C3C", "#EC7063", "#F1948A", "#FADBD8", "#C0392B"],
    "грусть": ["#2C3E50", "#34495E", "#5D6D7E", "#85929E", "#AEB6BF"],
    "радость": ["#F1C40F", "#F7DC6F", "#FAD7A0", "#FDEBD0", "#E67E22"],
    "спокойствие": ["#D5F5E3", "#A9DFBF", "#7DCEA0", "#52BE80", "#2ECC71"],
    "киберпанк": ["#00FFF5", "#FF00FF", "#8A2BE2", "#FF4500", "#00FF00"],
    "пустыня": ["#D4AC0D", "#B7950B", "#9A7D0A", "#7D6608", "#F7DC6F"],
    "север": ["#0F4C81", "#1B6CA8", "#2980B9", "#5DADE2", "#D4E6F1"],
    "огонь": ["#E74C3C", "#C0392B", "#922B21", "#F39C12", "#D35400"],
    "туман": ["#BDC3C7", "#AEB6BF", "#99A3A4", "#7F8C8D", "#CCD1D1"],
    "ваниль": ["#FDEBD0", "#FAD7A0", "#F7DC6F", "#F5B041", "#E67E22"],
    "мята": ["#D5F5E3", "#A9DFBF", "#7DCEA0", "#52BE80", "#27AE60"],
    "лаванда": ["#8E44AD", "#A569BD", "#BB8FCE", "#D2B4DE", "#E8DAEF"]
};

function generatePalette() {
    const userInput = document.getElementById('userInput').value.trim().toLowerCase();
    const paletteDiv = document.getElementById('palette');
    
    paletteDiv.innerHTML = '<p style="color: #999; width: 100%;">✨ Подбираю палитру...</p>';
    
    setTimeout(() => {
        if (userInput === '') {
            const colors = Array.from({length: 5}, () => {
                return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            });
            displayColors(colors);
            return;
        }
        
        let foundColors = null;
        
        for (const [mood, colors] of Object.entries(moodPalettes)) {
            if (userInput.includes(mood)) {
                foundColors = colors;
                break;
            }
        }
        
        if (!foundColors) {
            let hash = 0;
            for (let i = 0; i < userInput.length; i++) {
                hash = userInput.charCodeAt(i) + ((hash << 5) - hash);
            }
            
            const colors = [];
            let currentHash = Math.abs(hash);
            
            for (let i = 0; i < 5; i++) {
                const hue = (currentHash >> (i * 4)) % 360;
                const saturation = 50 + (currentHash >> (i * 3)) % 40;
                const lightness = 40 + (currentHash >> (i * 2)) % 25;
                
                const color = hslToHex(hue, saturation, lightness);
                colors.push(color);
                currentHash = Math.floor(currentHash / 7) + (currentHash % 13) * 100;
            }
            
            foundColors = colors;
        }
        
        displayColors(foundColors);
    }, 500);
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

function displayColors(colors) {
    const paletteDiv = document.getElementById('palette');
    paletteDiv.innerHTML = '';
    
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
