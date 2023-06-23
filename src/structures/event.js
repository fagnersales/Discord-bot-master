"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventClass = void 0;
;
var EventClass = /** @class */ (function () {
    function EventClass(options) {
        this.name = options.name;
        this.once = options.once;
        this.execute = options.execute;
    }
    ;
    return EventClass;
}());
exports.EventClass = EventClass;
;
