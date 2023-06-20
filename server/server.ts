// Импорт необходимых библиотек
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";

// Создание экземпляра приложения Express
const app = express();

// Использование middleware для обработки CORS и JSON
app.use(cors());
app.use(bodyParser.json());

// Определение интерфейса для объектов пользователей
interface User {
  email: string;
  number: string;
}

let users: User[] = [];

// Загрузка данных из файла users.json
fs.readFile("users.json", (err, data) => {
  if (err) {
    console.error("Failed to read users.json", err);
    return;
  }

  users = JSON.parse(data.toString());
});

// Обработка POST-запроса на эндпоинт "/search"
app.post("/search", (req: Request, res: Response) => {
  setTimeout(() => {
    // имитация задержки сервера
    // Получение данных из тела запроса
    const { email, number } = req.body;

    // Поиск пользователей, соответствующих полученным данным
    const result = users.filter(
      (user) => user.email === email && (!number || user.number === number)
    );

    // Отправка ответа с результатами поиска
    res.json(result);
  }, 5000);
});

// Запуск сервера на порту 5000
app.listen(5000, () => console.log("Server started on port 5000"));
