import "./dropdown.css";
//before this read Dialogbox in that i explained almost everything
export function DropDown({ functionality }) {
  //{isOpen, handleClose,x,y, options, handleClick}//here x,y we can get my using js event handlers
  if (!functionality.isOpen) return null;
  return (
    <div className="dropdown">
      <div
        className="dropdown-overlay"
        onClick={functionality.handleClose}
        onContextMenu={(e) => {
          e.preventDefault();
          functionality.handleClose();
        }}
      >
        {/* //onContextMenu is for rightClick */}

        <div
          className="dropdown-menu"
          style={{ top: functionality.y, left: functionality.x }}
        >
          {/* //in options i was thinking of making an array or object then take data but nah that will be too much trouble
          //options is an array of things that we want to display */}
          {functionality.options.map((option, index) => {
            if (option == "hr")
              return <hr key={index} className="dropdown-hr" />; //for hr
            return (
              <button
                key={index}
                onClick={() => {
                  functionality.handleClick(option);
                  functionality.handleClose();
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
