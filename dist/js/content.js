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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/app/content.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/app/content.ts":
/*!****************************!*\
  !*** ./src/app/content.ts ***!
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
            }
            else {
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
    });
}
// FEATURE FUNCTIONS
function AdjustSkipSpeed(on) {
    if (on) {
        console.log("Skip speed on!");
        document.addEventListener("keydown", skipSpeed);
    }
    else {
        console.log("removing skip speed listener");
        document.removeEventListener("keydown", skipSpeed);
    }
}
function LoopSection(on) {
    return __awaiter(this, void 0, void 0, function* () {
        if (on) {
            const interval = setInterval(() => {
                if (chromeControls && !document.getElementById("yes-loop-button")) {
                    clearInterval(interval);
                    const volumeArea = document.querySelector(".ytp-volume-area");
                    volumeArea.insertAdjacentHTML("afterend", '<button id="yes-loop-button">LOOP</button>');
                    const yesLoopButton = document.getElementById("yes-loop-button");
                    yesLoopButton.addEventListener("click", manageLoop);
                }
            }, 500);
        }
    });
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
    }
    else {
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
                    clone.firstElementChild.insertAdjacentHTML("afterbegin", "<span style='margin-left: 3.5px; font-weight: 700;'>A</span>");
                    document.querySelector(".ytp-progress-bar").appendChild(clone);
                }
            }
            if (clickCount == 2) {
                if (endTime == undefined) {
                    endTime = document.querySelector("video").currentTime;
                    const node = document.querySelector(".ytp-scrubber-container");
                    const clone = node.cloneNode(true);
                    clone.classList.add("bLoop");
                    clone.firstElementChild.insertAdjacentHTML("afterbegin", "<span style='margin-left: 3.5px; font-weight: 700;'>B</span>");
                    document.querySelector(".ytp-progress-bar").appendChild(clone);
                    startLoop();
                }
            }
        }
        else if (clickCount > 2) {
            clickCount = 0;
        }
    }
}
function startLoop() {
    video.currentTime = startTime;
    const interval = setInterval(() => {
        if (video.currentTime > endTime && activeLoop) {
            video.currentTime = startTime;
        }
        else if (!activeLoop) {
            clearInterval(interval);
        }
    }, 10);
}
function skipSpeed(evt) {
    let uiLabel = document.querySelector(".ytp-doubletap-tooltip-label");
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
            }
            else if (evt.keyCode == 37) {
                video.currentTime = video.currentTime - skipSpeed + 5;
                UpdateSkipUI(skipSpeed);
            }
        }
    }, 10);
}
function UpdateSkipUI(speed) {
    let uiLabel = document.querySelector(".ytp-doubletap-tooltip-label");
    uiLabel.style.color = "transparent";
    let updateUiInterval = setInterval(() => {
        const element = (document.querySelector(".ytp-doubletap-ui-legacy"));
        if (element.style.display == "") {
            let subString = uiLabel.innerHTML.substring(2);
            uiLabel.innerHTML = speed + " " + subString;
            uiLabel.style.color = "white";
            clearInterval(updateUiInterval);
        }
    }, 10);
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9jb250ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQSxpREFBaUQ7QUFDakQseUNBQXlDO0FBQ3pDLGdEQUFnRDtBQUNoRCxtQ0FBbUM7QUFDbkMsOERBQThEO0FBQzlELFFBQVE7QUFDUixRQUFRO0FBQ1IsTUFBTTs7Ozs7Ozs7OztBQUVOLG1CQUFtQjtBQUNuQixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbEIsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7QUFDakMsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQztBQUUzQixPQUFPLENBQUMs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QUFTLFlBQVksQ0FBQyxLQUFLO0lBQ3pCLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQ2xDLDhCQUE4QixDQUMvQixDQUFDO0lBQ0YsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDO0lBRXBDLElBQUksZ0JBQWdCLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTtRQUN0QyxNQUFNLE9BQU8sR0FBbUIsQ0FDOUIsUUFBUSxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxDQUNuRCxDQUFDO1FBQ0YsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUU7WUFDL0IsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0MsT0FBTyxDQUFDLFNBQVMsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQztZQUM1QyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7WUFDOUIsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDakM7SUFDSCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVCxDQUFDIiwiZmlsZSI6ImNvbnRlbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9hcHAvY29udGVudC50c1wiKTtcbiIsIi8vIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHt9LCAocmVzcG9uc2UpID0+IHtcbi8vICAgdmFyIGNoZWNrUmVhZHkgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4vLyAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIikge1xuLy8gICAgICAgY2xlYXJJbnRlcnZhbChjaGVja1JlYWR5KTtcbi8vICAgICAgIGNvbnNvbGUubG9nKFwiV2UncmUgaW4gdGhlIGluamVjdGVkIGNvbnRlbnQgc2NyaXB0IVwiKTtcbi8vICAgICB9XG4vLyAgIH0pO1xuLy8gfSk7XG5cbi8vIEdsb2JhbCB2YXJpYWJsZXNcbmxldCBmZWF0dXJlcyA9IFtdO1xubGV0IGFjdGl2ZUZlYXR1cmVzID0gW107XG5sZXQgcGF0aE5hbWUgPSBsb2NhdGlvbi5wYXRobmFtZTtcbmxldCBjdXJyZW50UGFnZSA9IFwiXCI7XG5sZXQgY2hyb21lQ29udHJvbHMgPSBmYWxzZTtcblxuY29uc29sZS5sb2coYWN0aXZlRmVhdHVyZXMpO1xuXG4vLyBMSVNURU5FUlNcblxuLy8gTGlzdGVucyBmb3IgcGFnZSBjaGFuZ2Vcbm5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgY29uc3QgdXJsID0gbG9jYXRpb24ucGF0aG5hbWU7XG4gIGlmICh1cmwgIT09IHBhdGhOYW1lKSB7XG4gICAgcGF0aE5hbWUgPSB1cmw7XG4gICAgY2hlY2tQYWdlKCk7XG4gICAgcnVuRmVhdHVyZXMoYWN0aXZlRmVhdHVyZXMpO1xuICB9XG59KS5vYnNlcnZlKGRvY3VtZW50LCB7IHN1YnRyZWU6IHRydWUsIGNoaWxkTGlzdDogdHJ1ZSB9KTtcblxuLy8gTGlzdGVucyBmb3IgQ2hyb21lIENvbnRyb2xzIHRvIGFwcGVhciAoaWUuIGJ1dHRvbiBiYXIgb24gdmlkZW8pXG5uZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gIGNvbnN0IHZpZGVvQ29udHJvbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnl0cC1jaHJvbWUtY29udHJvbHNcIik7XG4gIGlmICh2aWRlb0NvbnRyb2xzKSB7XG4gICAgY2hyb21lQ29udHJvbHMgPSB0cnVlO1xuICB9XG59KS5vYnNlcnZlKGRvY3VtZW50LCB7IHN1YnRyZWU6IHRydWUsIGNoaWxkTGlzdDogdHJ1ZSB9KTtcblxuLy8gQ2hlY2tzIHdoYXQgcGFnZSB1c2VyIGlzIG9uIGFuZCBzZXRzIGN1cnJlbnRQYWdlXG5mdW5jdGlvbiBjaGVja1BhZ2UoKSB7XG4gIHN3aXRjaCAocGF0aE5hbWUpIHtcbiAgICBjYXNlIFwiL1wiOlxuICAgICAgY29uc29sZS5sb2coXCJ5b3V0dWJlIGhvbWVcIik7XG4gICAgICBjdXJyZW50UGFnZSA9IFwiaG9tZVwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIi93YXRjaFwiOlxuICAgICAgY29uc29sZS5sb2coXCJ3YXRjaGluZyB2aWRlb1wiKTtcbiAgICAgIGN1cnJlbnRQYWdlID0gXCJ2aWRlb1wiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIi9mZWVkL2V4cGxvcmVcIjpcbiAgICAgIGNvbnNvbGUubG9nKFwiZXhwbG9yZSBwYWdlXCIpO1xuICAgICAgY3VycmVudFBhZ2UgPSBcImV4cGxvcmVcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCIvZmVlZC9zdWJzY3JpcHRpb25zXCI6XG4gICAgICBjb25zb2xlLmxvZyhcInN1YnNjcmlwdGlvbnNcIik7XG4gICAgICBjdXJyZW50UGFnZSA9IFwic3Vic2NyaXB0aW9uc1wiO1xuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuLy8gV2FpdHMgZm9yIHBhZ2UgdG8gbG9hZCB0aGVuIHJ1bnMgZmVhdHVyZXNcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsIChldmVudCkgPT4ge1xuICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgY2hlY2tQYWdlKCk7XG4gICAgcnVuRmVhdHVyZXMoZmVhdHVyZXMpO1xuICB9XG59KTtcblxuLy8gQ0hST01FIFNUT1JBR0VcblxuLy8gR2V0cyBhY3RpdmUgZmVhdHVyZSBsaXN0IG9mIENocm9tZSBTdG9yYWdlXG5mdW5jdGlvbiBnZXRBY3RpdmVGZWF0dXJlTGlzdCgpIHtcbiAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoXCJmZWF0dXJlTGlzdFwiLCAocmVzdWx0KSA9PiB7XG4gICAgY29uc3QgZmVhdHVyZU9iamVjdCA9IHJlc3VsdC5mZWF0dXJlTGlzdDtcbiAgICBmZWF0dXJlT2JqZWN0LmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGxldCBleGlzdGluZ0lkcyA9IFtdO1xuICAgICAgZmVhdHVyZXMuZm9yRWFjaCgob2JqZWN0KSA9PiBleGlzdGluZ0lkcy5wdXNoKG9iamVjdC5pZCkpO1xuICAgICAgaWYgKGV4aXN0aW5nSWRzLmluY2x1ZGVzKGVsZW1lbnQuaWQpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZmVhdHVyZSBhbHJlYWR5IGluIGxpc3Qg4oCTwqB1cGRhdGluZ1wiKTtcbiAgICAgICAgbGV0IGluZGV4ID0gZXhpc3RpbmdJZHMuaW5kZXhPZihlbGVtZW50LmlkKTtcbiAgICAgICAgZmVhdHVyZXNbaW5kZXhdID0gZWxlbWVudDtcbiAgICAgICAgcnVuRmVhdHVyZXMoZmVhdHVyZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJmZWF0dXJlIG5vdCBpbiBsaXN0IC0gYWRkaW5nXCIpO1xuICAgICAgICBmZWF0dXJlcy5wdXNoKGVsZW1lbnQpO1xuICAgICAgICBydW5GZWF0dXJlcyhmZWF0dXJlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5nZXRBY3RpdmVGZWF0dXJlTGlzdCgpO1xuXG4vLyBMaXN0ZW5zIGZvciBjaGFuZ2UgaW4gQ2hyb21lIFN0b3JhZ2VcbmNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAoY2hhbmdlcywgYXJlYSkge1xuICBnZXRBY3RpdmVGZWF0dXJlTGlzdCgpO1xufSk7XG5cbi8vIFJVTiBGRUFUVVJFU1xuLy8gRmVhdHVyZXMgY2hlY2sgaWY6XG4vLyAxKSBOYW1lIG9mIGZlYXR1cmUgaXMgaW5jbHVkZWQgaW4gYWN0aXZlIGZlYXR1cmVzXG4vLyAyKSBUaGF0IHRoZSBjdXJyZW50UGFnZSBpcyBzZXQgdG8gdGhlIHBhZ2UgdGhlIGZlYXR1cmUgc2hvdWxkIHJ1biBvblxuLy8gMykgKkVWRU5UVUFMTFkqIENoZWNrcyBpZiBmZWF0dXJlIGlzIGZvciBmcmVlIG9yIHBhaWQgdXNlcnNcbmZ1bmN0aW9uIHJ1bkZlYXR1cmVzKHByZWYpIHtcbiAgY29uc29sZS5sb2cocHJlZik7XG4gIHByZWYuZm9yRWFjaCgoZmVhdHVyZSkgPT4ge1xuICAgIGlmIChmZWF0dXJlLmlkID09PSBcInRlc3RGZWF0dXJlXCIgJiYgY3VycmVudFBhZ2UgPT09IFwidmlkZW9cIilcbiAgICAgIEFkanVzdFNraXBTcGVlZChmZWF0dXJlLmNoZWNrZWQpO1xuICAgIGlmIChmZWF0dXJlLmlkID09PSBcInRlc3RGZWF0dXJlVHdvXCIgJiYgY3VycmVudFBhZ2UgPT09IFwidmlkZW9cIilcbiAgICAgIExvb3BTZWN0aW9uKGZlYXR1cmUuY2hlY2tlZCk7XG4gIH0pO1xufVxuXG4vLyBGRUFUVVJFIEZVTkNUSU9OU1xuXG5mdW5jdGlvbiBBZGp1c3RTa2lwU3BlZWQob24pIHtcbiAgaWYgKG9uKSB7XG4gICAgY29uc29sZS5sb2coXCJTa2lwIHNwZWVkIG9uIVwiKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBza2lwU3BlZWQpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKFwicmVtb3Zpbmcgc2tpcCBzcGVlZCBsaXN0ZW5lclwiKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBza2lwU3BlZWQpO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIExvb3BTZWN0aW9uKG9uKSB7XG4gIGlmIChvbikge1xuICAgIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgaWYgKGNocm9tZUNvbnRyb2xzICYmICFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInllcy1sb29wLWJ1dHRvblwiKSkge1xuICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgY29uc3Qgdm9sdW1lQXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIueXRwLXZvbHVtZS1hcmVhXCIpO1xuXG4gICAgICAgIHZvbHVtZUFyZWEuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgICAgICAgIFwiYWZ0ZXJlbmRcIixcbiAgICAgICAgICAnPGJ1dHRvbiBpZD1cInllcy1sb29wLWJ1dHRvblwiPkxPT1A8L2J1dHRvbj4nXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgeWVzTG9vcEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwieWVzLWxvb3AtYnV0dG9uXCIpO1xuICAgICAgICB5ZXNMb29wQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBtYW5hZ2VMb29wKTtcbiAgICAgIH1cbiAgICB9LCA1MDApO1xuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcblxuLy8gSGVscGVyIHZhcmlhYmxlc1xubGV0IHN0YXJ0VGltZTtcbmxldCBlbmRUaW1lO1xubGV0IGNsaWNrQ291bnQgPSAwO1xubGV0IHZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInZpZGVvXCIpO1xubGV0IGFjdGl2ZUxvb3AgPSBmYWxzZTtcblxuZnVuY3Rpb24gbWFuYWdlTG9vcCgpIHtcbiAgaWYgKCFhY3RpdmVMb29wKSB7XG4gICAgYWN0aXZlTG9vcCA9IHRydWU7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNhcHR1cmVMb29wKTtcbiAgfSBlbHNlIHtcbiAgICBhY3RpdmVMb29wID0gZmFsc2U7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNhcHR1cmVMb29wKTtcbiAgICBzdGFydFRpbWUgPSBudWxsO1xuICAgIGVuZFRpbWUgPSBudWxsO1xuICAgIGNsaWNrQ291bnQgPSAwO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYUxvb3BcIikucmVtb3ZlKCk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5iTG9vcFwiKS5yZW1vdmUoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjYXB0dXJlTG9vcChlKSB7XG4gIGxldCBvYmplY3RDbGlja2VkID0gPEhUTUxEaXZFbGVtZW50PmUudGFyZ2V0O1xuICBsZXQgY2xpY2tlZE9iamVjdENsYXNzZXMgPSBvYmplY3RDbGlja2VkLmNsYXNzTGlzdDtcblxuICBpZiAoY2xpY2tlZE9iamVjdENsYXNzZXMudmFsdWUuaW5jbHVkZXMoXCJ5dHAtcHJvZ3Jlc3MtYmFyXCIpKSB7XG4gICAgY2xpY2tDb3VudCsrO1xuICAgIGlmIChjbGlja0NvdW50IDw9IDIpIHtcbiAgICAgIGlmIChjbGlja0NvdW50ID09IDEpIHtcbiAgICAgICAgaWYgKHN0YXJ0VGltZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBzdGFydFRpbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidmlkZW9cIikuY3VycmVudFRpbWU7XG4gICAgICAgICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIueXRwLXNjcnViYmVyLWNvbnRhaW5lclwiKTtcbiAgICAgICAgICBjb25zdCBjbG9uZSA9IDxFbGVtZW50Pm5vZGUuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgIGNsb25lLmNsYXNzTGlzdC5hZGQoXCJhTG9vcFwiKTtcbiAgICAgICAgICBjbG9uZS5maXJzdEVsZW1lbnRDaGlsZC5pbnNlcnRBZGphY2VudEhUTUwoXG4gICAgICAgICAgICBcImFmdGVyYmVnaW5cIixcbiAgICAgICAgICAgIFwiPHNwYW4gc3R5bGU9J21hcmdpbi1sZWZ0OiAzLjVweDsgZm9udC13ZWlnaHQ6IDcwMDsnPkE8L3NwYW4+XCJcbiAgICAgICAgICApO1xuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIueXRwLXByb2dyZXNzLWJhclwiKS5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNsaWNrQ291bnQgPT0gMikge1xuICAgICAgICBpZiAoZW5kVGltZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBlbmRUaW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInZpZGVvXCIpLmN1cnJlbnRUaW1lO1xuICAgICAgICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnl0cC1zY3J1YmJlci1jb250YWluZXJcIik7XG4gICAgICAgICAgY29uc3QgY2xvbmUgPSA8RWxlbWVudD5ub2RlLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICBjbG9uZS5jbGFzc0xpc3QuYWRkKFwiYkxvb3BcIik7XG4gICAgICAgICAgY2xvbmUuZmlyc3RFbGVtZW50Q2hpbGQuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgICAgICAgICAgXCJhZnRlcmJlZ2luXCIsXG4gICAgICAgICAgICBcIjxzcGFuIHN0eWxlPSdtYXJnaW4tbGVmdDogMy41cHg7IGZvbnQtd2VpZ2h0OiA3MDA7Jz5CPC9zcGFuPlwiXG4gICAgICAgICAgKTtcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnl0cC1wcm9ncmVzcy1iYXJcIikuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICAgIHN0YXJ0TG9vcCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjbGlja0NvdW50ID4gMikge1xuICAgICAgY2xpY2tDb3VudCA9IDA7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHN0YXJ0TG9vcCgpIHtcbiAgdmlkZW8uY3VycmVudFRpbWUgPSBzdGFydFRpbWU7XG4gIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgIGlmICh2aWRlby5jdXJyZW50VGltZSA+IGVuZFRpbWUgJiYgYWN0aXZlTG9vcCkge1xuICAgICAgdmlkZW8uY3VycmVudFRpbWUgPSBzdGFydFRpbWU7XG4gICAgfSBlbHNlIGlmICghYWN0aXZlTG9vcCkge1xuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgfVxuICB9LCAxMCk7XG59XG5cbmZ1bmN0aW9uIHNraXBTcGVlZChldnQpIHtcbiAgbGV0IHVpTGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxEaXZFbGVtZW50PihcbiAgICBcIi55dHAtZG91YmxldGFwLXRvb2x0aXAtbGFiZWxcIlxuICApO1xuICB1aUxhYmVsLnN0eWxlLmNvbG9yID0gXCJ0cmFuc3BhcmVudFwiO1xuICBjb25zdCBza2lwU3BlZWQgPSBOdW1iZXIoZmVhdHVyZXMuZmluZCgoZWxlbSkgPT4gZWxlbS5za2lwU3BlZWQpLnNraXBTcGVlZCk7XG4gIGxldCB2aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ2aWRlb1wiKTtcbiAgbGV0IHNlZWtpbmcgPSBmYWxzZTtcblxuICB2aWRlby5hZGRFdmVudExpc3RlbmVyKFwic2Vla2luZ1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgc2Vla2luZyA9IHRydWU7XG4gIH0pO1xuXG4gIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoXCJzZWVrZWRcIiwgZnVuY3Rpb24gKCkge1xuICAgIHNlZWtpbmcgPSBmYWxzZTtcbiAgfSk7XG5cbiAgY29uc3Qgc2Vla2luZ0ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgIGlmICghc2Vla2luZykge1xuICAgICAgY2xlYXJJbnRlcnZhbChzZWVraW5nSW50ZXJ2YWwpO1xuICAgICAgaWYgKGV2dC5rZXlDb2RlID09IDM5KSB7XG4gICAgICAgIHZpZGVvLmN1cnJlbnRUaW1lID0gdmlkZW8uY3VycmVudFRpbWUgKyBza2lwU3BlZWQgLSA1O1xuICAgICAgICBVcGRhdGVTa2lwVUkoc2tpcFNwZWVkKTtcbiAgICAgIH0gZWxzZSBpZiAoZXZ0LmtleUNvZGUgPT0gMzcpIHtcbiAgICAgICAgdmlkZW8uY3VycmVudFRpbWUgPSB2aWRlby5jdXJyZW50VGltZSAtIHNraXBTcGVlZCArIDU7XG4gICAgICAgIFVwZGF0ZVNraXBVSShza2lwU3BlZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfSwgMTApO1xufVxuXG5mdW5jdGlvbiBVcGRhdGVTa2lwVUkoc3BlZWQpIHtcbiAgbGV0IHVpTGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxEaXZFbGVtZW50PihcbiAgICBcIi55dHAtZG91YmxldGFwLXRvb2x0aXAtbGFiZWxcIlxuICApO1xuICB1aUxhYmVsLnN0eWxlLmNvbG9yID0gXCJ0cmFuc3BhcmVudFwiO1xuXG4gIGxldCB1cGRhdGVVaUludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgIGNvbnN0IGVsZW1lbnQgPSA8SFRNTERpdkVsZW1lbnQ+KFxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi55dHAtZG91YmxldGFwLXVpLWxlZ2FjeVwiKVxuICAgICk7XG4gICAgaWYgKGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9PSBcIlwiKSB7XG4gICAgICBsZXQgc3ViU3RyaW5nID0gdWlMYWJlbC5pbm5lckhUTUwuc3Vic3RyaW5nKDIpO1xuICAgICAgdWlMYWJlbC5pbm5lckhUTUwgPSBzcGVlZCArIFwiIFwiICsgc3ViU3RyaW5nO1xuICAgICAgdWlMYWJlbC5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgIGNsZWFySW50ZXJ2YWwodXBkYXRlVWlJbnRlcnZhbCk7XG4gICAgfVxuICB9LCAxMCk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9