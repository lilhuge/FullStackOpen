import { useState } from "react";

const StatisticLine = ({ text, value, symbol = "" }) => {
  return (
    <>
      <tr>
        <td>{text}</td>
        <td>
          {value} {symbol}
        </td>
      </tr>
    </>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const calculateAverage = () => (good - bad) / (good + neutral + bad);
  const calculatePositive = () => (100 * good) / (good + neutral + bad);

  if (good + neutral + bad < 1) {
    return (
      <>
        <p>No feedback given</p>
      </>
    );
  }

  return (
    <>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="average" value={calculateAverage() || 0} />
          <StatisticLine
            text="positive"
            value={calculatePositive() || 0}
            symbol="%"
          />
        </tbody>
      </table>
    </>
  );
};

const Button = ({ handleClick, label }) => {
  return <button onClick={handleClick}>{label}</button>;
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleClick = (feedback) => () => {
    switch (feedback) {
      case "good":
        setGood(good + 1);
        break;
      case "neutral":
        setNeutral(neutral + 1);
        break;
      case "bad":
        setBad(bad + 1);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleClick("good")} label="good" />
      <Button handleClick={handleClick("neutral")} label="neutral" />
      <Button handleClick={handleClick("bad")} label="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
