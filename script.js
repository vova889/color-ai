const part1 = "AQ.Ab8RN6L-";
const part2 = "B2k_miMII17g88SH";
const part3 = "uGNgZkQ-HUq2BKhA";
const part4 = "zyMBCM4aSg";
const API_KEY = part1 + part2 + part3 + part4;

async function generatePalette() {
    const userInput = document.getElementById('userInput').value;
    const paletteDiv = document.getElementById('palette');
    
    paletteDiv.innerHTML = '<p style="color: #999; width: 100%;">✨ Генерирую палитру...</p>';
    
    if (!userInput || userInput.trim() === '') {
        const colors = Array.from({length: 5}, () => {
            return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        });
        displayColors(colors);
        return;
    }
    
    try {
        const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY;
        
        const aiPrompt = `Ты — профессиональный дизайнер. Пользователь описал настроение: "${userInput}". 
        Создай палитру из 5 цветов (HEX-коды), которые идеально передают это настроение.
        Верни ТОЛЬКО JSON массив в формате: ["#FF5733", "#C70039", ...] без лишнего текста.`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: aiPrompt
                    }]
                }]
            })
        });
        
        const data = await response.json();
        
        let answer = data.candidates[0].content.parts[0].text;
        
        const match = answer.match(/\[.*\]/s);
        if (match) {
            answer = match[0];
        }
        
        const colors = JSON.parse(answer);
        displayColors(colors.slice(0, 5));
        
    } catch (error) {
        console.error("Ошибка:", error);
        paletteDiv.innerHTML = '<p style="color: red; width: 100%;">Ошибка. Попробуй ещё раз.</p>';
    }
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
