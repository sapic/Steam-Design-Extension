console.log('add listener')
chrome.runtime.onMessageExternal.addListener(
  function (request, sender, sendResponse) {
    console.log('message', request, sender, sendResponse)

    const form = new FormData()
    // form.title = 'asd'
    // form.append('title', 'hello')
    for (let field of Object.keys(request.body)) {
      console.log('field', field)
      form.append(field, request.body[field])
    }

    const file = dataURItoBlob(request.body['file-upload-button'])
    form.set('file-upload-button', file)

    form.append('hello', 'workd')

    console.log('form', form)
    console.log('form', form.getAll("hello"))

    fetch(request.url, { // Your POST endpoint
      method: 'POST',
      mode: 'no-cors',
      body: form // This is your file object
    }).then(
      success => console.log(success) // Handle the success response object
    ).catch(
      error => console.log(error) // Handle the error response object
    );
    if (sender.url == blocklistedWebsite)
      return;  // don't allow this web page access
    if (request.openUrlInEditor)
      openUrl(request.openUrlInEditor);
  });


function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  //Old Code
  //write the ArrayBuffer to a blob, and you're done
  //var bb = new BlobBuilder();
  //bb.append(ab);
  //return bb.getBlob(mimeString);

  //New Code
  return new Blob([ab], { type: mimeString });


}