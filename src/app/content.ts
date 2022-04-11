// chrome.runtime.sendMessage({}, (response) => {
//   var checkReady = setInterval(() => {
//     if (document.readyState === "complete") {
//       clearInterval(checkReady);
//       console.log("We're in the injected content script!");
//     }
//   });
// });

let features = [];
let activeFeatures = [];
let pathName = location.pathname;
let currentPage = "";
let chromeControls = false;

new MutationObserver(() => {
  const url = location.pathname;
  if (url !== pathName) {
    pathName = url;
    checkPage();
    runFeatures(activeFeatures);
  }
}).observe(document, { subtree: true, childList: true });

new MutationObserver(() => {
  const videoControls = document.querySelector(".ytp-chrome-controls");
  if (videoControls) {
    chromeControls = true;
  }
}).observe(document, { subtree: true, childList: true });

function checkPage() {
  switch (pathName) {
    case "/":
      console.log("youtube home");
      currentPage = "home";
      break;
    case "/watch":
      console.log("watching video");
      currentPage = "video";
      break;
    case "/feed/explore":
      console.log("explore page");
      currentPage = "explore";
      break;
    case "/feed/subscriptions":
      console.log("subscriptions");
      currentPage = "subscriptions";
      break;
  }
}

document.addEventListener("readystatechange", (event) => {
  if (document.readyState === "complete") {
    checkPage();
    runFeatures(activeFeatures);
  }
});

function getActiveFeatureList() {
  chrome.storage.sync.get("featureList", (result) => {
    const featureObject = result.featureList;
    featureObject.forEach((element) => {
      features.push({ id: element.id, on: element.checked });
      if (element.checked) {
        activeFeatures.push(element.id);
      }
    });
  });
}

getActiveFeatureList();

chrome.storage.onChanged.addListener(function (changes, area) {
  getActiveFeatureList();
});

function runFeatures(pref) {
  if (pref.includes("testFeature") && currentPage === "home") testFeature();
  if (pref.includes("testFeatureTwo") && currentPage === "video")
    testFeatureTwo();
}

function testFeature() {
  console.log("test feature one");
}

async function testFeatureTwo() {
  const interval = setInterval(() => {
    if (chromeControls) {
      clearInterval(interval);
      const volumeArea = document.querySelector(".ytp-volume-area");

      volumeArea.insertAdjacentHTML(
        "afterend",
        '<button id="yes-loop-button">LOOP</button>'
      );

      const yesLoopButton = document.getElementById("yes-loop-button");
      yesLoopButton.addEventListener("click", manageLoop);
    }
  }, 500);
}

// Helper Functions
let startTime;
let endTime;
let clickCount = 0;
let video = document.querySelector("video");
let activeLoop = false;

function manageLoop() {
  if (!activeLoop) {
    activeLoop = true;
    document.addEventListener("click", captureLoop);
  } else {
    activeLoop = false;
    document.removeEventListener("click", captureLoop);
    startTime = null;
    endTime = null;
    clickCount = 0;
    document.querySelector(".aLoop").remove();
    document.querySelector(".bLoop").remove();
  }
}

function captureLoop(e) {
  let objectClicked = <HTMLDivElement>e.target;
  let clickedObjectClasses = objectClicked.classList;

  if (clickedObjectClasses.value.includes("ytp-progress-bar")) {
    clickCount++;
    if (clickCount <= 2) {
      if (clickCount == 1) {
        if (startTime == undefined) {
          startTime = document.querySelector("video").currentTime;
          const node = document.querySelector(".ytp-scrubber-container");
          const clone = <Element>node.cloneNode(true);
          clone.classList.add("aLoop");
          clone.firstElementChild.insertAdjacentHTML(
            "afterbegin",
            "<span style='margin-left: 3.5px; font-weight: 700;'>A</span>"
          );
          document.querySelector(".ytp-progress-bar").appendChild(clone);
        }
      }

      if (clickCount == 2) {
        if (endTime == undefined) {
          endTime = document.querySelector("video").currentTime;
          const node = document.querySelector(".ytp-scrubber-container");
          const clone = <Element>node.cloneNode(true);
          clone.classList.add("bLoop");
          clone.firstElementChild.insertAdjacentHTML(
            "afterbegin",
            "<span style='margin-left: 3.5px; font-weight: 700;'>B</span>"
          );
          document.querySelector(".ytp-progress-bar").appendChild(clone);
          startLoop();
        }
      }
    } else if (clickCount > 2) {
      clickCount = 0;
    }
  }
}

function startLoop() {
  video.currentTime = startTime;
  const interval = setInterval(() => {
    if (video.currentTime > endTime && activeLoop) {
      video.currentTime = startTime;
    } else if (!activeLoop) {
      clearInterval(interval);
    }
  }, 10);
}
