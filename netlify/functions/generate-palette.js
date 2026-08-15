// Серверная функция для общения с Gemini API
const API_KEY = process.env.GEMINI_API_KEY;

exports.handler = async (event) => {
    try {
        const { prompt } = JSON.parse(event.body);
        
        const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + API_KEY;
        
        const aiPrompt = `Ты — профессиональный дизайнер. Пользователь описал настроение: "${prompt}". 
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
        
        // Достаем JSON из ответа
        const match = answer.match(/\[.*\]/s);
        if (match) {
            answer = match[0];
        }
        
        const colors = JSON.parse(answer);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ colors: colors.slice(0, 5) })
        };
        
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Ошибка генерации" })
        };
    }
};
