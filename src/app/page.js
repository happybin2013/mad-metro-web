"use client";

import { useState, useEffect } from "react";
import React from 'react';
import dynamic from 'next/dynamic';
import LeafletMap from './components/LeafletMap';

const Home = () => {
  const [people, setPeople] = useState([{ name: "", location: "" }]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null); // 상태 추가

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
      "중간 역을 찾아 그리고 중간 역의 위도와 경도를 출력해 답변은 오직 json 데이터의 value만을 좌표로 채워넣어 json data만을 답변할 것 { \"markerPosition\" : [ , ] }";

    const res = await fetch("/api/find-midpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    const contentObject = data.choices[0].message.content;
    setMarkerPosition(contentObject.markerPosition);
    setResponse(formatResponse(contentObject.markerPosition));
    setLoading(false);
  };
  
  const formatResponse = (markerPosition) => {
    if (!markerPosition) return null;

    const { lat, lng } = markerPosition;
    return (
      <p key={lat + lng} style={styles.paragraph}>
        [{lat}, {lng}]
      </p>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>서울 지하철 중간 지점 찾기</h1>
      <p style={styles.description}>
        사람들의 이름과 지역을 입력하고, 이들이 만나기 좋은 역을 추천받으세요.
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
        <button onClick={getMidpoint} style={styles.button}>
          {loading ? "찾는 중..." : "중간 지점 찾기"}
        </button>
      </div>
      {isClient && (
        <div id="map" style={styles.mapContainer}>
          <LeafletMap markerPosition={markerPosition} />
        </div>
      )}
      <div style={styles.result}>{response}</div>
    </div>
  );
};

export default Home;

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundSize: "cover",
    height: "100vh", // 화면 전체 높이 설정
    width: "100%",
    background: "linear-gradient(45deg, #fc5bdd, #70c7ff)", // 사선 리니어 그라데이션
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#000000", // 검은색 글씨색
  },
  description: {
    fontSize: "16px",
    marginBottom: "20px",
    color: "#000000", // 검은색 글씨색
  },
  inputWrapper: {
    border: "1px solid #ffffcc", // 테두리 색상
    borderRadius: "2px", // 테두리 라운드 처리
    padding: "10px",
    marginBottom: "20px",
    backgroundColor: "#ffffff", // 흰색 배경색
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
    borderRadius: "2px", // 테두리 라운드 처리
    border: "1px solid #ffffff", // 테두리 색상
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#ffcccc", // 살구색
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  mapContainer: {
    height: "400px", // 지도의 높이 설정
    width: "80%", // 지도의 가로 크기를 container에 맞춤
    marginTop: "20px", // 상단 여백
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
