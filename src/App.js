import React, { useState } from "react";
import {
  BarChart,
  Bar,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import data from "./result.json";

function App() {
  const [inputTime, setInputTime] = useState("00:00");
  const [time, setTime] = useState("00:00");
  const [messages, setMessages] = useState([{ a: 7 }, { a: 8 }]);
  const set = (value) => {
    console.log(inputTime);
    console.log(data.jsonData);
    setTime(inputTime);
    setMessages(() => {
      const result = data.jsonData.filter(x => x.timestamp.substring(1, 6) === inputTime)
      console.log(result);
      return result;
    }
    )
  }

  return (
    <div>
      <BarChart width={1920} height={720} data={data.analyze} >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar onClick={(data, index) => { console.log(data); console.log(index) }} dataKey="count" fill="#8884d8" />
      </BarChart>
      <div style={{ padding: "5px 40px" }}>
        <input value={inputTime} onChange={(e) => { setInputTime(e.target.value) }}></input>
        <button onClick={(e) => set(e.target.value)}>SET</button>
        {messages.map((data, index) => (
          <div className="text alert" key={index}>
            {data.timestamp}{data.user}:{data.msg}
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
