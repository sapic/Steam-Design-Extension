export default function getJsonData() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['sapic_keys', 'set_at']).then(result => {
      if (!result ||
        !result.set_at ||
        !result.sapic_keys ||
        result.sapic_keys.length < 1
      ) {
        return fetchFromGithub().then(resolve).catch(reject);
      }

      const timeSpent = Date.now() - result.set_at;
      if (timeSpent > 60 * 60 * 24 * 1000) { // cache for 24 hours
        return fetchFromGithub().then(resolve).catch(reject);
      }

      chrome.storage.sync.get(result.keys).then(data => {
        if (!data) {
          return fetchFromGithub().then(resolve).catch(reject);
        }

        const response = {
          designers: data.designers,
          sapicstaff: data.sapicstaff,
          aevoa: data.aevoa,
          donator: data.donator,
        };

        const animatedBackgrounds = [];
        for (let i = 0; i < data.animatedBackgroundsLength; i++) {
          animatedBackgrounds.push(data[`animatedBg_${i}`]);
        }

        response.animatedBackgrounds = animatedBackgrounds;
        resolve(response);
      }).catch(reject);
    }).catch(reject);
  });
}

function fetchFromGithub() {
  return new Promise((resolve, reject) => {
    fetch(chrome.runtime.getURL('js/data/designers.json'))
      .then(r => r.json())
      .then(function (data) {
        const toSet = {
          designers: data.designers,
          sapicstaff: data.sapicstaff,
          aevoa: data.aevoa,
          donator: data.donator,
          set_at: Date.now(),
        };
        const keys = ['designers', 'sapicstaff', 'aevoa', 'donator', 'set_at'];

        if (data.animatedBackgrounds) {
          for (let i = 0; i < data.animatedBackgrounds.length; i++) {
            toSet[`animatedBg_${i}`] = data.animatedBackgrounds[i];
            keys.push(`animatedBg_${i}`);
          }

          toSet.animatedBackgroundsLength = data.animatedBackgrounds.length;
          keys.push('animatedBackgroundsLength');
        }

        toSet.sapic_keys = keys;

        chrome.storage.sync.set(toSet).then(() => {
          resolve(data);
        }).catch(reject);
      })
      .catch(reject);
  });
}
