var connectToDb = require('../util/database');
var Subtask = /** @class */ (function () {
    function Subtask(title, isCompleted) {
        if (isCompleted === void 0) { isCompleted = false; }
        this.title = title;
        this.isCompleted = isCompleted;
    }
    return Subtask;
}());
