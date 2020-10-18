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
  margin-left: 80px;
  color: red;
  cursor: pointer;
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
    console.log(files);
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

  const uploadFiles = async () => {
    const itemForm = document.querySelector(`#SubmitItemForm`)
    itemForm.setAttribute("target", "_blank")

    for (const file of selectedFiles) {
      document.querySelector(`#file`).files = new FileListItems([file.file])
      const widthInput = document.getElementById('image_width')
      const heightInput = document.getElementById('image_height')
      widthInput.value = 1000
      heightInput.value = 1

      if (file.name) {
        document.querySelector(`#title`).setAttribute('value', file.name)
      } else {
        document.querySelector(`#title`).setAttribute('value', file.file.name)
      }

      console.log('title', document.querySelector(`#title`).getAttribute('value'))
      document.querySelector(`#agree_terms`).checked = true
      itemForm.submit()
      await delay(1000)
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
                      return e
                    }}
                  ></input>
                </div>
              </FileInfo>
              <FileRemove onClick={() => removeFile(data.file.name)}>
                <div>Delete</div>
              </FileRemove>
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
    </Container>
  )
}

function FileListItems(files) {
  var b = new ClipboardEvent("").clipboardData || new DataTransfer()
  for (var i = 0, len = files.length; i < len; i++) b.items.add(files[i])
  return b.files
}


export default DropZone;