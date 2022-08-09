const Hello = (props) => {
  return (
    <div>
      <p>Hello world {props.name}, you are {props.age} years old.</p>
    </div>
  );
};

const App = () => {
  const name = "George";
  const age = "27";


  console.log("Hello from component");
  const now = new Date();
  const a = 10;
  const b = 20;
  return (
    <div className="App">
      <p>Hello World, it is {now.toString()}</p>
      <p>
        {a} plus {b} is {a + b}
      </p>
      <Hello name={name} age={age}/>
      <Hello name="Jess" age={20+9}/>
      <Hello name="Hannah"/>
    </div>
  );
};

export default App;
