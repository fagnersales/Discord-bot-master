"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedClient = void 0;
var discord_js_1 = require("discord.js");
var node_url_1 = require("node:url");
var index_js_1 = require("../index.js");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var dynamicImport = function (path) { return Promise.resolve("".concat((0, node_url_1.pathToFileURL)(path).toString())).then(function (s) { return require(s); }).then(function (module) { return module === null || module === void 0 ? void 0 : module.default; }); };
var ExtendedClient = /** @class */ (function (_super) {
    __extends(ExtendedClient, _super);
    function ExtendedClient() {
        var _this = _super.call(this, {
            intents: [
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildPresences,
                discord_js_1.GatewayIntentBits.GuildMembers,
                discord_js_1.GatewayIntentBits.MessageContent,
                discord_js_1.GatewayIntentBits.GuildMessages,
                discord_js_1.GatewayIntentBits.GuildVoiceStates
            ],
            failIfNotExists: false,
            rest: {
                retries: 3,
                timeout: 15000,
                version: '10'
            }
        }) || this;
        _this.slash = new discord_js_1.Collection();
        _this.cooldown = new discord_js_1.Collection();
        _this.text = new discord_js_1.Collection();
        return _this;
    }
    ;
    ExtendedClient.prototype.loadModules = function () {
        return __awaiter(this, void 0, void 0, function () {
            var commandFolderPath, commandFolders, _i, commandFolders_1, folder, commandPath, commandFiles, _a, commandFiles_1, file, filePath, command, properties, eventFolderPath, eventFolder, _b, eventFolder_1, folder, eventPath, eventFiles, _loop_1, this_1, _c, eventFiles_1, file, messageFolderPath, messageFolders, _d, messageFolders_1, folder, messagePath, commandFiles, _e, commandFiles_2, file, filePath, command;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        commandFolderPath = (0, node_url_1.fileURLToPath)(new URL('../commands/slash', import.meta.url));
                        commandFolders = node_fs_1.default.readdirSync(commandFolderPath);
                        _i = 0, commandFolders_1 = commandFolders;
                        _f.label = 1;
                    case 1:
                        if (!(_i < commandFolders_1.length)) return [3 /*break*/, 7];
                        folder = commandFolders_1[_i];
                        commandPath = node_path_1.default.join(commandFolderPath, folder);
                        commandFiles = node_fs_1.default.readdirSync(commandPath).filter(function (file) { return file.endsWith('.js'); });
                        _a = 0, commandFiles_1 = commandFiles;
                        _f.label = 2;
                    case 2:
                        if (!(_a < commandFiles_1.length)) return [3 /*break*/, 5];
                        file = commandFiles_1[_a];
                        filePath = node_path_1.default.join(commandPath, file);
                        return [4 /*yield*/, dynamicImport(filePath)];
                    case 3:
                        command = _f.sent();
                        properties = __assign({ folder: folder }, command);
                        // Set a new item in the Collection with the key as the command name and the value as the exported module
                        if ('data' in command && 'execute' in command) {
                            this.slash.set(command.data.name, command);
                        }
                        else {
                            console.log("[WARNING] The command at ".concat(filePath, " is missing a required \"data\" or \"execute\" property."));
                        }
                        ;
                        _f.label = 4;
                    case 4:
                        _a++;
                        return [3 /*break*/, 2];
                    case 5:
                        ;
                        _f.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7:
                        ;
                        eventFolderPath = (0, node_url_1.fileURLToPath)(new URL('../events', import.meta.url));
                        eventFolder = node_fs_1.default.readdirSync(eventFolderPath);
                        _b = 0, eventFolder_1 = eventFolder;
                        _f.label = 8;
                    case 8:
                        if (!(_b < eventFolder_1.length)) return [3 /*break*/, 13];
                        folder = eventFolder_1[_b];
                        eventPath = node_path_1.default.join(eventFolderPath, folder);
                        eventFiles = node_fs_1.default.readdirSync(eventPath).filter(function (file) { return file.endsWith('.js'); });
                        _loop_1 = function (file) {
                            var filePath, event_1;
                            return __generator(this, function (_g) {
                                switch (_g.label) {
                                    case 0:
                                        filePath = node_path_1.default.join(eventPath, file);
                                        return [4 /*yield*/, dynamicImport(filePath)];
                                    case 1:
                                        event_1 = _g.sent();
                                        if ('name' in event_1 && 'execute' in event_1) {
                                            if (event_1.once) {
                                                this_1.once(event_1.name, function () {
                                                    var args = [];
                                                    for (var _i = 0; _i < arguments.length; _i++) {
                                                        args[_i] = arguments[_i];
                                                    }
                                                    return event_1.execute.apply(event_1, __spreadArray([index_js_1.client], args, false));
                                                });
                                            }
                                            else {
                                                this_1.on(event_1.name, function () {
                                                    var args = [];
                                                    for (var _i = 0; _i < arguments.length; _i++) {
                                                        args[_i] = arguments[_i];
                                                    }
                                                    return event_1.execute.apply(event_1, __spreadArray([index_js_1.client], args, false));
                                                });
                                            }
                                        }
                                        else {
                                            console.log("[WARNING] The event at ".concat(filePath, " is missing a required \"name\" or \"execute\" property."));
                                        }
                                        ;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _c = 0, eventFiles_1 = eventFiles;
                        _f.label = 9;
                    case 9:
                        if (!(_c < eventFiles_1.length)) return [3 /*break*/, 12];
                        file = eventFiles_1[_c];
                        return [5 /*yield**/, _loop_1(file)];
                    case 10:
                        _f.sent();
                        _f.label = 11;
                    case 11:
                        _c++;
                        return [3 /*break*/, 9];
                    case 12:
                        _b++;
                        return [3 /*break*/, 8];
                    case 13:
                        messageFolderPath = (0, node_url_1.fileURLToPath)(new URL('../commands/text', import.meta.url));
                        messageFolders = node_fs_1.default.readdirSync(messageFolderPath);
                        _d = 0, messageFolders_1 = messageFolders;
                        _f.label = 14;
                    case 14:
                        if (!(_d < messageFolders_1.length)) return [3 /*break*/, 20];
                        folder = messageFolders_1[_d];
                        messagePath = node_path_1.default.join(messageFolderPath, folder);
                        commandFiles = node_fs_1.default.readdirSync(messagePath).filter(function (file) { return file.endsWith('.js'); });
                        _e = 0, commandFiles_2 = commandFiles;
                        _f.label = 15;
                    case 15:
                        if (!(_e < commandFiles_2.length)) return [3 /*break*/, 18];
                        file = commandFiles_2[_e];
                        filePath = node_path_1.default.join(messagePath, file);
                        return [4 /*yield*/, dynamicImport(filePath)];
                    case 16:
                        command = _f.sent();
                        // Set a new item in the Collection with the key as the command name and the value as the exported module
                        if ('data' in command && 'run' in command) {
                            this.text.set(command.data.name, command);
                        }
                        else {
                            console.log("[WARNING] The command at ".concat(filePath, " is missing a required \"data\" or \"run\" property."));
                        }
                        ;
                        _f.label = 17;
                    case 17:
                        _e++;
                        return [3 /*break*/, 15];
                    case 18:
                        ;
                        _f.label = 19;
                    case 19:
                        _d++;
                        return [3 /*break*/, 14];
                    case 20:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    /**
     * This is used to log into the Discord API with loading all commands and events.
     */
    ExtendedClient.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.login(process.env.TOKEN);
                this.loadModules();
                return [2 /*return*/];
            });
        });
    };
    ;
    return ExtendedClient;
}(discord_js_1.Client));
exports.ExtendedClient = ExtendedClient;
;
