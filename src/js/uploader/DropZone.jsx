import React, { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  /* height: 100px; */
`

const DropContainer = styled.div`
  width: 100%;
  height: 100px;
  border: 5px solid white;
  border-style: dashed;
`

const FilesContainer = styled.div`
  display: flex;
`

const PreviewImage = styled.img`
  /* width: 100px; */
  height: 80px;
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
        setSelectedFiles(prevArray => [...prevArray, files[i]]);
        // add to an array so we can display the name of file
      } else {
        // add a new property called invalid
        // add to the same array so we can display the name of the file
        // set error message
      }
    }
  }

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon'];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  }

  const removeFile = (name) => {
    // find the index of the item
    // remove the item from array

    const selectedFileIndex = selectedFiles.findIndex(e => e.name === name);
    selectedFiles.splice(selectedFileIndex, 1);
    // update selectedFiles array
    setSelectedFiles([...selectedFiles]);
  }

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const uploadFiles = async () => {
    console.log('uploadFiles')
    const itemForm = document.querySelector(`#SubmitItemForm`)

    let msg = {}

    const inputsList = [
      "redirect_uri",
      "wg",
      "wg_hmac",
      "appid",
      "consumer_app_id",
      "sessionid",
      "token",
      "cloudfilenameprefix",
      "publishedfileid",
      "id",
      "file_type",
      // "image_width",
      // "image_height",
    ]
    for (const name of inputsList) {
      const x = document.querySelector(`#SubmitItemForm > input[name="${name}"]`);
      console.log(name, x)
      msg[name] = x.getAttribute('value')
    }

    // const form = new FormData(itemForm)
    // itemForm.set('image_width', 1000)
    // itemForm.set('image_height', 1)
    // itemForm.set('title', 'test')
    // itemForm.set('file-upload-button', selectedFiles[0])
    // itemForm.set('visibility', 0)
    // itemForm.set('agree_terms', 'checked')

    document.querySelector(`#file`).files = new FileListItems([selectedFiles[0]])
    const widthInput = document.getElementById('image_width')
    const heightInput = document.getElementById('image_height')
    widthInput.value = 1000
    heightInput.value = 1

    document.querySelector(`#title`).setAttribute('value', 'test')
    document.querySelector(`#agree_terms`).checked = true
    // agree_terms


    itemForm.setAttribute("target", "_blank")
    itemForm.submit()

    // const form = new FormData(itemForm)
    // form.set('image_width', 1000)
    // form.set('image_height', 1)
    // form.set('title', 'test')
    // form.set('file-upload-button', selectedFiles[0])
    // form.set('visibility', 0)
    // form.set('agree_terms', 'checked')

    // msg['image_width'] = 1000
    // msg['image_height'] = 1
    // msg['title'] = 'test'
    // msg['file-upload-button'] = await toBase64(selectedFiles[0])
    // msg['visibility'] = 0
    // msg['agree_terms'] = 'checked'

    // const url = itemForm.getAttribute('action')

    // chrome.runtime.sendMessage('hpgkiojfimnfdfkhnaolfkcfcohbfcao', {
    //   url,
    //   body: msg
    // }, function (response) {
    //   console.log(response.farewell);
    // });

    // fetch(url, { // Your POST endpoint
    //   method: 'POST',
    //   body: form // This is your file object
    // }).then(
    //   response => response.json() // if the response is a JSON object
    // ).then(
    //   success => console.log(success) // Handle the success response object
    // ).catch(
    //   error => console.log(error) // Handle the error response object
    // );
  }

  return (
    <Container>
      <DropContainer
        onDragOver={dragOver}
        onDragEnter={dragEnter}
        onDragLeave={dragLeave}
        onDrop={fileDrop}
      >
        {selectedFiles.length === 0
          ? <div className="drop-message">
            <div className="upload-icon"></div>
            Drag & Drop files here or click to upload
          </div>
          : <FilesContainer>
            {
              selectedFiles.map((data, i) =>
                <div className="file-status-bar" key={i}>
                  <div>
                    <PreviewImage src={URL.createObjectURL(data)}></PreviewImage>
                  </div>
                  <div className="file-remove" onClick={() => removeFile(data.name)}>X</div>
                </div>
              )
            }
          </FilesContainer>
        }
      </DropContainer>
      <a className="btn_blue_white_innerfade btn_medium" onClick={() => uploadFiles()}>
        <span>Upload files</span>
      </a>
    </Container>
  )
}

function FileListItems(files) {
  var b = new ClipboardEvent("").clipboardData || new DataTransfer()
  for (var i = 0, len = files.length; i < len; i++) b.items.add(files[i])
  return b.files
}


export default DropZone;