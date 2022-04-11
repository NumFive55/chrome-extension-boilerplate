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
    if (pref.includes("testFeature") && currentPage === "home")
        testFeature();
    if (pref.includes("testFeatureTwo") && currentPage === "video")
        testFeatureTwo();
}
function testFeature() {
    console.log("test feature one");
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9jb250ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQSxpREFBaUQ7QUFDakQseUNBQXlDO0FBQ3pDLGdEQUFnRDtBQUNoRCxtQ0FBbUM7QUFDbkMsOERBQThEO0FBQzlELFFBQVE7QUFDUixRQUFRO0FBQ1IsTUFBTTs7Ozs7Ozs7OztBQUVOLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNsQixJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7QUFDeEIsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztBQUNqQyxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDckIsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDO0FBRTNCLElBQUksZ0JBQWdCLENBQUMsR0FBRyxF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TyxJQUFJLFNBQVMsRUFBRTtvQkFDeEIsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDO29CQUN0RCxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLHlCQUF5QixDQUFDLENBQUM7b0JBQy9ELE1BQU0sS0FBSyxHQUFZLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzVDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUM3QixLQUFLLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQ3hDLFlBQVksRUFDWiw4REFBOEQsQ0FDL0QsQ0FBQztvQkFDRixRQUFRLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUMvRCxTQUFTLEVBQUUsQ0FBQztpQkFDYjthQUNGO1NBQ0Y7YUFBTSxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7WUFDekIsVUFBVSxHQUFHLENBQUMsQ0FBQztTQUNoQjtLQUNGO0FBQ0gsQ0FBQztBQUVELFNBQVMsU0FBUztJQUNoQixLQUFLLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztJQUM5QixNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFO1FBQ2hDLElBQUksS0FBSyxDQUFDLFdBQVcsR0FBRyxPQUFPLElBQUksVUFBVSxFQUFFO1lBQzdDLEtBQUssQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO1NBQy9CO2FBQU0sSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUN0QixhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDekI7SUFDSCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVCxDQUFDIiwiZmlsZSI6ImNvbnRlbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9hcHAvY29udGVudC50c1wiKTtcbiIsIi8vIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHt9LCAocmVzcG9uc2UpID0+IHtcbi8vICAgdmFyIGNoZWNrUmVhZHkgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4vLyAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIikge1xuLy8gICAgICAgY2xlYXJJbnRlcnZhbChjaGVja1JlYWR5KTtcbi8vICAgICAgIGNvbnNvbGUubG9nKFwiV2UncmUgaW4gdGhlIGluamVjdGVkIGNvbnRlbnQgc2NyaXB0IVwiKTtcbi8vICAgICB9XG4vLyAgIH0pO1xuLy8gfSk7XG5cbmxldCBmZWF0dXJlcyA9IFtdO1xubGV0IGFjdGl2ZUZlYXR1cmVzID0gW107XG5sZXQgcGF0aE5hbWUgPSBsb2NhdGlvbi5wYXRobmFtZTtcbmxldCBjdXJyZW50UGFnZSA9IFwiXCI7XG5sZXQgY2hyb21lQ29udHJvbHMgPSBmYWxzZTtcblxubmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICBjb25zdCB1cmwgPSBsb2NhdGlvbi5wYXRobmFtZTtcbiAgaWYgKHVybCAhPT0gcGF0aE5hbWUpIHtcbiAgICBwYXRoTmFtZSA9IHVybDtcbiAgICBjaGVja1BhZ2UoKTtcbiAgICBydW5GZWF0dXJlcyhhY3RpdmVGZWF0dXJlcyk7XG4gIH1cbn0pLm9ic2VydmUoZG9jdW1lbnQsIHsgc3VidHJlZTogdHJ1ZSwgY2hpbGRMaXN0OiB0cnVlIH0pO1xuXG5uZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gIGNvbnN0IHZpZGVvQ29udHJvbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnl0cC1jaHJvbWUtY29udHJvbHNcIik7XG4gIGlmICh2aWRlb0NvbnRyb2xzKSB7XG4gICAgY2hyb21lQ29udHJvbHMgPSB0cnVlO1xuICB9XG59KS5vYnNlcnZlKGRvY3VtZW50LCB7IHN1YnRyZWU6IHRydWUsIGNoaWxkTGlzdDogdHJ1ZSB9KTtcblxuZnVuY3Rpb24gY2hlY2tQYWdlKCkge1xuICBzd2l0Y2ggKHBhdGhOYW1lKSB7XG4gICAgY2FzZSBcIi9cIjpcbiAgICAgIGNvbnNvbGUubG9nKFwieW91dHViZSBob21lXCIpO1xuICAgICAgY3VycmVudFBhZ2UgPSBcImhvbWVcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCIvd2F0Y2hcIjpcbiAgICAgIGNvbnNvbGUubG9nKFwid2F0Y2hpbmcgdmlkZW9cIik7XG4gICAgICBjdXJyZW50UGFnZSA9IFwidmlkZW9cIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCIvZmVlZC9leHBsb3JlXCI6XG4gICAgICBjb25zb2xlLmxvZyhcImV4cGxvcmUgcGFnZVwiKTtcbiAgICAgIGN1cnJlbnRQYWdlID0gXCJleHBsb3JlXCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiL2ZlZWQvc3Vic2NyaXB0aW9uc1wiOlxuICAgICAgY29uc29sZS5sb2coXCJzdWJzY3JpcHRpb25zXCIpO1xuICAgICAgY3VycmVudFBhZ2UgPSBcInN1YnNjcmlwdGlvbnNcIjtcbiAgICAgIGJyZWFrO1xuICB9XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsIChldmVudCkgPT4ge1xuICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgY2hlY2tQYWdlKCk7XG4gICAgcnVuRmVhdHVyZXMoYWN0aXZlRmVhdHVyZXMpO1xuICB9XG59KTtcblxuZnVuY3Rpb24gZ2V0QWN0aXZlRmVhdHVyZUxpc3QoKSB7XG4gIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFwiZmVhdHVyZUxpc3RcIiwgKHJlc3VsdCkgPT4ge1xuICAgIGNvbnN0IGZlYXR1cmVPYmplY3QgPSByZXN1bHQuZmVhdHVyZUxpc3Q7XG4gICAgZmVhdHVyZU9iamVjdC5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBmZWF0dXJlcy5wdXNoKHsgaWQ6IGVsZW1lbnQuaWQsIG9uOiBlbGVtZW50LmNoZWNrZWQgfSk7XG4gICAgICBpZiAoZWxlbWVudC5jaGVja2VkKSB7XG4gICAgICAgIGFjdGl2ZUZlYXR1cmVzLnB1c2goZWxlbWVudC5pZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5nZXRBY3RpdmVGZWF0dXJlTGlzdCgpO1xuXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKGNoYW5nZXMsIGFyZWEpIHtcbiAgZ2V0QWN0aXZlRmVhdHVyZUxpc3QoKTtcbn0pO1xuXG5mdW5jdGlvbiBydW5GZWF0dXJlcyhwcmVmKSB7XG4gIGlmIChwcmVmLmluY2x1ZGVzKFwidGVzdEZlYXR1cmVcIikgJiYgY3VycmVudFBhZ2UgPT09IFwiaG9tZVwiKSB0ZXN0RmVhdHVyZSgpO1xuICBpZiAocHJlZi5pbmNsdWRlcyhcInRlc3RGZWF0dXJlVHdvXCIpICYmIGN1cnJlbnRQYWdlID09PSBcInZpZGVvXCIpXG4gICAgdGVzdEZlYXR1cmVUd28oKTtcbn1cblxuZnVuY3Rpb24gdGVzdEZlYXR1cmUoKSB7XG4gIGNvbnNvbGUubG9nKFwidGVzdCBmZWF0dXJlIG9uZVwiKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdGVzdEZlYXR1cmVUd28oKSB7XG4gIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgIGlmIChjaHJvbWVDb250cm9scykge1xuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICBjb25zdCB2b2x1bWVBcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi55dHAtdm9sdW1lLWFyZWFcIik7XG5cbiAgICAgIHZvbHVtZUFyZWEuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgICAgICBcImFmdGVyZW5kXCIsXG4gICAgICAgICc8YnV0dG9uIGlkPVwieWVzLWxvb3AtYnV0dG9uXCI+TE9PUDwvYnV0dG9uPidcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHllc0xvb3BCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInllcy1sb29wLWJ1dHRvblwiKTtcbiAgICAgIHllc0xvb3BCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG1hbmFnZUxvb3ApO1xuICAgIH1cbiAgfSwgNTAwKTtcbn1cblxuLy8gSGVscGVyIEZ1bmN0aW9uc1xubGV0IHN0YXJ0VGltZTtcbmxldCBlbmRUaW1lO1xubGV0IGNsaWNrQ291bnQgPSAwO1xubGV0IHZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInZpZGVvXCIpO1xubGV0IGFjdGl2ZUxvb3AgPSBmYWxzZTtcblxuZnVuY3Rpb24gbWFuYWdlTG9vcCgpIHtcbiAgaWYgKCFhY3RpdmVMb29wKSB7XG4gICAgYWN0aXZlTG9vcCA9IHRydWU7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNhcHR1cmVMb29wKTtcbiAgfSBlbHNlIHtcbiAgICBhY3RpdmVMb29wID0gZmFsc2U7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNhcHR1cmVMb29wKTtcbiAgICBzdGFydFRpbWUgPSBudWxsO1xuICAgIGVuZFRpbWUgPSBudWxsO1xuICAgIGNsaWNrQ291bnQgPSAwO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYUxvb3BcIikucmVtb3ZlKCk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5iTG9vcFwiKS5yZW1vdmUoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjYXB0dXJlTG9vcChlKSB7XG4gIGxldCBvYmplY3RDbGlja2VkID0gPEhUTUxEaXZFbGVtZW50PmUudGFyZ2V0O1xuICBsZXQgY2xpY2tlZE9iamVjdENsYXNzZXMgPSBvYmplY3RDbGlja2VkLmNsYXNzTGlzdDtcblxuICBpZiAoY2xpY2tlZE9iamVjdENsYXNzZXMudmFsdWUuaW5jbHVkZXMoXCJ5dHAtcHJvZ3Jlc3MtYmFyXCIpKSB7XG4gICAgY2xpY2tDb3VudCsrO1xuICAgIGlmIChjbGlja0NvdW50IDw9IDIpIHtcbiAgICAgIGlmIChjbGlja0NvdW50ID09IDEpIHtcbiAgICAgICAgaWYgKHN0YXJ0VGltZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBzdGFydFRpbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidmlkZW9cIikuY3VycmVudFRpbWU7XG4gICAgICAgICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIueXRwLXNjcnViYmVyLWNvbnRhaW5lclwiKTtcbiAgICAgICAgICBjb25zdCBjbG9uZSA9IDxFbGVtZW50Pm5vZGUuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgIGNsb25lLmNsYXNzTGlzdC5hZGQoXCJhTG9vcFwiKTtcbiAgICAgICAgICBjbG9uZS5maXJzdEVsZW1lbnRDaGlsZC5pbnNlcnRBZGphY2VudEhUTUwoXG4gICAgICAgICAgICBcImFmdGVyYmVnaW5cIixcbiAgICAgICAgICAgIFwiPHNwYW4gc3R5bGU9J21hcmdpbi1sZWZ0OiAzLjVweDsgZm9udC13ZWlnaHQ6IDcwMDsnPkE8L3NwYW4+XCJcbiAgICAgICAgICApO1xuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIueXRwLXByb2dyZXNzLWJhclwiKS5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNsaWNrQ291bnQgPT0gMikge1xuICAgICAgICBpZiAoZW5kVGltZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBlbmRUaW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInZpZGVvXCIpLmN1cnJlbnRUaW1lO1xuICAgICAgICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnl0cC1zY3J1YmJlci1jb250YWluZXJcIik7XG4gICAgICAgICAgY29uc3QgY2xvbmUgPSA8RWxlbWVudD5ub2RlLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICBjbG9uZS5jbGFzc0xpc3QuYWRkKFwiYkxvb3BcIik7XG4gICAgICAgICAgY2xvbmUuZmlyc3RFbGVtZW50Q2hpbGQuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgICAgICAgICAgXCJhZnRlcmJlZ2luXCIsXG4gICAgICAgICAgICBcIjxzcGFuIHN0eWxlPSdtYXJnaW4tbGVmdDogMy41cHg7IGZvbnQtd2VpZ2h0OiA3MDA7Jz5CPC9zcGFuPlwiXG4gICAgICAgICAgKTtcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnl0cC1wcm9ncmVzcy1iYXJcIikuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICAgIHN0YXJ0TG9vcCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjbGlja0NvdW50ID4gMikge1xuICAgICAgY2xpY2tDb3VudCA9IDA7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHN0YXJ0TG9vcCgpIHtcbiAgdmlkZW8uY3VycmVudFRpbWUgPSBzdGFydFRpbWU7XG4gIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgIGlmICh2aWRlby5jdXJyZW50VGltZSA+IGVuZFRpbWUgJiYgYWN0aXZlTG9vcCkge1xuICAgICAgdmlkZW8uY3VycmVudFRpbWUgPSBzdGFydFRpbWU7XG4gICAgfSBlbHNlIGlmICghYWN0aXZlTG9vcCkge1xuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgfVxuICB9LCAxMCk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9