import * as preact from 'preact'
import { useState } from 'preact/hooks'

function DropZone(props) {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const dragOver = (e) => {
    e.preventDefault();
  }

  const dragEnter = (e) => {
    e.preventDefault();
  }

  const dragLeave = (e) => {
    e.preventDefault();
  }

  const fileDrop = (e) => {
    e.preventDefault();
    TrackGA('files_drop')
    const files = e.dataTransfer.files;

    if (files.length) {
      handleFiles(files);
    }
  }

  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        setSelectedFiles(prevArray => [...prevArray, {
          file: files[i],
          name: files[i].name,
        }]);
      }
    }
  }

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  }

  const removeFile = (name) => {
    const selectedFileIndex = selectedFiles.findIndex(e => e.file.name === name);
    selectedFiles.splice(selectedFileIndex, 1);
    setSelectedFiles([...selectedFiles]);
  }

  const getFileDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function () {
        const i = new Image();

        i.onload = (function (e) {
          var height, width;
          width = e.target.width;
          height = e.target.height;

          resolve({ width, height });
        });

        return i.src = reader.result;
      }
      reader.readAsDataURL(file)
    })
  }

  const uploadFiles = async () => {
    TrackGA('upload_clicked')

    const itemForm = document.querySelector(`#SubmitItemForm`)
    const widthInput = document.getElementById('image_width')
    const heightInput = document.getElementById('image_height')

    const localFiles = [...selectedFiles]
    for (let i = 0; i < localFiles.length; i++) {
      localFiles[i]['done'] = undefined
      localFiles[i]['error'] = undefined
    }

    setSelectedFiles(localFiles)

    for (let i = 0; i < localFiles.length; i++) {
      const file = localFiles[i]
      const frameid = 'upload_frame' + Date.now()
      const frame = document.createElement('iframe')
      frame.setAttribute('id', frameid)
      frame.setAttribute('name', frameid)
      frame.setAttribute('style', `display: none;position: absolute;`)

      document.body.appendChild(frame)

      itemForm.setAttribute("target", frameid)
      document.querySelector(`#file`).files = new FileListItems([file.file])

      const { width, height } = await getFileDimensions(file.file)
      if (height > width && height > 506) {
        widthInput.value = 1000
        heightInput.value = 1
      } else {
        widthInput.value = width
        heightInput.value = height
      }

      if (file.name) {
        document.querySelector(`#title`).value = file.name
      } else {
        document.querySelector(`#title`).value = file.file.name
      }

      document.querySelector(`#agree_terms`).checked = true

      const frameLoaded = new Promise((resolve, reject) => {
        frame.addEventListener('load', () => {

          const innerDoc = frame.contentDocument || frame.contentWindow.document;
          const idEl = innerDoc.getElementById("application_root")

          if (!idEl) {
            const messageEl = innerDoc.getElementById('message')
            if (messageEl) {
              return reject(messageEl.innerText)
            }
            reject()
            return
          }
          const id = idEl.getAttribute('data-publishedfileid')

          if (!id || id === '') {
            reject()
            return
          }

          resolve(id)
        }, false);
      })

      try {
        itemForm.submit()
        const id = await frameLoaded

        const files = [...localFiles]
        files[i].done = true
        files[i].id = id
        setSelectedFiles(files)
        TrackGA('upload_success')
      } catch (e) {
        const files = [...localFiles]
        files[i].error = true
        if (e) {
          files[i].errorText = e
        }
        setSelectedFiles(files)
        TrackGA('upload_error')
      }

      frame.parentNode.removeChild(frame)
    }
  }

  return (
    <div className="spe__Container">
      <div className="spe__DropContainer"
        onDragOver={dragOver}
        onDragEnter={dragEnter}
        onDragLeave={dragLeave}
        onDrop={fileDrop}
      >
        <div className="spe__DndMessage">
          <div >Drag & Drop files here</div>
        </div>
      </div>
      <div className="spe__FilesContainer">
        {
          selectedFiles.map((data, i) =>
            <div className="spe__FilePreview" key={i}>
              <div className="spe__FileInfo">
                <img
                  className="spe__PreviewImage"
                  src={URL.createObjectURL(data.file)}
                ></img>
                <div>
                  <label>Title: </label>
                  <input
                    type="text"
                    className="titleField"
                    maxLength="128"
                    value={data.name}
                    onChange={(e) => {
                      const files = [...selectedFiles]
                      files[i].name = e.target.value
                      setSelectedFiles(files)
                    }}
                  ></input>
                </div>
              </div>
              <div className="spe__FileRemove" onClick={() => removeFile(data.file.name)}>
                <div>Delete</div>
              </div>
              {data.done &&
                <div className="spe__FileDone">
                  <a
                    href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${data.id}`}
                    target="_blank"
                  >
                    Done (Clickable)
                   </a>
                </div>}
              {data.error && <div className="spe__FileError">
                {data.errorText ? data.errorText : 'Error'}
              </div>}
            </div>
          )
        }
      </div>
      {
        selectedFiles.length > 0 &&
        <a className="btn_blue_white_innerfade btn_medium" onClick={() => uploadFiles()}>
          <span>Upload files</span>
        </a>
      }
    </div >
  )
}

function FileListItems(files) {
  var b = new ClipboardEvent("").clipboardData || new DataTransfer()
  for (var i = 0, len = files.length; i < len; i++) b.items.add(files[i])
  return b.files
}

function TrackGA(page) {
  if (!fetch) {
    return
  }
  const measurement_id = `G-9YSXRY4VTK`;
  const api_secret = `D-eXzbjMS0GDLjYqg8OqcQ`;

  fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`, {
    method: "POST",
    body: JSON.stringify({
      client_id: '331601645.1601326977',
      events: [{
        name: page,
        params: {},
      }]
    })
  });
}


export default DropZone;