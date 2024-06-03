var blockSize = 25;
        var rows = 18;
        var cols = 30;
        var board;
        var context; 

        // Zmijska glava
        var snakeX = blockSize * 5;
        var snakeY = blockSize * 5;
        var velocityX = 0;
        var velocityY = 0;
        var snakeBody = [];
        

        // Hrana
        var foodX;
        var foodY;

        // Score i Highscore
        var score = 0;
        var highScore = localStorage.getItem("highScore") || 0; // uzima vrijednost highscorea iz localStorage

        // Game over
        var gameOver = false;
        var gameSpeed = 100; // Defaultna brzina igre


        // Postavljanje okvira igrice
        window.onload = function() {
            board = document.getElementById("board");
            board.height = rows * blockSize;
            board.width = cols * blockSize;
            context = board.getContext("2d"); // za crtanje kvadratića

            placeFood();
            document.addEventListener("keyup", changeDirection);
            // update();
           // setInterval(update, 1000/10); // 100 milliseconds
           //setInterval(update, gameSpeed); // Promijenjen interval na gameSpeed
           gameInterval = setInterval(update, gameSpeed); // Stvaranje intervala
        }

        // Postavljanje cijelog tijela igrice
        function update() {
            if (gameOver) {
                context.fillStyle = "red";
                context.font = "bold 90px Arial";
                context.fillText("Game Over", board.width / 2 - 240, board.height / 2);
                return;
            }

            // Stilizacija okvira
            context.fillStyle="black";
            context.fillRect(0, 0, board.width, board.height);

            // Stilizacija hrane 
            context.fillStyle="red";
            context.beginPath();
            context.arc(foodX + blockSize/2, foodY + blockSize/2, blockSize/2.5, 0, Math.PI * 2); // kružnica
            context.fill(); //kod blocksize/3 smanjila kružnicu

            // Sudar zmijice i hrane
            if (snakeX == foodX && snakeY == foodY) {
                snakeBody.push([foodX, foodY]);
                placeFood();
                score++; //nadodano
            }

            // Stvaranje tijela zmijice
            for (let i = snakeBody.length-1; i > 0; i--) {
                snakeBody[i] = snakeBody[i-1];
            }
            if (snakeBody.length) {
                snakeBody[0] = [snakeX, snakeY];
            }

            // Stiliziranje tijela zmijice
            context.fillStyle="yellow";
            snakeX += velocityX * blockSize;
            snakeY += velocityY * blockSize;

            // Crtanje glave zmije kao kružnice
            context.beginPath();
            context.arc(snakeX + blockSize/2, snakeY + blockSize/2, blockSize/2, 0, Math.PI * 2); // kružnica
            context.fill(); //blocksize/3 smanjila kružnicu


            
           // Crtanje tijela zmije kao kružnica
           context.fillStyle="green";
            for (let i = 0; i < snakeBody.length; i++) {
                context.beginPath();
                context.arc(snakeBody[i][0] + blockSize/2, snakeBody[i][1] + blockSize/2, blockSize/2.5, 0, Math.PI * 2); // kružnica
                context.fill(); //blocksize/smanjila kružnicu
                
            }
           

            // Postavljanje tijela zmijice
            /*
// Postavljanje tijela zmijice
for (let i = 0; i < snakeBody.length; i++) {
    let [bodyX, bodyY] = snakeBody[i];
    context.beginPath();
    let offsetX = snakeX - snakeBody[i][0]; // Računanje razlike u X koordinatama
    let offsetY = snakeY - snakeBody[i][1]; // Računanje razlike u Y koordinatama
    context.arc(bodyX + offsetX, bodyY + offsetY, blockSize / 3, 0, Math.PI * 2);
    context.fill();
}
*/



            //game over uvjeti
            if (snakeX < 0 || snakeX > cols*blockSize || snakeY < 0 || snakeY > rows*blockSize) {
                gameOver = true;
            }

            for (let i = 0; i < snakeBody.length; i++) {
                if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
                    gameOver = true;
                }
            }

            // prikaz score 
            context.fillStyle = "white";
            context.font = "20px Arial";
            context.fillText("Score: " + score, 10, 30);
            context.fillText("High Score: " + highScore, 10, 60);
        }

        // Pomicanje zmijice
        function changeDirection(e) {
            if (e.code == "ArrowUp" && velocityY != 1) {
                velocityX = 0;
                velocityY = -1;
            }
            else if (e.code == "ArrowDown" && velocityY != -1) {
                velocityX = 0;
                velocityY = 1;
            }
            else if (e.code == "ArrowLeft" && velocityX != 1) {
                velocityX = -1;
                velocityY = 0;
            }
            else if (e.code == "ArrowRight" && velocityX != -1) {
                velocityX = 1;
                velocityY = 0;
            }
            else {
        
                gameOver = true;
                context.fillStyle = "red";
                context.font = "bold 90px Arial";
                context.fillText("Game Over", board.width / 2 - 240, board.height / 2);
                return;
            }
        }

        // Nasumično postavljanje hrane
        function placeFood() {
            //(0-1) * cols -> (0-19.9999) -> (0-19) * 25
            foodX = Math.floor(Math.random() * cols) * blockSize;
            foodY = Math.floor(Math.random() * rows) * blockSize;
        }

        // Postavljanje brzine igre ovisno o levelu
function setDifficulty(difficulty) {
    switch (difficulty) {
        case 'easy':
            gameSpeed = 150; // Postavite brzinu za easy
            break;
        case 'medium':
            gameSpeed = 100; // Postavite brzinu za medium
            break;
        case 'hard':
            gameSpeed = 50; // Postavite brzinu za hard
            break;
        default:
            break;
    }

    clearInterval(gameInterval);
    gameInterval = setInterval(update, gameSpeed);
}

        // Ponovno pokretanje igrice
        function resetGame() {
            snakeX = blockSize * 5;
            snakeY = blockSize * 5;
            velocityX = 0;
            velocityY = 0;
            snakeBody = []; 
           
            score = 0;
            gameOver = false;
            placeFood();
        }
        