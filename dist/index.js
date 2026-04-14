"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersionInfo = exports.setDisplayTest = exports.setTestLocation = exports.setTestMode = exports.registerOutbrain = exports.OutbrainWidget = void 0;
// Component
var OutbrainWidget_1 = require("./OutbrainWidget");
Object.defineProperty(exports, "OutbrainWidget", { enumerable: true, get: function () { return OutbrainWidget_1.OutbrainWidget; } });
// Native SDK bridge
var nativeModule_1 = require("./nativeModule");
Object.defineProperty(exports, "registerOutbrain", { enumerable: true, get: function () { return nativeModule_1.registerOutbrain; } });
Object.defineProperty(exports, "setTestMode", { enumerable: true, get: function () { return nativeModule_1.setTestMode; } });
Object.defineProperty(exports, "setTestLocation", { enumerable: true, get: function () { return nativeModule_1.setTestLocation; } });
Object.defineProperty(exports, "setDisplayTest", { enumerable: true, get: function () { return nativeModule_1.setDisplayTest; } });
// Utils
var outbrainInit_1 = require("./outbrainInit");
Object.defineProperty(exports, "getVersionInfo", { enumerable: true, get: function () { return outbrainInit_1.getVersionInfo; } });
