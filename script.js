const moodPalettes = {
    "ночь": ["#0B1026", "#1B2A4A", "#2C3E50", "#34495E", "#5D6D7E"],
    "космос": ["#0F0C29", "#302B63", "#24243E", "#1A1A40", "#4B0082"],
    "лес": ["#1E5128", "#4E9F3D", "#7DCEA0", "#A9DFBF", "#145A32"],
    "океан": ["#154360", "#1A5276", "#2980B9", "#5DADE2", "#85C1E9"],
    "море": ["#154360", "#1A5276", "#2980B9", "#5DADE2", "#85C1E9"],
    "пустыня": ["#D4AC0D", "#B7950B", "#9A7D0A", "#7D6608", "#F7DC6F"],
    "горы": ["#2C3E50", "#34495E", "#5D6D7E", "#85929E", "#AEB6BF"],
    "снег": ["#E5E7E9", "#CCD1D1", "#99A3A4", "#7F8C8D", "#BDC3C7"],
    "вулкан": ["#E74C3C", "#C0392B", "#922B21", "#F39C12", "#D35400"],
    "осень": ["#6E2C00", "#AF601A", "#D35400", "#E67E22", "#F5B041"],
    "солнце": ["#FFD700", "#FFA500", "#FF8C00", "#FFDAB9", "#FFE4B5"],
    "весна": ["#A9DFBF", "#7DCEA0", "#52BE80", "#2ECC71", "#D5F5E3"],
    "зима": ["#E5E7E9", "#CCD1D1", "#99A3A4", "#7F8C8D", "#BDC3C7"],
    "лето": ["#F1C40F", "#F7DC6F", "#FAD7A0", "#FDEBD0", "#E67E22"],
    "клубника": ["#E74C3C", "#C0392B", "#F1948A", "#F5B7B1", "#922B21"],
    "кофе": ["#6E2C00", "#AF601A", "#D35400", "#E67E22", "#F5B041"],
    "шоколад": ["#3E2723", "#4E342E", "#5D4037", "#6D4C41", "#8D6E63"],
    "апельсин": ["#E67E22", "#F39C12", "#F5B041", "#F7DC6F", "#FAD7A0"],
    "вишня": ["#922B21", "#C0392B", "#E74C3C", "#F1948A", "#F5B7B1"],
    "арбуз": ["#2ECC71", "#27AE60", "#E74C3C", "#C0392B", "#F1948A"],
    "любовь": ["#E74C3C", "#EC7063", "#F1948A", "#FADBD8", "#C0392B"],
    "грусть": ["#2C3E50", "#34495E", "#5D6D7E", "#85929E", "#AEB6BF"],
    "радость": ["#F1C40F", "#F7DC6F", "#FAD7A0", "#FDEBD0", "#E67E22"],
    "спокойствие": ["#D5F5E3", "#A9DFBF", "#7DCEA0", "#52BE80", "#2ECC71"],
    "страх": ["#1B1B1B", "#2C2C2C", "#3D3D3D", "#4E4E4E", "#5F5F5F"],
    "злость": ["#8B0000", "#B22222", "#DC143C", "#FF0000", "#FF4500"],
    "киберпанк": ["#00FFF5", "#FF00FF", "#8A2BE2", "#FF4500", "#00FF00"],
    "минимализм": ["#FFFFFF", "#F5F5F5", "#E0E0E0", "#CCCCCC", "#999999"],
    "ретро": ["#8B4513", "#CD853F", "#DEB887", "#F5DEB3", "#D2691E"],
    "неон": ["#FF00FF", "#00FFFF", "#FF4500", "#00FF00", "#FFFF00"],
    "готика": ["#0B0B0B", "#1B1B1B", "#2B2B2B", "#3B3B3B", "#8B0000"],
    "огонь": ["#E74C3C", "#C0392B", "#922B21", "#F39C12", "#D35400"],
    "вода": ["#154360", "#1A5276", "#2980B9", "#5DADE2", "#85C1E9"],
    "золото": ["#FFD700", "#F4A460", "#DAA520", "#B8860B", "#FFC125"],
    "серебро": ["#C0C0C0", "#D3D3D3", "#E8E8E8", "#A9A9A9", "#808080"],
    "радуга": ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF"],
    "закат": ["#F39C12", "#E74C3C", "#8E44AD", "#D35400", "#F5B041"],
    "рассвет": ["#FAD7A0", "#F5B041", "#F39C12", "#E67E22", "#FDEBD0"],
    "лаванда": ["#8E44AD", "#A569BD", "#BB8FCE", "#D2B4DE", "#E8DAEF"],
    "камень": ["#7F8C8D", "#99A3A4", "#BDC3C7", "#AEB6BF", "#CCD1D1"],
    "металл": ["#7F8C8D", "#99A3A4", "#BDC3C7", "#AEB6BF", "#CCD1D1"],
    "дерево": ["#4E342E", "#5D4037", "#6D4C41", "#8D6E63", "#A1887F"]
};

function generatePalette() {
    const userInput = document.getElementById('userInput').value.trim().toLowerCase();
    const paletteDiv = document.getElementById('palette');
    
    paletteDiv.innerHTML = '<p style="color: #999; width: 100%;">✨ Подбираю палитру...</p>';
    
    setTimeout(() => {
        let colors = null;
        
        if (userInput === '') {
            colors = Array.from({length: 5}, () => {
                return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            });
        } else {
            let found = false;
            
            for (const [mood, palette] of Object.entries(moodPalettes)) {
                if (userInput.includes(mood)) {
                    colors = palette;
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                let hash = 0;
                for (let i = 0; i < userInput.length; i++) {
                    hash = userInput.charCodeAt(i) + ((hash << 5) - hash);
                }
                
                const palette = [];
                let currentHash = Math.abs(hash);
                
                for (let i = 0; i < 5; i++) {
                    const hue = (currentHash >> (i * 4)) % 360;
                    const saturation = 50 + (currentHash >> (i * 3)) % 40;
                    const lightness = 40 + (currentHash >> (i * 2)) % 25;
                    
                    const color = hslToHex(hue, saturation, lightness);
                    palette.push(color);
                    currentHash = Math.floor(currentHash / 7) + (currentHash % 13) * 100;
                }
                
                colors = palette;
            }
        }
        
        displayColors(colors);
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

document.getElementById('generateBtn').addEventListener('click', generatePalette);

document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        generatePalette();
    }
});

generatePalette();
