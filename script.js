const input = document.getElementById('inp')

//for enter btn
input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        document.getElementById('btn').click();
    }
});

let convs = []

const convsDiv = document.getElementById('convs');

//for dark mode

document.getElementById("darkModeToggle").addEventListener("change", function () {
    document.body.classList.toggle("dark-mode");

});

// Existing convs array and displayData function assumed
document.getElementById('clearBtn').addEventListener('click', function () {
    convs = [];
    convsDiv.textContent = '';
    input.value = '';
});

document.getElementById('btn').addEventListener('click', function () {

    //for lang
    let lang = document.getElementById('lang').value;
    const typing = document.getElementById('typingIndicator');
    typing.style.display = 'block'; // Show typing


       // 👉 Show loading cursor
    document.body.style.cursor = 'wait';

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAzOSl3QH0jIUcY1-yTyZbfT9-IRNKpwjQ`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                            text: `You are **ChefMate AI**, a professional digital chef and meal planner.

Respond in: ${lang}

If the input is in English but ${lang} is not 'en', translate your final response into ${lang}.



User said: "${input.value}"

Check for:
 Nutritional preferences (e.g., "1500 calorie/day", "no sugar", "low carb", etc.)
 Dietary tags (e.g., vegetarian, vegan, gluten-free, halal, keto, diabetic)
 Time constraints (e.g., "quick", "under 30 minutes", "no oven")
 Weekly meal plan requests (e.g., "make a weekly plan", "7-day vegetarian diet", etc.)

If the input is a weekly plan request, generate a 7-day meal plan with:
Dish name for each day (Breakfast, Lunch, Dinner)
Calorie estimates
Quick preparation tips
Variations if repeated ingredients are used

Else, generate a complete recipe that includes:

0 Dish Histroy
1 Dish Name  
2 Category(🥦 Vegetarian, 🥩 Non-Veg, 🌶 Spicy, etc.)  
3 Difficulty Level(Easy, Medium, Hard)  
4 Prep Time, Cook Time, Total Time  
5 Serving Size  
6 Ingredients (with exact measurements)  
7 Step-by-Step Instructions (clear, numbered, and easy to follow)  
8 Nutritional Info per serving (Calories, Protein, Carbs, Fat)  
9 Allergen Warnings (if any)  
10 Cooking Tools Required  
11 Serving Suggestions / Pairings  
12 Optional Tips (storage, substitutions, flavor tweaks)  
13 Estimated Cost in INR (optional, based on local Indian pricing)

Ensure:
 Cultural authenticity for regional dishes  
 Final output is translated into ${lang}  
 Format with clean line breaks, bold titles, and emojis if applicable  
 Keep the tone friendly and professional`

                            },
                        ],
                    },
                ],
            }),
        },
    )
        .then((res) => res.json())
        .then((data) => {
            console.log(data.candidates[0].content.parts[0].text);
            typing.style.display = 'none';
            document.body.style.cursor = 'default';
             // 👉 Reset cursor
            let obj = {
                myQue: input.value,
                AIresponse: data.candidates[0].content.parts[0].text,
            };
            convs.push(obj)
           
            displayData(convs);
        })
        .catch((err) => console.log(err))

})

function displayData(arr) {
    convsDiv.textContent = ''
    arr.forEach((e, i) => {
        const queDiv = document.createElement('div');
        queDiv.className = 'msg user-msg';
        queDiv.innerHTML = `<strong>You:</strong> ${e.myQue}`;

        // const ansDiv = document.createElement('div');
        // ansDiv.className = 'msg ai-msg';
        // ansDiv.innerHTML = `<strong>ChefMate AI:</strong> ${e.AIresponse}`;


        const ansDiv = document.createElement('div');
ansDiv.className = 'msg ai-msg';
ansDiv.innerHTML = `
  <strong>ChefMate AI:</strong>
  <div class="recipe-content">${e.AIresponse}</div>
  <button class="copy-btn">📋 Copy Recipe</button>
`;

        convsDiv.appendChild(queDiv);
        convsDiv.appendChild(ansDiv);

        const copyBtn = ansDiv.querySelector('.copy-btn');
const recipeText = ansDiv.querySelector('.recipe-content');

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(recipeText.innerText)
    .then(() => {
      copyBtn.textContent = "✅ Copied!";
    //   setTimeout(() => copyBtn.textContent = "📋 Copy Recipe", 2000);
    })
    .catch(() => {
      copyBtn.textContent = "❌ Failed to copy";
    });
});

        
    })
    input.value = '';
    convsDiv.scrollTop = convsDiv.scrollHeight;
}


