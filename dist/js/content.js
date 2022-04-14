/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/app/content.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/app/content.js":
/*!****************************!*\
  !*** ./src/app/content.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9jb250ZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQSxnQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixJQUFJOztBQUVKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLHFCQUFxQixpQ0FBaUM7O0FBRXZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMscUJBQXFCLGlDQUFpQzs7QUFFdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLGtCQUFrQjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLGtCQUFrQjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNvbnRlbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9hcHAvY29udGVudC5qc1wiKTtcbiIsIi8vIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHt9LCAocmVzcG9uc2UpID0+IHtcbi8vICAgdmFyIGNoZWNrUmVhZHkgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4vLyAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIikge1xuLy8gICAgICAgY2xlYXJJbnRlcnZhbChjaGVja1JlYWR5KTtcbi8vICAgICAgIGNvbnNvbGUubG9nKFwiV2UncmUgaW4gdGhlIGluamVjdGVkIGNvbnRlbnQgc2NyaXB0IVwiKTtcbi8vICAgICB9XG4vLyAgIH0pO1xuLy8gfSk7XG5cbi8vIHR5cGUgUGljdHVyZUluUGljdHVyZUV2ZW50TGlzdGVuZXIgPVxuLy8gICB8ICgodGhpczogSFRNTFZpZGVvRWxlbWVudCwgZXY6IFBpY3R1cmVJblBpY3R1cmVFdmVudCkgPT4gYW55KVxuLy8gICB8IG51bGw7XG5cbi8vIGludGVyZmFjZSBIVE1MVmlkZW9FbGVtZW50IHtcbi8vICAgYXV0b1BpY3R1cmVJblBpY3R1cmU6IGJvb2xlYW47XG4vLyAgIGRpc2FibGVQaWN0dXJlSW5QaWN0dXJlOiBib29sZWFuO1xuLy8gICByZXF1ZXN0UGljdHVyZUluUGljdHVyZSgpOiBQcm9taXNlPFBpY3R1cmVJblBpY3R1cmVXaW5kb3c+O1xuLy8gICAvLyBvbmVudGVycGljdHVyZWlucGljdHVyZTogUGljdHVyZUluUGljdHVyZUV2ZW50TGlzdGVuZXI7XG4vLyAgIC8vIG9ubGVhdmVwaWN0dXJlaW5waWN0dXJlOiBQaWN0dXJlSW5QaWN0dXJlRXZlbnRMaXN0ZW5lcjtcbi8vIH1cblxuLy8gaW50ZXJmYWNlIERvY3VtZW50IHtcbi8vICAgcmVhZG9ubHkgcGljdHVyZUluUGljdHVyZUVuYWJsZWQ6IGJvb2xlYW47XG4vLyAgIGV4aXRQaWN0dXJlSW5QaWN0dXJlKCk6IFByb21pc2U8dm9pZD47XG4vLyB9XG5cbi8vIGludGVyZmFjZSBEb2N1bWVudE9yU2hhZG93Um9vdCB7XG4vLyAgIHJlYWRvbmx5IHBpY3R1cmVJblBpY3R1cmVFbGVtZW50OiBFbGVtZW50IHwgbnVsbDtcbi8vIH1cblxuLy8gR2xvYmFsIHZhcmlhYmxlc1xubGV0IGZlYXR1cmVzID0gW107XG5sZXQgYWN0aXZlRmVhdHVyZXMgPSBbXTtcbmxldCBwYXRoTmFtZSA9IGxvY2F0aW9uLnBhdGhuYW1lO1xubGV0IGN1cnJlbnRQYWdlID0gXCJcIjtcbmxldCBjaHJvbWVDb250cm9scyA9IGZhbHNlO1xuXG5jb25zb2xlLmxvZyhhY3RpdmVGZWF0dXJlcyk7XG5cbi8vIExJU1RFTkVSU1xuXG4vLyBMaXN0ZW5zIGZvciBwYWdlIGNoYW5nZVxubmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICBjb25zdCB1cmwgPSBsb2NhdGlvbi5wYXRobmFtZTtcbiAgaWYgKHVybCAhPT0gcGF0aE5hbWUpIHtcbiAgICBwYXRoTmFtZSA9IHVybDtcbiAgICBjaGVja1BhZ2UoKTtcbiAgICBydW5GZWF0dXJlcyhhY3RpdmVGZWF0dXJlcyk7XG4gIH1cbn0pLm9ic2VydmUoZG9jdW1lbnQsIHsgc3VidHJlZTogdHJ1ZSwgY2hpbGRMaXN0OiB0cnVlIH0pO1xuXG4vLyBMaXN0ZW5zIGZvciBDaHJvbWUgQ29udHJvbHMgdG8gYXBwZWFyIChpZS4gYnV0dG9uIGJhciBvbiB2aWRlbylcbm5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgY29uc3QgdmlkZW9Db250cm9scyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIueXRwLWNocm9tZS1jb250cm9sc1wiKTtcbiAgaWYgKHZpZGVvQ29udHJvbHMpIHtcbiAgICBjaHJvbWVDb250cm9scyA9IHRydWU7XG4gIH1cbn0pLm9ic2VydmUoZG9jdW1lbnQsIHsgc3VidHJlZTogdHJ1ZSwgY2hpbGRMaXN0OiB0cnVlIH0pO1xuXG4vLyBDaGVja3Mgd2hhdCBwYWdlIHVzZXIgaXMgb24gYW5kIHNldHMgY3VycmVudFBhZ2VcbmZ1bmN0aW9uIGNoZWNrUGFnZSgpIHtcbiAgc3dpdGNoIChwYXRoTmFtZSkge1xuICAgIGNhc2UgXCIvXCI6XG4gICAgICBjb25zb2xlLmxvZyhcInlvdXR1YmUgaG9tZVwiKTtcbiAgICAgIGN1cnJlbnRQYWdlID0gXCJob21lXCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiL3dhdGNoXCI6XG4gICAgICBjb25zb2xlLmxvZyhcIndhdGNoaW5nIHZpZGVvXCIpO1xuICAgICAgY3VycmVudFBhZ2UgPSBcInZpZGVvXCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiL2ZlZWQvZXhwbG9yZVwiOlxuICAgICAgY29uc29sZS5sb2coXCJleHBsb3JlIHBhZ2VcIik7XG4gICAgICBjdXJyZW50UGFnZSA9IFwiZXhwbG9yZVwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIi9mZWVkL3N1YnNjcmlwdGlvbnNcIjpcbiAgICAgIGNvbnNvbGUubG9nKFwic3Vic2NyaXB0aW9uc1wiKTtcbiAgICAgIGN1cnJlbnRQYWdlID0gXCJzdWJzY3JpcHRpb25zXCI7XG4gICAgICBicmVhaztcbiAgfVxufVxuXG4vLyBXYWl0cyBmb3IgcGFnZSB0byBsb2FkIHRoZW4gcnVucyBmZWF0dXJlc1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInJlYWR5c3RhdGVjaGFuZ2VcIiwgKGV2ZW50KSA9PiB7XG4gIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIpIHtcbiAgICBjaGVja1BhZ2UoKTtcbiAgICBydW5GZWF0dXJlcyhmZWF0dXJlcyk7XG4gIH1cbn0pO1xuXG4vLyBDSFJPTUUgU1RPUkFHRVxuXG4vLyBHZXRzIGFjdGl2ZSBmZWF0dXJlIGxpc3Qgb2YgQ2hyb21lIFN0b3JhZ2VcbmZ1bmN0aW9uIGdldEFjdGl2ZUZlYXR1cmVMaXN0KCkge1xuICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChcImZlYXR1cmVMaXN0XCIsIChyZXN1bHQpID0+IHtcbiAgICBjb25zdCBmZWF0dXJlT2JqZWN0ID0gcmVzdWx0LmZlYXR1cmVMaXN0O1xuICAgIGZlYXR1cmVPYmplY3QuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgbGV0IGV4aXN0aW5nSWRzID0gW107XG4gICAgICBmZWF0dXJlcy5mb3JFYWNoKChvYmplY3QpID0+IGV4aXN0aW5nSWRzLnB1c2gob2JqZWN0LmlkKSk7XG4gICAgICBpZiAoZXhpc3RpbmdJZHMuaW5jbHVkZXMoZWxlbWVudC5pZCkpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJmZWF0dXJlIGFscmVhZHkgaW4gbGlzdCDigJPCoHVwZGF0aW5nXCIpO1xuICAgICAgICBsZXQgaW5kZXggPSBleGlzdGluZ0lkcy5pbmRleE9mKGVsZW1lbnQuaWQpO1xuICAgICAgICBmZWF0dXJlc1tpbmRleF0gPSBlbGVtZW50O1xuICAgICAgICBydW5GZWF0dXJlcyhmZWF0dXJlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhcImZlYXR1cmUgbm90IGluIGxpc3QgLSBhZGRpbmdcIik7XG4gICAgICAgIGZlYXR1cmVzLnB1c2goZWxlbWVudCk7XG4gICAgICAgIHJ1bkZlYXR1cmVzKGZlYXR1cmVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbmdldEFjdGl2ZUZlYXR1cmVMaXN0KCk7XG5cbi8vIExpc3RlbnMgZm9yIGNoYW5nZSBpbiBDaHJvbWUgU3RvcmFnZVxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChjaGFuZ2VzLCBhcmVhKSB7XG4gIGdldEFjdGl2ZUZlYXR1cmVMaXN0KCk7XG59KTtcblxuLy8gUlVOIEZFQVRVUkVTXG4vLyBGZWF0dXJlcyBjaGVjayBpZjpcbi8vIDEpIE5hbWUgb2YgZmVhdHVyZSBpcyBpbmNsdWRlZCBpbiBhY3RpdmUgZmVhdHVyZXNcbi8vIDIpIFRoYXQgdGhlIGN1cnJlbnRQYWdlIGlzIHNldCB0byB0aGUgcGFnZSB0aGUgZmVhdHVyZSBzaG91bGQgcnVuIG9uXG4vLyAzKSAqRVZFTlRVQUxMWSogQ2hlY2tzIGlmIGZlYXR1cmUgaXMgZm9yIGZyZWUgb3IgcGFpZCB1c2Vyc1xuZnVuY3Rpb24gcnVuRmVhdHVyZXMocHJlZikge1xuICBjb25zb2xlLmxvZyhwcmVmKTtcbiAgcHJlZi5mb3JFYWNoKChmZWF0dXJlKSA9PiB7XG4gICAgaWYgKGZlYXR1cmUuaWQgPT09IFwidGVzdEZlYXR1cmVcIiAmJiBjdXJyZW50UGFnZSA9PT0gXCJ2aWRlb1wiKVxuICAgICAgQWRqdXN0U2tpcFNwZWVkKGZlYXR1cmUuY2hlY2tlZCk7XG4gICAgaWYgKGZlYXR1cmUuaWQgPT09IFwidGVzdEZlYXR1cmVUd29cIiAmJiBjdXJyZW50UGFnZSA9PT0gXCJ2aWRlb1wiKVxuICAgICAgTG9vcFNlY3Rpb24oZmVhdHVyZS5jaGVja2VkKTtcbiAgICBpZiAoZmVhdHVyZS5pZCA9PT0gXCJwaWN0dXJlSW5QaWN0dXJlXCIgJiYgY3VycmVudFBhZ2UgPT09IFwidmlkZW9cIilcbiAgICAgIGFkZFBpcChmZWF0dXJlLmNoZWNrZWQpO1xuICB9KTtcbn1cblxuLy8gRkVBVFVSRSBGVU5DVElPTlNcblxuZnVuY3Rpb24gQWRqdXN0U2tpcFNwZWVkKG9uKSB7XG4gIGlmIChvbikge1xuICAgIGNvbnNvbGUubG9nKFwiU2tpcCBzcGVlZCBvbiFcIik7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgc2tpcFNwZWVkKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhcInJlbW92aW5nIHNraXAgc3BlZWQgbGlzdGVuZXJcIik7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgc2tpcFNwZWVkKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBMb29wU2VjdGlvbihvbikge1xuICBpZiAob24pIHtcbiAgICBjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGlmIChjaHJvbWVDb250cm9scyAmJiAhZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ5ZXMtbG9vcC1idXR0b25cIikpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgIGNvbnN0IHZvbHVtZUFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnl0cC12b2x1bWUtYXJlYVwiKTtcblxuICAgICAgICB2b2x1bWVBcmVhLmluc2VydEFkamFjZW50SFRNTChcbiAgICAgICAgICBcImFmdGVyZW5kXCIsXG4gICAgICAgICAgJzxidXR0b24gaWQ9XCJ5ZXMtbG9vcC1idXR0b25cIj5MT09QPC9idXR0b24+J1xuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHllc0xvb3BCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInllcy1sb29wLWJ1dHRvblwiKTtcbiAgICAgICAgeWVzTG9vcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbWFuYWdlTG9vcCk7XG4gICAgICB9XG4gICAgfSwgNTAwKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRQaXAob24pIHtcbiAgbGV0IGludGVydmFsO1xuICBpZiAob24pIHtcbiAgICBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGlmIChjaHJvbWVDb250cm9scyAmJiAhZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ5ZXMtcGlwLWJ1dHRvblwiKSkge1xuICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgY29uc3QgbWluaURpc3BsYXlCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgIFwiLnl0cC1taW5pcGxheWVyLWJ1dHRvblwiXG4gICAgICAgICk7XG5cbiAgICAgICAgbWluaURpc3BsYXlCdXR0b24uaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgICAgICAgIFwiYmVmb3JlYmVnaW5cIixcbiAgICAgICAgICAnPGJ1dHRvbiBpZD1cInllcy1waXAtYnV0dG9uXCI+UElQPC9idXR0b24+J1xuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHllc1BpcEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwieWVzLXBpcC1idXR0b25cIik7XG4gICAgICAgIHllc1BpcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlUGlwKTtcbiAgICAgIH1cbiAgICB9LCA1MDApO1xuICB9IGVsc2Uge1xuICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcblxuLy8gSGVscGVyIHZhcmlhYmxlc1xubGV0IHN0YXJ0VGltZTtcbmxldCBlbmRUaW1lO1xubGV0IGNsaWNrQ291bnQgPSAwO1xubGV0IHZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInZpZGVvXCIpO1xubGV0IGFjdGl2ZUxvb3AgPSBmYWxzZTtcblxuZnVuY3Rpb24gbWFuYWdlTG9vcCgpIHtcbiAgaWYgKCFhY3RpdmVMb29wKSB7XG4gICAgYWN0aXZlTG9vcCA9IHRydWU7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNhcHR1cmVMb29wKTtcbiAgfSBlbHNlIHtcbiAgICBhY3RpdmVMb29wID0gZmFsc2U7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNhcHR1cmVMb29wKTtcbiAgICBzdGFydFRpbWUgPSBudWxsO1xuICAgIGVuZFRpbWUgPSBudWxsO1xuICAgIGNsaWNrQ291bnQgPSAwO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYUxvb3BcIikucmVtb3ZlKCk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5iTG9vcFwiKS5yZW1vdmUoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjYXB0dXJlTG9vcChlKSB7XG4gIGxldCBvYmplY3RDbGlja2VkID0gZS50YXJnZXQ7XG4gIGxldCBjbGlja2VkT2JqZWN0Q2xhc3NlcyA9IG9iamVjdENsaWNrZWQuY2xhc3NMaXN0O1xuXG4gIGlmIChjbGlja2VkT2JqZWN0Q2xhc3Nlcy52YWx1ZS5pbmNsdWRlcyhcInl0cC1wcm9ncmVzcy1iYXJcIikpIHtcbiAgICBjbGlja0NvdW50Kys7XG4gICAgaWYgKGNsaWNrQ291bnQgPD0gMikge1xuICAgICAgaWYgKGNsaWNrQ291bnQgPT0gMSkge1xuICAgICAgICBpZiAoc3RhcnRUaW1lID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHN0YXJ0VGltZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ2aWRlb1wiKS5jdXJyZW50VGltZTtcbiAgICAgICAgICBjb25zdCBub2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi55dHAtc2NydWJiZXItY29udGFpbmVyXCIpO1xuICAgICAgICAgIGNvbnN0IGNsb25lID0gbm9kZS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgY2xvbmUuY2xhc3NMaXN0LmFkZChcImFMb29wXCIpO1xuICAgICAgICAgIGNsb25lLmZpcnN0RWxlbWVudENoaWxkLmluc2VydEFkamFjZW50SFRNTChcbiAgICAgICAgICAgIFwiYWZ0ZXJiZWdpblwiLFxuICAgICAgICAgICAgXCI8c3BhbiBzdHlsZT0nbWFyZ2luLWxlZnQ6IDMuNXB4OyBmb250LXdlaWdodDogNzAwOyc+QTwvc3Bhbj5cIlxuICAgICAgICAgICk7XG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi55dHAtcHJvZ3Jlc3MtYmFyXCIpLmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY2xpY2tDb3VudCA9PSAyKSB7XG4gICAgICAgIGlmIChlbmRUaW1lID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGVuZFRpbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidmlkZW9cIikuY3VycmVudFRpbWU7XG4gICAgICAgICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIueXRwLXNjcnViYmVyLWNvbnRhaW5lclwiKTtcbiAgICAgICAgICBjb25zdCBjbG9uZSA9IG5vZGUuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgIGNsb25lLmNsYXNzTGlzdC5hZGQoXCJiTG9vcFwiKTtcbiAgICAgICAgICBjbG9uZS5maXJzdEVsZW1lbnRDaGlsZC5pbnNlcnRBZGphY2VudEhUTUwoXG4gICAgICAgICAgICBcImFmdGVyYmVnaW5cIixcbiAgICAgICAgICAgIFwiPHNwYW4gc3R5bGU9J21hcmdpbi1sZWZ0OiAzLjVweDsgZm9udC13ZWlnaHQ6IDcwMDsnPkI8L3NwYW4+XCJcbiAgICAgICAgICApO1xuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIueXRwLXByb2dyZXNzLWJhclwiKS5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgICAgICAgc3RhcnRMb29wKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNsaWNrQ291bnQgPiAyKSB7XG4gICAgICBjbGlja0NvdW50ID0gMDtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc3RhcnRMb29wKCkge1xuICB2aWRlby5jdXJyZW50VGltZSA9IHN0YXJ0VGltZTtcbiAgY29uc3QgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgaWYgKHZpZGVvLmN1cnJlbnRUaW1lID4gZW5kVGltZSAmJiBhY3RpdmVMb29wKSB7XG4gICAgICB2aWRlby5jdXJyZW50VGltZSA9IHN0YXJ0VGltZTtcbiAgICB9IGVsc2UgaWYgKCFhY3RpdmVMb29wKSB7XG4gICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICB9XG4gIH0sIDEwKTtcbn1cblxuZnVuY3Rpb24gc2tpcFNwZWVkKGV2dCkge1xuICBsZXQgdWlMYWJlbCA9XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvciA8IEhUTUxEaXZFbGVtZW50ID4gXCIueXRwLWRvdWJsZXRhcC10b29sdGlwLWxhYmVsXCI7XG4gIHVpTGFiZWwuc3R5bGUuY29sb3IgPSBcInRyYW5zcGFyZW50XCI7XG4gIGNvbnN0IHNraXBTcGVlZCA9IE51bWJlcihmZWF0dXJlcy5maW5kKChlbGVtKSA9PiBlbGVtLnNraXBTcGVlZCkuc2tpcFNwZWVkKTtcbiAgbGV0IHZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInZpZGVvXCIpO1xuICBsZXQgc2Vla2luZyA9IGZhbHNlO1xuXG4gIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoXCJzZWVraW5nXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBzZWVraW5nID0gdHJ1ZTtcbiAgfSk7XG5cbiAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcInNlZWtlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgc2Vla2luZyA9IGZhbHNlO1xuICB9KTtcblxuICBjb25zdCBzZWVraW5nSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgaWYgKCFzZWVraW5nKSB7XG4gICAgICBjbGVhckludGVydmFsKHNlZWtpbmdJbnRlcnZhbCk7XG4gICAgICBpZiAoZXZ0LmtleUNvZGUgPT0gMzkpIHtcbiAgICAgICAgdmlkZW8uY3VycmVudFRpbWUgPSB2aWRlby5jdXJyZW50VGltZSArIHNraXBTcGVlZCAtIDU7XG4gICAgICAgIFVwZGF0ZVNraXBVSShza2lwU3BlZWQpO1xuICAgICAgfSBlbHNlIGlmIChldnQua2V5Q29kZSA9PSAzNykge1xuICAgICAgICB2aWRlby5jdXJyZW50VGltZSA9IHZpZGVvLmN1cnJlbnRUaW1lIC0gc2tpcFNwZWVkICsgNTtcbiAgICAgICAgVXBkYXRlU2tpcFVJKHNraXBTcGVlZCk7XG4gICAgICB9XG4gICAgfVxuICB9LCAxMCk7XG59XG5cbmZ1bmN0aW9uIFVwZGF0ZVNraXBVSShzcGVlZCkge1xuICBsZXQgdWlMYWJlbCA9XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvciA8IEhUTUxEaXZFbGVtZW50ID4gXCIueXRwLWRvdWJsZXRhcC10b29sdGlwLWxhYmVsXCI7XG4gIHVpTGFiZWwuc3R5bGUuY29sb3IgPSBcInRyYW5zcGFyZW50XCI7XG5cbiAgbGV0IHVwZGF0ZVVpSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIueXRwLWRvdWJsZXRhcC11aS1sZWdhY3lcIik7XG4gICAgaWYgKGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9PSBcIlwiKSB7XG4gICAgICBsZXQgc3ViU3RyaW5nID0gdWlMYWJlbC5pbm5lckhUTUwuc3Vic3RyaW5nKDIpO1xuICAgICAgdWlMYWJlbC5pbm5lckhUTUwgPSBzcGVlZCArIFwiIFwiICsgc3ViU3RyaW5nO1xuICAgICAgdWlMYWJlbC5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgIGNsZWFySW50ZXJ2YWwodXBkYXRlVWlJbnRlcnZhbCk7XG4gICAgfVxuICB9LCAxMCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVBpcCgpIHtcbiAgbGV0IHZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInZpZGVvXCIpO1xuICBpZiAoZG9jdW1lbnQucGljdHVyZUluUGljdHVyZUVsZW1lbnQpIHtcbiAgICBkb2N1bWVudC5leGl0UGljdHVyZUluUGljdHVyZSgpO1xuICB9IGVsc2Uge1xuICAgIGlmIChkb2N1bWVudC5waWN0dXJlSW5QaWN0dXJlRW5hYmxlZCkge1xuICAgICAgdmlkZW8ucmVxdWVzdFBpY3R1cmVJblBpY3R1cmUoKTtcbiAgICB9XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=