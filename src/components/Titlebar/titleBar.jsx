import { useState } from "react"
import './title-bar.css'


export function TitleBar({TitleBar}){
  const [isSelected,setIsSelected]= useState(false)
  const [arrowIcon,setArrowIcon]=useState('-')
  const [maximized,setMaximized]= useState(false)
  const[maximizeIcon,setMaximizeIcon]=useState('=')
  const [searchedFile,setSearchedFile]=useState('')
  const handleMaximization = (e) =>{
    e.preventDefault()
    setMaximized(!maximized);
    setMaximizeIcon('==');
  }
  const handleTitleBarDropDown = (e) =>{
    e.preventDefault();
    setArrowIcon('--')
    setIsSelected(!isSelected);
  }
  
  const handleSettings = ()=>{

  }

  return (<div className="Titlebar">
    <div><button onClick={handleTitleBarDropDown}>{arrowIcon}</button>
    </div>

    <div>
      <input type="text" placeholder="Search a file" value={searchedFile} onChange={setSearchedFile}/>
    </div>

    <div className="leftTitlebar">
      <div><button>-</button></div>
      <div><button onClick={handleMaximization}>{maximizeIcon}</button></div>
      <div><button>x</button></div>
      <div><button onClick={handleSettings}>+</button></div>
    </div>

  </div>)
}

function Checklist() {
  const [items, setItems] = useState([{id: 1, name: 'Undo', checked: false}, {id: 2, name: 'Redo', checked: false}]);

  const handleItemShifted=(i,event)=>{
    event.preventDefault()
    setItems(items.map(i2 => i2.id === i.id ? {...i2, checked: !i2.checked} : i2))
  }
  return <div>
    {items.map(i => <label key={i.id}><input type="checkbox" checked={i.checked} onChange={() => handleItemShifted(i)}/>{i.name}</label>)}
    </div>;
}