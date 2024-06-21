"use client";

import { useState } from "react";

export default function Home() {
  const [people, setPeople] = useState([{ name: "", location: "" }]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const addPerson = () => {
    setPeople([...people, { name: "", location: "" }]);
  };

  const handleChange = (index, field, value) => {
    const newPeople = [...people];
    newPeople[index][field] = value;
    setPeople(newPeople);
  };

  const getMidpoint = async () => {
    setLoading(true);
    setResponse("");

    const prompt =
      people.map((person) => `${person.name}는 ${person.location}`).join(", ") +
      " 이 사람들이 만나기 좋은 역을 추천해줘.";

    const res = await fetch("/api/find-midpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    const content = data.choices[0].message.content;
    setResponse(formatResponse(content));
    setLoading(false);
  };

  const formatResponse = (content) => {
    const lines = content.split("\n").filter((line) => line.trim() !== "");
    return lines.map((line, index) => (
      <p key={index} style={styles.paragraph}>
        {line}
      </p>
    ));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>서울 지하철 중간 지점 찾기</h1>
      <p style={styles.description}>
        사람들의 이름과 지역을 입력하고, 이들이 만나기 좋은 역을 추천받으세요.
      </p>
      {people.map((person, index) => (
        <div key={index} style={styles.inputGroup}>
          <input
            type="text"
            placeholder="이름"
            value={person.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="지역"
            value={person.location}
            onChange={(e) => handleChange(index, "location", e.target.value)}
            style={styles.input}
          />
        </div>
      ))}
      <button onClick={addPerson} style={styles.button}>
        사람 추가
      </button>
      <button onClick={getMidpoint} style={styles.button}>
        {loading ? "찾는 중..." : "중간 지점 찾기"}
      </button>
      <div style={styles.result}>{response}</div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  description: {
    fontSize: "16px",
    marginBottom: "20px",
  },
  inputGroup: {
    display: "flex",
    marginBottom: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    marginRight: "10px",
    flex: "1",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "10px 0",
  },
  result: {
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
    whiteSpace: "pre-wrap",
  },
  paragraph: {
    margin: "10px 0",
  },
};
