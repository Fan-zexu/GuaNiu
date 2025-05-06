import React from 'react';

const App = () => {
  return (
    <div>
      <h1>SSR Streaming Demo</h1>
      <p>This content is rendered via streaming SSR!</p>
      <ul>
        {[...Array(5)].map((_, i) => (
          <li key={i}>Item {i + 1}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;