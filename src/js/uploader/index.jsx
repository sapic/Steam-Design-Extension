import * as preact from 'preact'

import DropZone from "./DropZone.jsx";

function App(props) {
  return (
    <div className="detailBox collection">
      <div className="createCollectionArrow"></div>
      <div className="title">Upload multiple images</div>
      <div className="description">
        Drop multiple images into field below and we'll upload them all for you
      </div>
      <DropZone />
    </div>
  );
}

export default App 