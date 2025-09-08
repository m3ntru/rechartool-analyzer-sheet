import React, {useState} from "react";
import {
  BarChart,
  Bar,
  Cell,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const App = () => {
  const [inputTime, setInputTime] = useState("00:00");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [time, setTime] = useState("00:00");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [messages, setMessages] = useState([]);
  const [analyzeRaw, setAnalyzeRaw] = useState([]);
  const [analyzeProcess, setAnalyzeProcess] = useState([]);
  const [data, setData] = useState([]);
  const [inputSearch, setInputSearch] = useState("");

  const inputRegex = /(\d+):(\d+)/;
  const regex = /\[(\d+):(\d+):(\d+)\]/;

  const set = (value) => {
    const target = value ? value : inputTime;
    setTime(inputTime);
    const match = target.match(inputRegex);
    if (match) {
      const hh = match[1].padStart(2, "0");
      const mm = match[2].padStart(2, "0");
      const time = `${hh}:${mm}`;
      setMessages(() => {
        const result = data.filter((x) => {
          return x.time === time;
        });
        return result;
      });
    }
  };
  const setPeriod = (value) => {
    const startIndex =
      parseInt(startTime.split(":")[0]) * 60 +
      parseInt(startTime.split(":")[1]);
    const endIndex =
      parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);
    const filterData = analyzeRaw.filter(
      (data) => data.index >= startIndex && data.index <= endIndex
    );
    setAnalyzeProcess(filterData);
  };
  const resetPeriod = (value) => {
    setAnalyzeProcess(analyzeRaw);
    setActiveIndex(-1);
  };
  const search = () => {
    setMessages(() => {
      const result = data.filter(
        (x) => x.user.includes(inputSearch) || x.msg.includes(inputSearch)
      );
      return result;
    });
  };

  const onFileChange = async (e) => {
    let rl = [];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      rl = text.split(/\r\n/);
      var jsonData = [];
      var analyze = {};
      for (const text of rl) {
        let first = text.split(" ");
        const timestamp = first.shift();
        const match = timestamp.match(regex);
        if (match) {
          const hh = match[1].padStart(2, "0");
          const mm = match[2].padStart(2, "0");
          const time = `${hh}:${mm}`;
          const comment = first.join(" ");
          let second = comment.split(":");
          const user = second.shift();
          const msg = second.join(" ");
          jsonData.push({timestamp, user, msg, time});
          let count = analyze[time] ? analyze[time] : 0;
          analyze[time] = count + 1;
        }
      }
      const data = Object.keys(analyze).map((key, i) => {
        return {
          time: key,
          count: analyze[key],
          index: parseInt(key.split(":")[0]) * 60 + parseInt(key.split(":")[1]),
        };
      });
      setAnalyzeRaw(data);
      setAnalyzeProcess(data);
      setData(jsonData);
    };
    reader.readAsText(e.target.files[0]);
  };

  return (
    <div style={{height: "60vh", width: "100%"}}>
      <ResponsiveContainer height="100%" width="97%">
        <BarChart data={analyzeProcess}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            onClick={(data, index) => {
              setInputTime(data.time);
              set(data.time);
              setActiveIndex(index);
            }}
            dataKey="count"
            fill="#8884d8"
          >
            {data.map((entry, index) => (
              <Cell
                cursor="pointer"
                fill={index === activeIndex ? "#82ca9d" : "#8884d8"}
                key={`cell-${index}`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{padding: "5px 40px"}}>
        <div>
          <input type="file" onChange={(e) => onFileChange(e)} />
        </div>
        <label>set time </label>
        <input
          value={inputTime}
          onChange={(e) => {
            setInputTime(e.target.value);
          }}
          style={{marginRight: "4px"}}
        ></input>
        <button onClick={(e) => set()}>SET</button>
        <div style={{display: "flex"}}>
          <div style={{paddingRight: "4px"}}>
            <label>set start </label>
            <input
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
              }}
            ></input>
          </div>
          <div>
            <label> set end </label>
            <input
              style={{marginRight: "4px"}}
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
              }}
            ></input>
          </div>
          <button onClick={(e) => setPeriod()}>SET</button>
          <button onClick={(e) => resetPeriod()}>RESET</button>
        </div>
        <label>search</label>
        <input
          value={inputSearch}
          onChange={(e) => {
            setInputSearch(e.target.value);
          }}
          style={{marginRight: "4px"}}
        ></input>
        <button onClick={(e) => search()}>search</button>
        {messages.map((data, index) => (
          <div className="text alert" key={index}>
            {data.timestamp}
            {data.user}:{data.msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
