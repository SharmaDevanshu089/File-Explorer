import { useState } from "react";
import './top-bar.css';

export function TopBar() {
  const [isArrowSelected, setIsArrowSelected] = useState(false);
  const [searchedFile, setSearchedFile] = useState('');
  const [isSettingsOpened, setisSettingsOpened] = useState(false);

  const [checklistItems, setChecklistItems] = useState([
    { id: 1, name: 'Undo', checked: false }, 
    { id: 2, name: 'Redo', checked: false }
  ]);

  const arrowIcon = isArrowSelected ? '--' : '-';

  return (
    <div className="Topbar">
      <div className="checklist-dropdown">
        <button onClick={() => setIsArrowSelected(!isArrowSelected)}>{arrowIcon}</button>
        {isArrowSelected && <Checklist items={checklistItems} setItems={setChecklistItems} />}
      </div>

      <div className="search-box">
        <input 
          type="text" 
          placeholder="Search a file" 
          value={searchedFile} 
          onChange={(e) => setSearchedFile(e.target.value)} 
        />
      </div>

      <div className="settings-dropdown">
        <button onClick={() => setisSettingsOpened(!isSettingsOpened)}>+</button>
        {isSettingsOpened && <Settings />}
      </div>
    </div>
  );
}

function Checklist({ items, setItems }) {
  const handleItemShifted = (id) => {
    setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  return (
    <div className="dropdown-menu">
      {items.map(i => (
        <label key={i.id}>
          <input 
            type="checkbox" 
            checked={i.checked} 
            onChange={() => handleItemShifted(i.id)} 
          />
          {i.name}
        </label>
      ))}
    </div>
  );
}

function Settings() {
  const handleAction = (action) => {
    console.log(`Action triggered: ${action}`);
  };

  return (
    <ul className="dropdown-menu">
      <li onClick={() => handleAction("new_file")}>New File</li>
      <li onClick={() => handleAction("new_folder")}>New Folder</li>
    </ul>
  );
}