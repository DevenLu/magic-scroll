/**
 * magic-scroll-native v0.0.1
 * (c) 2018-2019 WangYi7099
 * Released under the MIT License
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react-dom'), require('react')) :
	typeof define === 'function' && define.amd ? define(['react-dom', 'react'], factory) :
	(global['magic-scroll-native'] = factory(global.ReactDOM,global.react));
}(this, (function (ReactDom,React) { 'use strict';

// detect content size change
function listenResize(element, callback) {
  return injectObject(element, callback);
}

function injectObject(element, callback) {
  if (element.__resizeTrigger__) {
    return;
  }

  if (getComputedStyle(element).position === 'static') {
    element.style.position = 'relative'; // 将static改为relative
  }
  element.__resizeListener__ = e => {
    e.stopImmediatePropagation();
    e.preventDefault();
    callback();
    resetTrigger(element);
  };

  const resizeTrigger = element.__resizeTrigger__ = document.createElement('div');
  resizeTrigger.innerHTML = ` 
  <div class="expand-trigger">
    <div></div>
  </div>
  <div class="contract-trigger"></div> `;
  resizeTrigger.className = 'resize-triggers';
  element.appendChild(resizeTrigger);

  resetTrigger(element);
  const expand = getExpand(resizeTrigger);
  const contract = getContract(resizeTrigger);
  expand.addEventListener('scroll', element.__resizeListener__, true);
  contract.addEventListener('scroll', element.__resizeListener__, true);

  return element.removeResize = () => {
    // Remove
    element.removeEventListener('scroll', element.__resizeListener__, true);
    element.removeChild(element.__resizeTrigger__);
    element.__resizeListener__ = element.__resizeTrigger__ = null;
    delete element.removeResize;
  };
}

const resetTrigger = element => {
  const trigger = element.__resizeTrigger__;
  const expand = getExpand(trigger);
  const contract = getContract(trigger);
  const expandChild = expand.firstElementChild;
  contract.scrollLeft = contract.scrollWidth;
  contract.scrollTop = contract.scrollHeight;
  expandChild.style.width = expand.offsetWidth + 1 + 'px';
  expandChild.style.height = expand.offsetHeight + 1 + 'px';
  expand.scrollLeft = expand.scrollWidth;
  expand.scrollTop = expand.scrollHeight;
};

const getExpand = elm => {
  return elm.firstElementChild;
};
const getContract = elm => {
  return elm.lastElementChild;
};

/**
 * Get a html element from a component.
 */
const getDom = ref => {
    if (!ref) {
        return null;
    }
    const _realDom = ReactDom.findDOMNode(ref);
    return _realDom;
};
/**
 * Deep merge from tow objects
 */
// export function merge(source: any, dest: any) {}
/**
 * Add or remove a event listener
 */
const eventOnOff = (dom, eventName, hander, capture, type = 'on') => {
    type == 'on' ? dom.addEventListener(eventName, hander, capture) : dom.removeEventListener(eventName, hander, capture);
};
/**
 * If value is a percent, convert it to a numeric one.
 * such as:
 * 85% -> size * 0.85
 */
function normalizeSize(size, amount) {
    let number = /(-?\d+(?:\.\d+?)?)%$/.exec(size + '');
    if (!number) {
        number = size - 0;
    } else {
        number = number[1] - 0;
        number = amount * number / 100;
    }
    return number;
}

/**
 * It is used to communication between HOC and wrapped component.
 */
// tslint:disable-next-line
const noop = () => {};
class Watcher {
    constructor(name = '', getter = noop) {
        this.name = name;
        this.getter = getter;
    }
    run(...args) {
        let rtn = this.getter.apply(this, args);
        if (!(rtn instanceof Promise)) {
            rtn = Promise.resolve(rtn);
        }
        return rtn;
    }
}
class Subscription {
    constructor() {
        this.watchers = [];
    }
    subscribe(eventName = null, getter) {
        this.watchers.push(new Watcher(eventName, getter));
    }
    notify(name = null, ...params) {
        const resArray = [];
        // tslint:disable-next-line
        for (let index = 0; index < this.watchers.length; index++) {
            const watcher = this.watchers[index];
            if (name === Subscription.All_WATCHERS || name === watcher.name) {
                resArray.push(watcher.run.apply(watcher, params));
            }
        }
        return Promise.all(resArray);
    }
    unsubscribe() {
        this.watchers = [];
    }
}
Subscription.All_WATCHERS = 'ALL_WATCHERS';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */





function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

/**
 * Normalize class name.
 */
const normalizeClass = (classOne, classTwo) => {
    classOne = classOne || [];
    classTwo = classTwo || [];
    if (!Array.isArray(classOne)) {
        classOne = classOne.replace(/\s+/g, ' ').split(' ');
    }
    if (!Array.isArray(classTwo)) {
        classTwo = classTwo.replace(/\s+/g, ' ').split(' ');
    }
    return classOne.concat(classTwo).join(' ');
};

/* ----------------- Type End -------------------------- */
class Panel extends React.PureComponent {
    render() {
        const _a = this.props,
              { renderPanel, children, className: cn } = _a,
              others = __rest(_a, ["renderPanel", "children", "className"]);
        const className = normalizeClass('__panel', cn);
        const style = {
            boxSizing: 'border-box',
            position: 'relative'
        };
        if (renderPanel) {
            return React.cloneElement(renderPanel(), Object.assign({ className,
                style }, others), children);
        } else {
            return React.createElement("div", Object.assign({ className: className, style: style }, others), children);
        }
    }
}
Panel.displayName = 'BasePanel';

function getPrefix(global) {
    let docStyle = document.documentElement.style;
    let engine;
    /* istanbul ignore if */
    if (global.opera && Object.prototype.toString.call(global.opera) === '[object Opera]') {
        engine = 'presto';
    } /* istanbul ignore next */
    else if ('MozAppearance' in docStyle) {
            engine = 'gecko';
        } else if ('WebkitAppearance' in docStyle) {
            engine = 'webkit';
        } /* istanbul ignore next */
        else if (typeof global.navigator.cpuClass === 'string') {
                engine = 'trident';
            }
    let vendorPrefix = {
        trident: 'ms',
        gecko: 'moz',
        webkit: 'webkit',
        presto: 'O'
    }[engine];
    return vendorPrefix;
}

/**
 * Get a style with a browser prefix
 */
function getComplitableStyle(property, value) {
    const compatibleValue = `-${getPrefix(window)}-${value}`;
    const testElm = document.createElement('div');
    testElm.style[property] = compatibleValue;
    if (testElm.style[property] == compatibleValue) {
        return compatibleValue;
    }
    /* istanbul ignore next */
    return false;
}
// Computed the bowser scrollbar gutter
let scrollBarWidth;
function getNativeScrollbarSize() {
    if (scrollBarWidth !== undefined) {
        return scrollBarWidth;
    }
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.position = 'absolute';
    outer.style.top = '-9999px';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    const { offsetWidth, clientWidth } = outer;
    scrollBarWidth = offsetWidth - clientWidth;
    document.body.removeChild(outer);
    return scrollBarWidth;
}

function cached(fn) {
    const cache = Object.create(null);
    return function cachedFn(str) {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    };
}
const capitalize = cached(str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
});

class View extends React.PureComponent {
    constructor(props) {
        super(props);
        // bind internal methods
        this._handleScroll = this._handleScroll.bind(this);
        this.subscription = new Subscription();
    }
    render() {
        const { children, barsState, renderView, renderPanel, barPos, scrollingX, scrollingY } = this.props;
        const style = {
            height: '100%'
        };
        const className = ['__native'];
        style.overflowY = !scrollingY ? 'hidden' : barsState.vBar.size ? 'scroll' : '';
        style.overflowX = !scrollingX ? 'hidden' : barsState.hBar.size ? 'scroll' : '';
        // Add gutter for hiding native bar
        let gutter = getNativeScrollbarSize();
        if (!gutter) {
            className.push('__hidebar');
        } else {
            if (barsState.vBar.size) {
                style[`margin${capitalize(barPos)}`] = `-${gutter}px`;
            }
            if (barsState.hBar.size) {
                style.height = `calc(100% + ${gutter}px)`;
            }
        }
        const viewStyle = {
            position: 'relative',
            boxSizing: 'border-box',
            minHeight: '100%',
            minWidth: '100%'
        };
        const widthStyle = getComplitableStyle('width', 'fit-content');
        if (widthStyle) {
            viewStyle.width = widthStyle;
        }
        let view;
        if (renderView) {
            view = React.cloneElement(renderView(this.props), {
                className: '__view',
                ref: 'view',
                style: viewStyle
            }, children);
        } else {
            view = React.createElement("div", { className: "__view", ref: "view", style: viewStyle }, children);
        }
        return React.createElement(Panel, { className: className, ref: "panel", style: style, renderPanel: renderPanel }, view);
    }
    componentDidMount() {
        this._refresh();
        this._addEvent();
    }
    componentWillUnmount() {
        this.subscription.notify(View.unmount_key);
        this.subscription.unsubscribe();
    }
    componentDidUpdate() {
        this._refresh();
    }
    /** Internal Medthds */
    _handleScroll(e) {
        console.log('handle scrolling...');
        this.props.handleScroll(e);
    }
    _detectResize(element) {
        if (element.removeResize) {
            if (!this.props.resize) {
                element.removeResize();
            }
            return;
        }
        if (this.props.resize) {
            listenResize(element, this.props.handleResize);
            this.subscription.subscribe(View.unmount_key, element.removeResize);
        }
    }
    _refresh() {
        // Detect dom size resize
        this._detectResize(this.refs.view);
    }
    _addEvent() {
        const panelElm = getDom(this.refs.panel);
        eventOnOff(panelElm, 'scroll', this._handleScroll);
        this.subscription.subscribe(View.unmount_key, () => {
            eventOnOff(panelElm, 'scroll', this._handleScroll, false, 'off');
        });
    }
}
View.displayName = 'magic-scroll-panel-native';
/** trigger beofore component will unmount */
View.unmount_key = 'UNMOUNT_SUBSCRIBE';

/**
 *  Compatible to scroller's animation function
 */
function createEasingFunction(easing, easingPattern) {
  return function (time) {
    return easingPattern(easing, time);
  };
}

/**
 * Calculate the easing pattern
 * @link https://github.com/cferdinandi/smooth-scroll/blob/master/src/js/smooth-scroll.js
 * modified by wangyi7099
 * @param {String} type Easing pattern
 * @param {Number} time Time animation should take to complete
 * @returns {Number}
 */
function easingPattern(easing, time) {
  let pattern = null;
  /* istanbul ignore next */
  {
    // Default Easing Patterns
    if (easing === 'easeInQuad') pattern = time * time; // accelerating from zero velocity
    if (easing === 'easeOutQuad') pattern = time * (2 - time); // decelerating to zero velocity
    if (easing === 'easeInOutQuad') pattern = time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
    if (easing === 'easeInCubic') pattern = time * time * time; // accelerating from zero velocity
    if (easing === 'easeOutCubic') pattern = --time * time * time + 1; // decelerating to zero velocity
    if (easing === 'easeInOutCubic') pattern = time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
    if (easing === 'easeInQuart') pattern = time * time * time * time; // accelerating from zero velocity
    if (easing === 'easeOutQuart') pattern = 1 - --time * time * time * time; // decelerating to zero velocity
    if (easing === 'easeInOutQuart') pattern = time < 0.5 ? 8 * time * time * time * time : 1 - 8 * --time * time * time * time; // acceleration until halfway, then deceleration
    if (easing === 'easeInQuint') pattern = time * time * time * time * time; // accelerating from zero velocity
    if (easing === 'easeOutQuint') pattern = 1 + --time * time * time * time * time; // decelerating to zero velocity
    if (easing === 'easeInOutQuint') pattern = time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * --time * time * time * time * time; // acceleration until halfway, then deceleration
  }
  return pattern || time; // no easing, no acceleration
}

function requestAnimationFrame(global) {
  // Check for request animation Frame support
  var requestFrame = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame;
  var isNative = !!requestFrame;

  if (requestFrame && !/requestAnimationFrame\(\)\s*\{\s*\[native code\]\s*\}/i.test(requestFrame.toString())) {
    isNative = false;
  }

  if (isNative) {
    return function (callback, root) {
      requestFrame(callback, root);
    };
  }

  var TARGET_FPS = 60;
  var requests = {};
  var rafHandle = 1;
  var intervalHandle = null;
  var lastActive = +new Date();

  return function (callback) {
    var callbackHandle = rafHandle++;

    // Store callback
    requests[callbackHandle] = callback;

    // Create timeout at first request
    if (intervalHandle === null) {
      intervalHandle = setInterval(function () {
        var time = +new Date();
        var currentRequests = requests;

        // Reset data structure before executing callbacks
        requests = {};

        for (var key in currentRequests) {
          if (currentRequests.hasOwnProperty(key)) {
            currentRequests[key](time);
            lastActive = time;
          }
        }

        // Disable the timeout when nothing happens for a certain
        // period of time
        if (time - lastActive > 2500) {
          clearInterval(intervalHandle);
          intervalHandle = null;
        }
      }, 1000 / TARGET_FPS);
    }

    return callbackHandle;
  };
}

/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 *
 * Based on the work of: Unify Project (unify-project.org)
 * http://unify-project.org
 * Copyright 2011, Deutsche Telekom AG
 * License: MIT + Apache (V2)
 */

/**
 * Generic animation class with support for dropped frames both optional easing and duration.
 *
 * Optional duration is useful when the lifetime is defined by another condition than time
 * e.g. speed of an animating object, etc.
 *
 * Dropped frame logic allows to keep using the same updater logic independent from the actual
 * rendering. This eases a lot of cases where it might be pretty complex to break down a state
 * based on the pure time difference.
 */
var time = Date.now || function () {
  return +new Date();
};
var desiredFrames = 60;
var millisecondsPerSecond = 1000;
var running = {};
var counter = 1;

const core = { effect: {} };
let global = null;

if (typeof window !== 'undefined') {
  global = window;
} else {
  global = {};
}

core.effect.Animate = {
  /**
   * A requestAnimationFrame wrapper / polyfill.
   *
   * @param callback {Function} The callback to be invoked before the next repaint.
   * @param root {HTMLElement} The root element for the repaint
   */
  requestAnimationFrame: requestAnimationFrame(global),
  /**
   * Stops the given animation.
   *
   * @param id {Integer} Unique animation ID
   * @return {Boolean} Whether the animation was stopped (aka, was running before)
   */
  stop: function (id) {
    var cleared = running[id] != null;
    if (cleared) {
      running[id] = null;
    }

    return cleared;
  },

  /**
   * Whether the given animation is still running.
   *
   * @param id {Integer} Unique animation ID
   * @return {Boolean} Whether the animation is still running
   */
  isRunning: function (id) {
    return running[id] != null;
  },

  /**
   * Start the animation.
   *
   * @param stepCallback {Function} Pointer to function which is executed on every step.
   *   Signature of the method should be `function(percent, now, virtual) { return continueWithAnimation; }`
   * @param verifyCallback {Function} Executed before every animation step.
   *   Signature of the method should be `function() { return continueWithAnimation; }`
   * @param completedCallback {Function}
   *   Signature of the method should be `function(droppedFrames, finishedAnimation) {}`
   * @param duration {Integer} Milliseconds to run the animation
   * @param easingMethod {Function} Pointer to easing function
   *   Signature of the method should be `function(percent) { return modifiedValue; }`
   * @param root {Element ? document.body} Render root, when available. Used for internal
   *   usage of requestAnimationFrame.
   * @return {Integer} Identifier of animation. Can be used to stop it any time.
   */
  start: function (stepCallback, verifyCallback, completedCallback, duration, easingMethod, root) {
    var start = time();
    var lastFrame = start;
    var percent = 0;
    var dropCounter = 0;
    var id = counter++;

    if (!root) {
      root = document.body;
    }

    // Compacting running db automatically every few new animations
    if (id % 20 === 0) {
      var newRunning = {};
      for (var usedId in running) {
        newRunning[usedId] = true;
      }
      running = newRunning;
    }

    // This is the internal step method which is called every few milliseconds
    var step = function (virtual) {
      // Normalize virtual value
      var render = virtual !== true;

      // Get current time
      var now = time();

      // Verification is executed before next animation step
      if (!running[id] || verifyCallback && !verifyCallback(id)) {
        running[id] = null;
        completedCallback && completedCallback(desiredFrames - dropCounter / ((now - start) / millisecondsPerSecond), id, false);
        return;
      }

      // For the current rendering to apply let's update omitted steps in memory.
      // This is important to bring internal state variables up-to-date with progress in time.
      if (render) {
        var droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;
        for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
          step(true);
          dropCounter++;
        }
      }

      // Compute percent value
      if (duration) {
        percent = (now - start) / duration;
        if (percent > 1) {
          percent = 1;
        }
      }

      // Execute step callback, then...
      var value = easingMethod ? easingMethod(percent) : percent;
      if ((stepCallback(value, now, render) === false || percent === 1) && render) {
        running[id] = null;
        completedCallback && completedCallback(desiredFrames - dropCounter / ((now - start) / millisecondsPerSecond), id, percent === 1 || duration == null);
      } else if (render) {
        lastFrame = now;
        core.effect.Animate.requestAnimationFrame(step, root);
      }
    };

    // Mark as running
    running[id] = true;

    // Init first step
    core.effect.Animate.requestAnimationFrame(step, root);

    // Return unique animation ID
    return id;
  }
};

function smoothScroll(elm, deltaX, deltaY, speed, easing, scrollingComplete) {
  const startLocationY = elm.scrollTop;
  const startLocationX = elm.scrollLeft;
  let positionX = startLocationX;
  let positionY = startLocationY;
  /**
   * keep the limit of scroll delta.
   */
  /* istanbul ignore next */
  if (startLocationY + deltaY < 0) {
    deltaY = -startLocationY;
  }
  const scrollHeight = elm.scrollHeight;
  if (startLocationY + deltaY > scrollHeight) {
    deltaY = scrollHeight - startLocationY;
  }
  if (startLocationX + deltaX < 0) {
    deltaX = -startLocationX;
  }
  if (startLocationX + deltaX > elm.scrollWidth) {
    deltaX = elm.scrollWidth - startLocationX;
  }

  const easingMethod = createEasingFunction(easing, easingPattern);

  const stepCallback = percentage => {
    positionX = startLocationX + deltaX * percentage;
    positionY = startLocationY + deltaY * percentage;
    elm.scrollTop = Math.floor(positionY);
    elm.scrollLeft = Math.floor(positionX);
  };

  const verifyCallback = () => {
    return Math.abs(positionY - startLocationY) <= Math.abs(deltaY) || Math.abs(positionX - startLocationX) <= Math.abs(deltaX);
  };

  core.effect.Animate.start(stepCallback, verifyCallback, scrollingComplete, speed, easingMethod);
}

const map = {
    vertical: {
        size: 'height',
        opsSize: 'width',
        posName: 'top',
        opposName: 'bottom',
        sidePosName: 'right',
        page: 'pageY',
        scroll: 'scrollTop',
        scrollSize: 'scrollHeight',
        offset: 'offsetHeight',
        client: 'clientY',
        axis: 'Y',
        scrollButton: {
            start: 'top',
            end: 'bottom'
        }
    },
    horizontal: {
        size: 'width',
        opsSize: 'height',
        posName: 'left',
        opposName: 'right',
        sidePosName: 'bottom',
        page: 'pageX',
        scroll: 'scrollLeft',
        scrollSize: 'scrollWidth',
        offset: 'offsetWidth',
        client: 'clientX',
        axis: 'X',
        scrollButton: {
            start: 'left',
            end: 'right'
        }
    }
};

/**
 * Get a html element from a component.
 */
const getDom$1 = ref => {
    if (!ref) {
        return null;
    }
    const _realDom = ReactDom.findDOMNode(ref);
    return _realDom;
};
/**
 * Deep merge from tow objects
 */
// export function merge(source: any, dest: any) {}
/**
 * Add or remove a event listener
 */
const eventOnOff$1 = (dom, eventName, hander, capture, type = 'on') => {
    type == 'on' ? dom.addEventListener(eventName, hander, capture) : dom.removeEventListener(eventName, hander, capture);
};
/**
 * If value is a percent, convert it to a numeric one.
 * such as:
 * 85% -> size * 0.85
 */

function isMobile$1() {
    return 'ontouchstart' in window;
}


/**
 * Get a style with a browser prefix
 */

function cached$1(fn) {
    const cache = Object.create(null);
    return function cachedFn(str) {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    };
}

/* --------------- Type End ---------------- */
const rgbReg = /rgb\(/;
const extractRgbColor = /rgb\((.*)\)/;
// Transform a common color int oa `rgbA` color
const getRgbAColor = cached$1(identity => {
    const [color, opacity] = identity.split('-');
    const div = document.createElement('div');
    div.style.background = color;
    document.body.appendChild(div);
    const computedColor = window.getComputedStyle(div).backgroundColor;
    document.body.removeChild(div);
    /* istanbul ignore if */
    if (!rgbReg.test(computedColor)) {
        return color;
    }
    return `rgba(${extractRgbColor.exec(computedColor)[1]}, ${opacity})`;
});
class Bar extends React.PureComponent {
    constructor(props) {
        super(props);
        const type = this.props.horizontal ? 'horizontal' : 'vertical';
        this.bar = map[type];
        this._createDragEvent = this._createDragEvent.bind(this);
        this._handleRailClick = this._handleRailClick.bind(this);
    }
    render() {
        const { hideBar, otherBarHide, opacity, railBg, railCls, railBorder, railOp, railSize, railBorderRadius, barBg, barCls, barBorderRadius, barSize,
            //  scrollButtonBg,
            //  scrollButtonClickStep,
            scrollButtonEnable
            //  scrollButtonPressingStep
        } = this.props;
        const barType = this._getType();
        const BAR_MAP = map[barType];
        const classNameOfType = '__is-' + barType;
        // Rail props
        /** Get rgbA format background color */
        const railBackgroundColor = getRgbAColor(railBg + '-' + railOp);
        const endPos = otherBarHide ? 0 : railSize;
        const railStyle = {
            position: 'absolute',
            zIndex: 1,
            borderRadius: railBorderRadius !== 'auto' && railBorderRadius || barSize,
            // backgroundColor: 'blue',
            [BAR_MAP.opsSize]: railSize,
            [BAR_MAP.posName]: 0,
            [BAR_MAP.opposName]: endPos,
            [BAR_MAP.sidePosName]: 0,
            background: railBackgroundColor,
            border: railBorder
        };
        // Bar wrapper props
        const buttonSize = scrollButtonEnable ? railSize : 0;
        const barWrapStyle = {
            position: 'absolute',
            borderRadius: barBorderRadius !== 'auto' && barBorderRadius || barSize,
            [BAR_MAP.posName]: buttonSize,
            [BAR_MAP.opsSize]: barSize,
            [BAR_MAP.opposName]: buttonSize
        };
        // Bar props
        const barStyle = {
            cursor: 'pointer',
            position: 'absolute',
            margin: 'auto',
            transition: 'opacity 0.5s',
            userSelect: 'none',
            borderRadius: 'inherit',
            backgroundColor: barBg,
            [BAR_MAP.size]: this._getBarSize() + '%',
            opacity,
            [BAR_MAP.opsSize]: barSize,
            transform: `translate${BAR_MAP.axis}(${this._getBarPos()}%)`
        };
        if (barType == 'vertical') {
            barWrapStyle.width = '100%';
            // Let bar to be on the center.
            barStyle.left = 0;
            barStyle.right = 0;
        } else {
            barWrapStyle.height = '100%';
            barStyle.top = 0;
            barStyle.bottom = 0;
        }
        return React.createElement("div", { ref: "rail", className: `__rail ${classNameOfType} ${railCls}`, style: railStyle }, createScrollbarButton(this, 'start'), hideBar ? null : React.createElement("div", { ref: "barWrap", className: `__bar-wrap ${classNameOfType}`, style: barWrapStyle }, React.createElement("div", { ref: "bar", className: `__bar ${classNameOfType} ${barCls} ${opacity == 0 ? '__is-hide' : '__is-show'}`, style: barStyle })), createScrollbarButton(this, 'end'));
    }
    componentDidMount() {
        this._addAllListeners();
    }
    // Internal methods
    /**
     * Create a drag event according to current platform
     */
    _getBarSize() {
        return Math.max(this.props.barMinSize * 100, this.props.barsState.size);
    }
    _getBarPos() {
        const scrollDistance = this.props.barsState.move * this.props.barsState.size;
        const pos = scrollDistance * this._getBarRatio() / this._getBarSize();
        return pos;
    }
    _getBarRatio() {
        return (100 - this._getBarSize()) / (100 - this.props.barsState.size);
    }
    _createDragEvent(type) {
        const bar = this.refs.bar;
        const rail = this.refs.barWrap;
        const moveEvent = type == 'touch' ? 'touchmove' : 'mousemove';
        const endEvent = type == 'touch' ? 'touchend' : 'mouseup';
        const dragStart = e => {
            e.stopImmediatePropagation();
            e.preventDefault();
            document.onselectstart = () => false;
            const event = type == 'touch' ? e.touches[0] : e;
            const dragPos = event[this.bar.client];
            this.startPosition = dragPos - bar.getBoundingClientRect()[this.bar.posName];
            eventOnOff$1(document, moveEvent, onDragging);
            eventOnOff$1(document, endEvent, dragEnd);
            this.props.setDrag(true);
        };
        const onDragging = e => {
            const event = type == 'touch' ? e.touches[0] : e;
            const dragPos = event[this.bar.client];
            const delta = (dragPos - rail.getBoundingClientRect()[this.bar.posName]) / this._getBarRatio();
            const percent = (delta - this.startPosition) / rail[this.bar.offset];
            this.props.onBarDrag(percent, this.bar.axis.toLowerCase());
        };
        const dragEnd = () => {
            document.onselectstart = null;
            this.startPosition = 0;
            eventOnOff$1(document, moveEvent, onDragging, false, 'off');
            eventOnOff$1(document, endEvent, dragEnd, false, 'off');
            this.props.setDrag(false);
        };
        return dragStart;
    }
    _addAllListeners() {
        if (this.refs.bar) {
            this._addBarListener();
        }
        if (this.refs.rail) {
            this._addRailListener();
        }
    }
    _addBarListener() {
        // Not registry listener on props because there is a passive
        // issue on `touchstart` event, see:
        // https://github.com/facebook/react/issues/9809#issuecomment-414072263
        const bar = this.refs.bar;
        const type = isMobile$1() ? 'touchstart' : 'mousedown';
        let event = isMobile$1() ? this._createDragEvent('touch') : this._createDragEvent('mouse');
        eventOnOff$1(bar, type, event, { passive: false });
    }
    _addRailListener() {
        const rail = this.refs.barWrap;
        const type = isMobile$1() ? 'touchstart' : 'mousedown';
        eventOnOff$1(rail, type, e => this._handleRailClick(e, type));
    }
    _handleRailClick(e, type) {
        // Scroll to the place of rail where click event triggers.
        const { client, offset, posName, axis } = this.bar;
        const bar = this.refs.bar;
        if (!bar) {
            return;
        }
        const barOffset = bar[offset];
        const event = type == 'touchstart' ? e.touches[0] : e;
        const percent = (event[client] - e.currentTarget.getBoundingClientRect()[posName] - barOffset / 2) / (e.currentTarget[offset] - barOffset);
        this.props.onRailClick(percent * 100 + '%', axis.toLowerCase());
    }
    _getType() {
        return this.props.horizontal ? 'horizontal' : 'vertical';
    }
}
Bar.defaultProps = {
    barSize: '6px',
    barBorderRadius: 'auto',
    barMinSize: 0,
    railBg: '#01a99a',
    railOp: 0,
    railCls: '',
    railSize: '6px',
    railBorder: null,
    railBorderRadius: 'auto',
    keepRailShow: false,
    onlyShowBarOnScroll: true,
    barKeepShowTime: 300,
    keepBarShow: false,
    barBg: 'rgb(3, 185, 118)',
    barCls: '',
    barOpacity: 1,
    scrollButtonEnable: false,
    scrollButtonBg: '#cecece',
    scrollButtonClickStep: 80,
    scrollButtonPressingStep: 30
};
/**
 *
 * @param context bar instance
 * @param type bar type (vertical | horizontal)
 * @param env mouse means component is running on PC , or running on moblie
 * phone.
 */
function createScrollButtonEvent(context, type, env = 'mouse') {
    const endEventName = env == 'mouse' ? 'mouseup' : 'touchend';
    const { scrollButtonClickStep, scrollButtonPressingStep } = context.props;
    const stepWithDirection = type == 'start' ? -scrollButtonClickStep : scrollButtonClickStep;
    const mousedownStepWithDirection = type == 'start' ? -scrollButtonPressingStep : scrollButtonPressingStep;
    const ref = requestAnimationFrame(window);
    let isMouseDown = false;
    let isMouseout = true;
    let timeoutId;
    const start = e => {
        /* istanbul ignore if */
        if (3 == e.which) {
            return;
        }
        e.nativeEvent.stopImmediatePropagation();
        e.preventDefault();
        isMouseout = false;
        context.props.onScrollButtonClick(stepWithDirection, context.bar.axis.toLowerCase());
        eventOnOff$1(document, endEventName, endPress, false);
        if (env == 'mouse') {
            const elm = context.refs[type];
            eventOnOff$1(elm, 'mouseenter', enter, false);
            eventOnOff$1(elm, 'mouseleave', leave, false);
        }
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            isMouseDown = true;
            ref(pressingButton, window);
        }, 500);
    };
    const pressingButton = () => {
        if (isMouseDown && !isMouseout) {
            context.props.onScrollButtonClick(mousedownStepWithDirection, context.bar.axis.toLowerCase(), false);
            ref(pressingButton, window);
        }
    };
    const endPress = () => {
        clearTimeout(timeoutId);
        isMouseDown = false;
        eventOnOff$1(document, endEventName, endPress, false, 'off');
        if (env == 'mouse') {
            const elm = context.refs[type];
            eventOnOff$1(elm, 'mouseenter', enter, false, 'off');
            eventOnOff$1(elm, 'mouseleave', leave, false, 'off');
        }
    };
    const enter = () => {
        isMouseout = false;
        pressingButton();
    };
    const leave = () => {
        isMouseout = true;
    };
    return start;
}
/**
 * create two scroll butons on one rail.
 * @param context bar instance
 * @param type bar type (vertical | horizontal)
 */
function createScrollbarButton(context, type) {
    if (!context.props.scrollButtonEnable) {
        return null;
    }
    const size = context.props.railSize;
    const borderColor = context.props.scrollButtonBg;
    const wrapperProps = {
        className: normalizeClass('__bar-button', '__bar-button-is-' + context._getType() + '-' + type),
        style: {
            position: 'absolute',
            cursor: 'pointer',
            [map[context._getType()].scrollButton[type]]: 0,
            width: size,
            height: size
        },
        ref: type
    };
    const innerStyle = {
        border: `calc(${size} / 2.5) solid transparent`,
        width: '0',
        height: '0',
        margin: 'auto',
        position: 'absolute',
        top: '0',
        bottom: '0',
        right: '0',
        left: '0'
    };
    const innerProps = {
        className: '__bar-button-inner',
        style: innerStyle
    };
    if (!context.props.horizontal) {
        if (type == 'start') {
            innerProps.style.borderBottomColor = borderColor;
            innerProps.style.transform = 'translateY(-25%)';
        } else {
            innerProps.style.borderTopColor = borderColor;
            innerProps.style.transform = 'translateY(25%)';
        }
    } else {
        if (type == 'start') {
            innerProps.style.borderRightColor = borderColor;
            innerProps.style.transform = 'translateX(-25%)';
        } else {
            innerProps.style.borderLeftColor = borderColor;
            innerProps.style.transform = 'translateX(25%)';
        }
    }
    if (isMobile$1()) {
        innerProps.onTouchstart = createScrollButtonEvent(context, type, 'touch');
    } else {
        innerProps.onMouseDown = createScrollButtonEvent(context, type);
    }
    return React.createElement("div", Object.assign({}, wrapperProps), React.createElement("div", Object.assign({}, innerProps, { ref: type })));
}
function createBar(barProps, vBarState, hBarState, opacity) {
    const isVBarHide = !vBarState.size;
    const isHBarHide = !hBarState.size;
    const vBar = vBarState.size && !barProps.keepRailShow ? React.createElement(Bar, Object.assign({}, Object.assign({}, barProps, {
        barsState: vBarState,
        horizontal: false,
        hideBar: isVBarHide,
        otherBarHide: isHBarHide,
        opacity
    }), { key: "vBar" })) : null;
    const hBar = vBarState.size && !barProps.keepRailShow ? React.createElement(Bar, Object.assign({}, Object.assign({}, barProps, {
        barsState: hBarState,
        horizontal: true,
        hideBar: isHBarHide,
        otherBarHide: isVBarHide,
        opacity
    }), { key: "hBar" })) : null;
    return [vBar, hBar];
}

/* ---------------- Type End -------------------- */
class BaseScroll extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    // Render
    render() {
        const _a = this.props,
              { renderContainer, className: cn, children, onEnter, onLeave, onMove, style = {} } = _a,
              others = __rest(_a, ["renderContainer", "className", "children", "onEnter", "onLeave", "onMove", "style"]);
        const className = normalizeClass(cn, '__magic-scroll');
        const ch = React.createElement(React.Fragment, null, children);
        style.position = 'relative';
        style.overflow = 'hidden';
        let eventObj = {};
        if (!isMobile$1()) {
            eventObj = {
                onMouseEnter: onEnter,
                onMouseLeave: onLeave,
                onMouseMove: onMove
            };
        } else {
            eventObj = {
                onTouchStart: onEnter,
                onTouchEnd: onLeave,
                onTouchMove: onMove
            };
        }
        if (renderContainer) {
            // React the cloned element
            return React.cloneElement(renderContainer(), Object.assign({ ref: 'container', className }, eventObj, others, { style }), ch);
        } else {
            return React.createElement("div", Object.assign({ ref: "container" }, eventObj, { className: className }, others, { style: style }), ch);
        }
    }
    componentDidMount() {
        console.log('mounted...');
    }
}
BaseScroll.displayName = 'BasePScroll';

/**
 * Simple debounce
 */
function debounce(func, waitTime) {
    let timeId;
    let _args;
    let context;
    function deb(...args) {
        context = this;
        _args = args;
        return readyToExecute();
    }
    function readyToExecute() {
        clearTimeout(timeId);
        let res;
        timeId = setTimeout(() => {
            res = func.apply(context, _args);
        }, waitTime);
        return res;
    }
    return deb;
}
/**
 * Simple throttle
 */
function throttle(func, waitTime) {
    let timeId;
    let _args;
    let context;
    function deb(...args) {
        context = this;
        _args = args;
        return readyToExecute();
    }
    function readyToExecute() {
        if (timeId) {
            return;
        }
        let res;
        timeId = setTimeout(() => {
            res = func.apply(context, _args);
            timeId = null;
        }, waitTime);
        return res;
    }
    return deb;
}

/**
 * copyed from vue-router!
 */

function warn(condition, message) {
    if (process.env.NODE_ENV !== 'production' && !condition) {
        // tslint:disable-next-line
        typeof console !== 'undefined' && console.warn(`[magic-scroll] ${message}`);
    }
}

/**
 * It is used to communication between HOC and wrapped component.
 */
// tslint:disable-next-line
const noop$1 = () => {};
class Watcher$1 {
    constructor(name = '', getter = noop$1) {
        this.name = name;
        this.getter = getter;
    }
    run(...args) {
        let rtn = this.getter.apply(this, args);
        if (!(rtn instanceof Promise)) {
            rtn = Promise.resolve(rtn);
        }
        return rtn;
    }
}
class Subscription$1 {
    constructor() {
        this.watchers = [];
    }
    subscribe(eventName = null, getter) {
        this.watchers.push(new Watcher$1(eventName, getter));
    }
    notify(name = null, ...params) {
        const resArray = [];
        // tslint:disable-next-line
        for (let index = 0; index < this.watchers.length; index++) {
            const watcher = this.watchers[index];
            if (name === Subscription$1.All_WATCHERS || name === watcher.name) {
                resArray.push(watcher.run.apply(watcher, params));
            }
        }
        return Promise.all(resArray);
    }
    unsubscribe() {
        this.watchers = [];
    }
}
Subscription$1.All_WATCHERS = 'ALL_WATCHERS';

function enhance(WrapperComponent) {
    class MagicScrollBase extends React.PureComponent {
        /* --------------------- Lifecycle Methods ------------------------ */
        constructor(props) {
            super(props);
            this._isLeaveContainer = true;
            this.container = React.createRef();
            /**
             *  This state is to control style of container
             *  vBar --> vertical bar
             *  hBar --> horizontal bar
             */
            this.state = {
                barState: {
                    vBar: {
                        move: 0,
                        size: 0,
                        disable: false
                    },
                    hBar: {
                        move: 0,
                        disable: false,
                        size: 0
                    },
                    opacity: 0
                }
            };
            // Bind `this` context
            this._handleScroll = this._handleScroll.bind(this);
            this._handleResize = this._handleResize.bind(this);
            this._onRailClick = this._onRailClick.bind(this);
            this._setBarDrag = this._setBarDrag.bind(this);
            this._onContainerEnter = this._onContainerEnter.bind(this);
            this._onContainerMove = this._onContainerMove.bind(this);
            this._onContainerLeave = this._onContainerLeave.bind(this);
            this._onBarDrag = this._onBarDrag.bind(this);
            this._onScrollButtonClick = this._onScrollButtonClick.bind(this);
            // // Debounce and throttle  methods
            this._hideBar = debounce(this._hideBar, this.props.barKeepShowTime);
            this._onContainerMove = throttle(this._onContainerMove, 500);
            this.subscription = new Subscription$1();
        }
        render() {
            const _a = this.props,
                  { wrappedCompRef, children, style, className, renderContainer, barBorderRadius, barSize, railBg, railCls, barBg, barCls, barOpacity, barMinSize, railOp, railSize, railBorderRadius, railBorder, keepRailShow, scrollButtonBg, scrollButtonClickStep, scrollButtonEnable, scrollButtonPressingStep } = _a,
                  otherProps = __rest(_a, ["wrappedCompRef", "children", "style", "className", "renderContainer", "barBorderRadius", "barSize", "railBg", "railCls", "barBg", "barCls", "barOpacity", "barMinSize", "railOp", "railSize", "railBorderRadius", "railBorder", "keepRailShow", "scrollButtonBg", "scrollButtonClickStep", "scrollButtonEnable", "scrollButtonPressingStep"]);
            const { barState } = this.state;
            const barProps = {
                railBg,
                railCls,
                keepRailShow,
                railOp,
                railSize,
                railBorder,
                railBorderRadius,
                barSize,
                barBg,
                barCls,
                barOpacity,
                barMinSize,
                barBorderRadius,
                scrollButtonBg,
                scrollButtonClickStep,
                scrollButtonEnable,
                scrollButtonPressingStep,
                setDrag: this._setBarDrag,
                onBarDrag: this._onBarDrag,
                onScrollButtonClick: this._onScrollButtonClick,
                onRailClick: this._onRailClick
            };
            return React.createElement(React.Fragment, null, React.createElement(BaseScroll, { ref: this.container,
                /** Styles and classNames */
                className: className, style: Object.assign({}, style),
                /** Render functions */
                renderContainer: renderContainer, onEnter: this._onContainerEnter, onLeave: this._onContainerLeave, onMove: this._onContainerMove }, createBar(barProps, barState.vBar, barState.hBar, barState.opacity), React.createElement(WrapperComponent, Object.assign({}, otherProps, { ref: value => {
                    // wrappedComp(value);
                    this.wrappedComp = value;
                    if (wrappedCompRef) {
                        wrappedCompRef(value);
                    }
                }, onContainerRefresh: this._refresh.bind(this), onScrollComplete: this._scrollComptelte.bind(this), onScroll: this._handleScroll.bind(this) }), children)));
        }
        componentDidMount() {
            // linsten window resize.
            this._addAllEventListeners();
            // refresh state of each components
            this._refresh();
            // initial scroll
            this._triggerInitialScroll();
        }
        componentWillUnmount() {
            this.subscription.notify(MagicScrollBase.unmount_key);
            this.subscription.unsubscribe();
        }
        /* ---------------------  Component Methods ------------------------ */
        /** ---------  private methods  --------- */
        _getDomByRef(refName) {
            return getDom$1(this[refName].current);
        }
        /** Add all necessary listeners */
        _addAllEventListeners() {
            window.addEventListener('resize', this._handleResize);
            this.subscription.subscribe(MagicScrollBase.unmount_key, () => {
                window.removeEventListener('resize', this._handleResize);
            });
        }
        _updateBar() {
            const barState = this.wrappedComp._getBarState();
            if (barState) {
                this.setState(pre => {
                    return {
                        barState: Object.assign({}, barState, { opacity: pre.barState.opacity })
                    };
                });
            }
        }
        _showBar() {
            // Show bar
            this.setState(prevState => {
                return {
                    barState: Object.assign({}, prevState.barState, { opacity: 1 })
                };
            });
        }
        _hideBar() {
            // Hide bar
            if (this._canHideBar()) {
                this.setState(prevState => {
                    return {
                        barState: Object.assign({}, prevState.barState, { opacity: 0 })
                    };
                });
            }
        }
        _showHideBar() {
            this._showBar();
            this._hideBar();
        }
        _refresh() {
            // set container size strategy
            const strat = this.props.sizeStrategy;
            this._setContainerSizeStrategy(strat);
            this._updateBar();
            this._showHideBar();
        }
        /**
         * Set size strategy according to
         * this.mergeOps.container.sizeStrategy
         */
        _setContainerSizeStrategy(strat) {
            const container = this._getDomByRef('container');
            if (this._destroyContainerResize) {
                this._destroyContainerResize();
                this._destroyContainerResize = null;
            }
            if (strat == 'percent') {
                if (this._destroyContainerResize) {
                    this._destroyContainerResize();
                    this._destroyContainerResize = null;
                }
                this._setPercentSize(container);
            } else if (strat == 'number') {
                if (!this._destroyContainerResize) {
                    this.subscription.subscribe(MagicScrollBase.unmount_key, this._destroyContainerResize = this._setNumberSize(container));
                }
            } else {
                warn(false, `Unexpected strategy: ${strat}, except 'percent' or 'number'.`);
                // fallback to percent.
                this._setContainerSizeStrategy('percent');
            }
        }
        _setPercentSize(elm) {
            elm.style.height = '100%';
            elm.style.width = '100%';
        }
        _setNumberSize(elm) {
            const parent = elm.parentNode;
            const setConainerSize = () => {
                elm.style.height = parent.offsetHeight + 'px';
                elm.style.width = parent.offsetWidth + 'px';
                this._updateBar();
            };
            listenResize(parent, setConainerSize);
            setConainerSize(); // fire an once!;
            return elm.removeResize;
        }
        _triggerInitialScroll() {
            const { initialScrollX: x, initialScrollY: y } = this.props;
            this.wrappedComp.scrollTo({ x, y });
        }
        _canHideBar() {
            return !this.props.keepBarShow && !this._isBarDragging && this._isLeaveContainer;
        }
        /** --------- react to events ----------------*/
        _handleScroll() {
            this._updateBar();
            this._showHideBar();
        }
        _handleResize() {
            this._updateBar();
        }
        _onRailClick(percent, pos) {
            this.wrappedComp.scrollTo({
                [pos]: percent
            });
        }
        _onBarDrag(move, type) {
            this.wrappedComp._onBarDrag(type, move);
        }
        _onScrollButtonClick(move, type, animate = true) {
            this.wrappedComp.scrollBy({
                [type]: move
            }, false /* whether to animate */);
        }
        _scrollComptelte(...args) {
            if (this.props.handleScrollComplete) {
                this.props.handleScrollComplete.apply(this.wrappedComp, args);
            }
        }
        _setBarDrag(isDragging) {
            this._isBarDragging = isDragging;
            this._hideBar();
        }
        _onContainerLeave() {
            this._isLeaveContainer = true;
            this._hideBar();
        }
        _onContainerEnter() {
            this._isLeaveContainer = false;
            if (!this.props.onlyShowBarOnScroll) {
                this._updateBar();
                this._showBar();
            }
        }
        _onContainerMove() {
            this._updateBar();
            if (!this.props.onlyShowBarOnScroll && !this._isLeaveContainer) {
                this._showBar();
            }
        }
    }
    /** Default props */
    MagicScrollBase.defaultProps = {
        sizeStrategy: 'percent',
        detectResize: true,
        initialScrollY: false,
        initialScrollX: false
    };
    MagicScrollBase.displayName = 'magic-scroll-base';
    /** trigger beofore component will unmount */
    MagicScrollBase.unmount_key = 'UNMOUNT_SUBSCRIBE';
    return React.forwardRef((props, ref) => {
        return React.createElement(MagicScrollBase, Object.assign({}, props, { wrappedCompRef: ref }));
    });
}

class MagicScrollNative extends React.PureComponent {
    /* --------------------- Lifecycle Methods ------------------------ */
    constructor(props) {
        super(props);
        this.panel = React.createRef();
        /**
         *  This state is to control style of container and panel
         *  vBar --> vertical bar
         *  hBar --> horizontal bar
         */
        this.state = {
            barState: {
                vBar: {
                    move: 0,
                    size: 0,
                    disable: false
                },
                hBar: {
                    move: 0,
                    size: 0,
                    disable: false
                },
                opacity: 0
            }
        };
        // Bind `this` context
        this._handleResize = this._handleResize.bind(this);
        // api binds
        this.scrollTo = this.scrollTo.bind(this);
        this._handleScroll = this._handleScroll.bind(this);
        this.subscription = new Subscription();
    }
    render() {
        const { children, renderPanel, renderView, scrollingX, scrollingY } = this.props;
        const { verticalNativeBarPos } = this.props;
        const barState = this.state.barState;
        return React.createElement(View, { resize: listenResize, barPos: verticalNativeBarPos, handleResize: this._handleResize, barsState: barState, handleScroll: this._handleScroll, renderPanel: renderPanel, renderView: renderView, ref: this.panel, scrollingX: scrollingX, scrollingY: scrollingY }, children);
    }
    componentDidMount() {
        this._refresh();
    }
    componentWillUnmount() {
        this.subscription.notify(MagicScrollNative.unmount_key);
        this.subscription.unsubscribe();
    }
    /* ---------------------  Component Methods ------------------------ */
    /** ---------  private methods  --------- */
    _getDomByRef(refName) {
        return getDom(this[refName].current);
    }
    _getBarState() {
        const container = this._getDomByRef('panel');
        const barState = {
            vBar: { move: 0, size: 0, disable: false },
            hBar: { move: 0, size: 0, disable: false }
        };
        if (!container) {
            return barState;
        }
        const { scrollingX, scrollingY } = this.props;
        const clientWidth = container.clientWidth;
        const clientHeight = container.clientHeight;
        let heightPercentage = clientHeight * 100 / container.scrollHeight;
        let widthPercentage = clientWidth * 100 / container.scrollWidth;
        barState.vBar.move = container.scrollTop * 100 / clientHeight;
        barState.hBar.move = container.scrollLeft * 100 / clientWidth;
        barState.vBar.size = heightPercentage < 100 ? heightPercentage : 0;
        barState.hBar.size = widthPercentage < 100 ? widthPercentage : 0;
        barState.vBar.disable = !scrollingY;
        barState.hBar.disable = !scrollingX;
        this.setState({
            barState
        });
        return barState;
    }
    _scrollTo(x, y, animate = true) {
        const panelElm = this._getDomByRef('panel');
        // Normalize...
        if (typeof x === 'undefined') {
            x = panelElm.scrollLeft;
        } else {
            x = normalizeSize(x, panelElm.scrollWidth - panelElm.clientWidth);
        }
        if (typeof y === 'undefined') {
            y = panelElm.scrollTop;
        } else {
            y = normalizeSize(y, panelElm.scrollHeight - panelElm.clientHeight);
        }
        if (animate) {
            // hadnle for scroll complete
            const scrollingComplete = this._scrollComptelte.bind(this);
            // options
            const { easing, speed } = this.props;
            smoothScroll(panelElm, x - panelElm.scrollLeft, y - panelElm.scrollTop, speed, easing, scrollingComplete);
        } else {
            panelElm.scrollTop = y;
            panelElm.scrollLeft = x;
        }
    }
    _refresh() {
        // refresh panel
        this.panel.current._refresh();
    }
    /** --------- react to events ----------------*/
    _handleScroll() {
        this.props.onScroll();
    }
    _handleResize() {
        this.refresh();
    }
    _scrollComptelte() {
        console.log('scroll complelte...');
    }
    _onBarDrag(direction, percent) {
        const elm = this._getDomByRef('panel');
        const dest = elm[direction == 'x' ? 'scrollWidth' : 'scrollHeight'] * percent;
        this.scrollTo({
            [direction]: dest
        }, false);
    }
    _getPosition() {
        const { scrollTop, scrollLeft } = this._getDomByRef('panel');
        return {
            scrollTop,
            scrollLeft
        };
    }
    /** Public methods */
    scrollTo({ x, y }, animate = true) {
        this._scrollTo(x, y, animate);
    }
    scrollBy({ x, y }, animate = true) {
        const { scrollWidth, scrollHeight, clientWidth, clientHeight } = this._getDomByRef('panel');
        let { scrollLeft, scrollTop } = this._getPosition();
        if (x) {
            scrollLeft += normalizeSize(x, scrollWidth - clientWidth);
        }
        if (y) {
            scrollTop += normalizeSize(y, scrollHeight - clientHeight);
        }
        this._scrollTo(scrollLeft, scrollTop, animate);
    }
    refresh() {
        this._refresh();
        // Call HOC's refresh method
        this.props.onContainerRefresh();
    }
}
MagicScrollNative.defaultProps = {
    scrollingX: true,
    scrollingY: true,
    speed: 300,
    easing: undefined,
    verticalNativeBarPos: 'right'
};
MagicScrollNative.displayName = 'magic-scroll-native';
/** trigger beofore component will unmount */
MagicScrollNative.unmount_key = 'UNMOUNT_SUBSCRIBE';
var magicScroll = enhance(MagicScrollNative);

return magicScroll;

})));