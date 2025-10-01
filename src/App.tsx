import * as React from "react";

const App = () => {
  const [count, setCount] = React.useState(0);
  
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>React Test</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <p>If you can see this and the button works, React is loaded correctly.</p>
    </div>
  );
};

export default App;
