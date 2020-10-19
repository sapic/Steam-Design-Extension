import React, { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
`

const DropContainer = styled.div`
  width: 100%;
  height: 100px;
  border: 5px solid white;
  border-style: dashed;
`

const FilesContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const PreviewImage = styled.img`
  width: 80px;
  max-height: 80px;
  margin-right: 20px;
`

const FileInfo = styled.div` 
  height: 80px;
  display: flex;
  align-items: center;
`

const DndMessage = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const FilePreview = styled.div`
  display: flex;
  margin-bottom: 20px;
`

const FileRemove = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  color: red;
  cursor: pointer;
`
const FileDone = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  color: green;
`

const FileError = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  color: red;
`

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
        document.querySelector(`#title`).setAttribute('value', file.name)
      } else {
        document.querySelector(`#title`).setAttribute('value', file.file.name)
      }

      document.querySelector(`#agree_terms`).checked = true
      const submitres = itemForm.submit()

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
        const id = await frameLoaded

        const files = [...localFiles]
        files[i].done = true
        files[i].id = id
        setSelectedFiles(files)
      } catch (e) {
        const files = [...localFiles]
        files[i].error = true
        if (e) {
          files[i].errorText = e
        }
        setSelectedFiles(files)
      }

      frame.parentNode.removeChild(frame)
    }
  }

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  return (
    <Container>
      <DropContainer
        onDragOver={dragOver}
        onDragEnter={dragEnter}
        onDragLeave={dragLeave}
        onDrop={fileDrop}
      >
        <DndMessage>
          <div >Drag & Drop files here</div>
        </DndMessage>
      </DropContainer>
      <FilesContainer>
        {
          selectedFiles.map((data, i) =>
            <FilePreview key={i}>
              <FileInfo>
                <PreviewImage src={URL.createObjectURL(data.file)}></PreviewImage>
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
              </FileInfo>
              <FileRemove onClick={() => removeFile(data.file.name)}>
                <div>Delete</div>
              </FileRemove>
              {data.done &&
                <FileDone>
                  <a
                    href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${data.id}`}
                    target="_blank"
                  >
                    Done (Clickable)
                   </a>
                </FileDone>}
              {data.error && <FileError>
                {data.errorText ? data.errorText : 'Error'}
              </FileError>}
            </FilePreview>
          )
        }
      </FilesContainer>
      {
        selectedFiles.length > 0 &&
        <a className="btn_blue_white_innerfade btn_medium" onClick={() => uploadFiles()}>
          <span>Upload files</span>
        </a>
      }
    </Container >
  )
}

function FileListItems(files) {
  var b = new ClipboardEvent("").clipboardData || new DataTransfer()
  for (var i = 0, len = files.length; i < len; i++) b.items.add(files[i])
  return b.files
}


export default DropZone;