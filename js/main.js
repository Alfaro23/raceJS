//переменные
let score = document.querySelector(".score");
let start = document.querySelector(".start");
let gameArea = document.querySelector(".gameArea");
let start_info = document.querySelector(".start_info");
let last_record = document.querySelector(".last_record");
let car = document.createElement("div");
car.classList.add("car"); // Добавлю машине специальный класс

//массив с разными изображениями машин
let cars = ["./image/enemy.png", "./image/enemy2.png", "./image/enemy3.png", "./image/enemy4.png", "./image/enemy5.png", "./image/enemy6.png"];

//Необходимые клавишы для управления автомобилем
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
}

//объект с первоначальными данными для игры
let setting = {
    start: false,
    score: 0,
    speed: 2,
    traffic: 2,
}

//для установки рандомного фона вражеской машины
function randomCar(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//функция для определения элементов которые заполнят страницу
function getQuantityElements(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1;
}

//Начало игры при нажатии на "Начало игры"
start.addEventListener("click", () => {
    score.style.display = "block";
    start_info.style.display = "none";
    gameArea.innerHTML = ""; // очищаю дорогу
    
    //цикл для отображения линий на дороге
    for (let i = 0; i < getQuantityElements(100); i++) {
        let line = document.createElement("div"); // создаем линию
        line.classList.add("line"); //добавляем ей класс
        line.y = i * 100; //для манипуляции линиями сохраню в переменную
        line.style.top = (i * 100) + "px"; //размещаем на странице линии с пробелами между ними

        //рисуем линию на дороге
        gameArea.appendChild(line);
    }

    //цикл для создания автомобилей
    for (let j = 0; j < getQuantityElements(100 * setting.traffic); j++) {
        let enemy = document.createElement("div");
        enemy.classList.add("enemy");
        enemy.y = -100 * setting.traffic * (j + 1); //расстояние между автомобилями
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px"; //располагаю мажины левее на рандомное число
        enemy.style.top = enemy.y + "px"; //расстояние от верха игрового пространства
        enemy.style.background = "transparent url(" + cars[randomCar(0, 5)] +") center / cover no-repeat"; //для смены фото машины
        gameArea.appendChild(enemy); // располагаю машины на поле
    }
    
    setting.score = 0; //обнуляем рекорд
    setting.start = true;  // Начинаем игру
    gameArea.appendChild(car); // Добавляю автомобиль на дорогу

    //размещаю машину после перезапуска игры
    car.style.left = gameArea.offsetWidth/2 - car.offsetWidth/2 + "px";
    car.style.top = "auto";
    car.style.bottom = "10px";

    //Анимирую функцию playGame
    requestAnimationFrame(playGame);

    //добавлю координаты расположения машины в объект
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
})


//
function playGame() {

    if (setting.start) {
        setting.score += setting.speed; //увеличиваю рекорд
        score.textContent = "Score: " + setting.score; //выводим рекорд
        moveRoad(); //Движение дороги
        moveEnemy();
        
        // Вычисляем в какое направление двигать машину
        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {  //ширина поля - ширина тачки это граница
            setting.x += setting.speed;
        }
        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }
        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed;
        }

        //передаем измененные значения на страницу
        car.style.left = setting.x + "px";
        car.style.top = setting.y + "px";

        //перезапускаем каждый раз функцию что бы игра не останавливалась и все было плавно
        requestAnimationFrame(playGame);
    }
}


//Начало движения
function startRun(event) {
    //прерываем событие
    event.preventDefault();
    //меняем ArrowUp = false на ArrowUp = true
    keys[event.key] = true;
}

//Остановка машины
function stopRun(event) {
    //прерываем событие
    event.preventDefault();
    //меняем ArrowUp = true на ArrowUp = false
    keys[event.key] = false;
}

//движение дороги
function moveRoad() {
    let lines = document.querySelectorAll(".line"); //получаем все линии на дороге

    lines.forEach((line, index) => {
        //задаю скорость движения линий
        line.y += setting.speed;
        //двигаем линии
        line.style.top = line.y + "px";

        //возвращаю линии если они скрываются внизу
        if (line.y >= document.documentElement.clientHeight) {
            line.y = -100;
        }
    })
}

//движение врагов
function moveEnemy() {
    let enemy = document.querySelectorAll(".enemy"); //получаем все машины на дороге
    enemy.forEach((item) => {

        let carRect =  car.getBoundingClientRect();  //получаю параматры автомобиля
        let enemyRect = item.getBoundingClientRect(); //получаю параматры вражеского автомобиля

        //условие при попадании нашей машины на границы вражеской
        if(carRect.top <= enemyRect.bottom && carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right && carRect.bottom >= enemyRect.top){
                //останавливаю игру
                setting.start = false;
                start_info.style.display = "flex";
                score.style.display = "none";
                last_record.innerHTML = "Предыдущий рекорд: " + setting.score;
        }

        item.y += setting.speed / 2; //присваеваем им скорость
        item.style.top = item.y + "px"; //двигаю машины

        //возвращаю машины если они скрываются внизу
        if (item.y >= document.documentElement.clientHeight) {
            item.y = -100 * setting.traffic;
            //для появления в рандомном месте
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
        }
    });
}

document.addEventListener("keydown", startRun);  //Начало движения при нажатии клавиши
document.addEventListener("keyup", stopRun);  //Остановка движения при отпускании клавиши