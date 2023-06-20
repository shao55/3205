import React, { useState, useRef } from "react";
import InputMask from 'react-input-mask';
import axios from 'axios';

import './App.css';

function App() {
  const [email, setEmail] = useState("");
  const [fullNumber, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const source = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    let number = fullNumber.replace(/-/g, '');
    const data = { email, number };

    if (!emailIsValid(email)) {
      alert("Некорректный адрес электронной почты");
      return;
    }

    if (!numberIsValid(number)) {
      alert("Некорректный номер телефона");
      return;
    }

    if (source.current) {
      source.current.cancel('Previous request cancelled');
    }

    source.current = axios.CancelToken.source();

    setLoading(true);
    setHasSearched(true);

    axios.post('http://localhost:5000/search', data, { cancelToken: source.current.token })
      .then((response) => {
        setLoading(false);
        setResult(response.data);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('Request cancelled');
        } else {
          console.log(error);
        }
        setLoading(false);
      });
  };

  const emailIsValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const numberIsValid = (number) => {
    return /^\d{6}$/.test(number);
  };

  return (
    <div className="App">
      <h1>
        {loading ? "Идёт поиск" : !hasSearched ? "Введите значения для поиска" : (result.length === 0 && !loading) ? "Ничего не найдено" : "Результаты поиска"}
      </h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
              title="Введите корректный адрес электронной почты"
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
      {result.map((user, index) => (
        <div key={index}>
          <p>{user.email}: {user.number}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
