"use strict";

function _interopDefault(ex) {
  return ex && "object" == typeof ex && "default" in ex ? ex.default : ex;
}

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var _extends = _interopDefault(require("@babel/runtime/helpers/extends")), _objectWithoutPropertiesLoose = _interopDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose")), React = require("react"), useLatest = _interopDefault(require("use-latest")), useComposedRef = _interopDefault(require("use-composed-ref")), HIDDEN_TEXTAREA_STYLE = {
  "min-height": "0",
  "max-height": "none",
  height: "0",
  visibility: "hidden",
  overflow: "hidden",
  position: "absolute",
  "z-index": "-1000",
  top: "0",
  right: "0"
}, forceHiddenStyles = function(node) {
  Object.keys(HIDDEN_TEXTAREA_STYLE).forEach((function(key) {
    node.style.setProperty(key, HIDDEN_TEXTAREA_STYLE[key], "important");
  }));
}, hiddenTextarea = null, getHeight = function(node, sizingData) {
  var height = node.scrollHeight;
  return "border-box" === sizingData.sizingStyle.boxSizing ? height + sizingData.borderSize : height - sizingData.paddingSize;
};

function calculateNodeHeight(sizingData, value, minRows, maxRows) {
  void 0 === minRows && (minRows = 1), void 0 === maxRows && (maxRows = 1 / 0), hiddenTextarea || ((hiddenTextarea = document.createElement("textarea")).setAttribute("tab-index", "-1"), 
  hiddenTextarea.setAttribute("aria-hidden", "true"), forceHiddenStyles(hiddenTextarea)), 
  document.body.contains(hiddenTextarea) || document.body.appendChild(hiddenTextarea);
  var paddingSize = sizingData.paddingSize, borderSize = sizingData.borderSize, sizingStyle = sizingData.sizingStyle, boxSizing = sizingStyle.boxSizing;
  Object.keys(sizingStyle).forEach((function(_key) {
    var key = _key;
    hiddenTextarea.style[key] = sizingStyle[key];
  })), forceHiddenStyles(hiddenTextarea), hiddenTextarea.value = value;
  var height = getHeight(hiddenTextarea, sizingData);
  hiddenTextarea.value = "x";
  var rowHeight = hiddenTextarea.scrollHeight - paddingSize, minHeight = rowHeight * minRows;
  "border-box" === boxSizing && (minHeight = minHeight + paddingSize + borderSize), 
  height = Math.max(minHeight, height);
  var maxHeight = rowHeight * maxRows;
  return "border-box" === boxSizing && (maxHeight = maxHeight + paddingSize + borderSize), 
  [ height = Math.min(maxHeight, height), rowHeight ];
}

var noop = function() {}, pick = function(props, obj) {
  return props.reduce((function(acc, prop) {
    return acc[prop] = obj[prop], acc;
  }), {});
}, SIZING_STYLE = [ "borderBottomWidth", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "boxSizing", "fontFamily", "fontSize", "fontStyle", "fontWeight", "letterSpacing", "lineHeight", "paddingBottom", "paddingLeft", "paddingRight", "paddingTop", "tabSize", "textIndent", "textRendering", "textTransform", "width" ], isIE = "undefined" != typeof document && !!document.documentElement.currentStyle, getSizingData = function(node) {
  var style = window.getComputedStyle(node);
  if (null === style) return null;
  var sizingStyle = pick(SIZING_STYLE, style), boxSizing = sizingStyle.boxSizing;
  return "" === boxSizing ? null : (isIE && "border-box" === boxSizing && (sizingStyle.width = parseFloat(sizingStyle.width) + parseFloat(sizingStyle.borderRightWidth) + parseFloat(sizingStyle.borderLeftWidth) + parseFloat(sizingStyle.paddingRight) + parseFloat(sizingStyle.paddingLeft) + "px"), 
  {
    sizingStyle: sizingStyle,
    paddingSize: parseFloat(sizingStyle.paddingBottom) + parseFloat(sizingStyle.paddingTop),
    borderSize: parseFloat(sizingStyle.borderBottomWidth) + parseFloat(sizingStyle.borderTopWidth)
  });
}, useWindowResizeListener = function(listener) {
  var latestListener = useLatest(listener);
  React.useEffect((function() {
    var handler = function(event) {
      latestListener.current(event);
    };
    return window.addEventListener("resize", handler), function() {
      window.removeEventListener("resize", handler);
    };
  }), []);
}, TextareaAutosize = function(_ref, userRef) {
  var cacheMeasurements = _ref.cacheMeasurements, maxRows = _ref.maxRows, minRows = _ref.minRows, _ref$onChange = _ref.onChange, onChange = void 0 === _ref$onChange ? noop : _ref$onChange, _ref$onHeightChange = _ref.onHeightChange, onHeightChange = void 0 === _ref$onHeightChange ? noop : _ref$onHeightChange, props = _objectWithoutPropertiesLoose(_ref, [ "cacheMeasurements", "maxRows", "minRows", "onChange", "onHeightChange" ]), isControlled = void 0 !== props.value, libRef = React.useRef(null), ref = useComposedRef(libRef, userRef), heightRef = React.useRef(0), measurementsCacheRef = React.useRef(), resizeTextarea = function() {
    var node = libRef.current, nodeSizingData = cacheMeasurements && measurementsCacheRef.current ? measurementsCacheRef.current : getSizingData(node);
    if (nodeSizingData) {
      measurementsCacheRef.current = nodeSizingData;
      var _calculateNodeHeight = calculateNodeHeight(nodeSizingData, node.value || node.placeholder || "x", minRows, maxRows), height = _calculateNodeHeight[0], rowHeight = _calculateNodeHeight[1];
      heightRef.current !== height && (heightRef.current = height, node.style.setProperty("height", height + "px", "important"), 
      onHeightChange(height, {
        rowHeight: rowHeight
      }));
    }
  };
  return "undefined" != typeof document && React.useLayoutEffect(resizeTextarea), 
  useWindowResizeListener(resizeTextarea), React.createElement("textarea", _extends({}, props, {
    onChange: function(event) {
      isControlled || resizeTextarea(), onChange(event);
    },
    ref: ref
  }));
}, index = React.forwardRef(TextareaAutosize);

exports.default = index;
