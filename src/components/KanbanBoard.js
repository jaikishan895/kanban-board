// File: src/components/KanbanBoard.js
import React, { useEffect, useState } from 'react';
import './KanbanBoard.css';
import UrgentIcon from './icons/SVG - Urgent Priority colour.svg'; // Replace with your SVG icon




const fetchData = async () => {
  const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
  return await response.json();
};

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);  // Store users from API
  const [groupedTickets, setGroupedTickets] = useState({});
  const [groupingOption, setGroupingOption] = useState(localStorage.getItem('groupingOption') || 'status');
  const [sortingOption, setSortingOption] = useState(localStorage.getItem('sortingOption') || 'priority');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    fetchData().then(data => {
      setTickets(data.tickets);
      setUsers(data.users);  // Set users data from API
      groupTickets(data.tickets, groupingOption, data.users);
    });
  }, [groupingOption]);

  const groupTickets = (tickets, option, users) => {
    let grouped;
    switch (option) {
      case 'status':
        grouped = tickets.reduce((acc, ticket) => {
          acc[ticket.status] = acc[ticket.status] ? [...acc[ticket.status], ticket] : [ticket];
          return acc;
        }, {});
        break;
      case 'user':
        // Create a mapping between userId and user name
        const userMap = users.reduce((map, user) => {
          map[user.id] = user.name;
          return map;
        }, {});

        grouped = tickets.reduce((acc, ticket) => {
          const userName = userMap[ticket.userId];  // Get user name by userId
          acc[userName] = acc[userName] ? [...acc[userName], ticket] : [ticket];
          return acc;
        }, {});
        break;
      case 'priority':
        grouped = tickets.reduce((acc, ticket) => {
          acc[ticket.priority] = acc[ticket.priority] ? [...acc[ticket.priority], ticket] : [ticket];
          return acc;
        }, {});
        break;
      default:
        grouped = tickets;
    }
    setGroupedTickets(grouped);
  };

  const sortTickets = (tickets) => {
    if (sortingOption === 'priority') {
      return tickets.sort((a, b) => b.priority - a.priority);
    } else if (sortingOption === 'title') {
      return tickets.sort((a, b) => a.title.localeCompare(b.title));
    }
    return tickets;
  };

  const handleGroupingChange = (option) => {
    setGroupingOption(option);
    localStorage.setItem('groupingOption', option);
    groupTickets(tickets, option, users);
  };

  const handleSortingChange = (option) => {
    setSortingOption(option);
    localStorage.setItem('sortingOption', option);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 4:
        return 'urgent';
      case 3:
        return 'high';
      case 2:
        return 'medium';
      case 1:
        return 'low';
      case 0:
        return 'nopriority';
      default:
        return '';
    }
  };

  return (
    <div className="kanban-board">
      <div className="controls">
        <div className="dropdown">
          <button className="dropdown-btn" onClick={toggleDropdown}>
            Display
          </button>
          {dropdownVisible && (
            <div className="dropdown-content">
              <div className="dropdown-group">
                <h4>Group</h4>
                <ul>
                  <li onClick={() => handleGroupingChange('status')}>By Status</li>
                  <li onClick={() => handleGroupingChange('user')}>By User</li>
                  <li onClick={() => handleGroupingChange('priority')}>By Priority</li>
                </ul>
              </div>
              <div className="dropdown-group">
                <h4>Sort</h4>
                <ul>
                  <li onClick={() => handleSortingChange('priority')}>By Priority</li>
                  <li onClick={() => handleSortingChange('title')}>By Title</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="board">
        {Object.keys(groupedTickets).map((groupKey) => (
          <div key={groupKey} className="column">
            <h3>{groupKey}</h3> {/* This will show the user name or status/priority */}
            {sortTickets(groupedTickets[groupKey]).map(ticket => (
              <div key={ticket.id} className={`ticket-card ${getPriorityClass(ticket.priority)}`}>
                <h4>{ticket.title}</h4>
                <p>Status: {ticket.status}</p>
                <p>Priority: {ticket.priority}</p>
                {ticket.priority === 4 && <img src={UrgentIcon} alt="Urgent Priority Icon" className="priority-icon" />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
