import { X } from "lucide-react";
import "./dialog.css";

// by using {stuff} we destructured the stuff so whatever we add like stuff.name,stuff.id it will be added to it similar to props
export function DefaultDialogBox({ stuff }) {
  //{isOpen,title, handleClose, message,type , value, setValue.fileOrFolderOp, handleSubmit}
  if (!stuff.isOpen) return null; //is it is not open don't return anything
  //else return
  return (
    <div className="dialog-above-all" onClick={stuff.handleClose}>
      {/* //whenever we click out the dialog box it will clse */}
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        {/* //stopPropagation stop the work that was gonna done by the parent, yk whenever u click child in js it fires click events for parents too so to stop that we use it if we don't then click on anywhere will close the dialog box */}
        <div className="dialog-header">
          {/* //label will be the text that will display at left */}
          <label>{stuff.title}</label>
          {/* //button will handle all closing events */}
          <button onClick={stuff.handleClose}>
            <X size={16} />
          </button>
        </div>
        <div className="dialog-main-body">
          {stuff.message && <p>{stuff.message}</p>}
          {/* //if there is message then only display it */}
          {stuff.type == "input" && (
            <input
              type="text"
              value={stuff.value}
              onChange={(e) => stuff.setValue(e.target.value)}
            />
          )}
          {/* //now if we set type ==input then if we define it as input then input box will come else conditions will be below like checkbox and stuff */}
        </div>
        <div className="dialog-footer">
          {stuff.fileOrFolderOp && (
            <div>
              <label>{stuff.DDForFileandFolder}</label>
            </div>
          )}
          {/* //this dropdown will come for things like then we click new then ask whether file or folder */}
          <div className="operation-btns">
            {/* //close when cancel pressed */}
            <button className="bottom-cancel-btn" onClick={stuff.handleClose}>
              Cancel
            </button>
            {/* //confirm the whatever */}
            <button
              className="bottom-submission-btn"
              onClick={stuff.handleSubmit}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
