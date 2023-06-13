// Импортируем необходимые библиотеки и стили
import React, { useState, useRef } from "react";
import InputMask from 'react-input-mask';
import axios from 'axios';
import './App.css'

// Основной компонент приложения
function App() {
  // Инициализируем состояния
  const [email, setEmail] = useState(""); // состояние для хранения введенного email
  const [fullNumber, setNumber] = useState(""); // состояние для хранения введенного номера
  const [loading, setLoading] = useState(false); // состояние для отслеживания процесса загрузки
  const [result, setResult] = useState([]); // состояние для хранения результатов поиска
  const [hasSearched, setHasSearched] = useState(false); // состояние для отслеживания того, совершен ли уже поиск
  const source = useRef(null); // реф для хранения объекта CancelToken от axios

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault(); // предотвращаем перезагрузку страницы при отправке формы

    // Обрабатываем введенный номер, удаляем дефисы
    let number = fullNumber.replace(/-/g, '');
    // Собираем данные для отправки на сервер
    const data = { email, number };

    // Если у нас уже есть источник отмены, отменяем предыдущий запрос
    if (source.current) {
      source.current.cancel('Previous request cancelled');
    }

    // Создаем новый объект CancelToken
    source.current = axios.CancelToken.source();

    // Устанавливаем состояние загрузки в true
    setLoading(true);
    // Отмечаем, что был совершен поиск
    setHasSearched(true);

    // Отправляем POST-запрос на сервер
    axios.post('http://localhost:5000/search', data, { cancelToken: source.current.token })
      .then((response) => {
        // При получении ответа устанавливаем состояние загрузки в false
        setLoading(false);
        // Записываем полученные результаты в соответствующее состояние
        setResult(response.data);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('Request cancelled');
        } else {
          console.log(error);
        }
        // В любом случае (ошибка или отмена) устанавливаем состояние загрузки в false
        setLoading(false);
      });
  };

  // Рендерим компонент
  return (
    <div className="App">
      <h1>
        {/* Выводим соответствующее сообщение в зависимости от состояния приложения */}
        {loading ? "Идёт поиск" : !hasSearched ? "Введите значения для поиска" : (result.length === 0 && !loading) ? "Ничего не найдено" : "Результаты поиска"}
      </h1>
      {/* Форма для ввода данных */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Number:
            <InputMask
              mask="99-99-99"
              value={fullNumber}
              onChange={(e) => setNumber(e.target.value)}
            />
          </label>
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>
      {/* Выводим результаты поиска */}
      {result.map((user, index) => (
        <div key={index}>
          <p>{user.email}: {user.number}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
