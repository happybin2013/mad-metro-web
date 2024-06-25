"use client";

import { useState, useEffect } from "react";
import React from 'react';

const Home = () => {
  const [people, setPeople] = useState([{ name: "", location: "" }]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [middlePlace, setMiddlePlace] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

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
      "중간 역을 찾아 그리고 중간 역의 위도와 경도를 출력해 답변은 오직 json 데이터의 value만을 좌표로 채워넣어 json data만을 답변할 것 { \"markerPosition\" : [ , ], \"middlePlace\" : \"\" }";

      console.log(prompt);
    try {
      const res = await fetch("/api/find-midpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      console.log('API Response:', data);

      if (!data.choices || data.choices.length === 0) {
        throw new Error("No choices found in the response data");
      }
      const contentObject = JSON.parse(
        data.choices[0].message.content.replace(/```json|```/g, "").trim()
      );
      console.log('Parsed Content Object:', contentObject);

      if (!contentObject.markerPosition) {
        throw new Error("Marker position not found in the response data");
      }

      setMarkerPosition(contentObject.markerPosition);
      setMiddlePlace(contentObject.middlePlace);
      setResponse(formatResponse(contentObject.markerPosition, contentObject.middlePlace));
    } catch (error) {
      console.error("Error fetching or parsing data:", error.message);
      setResponse("<데이터를 가져오거나 파싱하는 도중 오류가 발생했습니다.>");
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (markerPosition, middlePlace) => {
    if (!markerPosition) return null;

    const [lat, lng] = markerPosition;
    return (
      <div>
        <p key={lat + lng} style={styles.paragraph}>
          중간 지점은 [{lat}, {lng}]
        </p>
        <p style={styles.paragraph}>
          중간 역은 {middlePlace} 입니다
        </p>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.leftContainer, height: 'fit-content' }}>
        <h1 style={styles.title}>
          <span style={styles.titlePart1}>만나</span><br />
          <span style={styles.titlePart2}>그 역이</span><br />
          <span style={styles.titlePart3}>맞나?</span>
        </h1>
        <p style={styles.description}>
          사람들의 이름과 지역을 입력하고,<br />
          함께 만나기 좋은 역을 추천받으세요.
        </p>
        <div style={styles.inputWrapper}>
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
        </div>
        <div style={styles.buttonContainer}>
          <button onClick={addPerson} style={styles.button}>
            사람 추가
          </button>
          <button onClick={getMidpoint} style={{ ...styles.button, ...styles.findButton }}>
            {loading ? "찾는 중..." : "중간 지점 찾기"}
          </button>
        </div>
        <div style={styles.result}>{response}</div>
      </div>
      <div style={{ ...styles.rightContainer, background: '#ffffff', height: 'fit-content' }}>
      {isClient && markerPosition ? (
  <div id="map" style={styles.mapContainer}>
    <img
      src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${markerPosition[1]},${markerPosition[0]})/${markerPosition[1]},${markerPosition[0]},14/800x600?access_token=pk.eyJ1IjoicGxvZGV2IiwiYSI6ImNseHVuNGUzMTBoY3cycXBqdGVpbDk5eWIifQ.CW8MPCwvc0gseoQl_kPGvQ`}
      alt="Map with marker"
      onError={(e) => { 
        e.target.onerror = null; 
        e.target.src = 'image.png'; 
      }}
      style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
    />
  </div>
) : (
  <div>지도가 표시됩니다 😊</div>
)}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    fontFamily: "Arial, sans-serif",
    backgroundSize: "cover",
    height: "100%",
    width: "100%",
    background: "linear-gradient(135deg, #fc5bdd, #70c7ff)",
  },
  leftContainer: {
    width: "35%",
    padding: "30px",
    boxSizing: "border-box",
    background: "rgba(255, 255, 255, 0.8)",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    margin: "20px",
  },
  rightContainer: {
    width: "65%",
    padding: "20px",
    boxSizing: "border-box",
    background: "rgba(255, 255, 255, 0.8)",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    margin: "20px",
    height:"100%"
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "left",
    borderRadius: "10px",
    backgroundColor:"#ffffff",
    border: "4px solid #70c7ff",
    padding:"20px"
  },
  titlePart1: {
    color: "#fc5bdd", // 짙은 파란색
  },
  titlePart2: {
    color: "#000000", // 흰색
  },
  titlePart3: {
    color: "#fc5bdd", // 짙은 파란색
  },
  description: {
    fontSize: "18px",
    marginBottom: "20px",
    color: "#333",
    textAlign: "center",
  },
  inputWrapper: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  inputGroup: {
    display: "flex",
    marginBottom: "15px",
    textAlign:"center"
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    marginRight: "10px",
    flex: "1",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width:"80%"
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  button: {
    padding: "12px 25px",
    fontSize: "16px",
    backgroundColor: "#70c7ff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  findButton: {
    backgroundColor: "#fc5bdd",
  },
  buttonHover: {
    backgroundColor: "#ff4b4b",
  },
  findButtonHover: {
    backgroundColor: "#4b6bff",
  },
  mapContainer: {
    height: "100%",
    width: "100%",
    marginTop: "20px",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  },
  result: {
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    whiteSpace: "pre-wrap",
  },
  paragraph: {
    margin: "10px 0",
  },
};

export default Home;
