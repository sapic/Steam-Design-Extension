const filesInDirectory = dir => new Promise(resolve =>

  dir.createReader().readEntries(entries =>

    Promise.all(entries.filter(e => e.name[0] !== '.').map(e =>

      e.isDirectory
        ? filesInDirectory(e)
        : new Promise(resolve => e.file(resolve))
    ))
      .then(files => [].concat(...files))
      .then(resolve)
  )
)

const timestampForFilesInDirectory = dir =>
  filesInDirectory(dir).then(files =>
    files.map(f => f.name + f.lastModifiedDate).join())

const reload = () => {
  chrome.tabs.query({ active: true }, tabs => { // NB: see https://github.com/xpl/crx-hotreload/issues/5

    if (tabs[0]) { chrome.tabs.reload(tabs[0].id) }

    chrome.runtime.reload()
  })
}

const debouncedReload = debounce(reload, 1000)

const watchChanges = (dir, lastTimestamp) => {
  timestampForFilesInDirectory(dir).then(timestamp => {

    if (!lastTimestamp || (lastTimestamp === timestamp)) {

      setTimeout(() => watchChanges(dir, timestamp), 1000) // retry after 1s

    } else {
      debouncedReload()
    }
  })

}

chrome.management.getSelf(self => {

  if (self.installType === 'development') {

    chrome.runtime.getPackageDirectoryEntry(dir => watchChanges(dir))
  }
})

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};