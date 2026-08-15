// Функция генерации палитры с помощью ИИ
async function generatePalette() {
    const userInput = document.getElementById('userInput').value;
    const paletteDiv = document.getElementById('palette');
    
    // Показываем загрузку
    paletteDiv.innerHTML = '<p style="color: #999; width: 100%;">✨ Генерирую палитру...</p>';
    
    // Если пусто — просто случайные цвета
    if (!userInput || userInput.trim() === '') {
        const colors = Array.from({length: 5}, () => {
            return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        });
        displayColors(colors);
        return;
    }
    
    try {
        const colors = await askAIForPalette(userInput);
        displayColors(colors);
    } catch (error) {
        console.error("Ошибка:", error);
        paletteDiv.innerHTML = '<p style="color: red; width: 100%;">Ошибка. Попробуй ещё раз.</p>';
    }
}

// Запрос к Google Gemini через Netlify
async function askAIForPalette(text) {
    // Вызываем нашу серверless функцию
    const response = await fetch('/.netlify/functions/generate-palette', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: text })
    });
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data.colors;
}

// Отображение цветов на странице
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

// Копирование в буфер обмена
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`Цвет ${text} скопирован!`);
    });
}

// Всплывающее уведомление
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// Запуск при загрузке страницы
window.onload = function() {
    generatePalette();
    
    document.getElementById('userInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generatePalette();
        }
    });
};
