import { useState, useEffect } from "react";
import axios from "axios";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
// import styled from "@emotion/styled";

function App() {
  const [data, setData] = useState({});
  const [submitted, setSubmitted] = useState("HELLO");

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(
        "https://covid19.th-stat.com/api/open/timeline"
      );
      let x = result.data.Data; //kuyyyyyyyyyyyy
      setData(x);
    };
    fetchData();
  }, []);

  let dailyCases = {};
  let hold = {};
  for (let i = 0; i < data.length; i++) {
    data[i].DateArr = data[i].Date.split("/");
    let daily = data[i];
    let day = data[i].DateArr[1];
    let month = data[i].DateArr[0];
    let year = data[i].DateArr[2];
    let monthYear = [month, year].join("/");
    let date = [day, month, year].join("/");
    hold.hasOwnProperty(monthYear)
      ? (hold[monthYear] = {
          NewConfirmed:
            Number(hold[monthYear].NewConfirmed) + Number(daily.NewConfirmed),
          NewDeaths:
            Number(hold[monthYear].NewDeaths) + Number(daily.NewDeaths),
          NewHospitalized:
            Number(hold[monthYear].NewHospitalized) +
            Number(daily.NewHospitalized),
          NewRecovered:
            Number(hold[monthYear].NewRecovered) + Number(daily.NewRecovered),
        })
      : (hold[monthYear] = {
          NewConfirmed: Number(daily.NewConfirmed),
          NewDeaths: Number(daily.NewDeaths),
          NewHospitalized: Number(daily.NewHospitalized),
          NewRecovered: Number(daily.NewRecovered),
        });
    dailyCases[date] = Number(daily.NewConfirmed);
  }

  return (
    <div className="App">
      <header
        css={css`
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          border: 1px solid black;
          margin: 0;
        `}
      >
        <h1>COVID-19 TH</h1>
        <form
          css={css`
            margin: 25px 0 0 0;
            font-size: 20px;
          `}
        >
          <label>Choose month:</label>
          <select
            name="months"
            id="months"
            onChange={(e) => setSubmitted(e.target.value)}
            css={css`
              font-size: 20px;
            `}
          >
            {Object.entries(hold).map((m) => {
              return <option value={m[0]}>{m[0]}</option>;
            })}
          </select>
        </form>
      </header>

      <body
        css={css`
          margin: 0 0 0 25px;
        `}
      >
        <h2>
          {Object.entries(hold).map((m) => {
            return m[0] === submitted ? (
              <div>
                {m[0]}: {m[1]["NewConfirmed"]} cases
              </div>
            ) : null;
          })}
        </h2>
        <div>
          {Object.entries(dailyCases).map((m) => {
            let month = m[0].slice(3, 10);
            return month === submitted ? (
              <div>
                {m[0]} : {m[1]} cases
              </div>
            ) : null;
          })}
        </div>
      </body>
    </div>
  );
}

export default App;
