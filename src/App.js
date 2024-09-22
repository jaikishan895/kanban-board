// File: src/App.js
import React from 'react';
import KanbanBoard from './components/KanbanBoard';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Kanban Board</h1>
      <KanbanBoard />
    </div>
  );
}

export default App;
