// Sistema de Pérdida de Peso - Aplicación Principal

// Estructura de datos
let userData = {
    profile: {
        name: '',
        age: null,
        gender: 'male',
        height: null
    },
    weights: [],
    goal: null,
    foodLog: [],
    exerciseLog: []
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupTabs();
    updateDashboard();
    loadProfile();
});

// Gestión de tabs
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
        });
    });
}

function showTab(tabName) {
    // Ocultar todos los contenidos
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Desactivar todos los botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Mostrar el tab seleccionado
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Actualizar contenido específico del tab
    if (tabName === 'food') {
        updateFoodLog();
    } else if (tabName === 'exercise') {
        updateExerciseLog();
    } else if (tabName === 'progress') {
        updateWeightHistory();
        updateStatistics();
    }
}

// Gestión de datos
function saveData() {
    localStorage.setItem('weightLossData', JSON.stringify(userData));
}

function loadData() {
    const savedData = localStorage.getItem('weightLossData');
    if (savedData) {
        userData = JSON.parse(savedData);
    }
}

// Perfil de usuario
function saveProfile() {
    const name = document.getElementById('userName').value;
    const age = parseInt(document.getElementById('userAge').value);
    const gender = document.getElementById('userGender').value;
    const height = parseInt(document.getElementById('userHeight').value);

    if (!name || !age || !height) {
        alert('Por favor completa todos los campos');
        return;
    }

    userData.profile = { name, age, gender, height };
    saveData();

    showMessage('Perfil guardado exitosamente', 'success');
}

function loadProfile() {
    if (userData.profile.name) {
        document.getElementById('userName').value = userData.profile.name;
        document.getElementById('userAge').value = userData.profile.age;
        document.getElementById('userGender').value = userData.profile.gender;
        document.getElementById('userHeight').value = userData.profile.height;
    }
}

// Gestión de peso
function addWeightEntry() {
    const weight = parseFloat(document.getElementById('newWeight').value);

    if (!weight || weight <= 0) {
        alert('Por favor ingresa un peso válido');
        return;
    }

    const entry = {
        weight: weight,
        date: new Date().toISOString(),
        timestamp: Date.now()
    };

    userData.weights.push(entry);
    saveData();

    document.getElementById('newWeight').value = '';
    updateDashboard();
    showMessage('Peso registrado exitosamente', 'success');
}

function getCurrentWeight() {
    if (userData.weights.length === 0) return null;
    return userData.weights[userData.weights.length - 1].weight;
}

// Objetivos
function setGoal() {
    const goal = parseFloat(document.getElementById('goalWeight').value);

    if (!goal || goal <= 0) {
        alert('Por favor ingresa un peso objetivo válido');
        return;
    }

    const currentWeight = getCurrentWeight();
    if (!currentWeight) {
        alert('Primero debes registrar tu peso actual');
        return;
    }

    userData.goal = goal;
    saveData();
    updateGoalInfo();
    showMessage('Objetivo establecido exitosamente', 'success');
}

function updateGoalInfo() {
    const goalInfo = document.getElementById('goalInfo');
    const currentWeight = getCurrentWeight();

    if (!userData.goal || !currentWeight) {
        goalInfo.innerHTML = '<p style="color: #6c757d;">Establece tu objetivo para comenzar</p>';
        return;
    }

    const difference = currentWeight - userData.goal;
    const percentage = ((difference / currentWeight) * 100).toFixed(1);

    let message = '';
    if (difference > 0) {
        message = `
            <div class="success-message">
                <strong>¡Vamos!</strong><br>
                Te faltan ${difference.toFixed(1)} kg para alcanzar tu objetivo<br>
                Eso representa un ${percentage}% de tu peso actual
            </div>
        `;
    } else if (difference < 0) {
        message = `
            <div class="error-message">
                <strong>Atención:</strong><br>
                Tu peso objetivo está por debajo de tu peso actual<br>
                Considera aumentar ${Math.abs(difference).toFixed(1)} kg
            </div>
        `;
    } else {
        message = `
            <div class="success-message">
                <strong>¡Felicidades! 🎉</strong><br>
                Has alcanzado tu peso objetivo
            </div>
        `;
    }

    goalInfo.innerHTML = message;
}

// Calculadoras
function calculateBMI() {
    const weight = parseFloat(document.getElementById('bmcWeight').value);
    const height = parseInt(document.getElementById('bmcHeight').value);

    if (!weight || !height) {
        alert('Por favor completa todos los campos');
        return;
    }

    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);

    let category = '';
    let categoryClass = '';
    let recommendation = '';

    if (bmi < 18.5) {
        category = 'Bajo peso';
        categoryClass = 'bmi-underweight';
        recommendation = 'Considera aumentar tu ingesta calórica y consulta con un nutricionista.';
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Peso normal';
        categoryClass = 'bmi-normal';
        recommendation = '¡Excelente! Mantén tus hábitos saludables.';
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Sobrepeso';
        categoryClass = 'bmi-overweight';
        recommendation = 'Considera aumentar tu actividad física y mejorar tu alimentación.';
    } else {
        category = 'Obesidad';
        categoryClass = 'bmi-obese';
        recommendation = 'Es recomendable consultar con un profesional de la salud.';
    }

    const result = document.getElementById('bmiResult');
    result.innerHTML = `
        <h4>Tu IMC es: ${bmi.toFixed(1)}</h4>
        <p class="bmi-category ${categoryClass}">${category}</p>
        <p style="margin-top: 15px;">${recommendation}</p>
    `;
}

function calculateCalories() {
    const weight = parseFloat(document.getElementById('calWeight').value);
    const height = parseInt(document.getElementById('calHeight').value);
    const age = parseInt(document.getElementById('calAge').value);
    const gender = document.getElementById('calGender').value;
    const activity = parseFloat(document.getElementById('activityLevel').value);

    if (!weight || !height || !age) {
        alert('Por favor completa todos los campos');
        return;
    }

    // Fórmula de Harris-Benedict
    let bmr;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    const tdee = bmr * activity;
    const weightLoss = tdee - 500; // Déficit de 500 kcal para perder ~0.5kg/semana
    const maintain = tdee;
    const weightGain = tdee + 300;

    const result = document.getElementById('caloriesResult');
    result.innerHTML = `
        <h4>Calorías Diarias Recomendadas:</h4>
        <p><strong>Metabolismo Basal (BMR):</strong> ${Math.round(bmr)} kcal/día</p>
        <p><strong>Gasto Total (TDEE):</strong> ${Math.round(tdee)} kcal/día</p>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid #dee2e6;">
        <p><strong>Para perder peso:</strong> ${Math.round(weightLoss)} kcal/día</p>
        <p><strong>Para mantener peso:</strong> ${Math.round(maintain)} kcal/día</p>
        <p><strong>Para ganar peso:</strong> ${Math.round(weightGain)} kcal/día</p>
        <p style="margin-top: 15px; font-size: 0.9em; color: #6c757d;">
            Un déficit de 500 kcal/día puede ayudarte a perder aproximadamente 0.5 kg por semana.
        </p>
    `;
}

function calculateWater() {
    const weight = parseFloat(document.getElementById('waterWeight').value);

    if (!weight) {
        alert('Por favor ingresa tu peso');
        return;
    }

    // Fórmula: 35ml por kg de peso corporal
    const waterMl = weight * 35;
    const waterL = waterMl / 1000;
    const glasses = Math.ceil(waterMl / 250); // vasos de 250ml

    const result = document.getElementById('waterResult');
    result.innerHTML = `
        <h4>Agua Recomendada:</h4>
        <p><strong>${waterL.toFixed(1)} litros al día</strong></p>
        <p>Aproximadamente ${glasses} vasos de agua (250ml cada uno)</p>
        <p style="margin-top: 15px; font-size: 0.9em; color: #6c757d;">
            Beber suficiente agua ayuda a acelerar el metabolismo y reducir el apetito.
        </p>
    `;
}

// Registro de comidas
function addFood() {
    const name = document.getElementById('foodName').value;
    const calories = parseInt(document.getElementById('foodCalories').value);
    const mealType = document.getElementById('mealType').value;

    if (!name || !calories) {
        alert('Por favor completa todos los campos');
        return;
    }

    const entry = {
        name: name,
        calories: calories,
        mealType: mealType,
        date: new Date().toISOString(),
        timestamp: Date.now()
    };

    userData.foodLog.push(entry);
    saveData();

    // Limpiar campos
    document.getElementById('foodName').value = '';
    document.getElementById('foodCalories').value = '';

    updateFoodLog();
    updateDashboard();
    showMessage('Comida registrada exitosamente', 'success');
}

function updateFoodLog() {
    const foodLog = document.getElementById('foodLog');
    const today = new Date().toDateString();

    const todayFoods = userData.foodLog.filter(entry => {
        return new Date(entry.date).toDateString() === today;
    });

    if (todayFoods.length === 0) {
        foodLog.innerHTML = '<p style="color: #6c757d; text-align: center; padding: 20px;">No hay comidas registradas hoy</p>';
        return;
    }

    const mealTypes = {
        breakfast: 'Desayuno',
        lunch: 'Almuerzo',
        dinner: 'Cena',
        snack: 'Snack'
    };

    let html = '';
    todayFoods.forEach((entry, index) => {
        const time = new Date(entry.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        html += `
            <div class="log-entry">
                <div class="log-entry-info">
                    <strong>${entry.name}</strong>
                    <p>${mealTypes[entry.mealType]} - ${entry.calories} kcal</p>
                    <p style="font-size: 0.8em;">${time}</p>
                </div>
                <button class="btn btn-danger" onclick="deleteFood(${index})">Eliminar</button>
            </div>
        `;
    });

    foodLog.innerHTML = html;
}

function deleteFood(index) {
    if (confirm('¿Estás seguro de eliminar esta comida?')) {
        userData.foodLog.splice(index, 1);
        saveData();
        updateFoodLog();
        updateDashboard();
    }
}

// Registro de ejercicios
function addExercise() {
    const type = document.getElementById('exerciseType').value;
    const duration = parseInt(document.getElementById('exerciseDuration').value);
    const calories = parseInt(document.getElementById('exerciseCalories').value);

    if (!duration || !calories) {
        alert('Por favor completa todos los campos');
        return;
    }

    const exerciseNames = {
        running: 'Correr',
        walking: 'Caminar',
        cycling: 'Ciclismo',
        swimming: 'Natación',
        weights: 'Pesas',
        yoga: 'Yoga',
        other: 'Otro'
    };

    const entry = {
        type: exerciseNames[type],
        duration: duration,
        calories: calories,
        date: new Date().toISOString(),
        timestamp: Date.now()
    };

    userData.exerciseLog.push(entry);
    saveData();

    // Limpiar campos
    document.getElementById('exerciseDuration').value = '';
    document.getElementById('exerciseCalories').value = '';

    updateExerciseLog();
    updateDashboard();
    showMessage('Ejercicio registrado exitosamente', 'success');
}

function updateExerciseLog() {
    const exerciseLog = document.getElementById('exerciseLog');
    const today = new Date().toDateString();

    const todayExercises = userData.exerciseLog.filter(entry => {
        return new Date(entry.date).toDateString() === today;
    });

    if (todayExercises.length === 0) {
        exerciseLog.innerHTML = '<p style="color: #6c757d; text-align: center; padding: 20px;">No hay ejercicios registrados hoy</p>';
        return;
    }

    let html = '';
    todayExercises.forEach((entry, index) => {
        const time = new Date(entry.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        html += `
            <div class="log-entry">
                <div class="log-entry-info">
                    <strong>${entry.type}</strong>
                    <p>${entry.duration} minutos - ${entry.calories} kcal quemadas</p>
                    <p style="font-size: 0.8em;">${time}</p>
                </div>
                <button class="btn btn-danger" onclick="deleteExercise(${index})">Eliminar</button>
            </div>
        `;
    });

    exerciseLog.innerHTML = html;
}

function deleteExercise(index) {
    if (confirm('¿Estás seguro de eliminar este ejercicio?')) {
        userData.exerciseLog.splice(index, 1);
        saveData();
        updateExerciseLog();
        updateDashboard();
    }
}

// Dashboard
function updateDashboard() {
    // Actualizar peso actual
    const currentWeight = getCurrentWeight();
    document.getElementById('currentWeight').textContent = currentWeight ? currentWeight.toFixed(1) : '--';

    // Actualizar objetivo
    updateGoalInfo();

    // Actualizar resumen de hoy
    const today = new Date().toDateString();

    const todayFoods = userData.foodLog.filter(entry =>
        new Date(entry.date).toDateString() === today
    );
    const todayExercises = userData.exerciseLog.filter(entry =>
        new Date(entry.date).toDateString() === today
    );

    const totalCalories = todayFoods.reduce((sum, entry) => sum + entry.calories, 0);
    const totalBurned = todayExercises.reduce((sum, entry) => sum + entry.calories, 0);
    const balance = totalCalories - totalBurned;

    document.getElementById('todayCalories').textContent = totalCalories;
    document.getElementById('todayBurned').textContent = totalBurned;
    document.getElementById('todayBalance').textContent = balance;
}

// Historial de peso
function updateWeightHistory() {
    const weightHistory = document.getElementById('weightHistory');

    if (userData.weights.length === 0) {
        weightHistory.innerHTML = '<p style="color: #6c757d; text-align: center; padding: 20px;">No hay registros de peso</p>';
        return;
    }

    let html = '';
    const sortedWeights = [...userData.weights].reverse();

    sortedWeights.forEach((entry, index) => {
        const date = new Date(entry.date);
        const dateStr = date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const timeStr = date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });

        let changeHtml = '';
        if (index < sortedWeights.length - 1) {
            const previousWeight = sortedWeights[index + 1].weight;
            const change = entry.weight - previousWeight;
            const changeClass = change < 0 ? 'positive' : 'negative';
            const changeSymbol = change < 0 ? '↓' : '↑';
            changeHtml = `<span class="weight-change ${changeClass}">${changeSymbol} ${Math.abs(change).toFixed(1)} kg</span>`;
        }

        html += `
            <div class="weight-entry">
                <div class="weight-entry-info">
                    <div class="weight-value">${entry.weight.toFixed(1)} kg</div>
                    <div class="weight-date">${dateStr} - ${timeStr}</div>
                </div>
                ${changeHtml}
            </div>
        `;
    });

    weightHistory.innerHTML = html;
}

// Estadísticas
function updateStatistics() {
    const statistics = document.getElementById('statistics');

    if (userData.weights.length === 0) {
        statistics.innerHTML = '<p style="color: #6c757d; text-align: center; padding: 20px;">No hay suficientes datos para mostrar estadísticas</p>';
        return;
    }

    const currentWeight = getCurrentWeight();
    const firstWeight = userData.weights[0].weight;
    const totalChange = currentWeight - firstWeight;

    // Calcular peso promedio
    const avgWeight = userData.weights.reduce((sum, entry) => sum + entry.weight, 0) / userData.weights.length;

    // Calcular total de días
    const firstDate = new Date(userData.weights[0].date);
    const lastDate = new Date(userData.weights[userData.weights.length - 1].date);
    const daysDiff = Math.floor((lastDate - firstDate) / (1000 * 60 * 60 * 24));

    // Total de calorías y ejercicios
    const totalFoodCalories = userData.foodLog.reduce((sum, entry) => sum + entry.calories, 0);
    const totalExerciseCalories = userData.exerciseLog.reduce((sum, entry) => sum + entry.calories, 0);

    let html = `
        <div class="stat-row">
            <span class="stat-label">Peso inicial:</span>
            <span class="stat-number">${firstWeight.toFixed(1)} kg</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Peso actual:</span>
            <span class="stat-number">${currentWeight.toFixed(1)} kg</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Cambio total:</span>
            <span class="stat-number" style="color: ${totalChange < 0 ? '#28a745' : '#dc3545'}">
                ${totalChange > 0 ? '+' : ''}${totalChange.toFixed(1)} kg
            </span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Peso promedio:</span>
            <span class="stat-number">${avgWeight.toFixed(1)} kg</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Días rastreados:</span>
            <span class="stat-number">${daysDiff === 0 ? 1 : daysDiff}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Total de registros de peso:</span>
            <span class="stat-number">${userData.weights.length}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Comidas registradas:</span>
            <span class="stat-number">${userData.foodLog.length}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Ejercicios registrados:</span>
            <span class="stat-number">${userData.exerciseLog.length}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Calorías totales consumidas:</span>
            <span class="stat-number">${totalFoodCalories.toLocaleString()}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Calorías totales quemadas:</span>
            <span class="stat-number">${totalExerciseCalories.toLocaleString()}</span>
        </div>
    `;

    if (userData.goal) {
        const remaining = currentWeight - userData.goal;
        html += `
            <div class="stat-row">
                <span class="stat-label">Objetivo de peso:</span>
                <span class="stat-number">${userData.goal.toFixed(1)} kg</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Por alcanzar:</span>
                <span class="stat-number">${remaining > 0 ? remaining.toFixed(1) + ' kg' : '¡Meta alcanzada! 🎉'}</span>
            </div>
        `;
    }

    statistics.innerHTML = html;
}

// Mensajes
function showMessage(message, type) {
    // Esta función podría expandirse para mostrar notificaciones toast
    console.log(`${type}: ${message}`);
}
