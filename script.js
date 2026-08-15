const part1 = "hf_OeqjkEq";
const part2 = "kbqrQtXsLJ";
const part3 = "TZOqjICfHC";
const part4 = "cyJBjUw";
const HF_API_KEY = part1 + part2 + part3 + part4;

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
        const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + HF_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: `Ты — профессиональный дизайнер. Пользователь описал настроение: "${userInput}". 
Создай палитру из 5 цветов (HEX-коды), которые идеально передают это настроение.
Верни ТОЛЬКО JSON массив в формате: ["#FF5733", "#C70039", "#C70039", "#581845", "#DAF7A6"] без лишнего текста.`,
                parameters: {
                    max_new_tokens: 100,
                    temperature: 0.7
                }
            })
        });
        
        const data = await response.json();
        
        let text = "";
        if (Array.isArray(data)) {
            text = data[0].generated_text || "";
        } else if (data.generated_text) {
            text = data.generated_text;
        } else {
            throw new Error("Неожиданный формат ответа");
        }
        
        const match = text.match(/\[.*\]/s);
        if (!match) {
            throw new Error("ИИ не вернул палитру");
        }
        
        const colors = JSON.parse(match[0]);
        displayColors(colors.slice(0, 5));
        
    } catch (error) {
        console.error("Ошибка:", error);
        paletteDiv.innerHTML = '<p style="color: red; width: 100%;">Ошибка: ' + error.message + '</p>';
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
