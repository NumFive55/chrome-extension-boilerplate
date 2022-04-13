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
        runFeatures(activeFeatures);
    }
});
// CHROME STORAGE
// Gets active feature list of Chrome Storage
function getActiveFeatureList() {
    chrome.storage.sync.get("featureList", (result) => {
        const featureObject = result.featureList;
        featureObject.forEach((element) => {
            features.push({
                id: element.id,
                on: element.checked,
                skipSpeed: element.skipSpeed,
            });
            if (element.checked) {
                activeFeatures.push(element);
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
    // ADD A FOR EACH HERE
    // then for each pref do .includes(id)
    pref.forEach((feature) => {
        if (feature.id === "testFeature" && currentPage === "video")
            testFeature();
        if (feature.id === "testFeatureTwo" && currentPage === "video")
            testFeatureTwo();
    });
}
// FEATURE FUNCTIONS
function testFeature() {
    console.log("Skip speed on!");
    document.addEventListener("keydown", skipSpeed);
}
function testFeatureTwo() {
    return __awaiter(this, void 0, void 0, function* () {
        const interval = setInterval(() => {
            if (chromeControls) {
                clearInterval(interval);
                const volumeArea = document.querySelector(".ytp-volume-area");
                volumeArea.insertAdjacentHTML("afterend", '<button id="yes-loop-button">LOOP</button>');
                const yesLoopButton = document.getElementById("yes-loop-button");
                yesLoopButton.addEventListener("click", manageLoop);
            }
        }, 500);
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
    const skipSpeed = Number(activeFeatures.find((elem) => elem.skipSpeed).skipSpeed);
    let video = document.querySelector("video");
    let skipString = document.querySelector(".ytp-doubletap-tooltip-label").innerHTML;
    let skipSubstring = document
        .querySelector(".ytp-doubletap-tooltip-label")
        .innerHTML.substring(2);
    let newSubstring = skipSpeed + " " + skipSubstring;
    console.log(newSubstring);
    console.log(skipSpeed);
    if (evt.keyCode == 39) {
        console.log("right arrow key");
        video.currentTime = video.currentTime + skipSpeed - 5;
        skipString = newSubstring;
    }
    else if (evt.keyCode == 37) {
        console.log("left arrow key");
        video.currentTime = video.currentTime + skipSpeed + 5;
        skipString = newSubstring;
    }
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9jb250ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQSxpREFBaUQ7QUFDakQseUNBQXlDO0FBQ3pDLGdEQUFnRDtBQUNoRCxtQ0FBbUM7QUFDbkMsOERBQThEO0FBQzlELFFBQVE7QUFDUixRQUFRO0FBQ1IsTUFBTTs7Ozs7Ozs7OztBQUVOLG1CQUFtQjtBQUNuQixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbEIsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7QUFDakMsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQztBQUUzQixPQUFPLENBQUMs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QUFDLENBQUM7UUFDL0IsS0FBSyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDdEQsVUFBVSxHQUFHLFlBQVksQ0FBQztLQUMzQjtTQUFNLElBQUksR0FBRyxDQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUU7UUFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzlCLEtBQUssQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ3RELFVBQVUsR0FBRyxZQUFZLENBQUM7S0FDM0I7QUFDSCxDQUFDIiwiZmlsZSI6ImNvbnRlbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9hcHAvY29udGVudC50c1wiKTtcbiIsIi8vIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHt9LCAocmVzcG9uc2UpID0+IHtcbi8vICAgdmFyIGNoZWNrUmVhZHkgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4vLyAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIikge1xuLy8gICAgICAgY2xlYXJJbnRlcnZhbChjaGVja1JlYWR5KTtcbi8vICAgICAgIGNvbnNvbGUubG9nKFwiV2UncmUgaW4gdGhlIGluamVjdGVkIGNvbnRlbnQgc2NyaXB0IVwiKTtcbi8vICAgICB9XG4vLyAgIH0pO1xuLy8gfSk7XG5cbi8vIEdsb2JhbCB2YXJpYWJsZXNcbmxldCBmZWF0dXJlcyA9IFtdO1xubGV0IGFjdGl2ZUZlYXR1cmVzID0gW107XG5sZXQgcGF0aE5hbWUgPSBsb2NhdGlvbi5wYXRobmFtZTtcbmxldCBjdXJyZW50UGFnZSA9IFwiXCI7XG5sZXQgY2hyb21lQ29udHJvbHMgPSBmYWxzZTtcblxuY29uc29sZS5sb2coYWN0aXZlRmVhdHVyZXMpO1xuXG4vLyBMSVNURU5FUlNcblxuLy8gTGlzdGVucyBmb3IgcGFnZSBjaGFuZ2Vcbm5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgY29uc3QgdXJsID0gbG9jYXRpb24ucGF0aG5hbWU7XG4gIGlmICh1cmwgIT09IHBhdGhOYW1lKSB7XG4gICAgcGF0aE5hbWUgPSB1cmw7XG4gICAgY2hlY2tQYWdlKCk7XG4gICAgcnVuRmVhdHVyZXMoYWN0aXZlRmVhdHVyZXMpO1xuICB9XG59KS5vYnNlcnZlKGRvY3VtZW50LCB7IHN1YnRyZWU6IHRydWUsIGNoaWxkTGlzdDogdHJ1ZSB9KTtcblxuLy8gTGlzdGVucyBmb3IgQ2hyb21lIENvbnRyb2xzIHRvIGFwcGVhciAoaWUuIGJ1dHRvbiBiYXIgb24gdmlkZW8pXG5uZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gIGNvbnN0IHZpZGVvQ29udHJvbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnl0cC1jaHJvbWUtY29udHJvbHNcIik7XG4gIGlmICh2aWRlb0NvbnRyb2xzKSB7XG4gICAgY2hyb21lQ29udHJvbHMgPSB0cnVlO1xuICB9XG59KS5vYnNlcnZlKGRvY3VtZW50LCB7IHN1YnRyZWU6IHRydWUsIGNoaWxkTGlzdDogdHJ1ZSB9KTtcblxuLy8gQ2hlY2tzIHdoYXQgcGFnZSB1c2VyIGlzIG9uIGFuZCBzZXRzIGN1cnJlbnRQYWdlXG5mdW5jdGlvbiBjaGVja1BhZ2UoKSB7XG4gIHN3aXRjaCAocGF0aE5hbWUpIHtcbiAgICBjYXNlIFwiL1wiOlxuICAgICAgY29uc29sZS5sb2coXCJ5b3V0dWJlIGhvbWVcIik7XG4gICAgICBjdXJyZW50UGFnZSA9IFwiaG9tZVwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIi93YXRjaFwiOlxuICAgICAgY29uc29sZS5sb2coXCJ3YXRjaGluZyB2aWRlb1wiKTtcbiAgICAgIGN1cnJlbnRQYWdlID0gXCJ2aWRlb1wiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIi9mZWVkL2V4cGxvcmVcIjpcbiAgICAgIGNvbnNvbGUubG9nKFwiZXhwbG9yZSBwYWdlXCIpO1xuICAgICAgY3VycmVudFBhZ2UgPSBcImV4cGxvcmVcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCIvZmVlZC9zdWJzY3JpcHRpb25zXCI6XG4gICAgICBjb25zb2xlLmxvZyhcInN1YnNjcmlwdGlvbnNcIik7XG4gICAgICBjdXJyZW50UGFnZSA9IFwic3Vic2NyaXB0aW9uc1wiO1xuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuLy8gV2FpdHMgZm9yIHBhZ2UgdG8gbG9hZCB0aGVuIHJ1bnMgZmVhdHVyZXNcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsIChldmVudCkgPT4ge1xuICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgY2hlY2tQYWdlKCk7XG4gICAgcnVuRmVhdHVyZXMoYWN0aXZlRmVhdHVyZXMpO1xuICB9XG59KTtcblxuLy8gQ0hST01FIFNUT1JBR0VcblxuLy8gR2V0cyBhY3RpdmUgZmVhdHVyZSBsaXN0IG9mIENocm9tZSBTdG9yYWdlXG5mdW5jdGlvbiBnZXRBY3RpdmVGZWF0dXJlTGlzdCgpIHtcbiAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoXCJmZWF0dXJlTGlzdFwiLCAocmVzdWx0KSA9PiB7XG4gICAgY29uc3QgZmVhdHVyZU9iamVjdCA9IHJlc3VsdC5mZWF0dXJlTGlzdDtcbiAgICBmZWF0dXJlT2JqZWN0LmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGZlYXR1cmVzLnB1c2goe1xuICAgICAgICBpZDogZWxlbWVudC5pZCxcbiAgICAgICAgb246IGVsZW1lbnQuY2hlY2tlZCxcbiAgICAgICAgc2tpcFNwZWVkOiBlbGVtZW50LnNraXBTcGVlZCxcbiAgICAgIH0pO1xuICAgICAgaWYgKGVsZW1lbnQuY2hlY2tlZCkge1xuICAgICAgICBhY3RpdmVGZWF0dXJlcy5wdXNoKGVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuZ2V0QWN0aXZlRmVhdHVyZUxpc3QoKTtcblxuLy8gTGlzdGVucyBmb3IgY2hhbmdlIGluIENocm9tZSBTdG9yYWdlXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKGNoYW5nZXMsIGFyZWEpIHtcbiAgZ2V0QWN0aXZlRmVhdHVyZUxpc3QoKTtcbn0pO1xuXG4vLyBSVU4gRkVBVFVSRVNcbi8vIEZlYXR1cmVzIGNoZWNrIGlmOlxuLy8gMSkgTmFtZSBvZiBmZWF0dXJlIGlzIGluY2x1ZGVkIGluIGFjdGl2ZSBmZWF0dXJlc1xuLy8gMikgVGhhdCB0aGUgY3VycmVudFBhZ2UgaXMgc2V0IHRvIHRoZSBwYWdlIHRoZSBmZWF0dXJlIHNob3VsZCBydW4gb25cbi8vIDMpICpFVkVOVFVBTExZKiBDaGVja3MgaWYgZmVhdHVyZSBpcyBmb3IgZnJlZSBvciBwYWlkIHVzZXJzXG5mdW5jdGlvbiBydW5GZWF0dXJlcyhwcmVmKSB7XG4gIGNvbnNvbGUubG9nKHByZWYpO1xuICAvLyBBREQgQSBGT1IgRUFDSCBIRVJFXG4gIC8vIHRoZW4gZm9yIGVhY2ggcHJlZiBkbyAuaW5jbHVkZXMoaWQpXG4gIHByZWYuZm9yRWFjaCgoZmVhdHVyZSkgPT4ge1xuICAgIGlmIChmZWF0dXJlLmlkID09PSBcInRlc3RGZWF0dXJlXCIgJiYgY3VycmVudFBhZ2UgPT09IFwidmlkZW9cIikgdGVzdEZlYXR1cmUoKTtcbiAgICBpZiAoZmVhdHVyZS5pZCA9PT0gXCJ0ZXN0RmVhdHVyZVR3b1wiICYmIGN1cnJlbnRQYWdlID09PSBcInZpZGVvXCIpXG4gICAgICB0ZXN0RmVhdHVyZVR3bygpO1xuICB9KTtcbn1cblxuLy8gRkVBVFVSRSBGVU5DVElPTlNcblxuZnVuY3Rpb24gdGVzdEZlYXR1cmUoKSB7XG4gIGNvbnNvbGUubG9nKFwiU2tpcCBzcGVlZCBvbiFcIik7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHNraXBTcGVlZCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHRlc3RGZWF0dXJlVHdvKCkge1xuICBjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICBpZiAoY2hyb21lQ29udHJvbHMpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgY29uc3Qgdm9sdW1lQXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIueXRwLXZvbHVtZS1hcmVhXCIpO1xuXG4gICAgICB2b2x1bWVBcmVhLmluc2VydEFkamFjZW50SFRNTChcbiAgICAgICAgXCJhZnRlcmVuZFwiLFxuICAgICAgICAnPGJ1dHRvbiBpZD1cInllcy1sb29wLWJ1dHRvblwiPkxPT1A8L2J1dHRvbj4nXG4gICAgICApO1xuXG4gICAgICBjb25zdCB5ZXNMb29wQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ5ZXMtbG9vcC1idXR0b25cIik7XG4gICAgICB5ZXNMb29wQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBtYW5hZ2VMb29wKTtcbiAgICB9XG4gIH0sIDUwMCk7XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcblxuLy8gSGVscGVyIHZhcmlhYmxlc1xubGV0IHN0YXJ0VGltZTtcbmxldCBlbmRUaW1lO1xubGV0IGNsaWNrQ291bnQgPSAwO1xubGV0IHZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInZpZGVvXCIpO1xubGV0IGFjdGl2ZUxvb3AgPSBmYWxzZTtcblxuZnVuY3Rpb24gbWFuYWdlTG9vcCgpIHtcbiAgaWYgKCFhY3RpdmVMb29wKSB7XG4gICAgYWN0aXZlTG9vcCA9IHRydWU7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNhcHR1cmVMb29wKTtcbiAgfSBlbHNlIHtcbiAgICBhY3RpdmVMb29wID0gZmFsc2U7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNhcHR1cmVMb29wKTtcbiAgICBzdGFydFRpbWUgPSBudWxsO1xuICAgIGVuZFRpbWUgPSBudWxsO1xuICAgIGNsaWNrQ291bnQgPSAwO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYUxvb3BcIikucmVtb3ZlKCk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5iTG9vcFwiKS5yZW1vdmUoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjYXB0dXJlTG9vcChlKSB7XG4gIGxldCBvYmplY3RDbGlja2VkID0gPEhUTUxEaXZFbGVtZW50PmUudGFyZ2V0O1xuICBsZXQgY2xpY2tlZE9iamVjdENsYXNzZXMgPSBvYmplY3RDbGlja2VkLmNsYXNzTGlzdDtcblxuICBpZiAoY2xpY2tlZE9iamVjdENsYXNzZXMudmFsdWUuaW5jbHVkZXMoXCJ5dHAtcHJvZ3Jlc3MtYmFyXCIpKSB7XG4gICAgY2xpY2tDb3VudCsrO1xuICAgIGlmIChjbGlja0NvdW50IDw9IDIpIHtcbiAgICAgIGlmIChjbGlja0NvdW50ID09IDEpIHtcbiAgICAgICAgaWYgKHN0YXJ0VGltZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBzdGFydFRpbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidmlkZW9cIikuY3VycmVudFRpbWU7XG4gICAgICAgICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIueXRwLXNjcnViYmVyLWNvbnRhaW5lclwiKTtcbiAgICAgICAgICBjb25zdCBjbG9uZSA9IDxFbGVtZW50Pm5vZGUuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgIGNsb25lLmNsYXNzTGlzdC5hZGQoXCJhTG9vcFwiKTtcbiAgICAgICAgICBjbG9uZS5maXJzdEVsZW1lbnRDaGlsZC5pbnNlcnRBZGphY2VudEhUTUwoXG4gICAgICAgICAgICBcImFmdGVyYmVnaW5cIixcbiAgICAgICAgICAgIFwiPHNwYW4gc3R5bGU9J21hcmdpbi1sZWZ0OiAzLjVweDsgZm9udC13ZWlnaHQ6IDcwMDsnPkE8L3NwYW4+XCJcbiAgICAgICAgICApO1xuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIueXRwLXByb2dyZXNzLWJhclwiKS5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNsaWNrQ291bnQgPT0gMikge1xuICAgICAgICBpZiAoZW5kVGltZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBlbmRUaW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInZpZGVvXCIpLmN1cnJlbnRUaW1lO1xuICAgICAgICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnl0cC1zY3J1YmJlci1jb250YWluZXJcIik7XG4gICAgICAgICAgY29uc3QgY2xvbmUgPSA8RWxlbWVudD5ub2RlLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICBjbG9uZS5jbGFzc0xpc3QuYWRkKFwiYkxvb3BcIik7XG4gICAgICAgICAgY2xvbmUuZmlyc3RFbGVtZW50Q2hpbGQuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgICAgICAgICAgXCJhZnRlcmJlZ2luXCIsXG4gICAgICAgICAgICBcIjxzcGFuIHN0eWxlPSdtYXJnaW4tbGVmdDogMy41cHg7IGZvbnQtd2VpZ2h0OiA3MDA7Jz5CPC9zcGFuPlwiXG4gICAgICAgICAgKTtcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnl0cC1wcm9ncmVzcy1iYXJcIikuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICAgIHN0YXJ0TG9vcCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjbGlja0NvdW50ID4gMikge1xuICAgICAgY2xpY2tDb3VudCA9IDA7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHN0YXJ0TG9vcCgpIHtcbiAgdmlkZW8uY3VycmVudFRpbWUgPSBzdGFydFRpbWU7XG4gIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgIGlmICh2aWRlby5jdXJyZW50VGltZSA+IGVuZFRpbWUgJiYgYWN0aXZlTG9vcCkge1xuICAgICAgdmlkZW8uY3VycmVudFRpbWUgPSBzdGFydFRpbWU7XG4gICAgfSBlbHNlIGlmICghYWN0aXZlTG9vcCkge1xuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgfVxuICB9LCAxMCk7XG59XG5cbmZ1bmN0aW9uIHNraXBTcGVlZChldnQpIHtcbiAgY29uc3Qgc2tpcFNwZWVkID0gTnVtYmVyKFxuICAgIGFjdGl2ZUZlYXR1cmVzLmZpbmQoKGVsZW0pID0+IGVsZW0uc2tpcFNwZWVkKS5za2lwU3BlZWRcbiAgKTtcbiAgbGV0IHZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInZpZGVvXCIpO1xuICBsZXQgc2tpcFN0cmluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgXCIueXRwLWRvdWJsZXRhcC10b29sdGlwLWxhYmVsXCJcbiAgKS5pbm5lckhUTUw7XG4gIGxldCBza2lwU3Vic3RyaW5nID0gZG9jdW1lbnRcbiAgICAucXVlcnlTZWxlY3RvcihcIi55dHAtZG91YmxldGFwLXRvb2x0aXAtbGFiZWxcIilcbiAgICAuaW5uZXJIVE1MLnN1YnN0cmluZygyKTtcbiAgbGV0IG5ld1N1YnN0cmluZyA9IHNraXBTcGVlZCArIFwiIFwiICsgc2tpcFN1YnN0cmluZztcblxuICBjb25zb2xlLmxvZyhuZXdTdWJzdHJpbmcpO1xuICBjb25zb2xlLmxvZyhza2lwU3BlZWQpO1xuICBpZiAoZXZ0LmtleUNvZGUgPT0gMzkpIHtcbiAgICBjb25zb2xlLmxvZyhcInJpZ2h0IGFycm93IGtleVwiKTtcbiAgICB2aWRlby5jdXJyZW50VGltZSA9IHZpZGVvLmN1cnJlbnRUaW1lICsgc2tpcFNwZWVkIC0gNTtcbiAgICBza2lwU3RyaW5nID0gbmV3U3Vic3RyaW5nO1xuICB9IGVsc2UgaWYgKGV2dC5rZXlDb2RlID09IDM3KSB7XG4gICAgY29uc29sZS5sb2coXCJsZWZ0IGFycm93IGtleVwiKTtcbiAgICB2aWRlby5jdXJyZW50VGltZSA9IHZpZGVvLmN1cnJlbnRUaW1lICsgc2tpcFNwZWVkICsgNTtcbiAgICBza2lwU3RyaW5nID0gbmV3U3Vic3RyaW5nO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9