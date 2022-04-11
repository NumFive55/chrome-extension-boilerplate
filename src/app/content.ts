// chrome.runtime.sendMessage({}, (response) => {
//   var checkReady = setInterval(() => {
//     if (document.readyState === "complete") {
//       clearInterval(checkReady);
//       console.log("We're in the injected content script!");
//     }
//   });
// });

const features = [];
const activeFeatures = [];

chrome.storage.sync.get("featureList", (result) => {
  const featureObject = result.featureList;
  featureObject.forEach((element) => {
    features.push({ id: element.id, on: element.checked });
    if (element.checked) {
      activeFeatures.push(element.name);
    }
  });
});

chrome.storage.onChanged.addListener(function (changes, area) {
  console.log(changes);
  console.log(area);
});

runFeatures(activeFeatures);

console.log(features);
console.log(activeFeatures);

function runFeatures(pref) {
  console.log("run features ran");
  if (pref.includes("testFeature")) testFeature();
  if (pref.includes("testFeatureTwo")) testFeature();
}

function testFeature() {
  console.log("test feature one");
}

function testFeatureTwo() {
  console.log("test feature two");
}
