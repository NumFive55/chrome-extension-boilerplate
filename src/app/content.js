// chrome.runtime.sendMessage({}, (response) => {
//   var checkReady = setInterval(() => {
//     if (document.readyState === "complete") {
//       clearInterval(checkReady);
//       console.log("We're in the injected content script!");
//     }
//   });
// });

// type PictureInPictureEventListener =
//   | ((this: HTMLVideoElement, ev: PictureInPictureEvent) => any)
//   | null;

// interface HTMLVideoElement {
//   autoPictureInPicture: boolean;
//   disablePictureInPicture: boolean;
//   requestPictureInPicture(): Promise<PictureInPictureWindow>;
//   // onenterpictureinpicture: PictureInPictureEventListener;
//   // onleavepictureinpicture: PictureInPictureEventListener;
// }

// interface Document {
//   readonly pictureInPictureEnabled: boolean;
//   exitPictureInPicture(): Promise<void>;
// }

// interface DocumentOrShadowRoot {
//   readonly pictureInPictureElement: Element | null;
// }

// Global variables
let features = [];
let activeFeatures = [];
let pathName = location.pathname;
let currentPage = "";
let chromeControls = false;

console.log(activeFeatures);

// LISTENERS

// Listens for page change
new MutationObserver(() => {
  const url = location.pathname;
  if (url !== pathName) {
    pathName = url;
    checkPage();
    runFeatures(activeFeatures);
  }
}).observe(document, { subtree: true, childList: true });

// Listens for Chrome Controls to appear (ie. button bar on video)
new MutationObserver(() => {
  const videoControls = document.querySelector(".ytp-chrome-controls");
  if (videoControls) {
    chromeControls = true;
  }
}).observe(document, { subtree: true, childList: true });

// Checks what page user is on and sets currentPage
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

// Waits for page to load then runs features
document.addEventListener("readystatechange", (event) => {
  if (document.readyState === "complete") {
    checkPage();
    runFeatures(features);
  }
});

// CHROME STORAGE

// Gets active feature list of Chrome Storage
function getActiveFeatureList() {
  chrome.storage.sync.get("featureList", (result) => {
    const featureObject = result.featureList;
    featureObject.forEach((element) => {
      let existingIds = [];
      features.forEach((object) => existingIds.push(object.id));
      if (existingIds.includes(element.id)) {
        console.log("feature already in list – updating");
        let index = existingIds.indexOf(element.id);
        features[index] = element;
        runFeatures(features);
      } else {
        console.log("feature not in list - adding");
        features.push(element);
        runFeatures(features);
      }
    });
  });
}

getActiveFeatureList();

// Listens for change in Chrome Storage
chrome.storage.onChanged.addListener(function (changes, area) {
  getActiveFeatureList();
});

// RUN FEATURES
// Features check if:
// 1) Name of feature is included in active features
// 2) That the currentPage is set to the page the feature should run on
// 3) *EVENTUALLY* Checks if feature is for free or paid users
function runFeatures(pref) {
  console.log(pref);
  pref.forEach((feature) => {
    if (feature.id === "testFeature" && currentPage === "video")
      AdjustSkipSpeed(feature.checked);
    if (feature.id === "testFeatureTwo" && currentPage === "video")
      LoopSection(feature.checked);
    if (feature.id === "pictureInPicture" && currentPage === "video")
      addPip(feature.checked);
  });
}

// FEATURE FUNCTIONS

function AdjustSkipSpeed(on) {
  if (on) {
    console.log("Skip speed on!");
    document.addEventListener("keydown", skipSpeed);
  } else {
    console.log("removing skip speed listener");
    document.removeEventListener("keydown", skipSpeed);
  }
}

function LoopSection(on) {
  if (on) {
    const interval = setInterval(() => {
      if (chromeControls && !document.getElementById("yes-loop-button")) {
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
}

function addPip(on) {
  let interval;
  if (on) {
    interval = setInterval(() => {
      if (chromeControls && !document.getElementById("yes-pip-button")) {
        clearInterval(interval);
        const miniDisplayButton = document.querySelector(
          ".ytp-miniplayer-button"
        );

        miniDisplayButton.insertAdjacentHTML(
          "beforebegin",
          '<button id="yes-pip-button">PIP</button>'
        );

        const yesPipButton = document.getElementById("yes-pip-button");
        yesPipButton.addEventListener("click", handlePip);
      }
    }, 500);
  } else {
    clearInterval(interval);
  }
}

// HELPER FUNCTIONS

// Helper variables
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
  let objectClicked = e.target;
  let clickedObjectClasses = objectClicked.classList;

  if (clickedObjectClasses.value.includes("ytp-progress-bar")) {
    clickCount++;
    if (clickCount <= 2) {
      if (clickCount == 1) {
        if (startTime == undefined) {
          startTime = document.querySelector("video").currentTime;
          const node = document.querySelector(".ytp-scrubber-container");
          const clone = node.cloneNode(true);
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
          const clone = node.cloneNode(true);
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

function skipSpeed(evt) {
  let uiLabel =
    document.querySelector < HTMLDivElement > ".ytp-doubletap-tooltip-label";
  uiLabel.style.color = "transparent";
  const skipSpeed = Number(features.find((elem) => elem.skipSpeed).skipSpeed);
  let video = document.querySelector("video");
  let seeking = false;

  video.addEventListener("seeking", function () {
    seeking = true;
  });

  video.addEventListener("seeked", function () {
    seeking = false;
  });

  const seekingInterval = setInterval(() => {
    if (!seeking) {
      clearInterval(seekingInterval);
      if (evt.keyCode == 39) {
        video.currentTime = video.currentTime + skipSpeed - 5;
        UpdateSkipUI(skipSpeed);
      } else if (evt.keyCode == 37) {
        video.currentTime = video.currentTime - skipSpeed + 5;
        UpdateSkipUI(skipSpeed);
      }
    }
  }, 10);
}

function UpdateSkipUI(speed) {
  let uiLabel =
    document.querySelector < HTMLDivElement > ".ytp-doubletap-tooltip-label";
  uiLabel.style.color = "transparent";

  let updateUiInterval = setInterval(() => {
    const element = document.querySelector(".ytp-doubletap-ui-legacy");
    if (element.style.display == "") {
      let subString = uiLabel.innerHTML.substring(2);
      uiLabel.innerHTML = speed + " " + subString;
      uiLabel.style.color = "white";
      clearInterval(updateUiInterval);
    }
  }, 10);
}

function handlePip() {
  let video = document.querySelector("video");
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture();
  } else {
    if (document.pictureInPictureEnabled) {
      video.requestPictureInPicture();
    }
  }
}
