// https://api.openweathermap.org/data/2.5/weather?q=berlin&appid=acb67e0ddee36ecd9463ca4f757e71b7

//Ключ
const apiKey = 'acb67e0ddee36ecd9463ca4f757e71b7';
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lang=ru&units=metric&q=`;

//Ссылки 
const searchWindow = document.querySelector('.search__window');
const searchInput = document.querySelector('.search__box input');
const searchButton = document.querySelector('.search__button');
const main = document.querySelector('.main');
const weatherImage = document.querySelector('.img__today');
const errorText = document.querySelector('.error');
const weatherConditions = document.querySelector('.weather__conditions');
const plusIcon = document.querySelector('.custom-plus');
const todayDate = document.querySelector('.date');


//Открытие окна поиска при клике на крестик или окно поиска
if (plusIcon /*&& searchWindow*/) {
    plusIcon.addEventListener('click', () => {
        searchWindow.style.display = 'flex';
    });
}

//Асснхронная функция
async function checkWeather(city) {
    //Обработка ошибок, если они возникнут при выполнении кода
    try {
        //fetch(...) делает GET-запрос к API погоды
        //await, чтобы дождаться ответа сервера
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        //Если response.ok === false (например, город не найден), вызываем throw new Error(...), передавая статус ошибки (404, 500 и т. д.) 
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }
        
        //превращает ответ API в объект data
        const data = await response.json();
        //выводит объект в консоль (удобно для отладки)
        console.log(data, 'data');

        //Если API вернул данные без main или weather, это считается ошибкой
        if (!data.main || !data.weather) {
            throw new Error('Некорректные данные от API');
        }

        //Обновление данных на странице
        document.querySelector('.city').innerHTML = data.name;
        document.querySelector('.degree').innerHTML =
            Math.round(data.main.temp) + '°C';
        document.querySelector('.feels__like__value').innerHTML = 
            Math.round(data.main.feels_like) + '°C';
        document.querySelector('.humidity__value').innerHTML = data.main.humidity + '%';
        document.querySelector('.temp__max__value').innerHTML = 
            Math.round(data.main.temp_max) + '°C';
        document.querySelector('.temp__min__value').innerHTML = 
            Math.round(data.main.temp_min) + '°C';
        document.querySelector('.wind__speed__value').innerHTML = 
            Math.round(data.wind.speed) + ' км/ч';

        //Отображение изображения погоды
        if (weatherImage) {
            if (data.weather[0].main === 'Clear') {
                weatherImage.src = 'img/clear.png';
                weatherConditions.textContent = 'Ясно';
            } else if (data.weather[0].main === 'Rain') {
                weatherImage.src = 'img/rain.png';
                weatherConditions.textContent = 'Дождь';
            } else if (data.weather[0].main === 'Mist') {
                weatherImage.src = 'img/mist.png';
                weatherConditions.textContent = 'Туман';
            } else if (data.weather[0].main === 'Drizzle') {
                weatherImage.src = 'img/drizzle.png';
                weatherConditions.textContent = 'Морось';
            } else {
                weatherImage.src = 'img/cloudly.png';
                weatherConditions.textContent = 'Облачно';
            }
        }

        // Успешный запрос — скрываем ошибку
        errorText.style.display = 'none';

        // Показываем главный блок
        main.style.display = 'block';
        //Прячем searchWindow (экран поиска)
        searchWindow.style.display = 'none';

    //Обработка ошибок, если что-то пошло не так
    } catch (error) {
        //Ошибка выводится в консоль
        console.error('Ошибка запроса к API:', error);
        //Пользователь получает всплывающее предупреждение
        window.alert('Неизвестный город, повторите запроc');
        alert('Неизвестный город, повторите запроc');

    }

}

//Обработчик события на кнопку поиска погоды
//if (searchButton) - если searchButton (кнопка поиска) существует в DOM, выполняется код внутри if. Это предотвращает ошибки, если элемент отсутствует
if (searchButton) {
    //Добавление слушателя события
    searchButton.addEventListener('click', () => {
        //введённое пользователем название города и передаёт его в checkWeather(city), которая запрашивает погоду
        checkWeather(searchInput.value);
        //После запроса значение поля (searchInput) сбрасывается, чтобы пользователь мог ввести новый город
        searchInput.value = '';
    });
}

//Поиск погоды по нажатию клавиши "Enter" в поле ввода
//Проверка, существует ли searchInput
if (searchInput) {
    //Добавление слушателя события "keydown"
    //keydown срабатывает каждый раз, когда пользователь нажимает клавишу в поле ввода.
    //event — объект события, который содержит информацию о нажатой клавише
    searchInput.addEventListener("keydown", (event) => {
        //Проверка, нажата ли клавиша "Enter"
        if (event.key === "Enter") {
            //Вызов checkWeather() с текстом из поля для ввода
            checkWeather(searchInput.value);
            //Очистка поля ввода
            searchInput.value = "";
        }
    });
}

//Закрывается окно поиска (searchWindow) при клике вне него, если оно иконка plusIcon существуют
//Добавление слушателя события "click" на весь документ
document.addEventListener('click', (event) => {
    //Проверка условий
    //searchWindow && plusIcon — проверяет, существуют ли элементы.
    //!searchWindow.contains(event.target). Если клик был НЕ внутри searchWindow, то true.
    //!plusIcon.contains(event.target). Если клик был НЕ по plusIcon, то true.
    //Если оба условия true, выполняется код внутри {}.
    if (searchWindow && plusIcon && !searchWindow.contains(event.target) && !plusIcon.contains(event.target)) {
        // Если клик был вне окна поиска и иконки, скрываем searchWindow
        searchWindow.style.display = 'none';
    }
});

//Добавление автоматически обновляемой даты на страницу
const now = new Date();
const options = {
    weekday: 'long', // Полное название дня недели (например, "понедельник")
    day: 'numeric', 
    month: 'long', // Полное название месяца (например, "февраля")
    year: 'numeric'
};

todayDate.textContent = now.toLocaleDateString('ru-RU', options); 

