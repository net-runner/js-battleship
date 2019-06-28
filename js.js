(function () { function r(e, n, t) { function o(i, f) { if (!n[i]) { if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
    1: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = void 0;

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        var AI =
            function () {
                function AI() {
                    var showOverlay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
                    var shipsArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

                    _classCallCheck(this, AI);

                    this.showOverlay = showOverlay;

                    this.userBoardOverlay = {
                        isBorder: this.generateOverlay(true),
                        isShot: this.generateOverlay(),
                        isShip: this.generateOverlay(),
                        shipFinished: this.generateOverlay(),
                        probability: this.generateOverlay()
                    };

                    this.shipsLeft = this.getShipLengths(shipsArray);
                }

                _createClass(AI, [{
                    key: "generateOverlay",
                    value: function generateOverlay() {
                        var border = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
                        var userBoardOverlay = [];

                        for (var i = 0; i < 12; i++) {
                            userBoardOverlay[i] = [];

                            for (var j = 0; j < 12; j++) {
                                userBoardOverlay[i][j] = 0;

                                if (border && (i == 0 || i == 11 || j == 0 || j == 11)) {
                                    userBoardOverlay[i][j] = 1;
                                }
                            }
                        }


                        return userBoardOverlay;
                    }
                }, {
                    key: "displayOverlay",
                    value: function displayOverlay(maxProbability) {
                        var coords = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
                            x: 0,
                            y: 0
                        };
                        if (!this.showOverlay) return;

                        for (var i = 1; i < 11; i++) {
                            for (var j = 1; j < 11; j++) {
                                var element = document.getElementById("boardOverlayPos-".concat(i).concat(j));

                                var probability = this.userBoardOverlay.probability[i][j];

                                var color = "rgb(\n          ".concat(Math.round(255 - probability * 255 / maxProbability), ",\n          ").concat(Math.round(255 - probability * 255 / maxProbability), ",\n          ").concat(Math.round(255 - probability * 255 / maxProbability), "\n        )");

                                if (probability == 0) {
                                    color = "rgb(\n            ".concat(Math.round(0), ",\n            ").concat(Math.round(170), ",\n            ").concat(Math.round(170), "\n          )");
                                }


                                if (i == coords.y && j == coords.x) {
                                    color = "rgb(\n            ".concat(Math.round(255), ",\n            ").concat(Math.round(0), ",\n            ").concat(Math.round(0), "\n          )");
                                }


                                element.style.backgroundColor = color;
                            }
                        }
                    }
                }, {
                    key: "generateCoords",
                    value: function generateCoords() {
                        var coords = {
                            x: 1,
                            y: 1
                        };

                        var info = this.getInfo();

                        if (info.hasUnfinishedShip) {
                            this.finishHIM(info);
                        } else {
                            this.calculateProbability(info);
                        }


                        var maxProbability = this.getMaxProbability();

                        coords = this.getCoords();

                        this.userBoardOverlay.isShot[coords.y][coords.x] = 1;

                        if (this.showOverlay == true) {
                            this.displayOverlay(maxProbability, coords);
                        }


                        return coords;
                    }
                }, {
                    key: "shipFound",
                    value: function shipFound(coords) {
                        this.userBoardOverlay.isShip[coords.y][coords.x] = 1;
                    }
                }, {
                    key: "getCoords",
                    value: function getCoords() {
                        var coords = [];

                        var maxProbability = 0;

                        for (var i = 1; i < 11; i++) {
                            for (var j = 1; j < 11; j++) {
                                var currentProbability = this.userBoardOverlay.probability[i][j];

                                if (currentProbability >= maxProbability) {
                                    if (currentProbability == maxProbability) {
                                        coords.push({
                                            x: j,
                                            y: i
                                        });
                                    } else {
                                        coords = [];
                                        coords.push({
                                            x: j,
                                            y: i
                                        });
                                    }


                                    maxProbability = currentProbability;
                                }
                            }
                        }

                        if (coords.length == 1) {
                            return coords[0];
                        } else {
                            return coords[Math.floor(Math.random() * coords.length)];
                        }
                    }
                }, {
                    key: "getMaxProbability",
                    value: function getMaxProbability() {
                        var maxProbability = 0;

                        for (var i = 1; i < 11; i++) {
                            for (var j = 1; j < 11; j++) {
                                var currentProbability = this.userBoardOverlay.probability[i][j];

                                if (currentProbability >= maxProbability) {
                                    maxProbability = currentProbability;
                                }
                            }
                        }


                        return maxProbability;
                    }
                }, {
                    key: "calculateProbability",
                    value: function calculateProbability(info) {
                        for (var i = 1; i < 11; i++) {
                            for (var j = 1; j < 12 - info.longestLeft; j++) {
                                var canPlace = true;

                                for (var k = 0; k < info.longestLeft; k++) {
                                    if (this.userBoardOverlay.isShot[i][j + k]) {
                                        canPlace = false;
                                    }
                                }


                                if (canPlace) {
                                    for (var _k = 0; _k < info.longestLeft; _k++) {
                                        this.userBoardOverlay.probability[i][j + _k]++;
                                    }
                                }
                            }
                        }


                        for (var _i = 1; _i < 12 - info.longestLeft; _i++) {
                            for (var _j = 1; _j < 11; _j++) {
                                var _canPlace = true;

                                for (var _k2 = 0; _k2 < info.longestLeft; _k2++) {
                                    if (this.userBoardOverlay.isShot[_i + _k2][_j]) {
                                        _canPlace = false;
                                    }
                                }


                                if (_canPlace) {
                                    for (var _k3 = 0; _k3 < info.longestLeft; _k3++) {
                                        this.userBoardOverlay.probability[_i + _k3][_j]++;
                                    }
                                }
                            }
                        }
                    }
                }, {
                    key: "finishHIM",
                    value: function finishHIM(info) {
                        var unfinishedShipCoords = info.unfinishedShipCoords;

                        if (unfinishedShipCoords.length == info.longestLeft) {
                            for (var element in unfinishedShipCoords) {
                                element = unfinishedShipCoords[element];
                                this.markFinished(element.x, element.y);
                            }


                            this.shipsLeft[info.longestLeft]--;

                            info = this.getInfo();

                            this.calculateProbability(info);

                            var maxProbability = this.getMaxProbability();

                            this.displayOverlay(maxProbability);
                        }
                        else if (unfinishedShipCoords.length == 1) {
                            var coords = unfinishedShipCoords[0];

                            var possibleShots = [];

                            if (!this.userBoardOverlay.isShot[coords.y - 1][coords.x]) possibleShots.push({
                                x: coords.x,
                                y: coords.y - 1
                            });

                            if (!this.userBoardOverlay.isShot[coords.y][coords.x - 1]) possibleShots.push({
                                x: coords.x - 1,
                                y: coords.y
                            });

                            if (!this.userBoardOverlay.isShot[coords.y][coords.x + 1]) possibleShots.push({
                                x: coords.x + 1,
                                y: coords.y
                            });

                            if (!this.userBoardOverlay.isShot[coords.y + 1][coords.x]) possibleShots.push({
                                x: coords.x,
                                y: coords.y + 1
                            });

                            for (var _element in possibleShots) {
                                _element = possibleShots[_element];
                                this.userBoardOverlay.probability[_element.y][_element.x]++;
                            }


                            if (possibleShots.length == 0 || possibleShots.length == 1 && this.userBoardOverlay.isBorder[possibleShots[0].y][possibleShots[0].x] == 1) {
                                this.shipsLeft[1]--;

                                this.markFinished(coords.x, coords.y);

                                info = this.getInfo();

                                this.calculateProbability(info);

                                var _maxProbability = this.getMaxProbability();


                                this.displayOverlay(_maxProbability);
                            }
                        }
                        else {
                            var isFinished = false;

                            if (unfinishedShipCoords[0].x == unfinishedShipCoords[1].x) {
                                var _possibleShots = [];

                                if (!this.userBoardOverlay.isShot[unfinishedShipCoords[0].y - 1][unfinishedShipCoords[0].x]) {
                                    _possibleShots.push({
                                        x: unfinishedShipCoords[0].x,
                                        y: unfinishedShipCoords[0].y - 1
                                    });
                                }


                                if (!this.userBoardOverlay.isShot[unfinishedShipCoords[unfinishedShipCoords.length - 1].y + 1][unfinishedShipCoords[0].x]) {
                                    _possibleShots.push({
                                        x: unfinishedShipCoords[0].x,
                                        y: unfinishedShipCoords[unfinishedShipCoords.length - 1].y + 1
                                    });
                                }


                                if (_possibleShots.length == 0 || _possibleShots.length == 1 && this.userBoardOverlay.isBorder[_possibleShots[0].y][_possibleShots[0].x] == 1) {
                                    this.shipsLeft[unfinishedShipCoords.length]--;

                                    isFinished = true;

                                    info = this.getInfo();

                                    this.calculateProbability(info);

                                    var _maxProbability2 = this.getMaxProbability();


                                    this.displayOverlay(_maxProbability2);
                                }


                                for (var _element2 in _possibleShots) {
                                    _element2 = _possibleShots[_element2];
                                    this.userBoardOverlay.probability[_element2.y][_element2.x]++;
                                }
                            }
                            else if (unfinishedShipCoords[0].y == unfinishedShipCoords[1].y) {
                                var _possibleShots2 = [];

                                if (!this.userBoardOverlay.isShot[unfinishedShipCoords[0].y][unfinishedShipCoords[0].x - 1]) {
                                    _possibleShots2.push({
                                        x: unfinishedShipCoords[0].x - 1,
                                        y: unfinishedShipCoords[0].y
                                    });
                                }


                                if (!this.userBoardOverlay.isShot[unfinishedShipCoords[0].y][unfinishedShipCoords[unfinishedShipCoords.length - 1].x + 1]) {
                                    _possibleShots2.push({
                                        x: unfinishedShipCoords[unfinishedShipCoords.length - 1].x + 1,
                                        y: unfinishedShipCoords[0].y
                                    });
                                }


                                if (_possibleShots2.length == 0 || _possibleShots2.length == 1 && this.userBoardOverlay.isBorder[_possibleShots2[0].y][_possibleShots2[0].x] == 1) {
                                    this.shipsLeft[unfinishedShipCoords.length]--;

                                    isFinished = true;

                                    info = this.getInfo();

                                    this.calculateProbability(info);

                                    var _maxProbability3 = this.getMaxProbability();


                                    this.displayOverlay(_maxProbability3);
                                }


                                for (var _element3 in _possibleShots2) {
                                    _element3 = _possibleShots2[_element3];
                                    this.userBoardOverlay.probability[_element3.y][_element3.x]++;
                                }
                            }
                            else {
                                console.log("CO JEST KURRR");
                            }


                            if (isFinished) {
                                for (var _element4 in unfinishedShipCoords) {
                                    _element4 = unfinishedShipCoords[_element4];
                                    this.markFinished(_element4.x, _element4.y);
                                }


                                info = this.getInfo();

                                this.calculateProbability(info);

                                var _maxProbability4 = this.getMaxProbability();


                                this.displayOverlay(_maxProbability4);
                            }
                        }
                    }
                }, {
                    key: "markFinished",
                    value: function markFinished(x, y) {
                        this.userBoardOverlay.isShot[y - 1][x - 1] = 1;
                        this.userBoardOverlay.isShot[y - 1][x] = 1;
                        this.userBoardOverlay.isShot[y - 1][x + 1] = 1;

                        this.userBoardOverlay.isShot[y][x - 1] = 1;
                        this.userBoardOverlay.isShot[y][x] = 1;
                        this.userBoardOverlay.isShot[y][x + 1] = 1;

                        this.userBoardOverlay.isShot[y + 1][x - 1] = 1;
                        this.userBoardOverlay.isShot[y + 1][x] = 1;
                        this.userBoardOverlay.isShot[y + 1][x + 1] = 1;

                        this.userBoardOverlay.shipFinished[y][x] = 1;
                    }
                }, {
                    key: "getInfo",
                    value: function getInfo() {
                        var info = {
                            hasUnfinishedShip: false,
                            unfinishedShipCoords: [],
                            longestLeft: 0
                        };

                        for (var i = 1; i < 11; i++) {
                            for (var j = 1; j < 11; j++) {
                                this.userBoardOverlay.probability[i][j] = 0;

                                if (this.userBoardOverlay.isShip[i][j] && !this.userBoardOverlay.shipFinished[i][j]) {
                                    info.hasUnfinishedShip = true;

                                    info.unfinishedShipCoords.push({
                                        x: j,
                                        y: i
                                    });
                                }
                            }
                        }


                        for (var _i2 = 0; _i2 < this.shipsLeft.length; _i2++) {
                            var index = this.shipsLeft.length - 1 - _i2;

                            if (this.shipsLeft[index]) {
                                info.longestLeft = this.shipsLeft.length - 1 - _i2;
                                break;
                            }
                        }


                        return info;
                    }
                }, {
                    key: "getShipLengths",
                    value: function getShipLengths(shipsArray) {
                        var shipsLeft = [0];

                        for (var elem in shipsArray) {
                            if (shipsLeft[shipsArray[elem]]) {
                                shipsLeft[shipsArray[elem]]++;
                            } else {
                                shipsLeft[shipsArray[elem]] = 1;
                            }
                        }


                        return shipsLeft;
                    }
                }], [{
                    key: "generateRandomCoords",
                    value: function generateRandomCoords(boardOverlay) {
                        var coords = [];

                        for (var i = 1; i < 11; i++) {
                            for (var j = 1; j < 11; j++) {
                                if (!boardOverlay.isShot[i][j]) {
                                    coords.push({
                                        x: j,
                                        y: i
                                    });
                                }
                            }
                        }


                        return coords[Math.floor(Math.random() * coords.length)];
                    }
                }]);

                return AI;
            }();

        exports.default = AI;

    }, {}], 2: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = void 0;

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        var Battle =
            function () {
                function Battle(userBoard, computerBoard, artificialIntelligence) {
                    _classCallCheck(this, Battle);

                    this.turn = 0;

                    this.turnDiv = null;

                    this.userCounter = 0;
                    this.computerCounter = 0;

                    this.artificialIntelligence = artificialIntelligence;

                    this.userHits = 0;
                    this.computerHits = 0;

                    this.userBoard = userBoard;
                    this.computerBoard = computerBoard;
                }

                _createClass(Battle, [{
                    key: "userMove",
                    value: function userMove() {
                        this.turn = 0;
                        this.userCounter++;
                        this.turnDiv.textContent = "TwÃ³j ruch!";
                    }
                }, {
                    key: "computerMove",
                    value: function computerMove() {
                        var _this = this;

                        setTimeout(function () {
                            var coords = _this.artificialIntelligence.generateCoords();


                            document.getElementById("boardPos-".concat(coords.y).concat(coords.x)).classList.add("shot-cell");

                            console.log("Computer moved");

                            _this.computerCounter++;

                            if (_this.userBoard[coords.y][coords.x]) {
                                _this.computerHits++;

                                _this.artificialIntelligence.shipFound(coords);
                            }


                            _this.checkGameWin();


                            if (_this.userBoard[coords.y][coords.x]) {
                                _this.computerMove();
                            } else {
                                _this.userMove();
                            }
                        }, 1000);
                    }
                }, {
                    key: "setListeners",
                    value: function setListeners(userShots) {
                        var _self = this;


                        var boardCells = document.getElementsByClassName("computer-cell");

                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            var _loop = function _loop() {
                                var element = _step.value;
                                var matchedPos = {
                                    x: null,
                                    y: null
                                };

                                if (element.id[element.id.length - 1] == 0) {
                                    var regex = /boardPosComputer-(\d{1,2})(\d{2})/i;
                                    var match = element.id.match(regex);

                                    matchedPos.y = match[1];
                                    matchedPos.x = match[2];
                                } else {
                                    var _regex = /boardPosComputer-(\d{1,2})(\d{1})/i;

                                    var _match = element.id.match(_regex);


                                    matchedPos.y = _match[1];
                                    matchedPos.x = _match[2];
                                }


                                element.addEventListener("click", function () {
                                    if (!_self.turn) {
                                        if (!userShots[matchedPos.y][matchedPos.x]) {
                                            userShots[matchedPos.y][matchedPos.x] = 1;

                                            element.classList.add("shot-cell");

                                            if (_self.computerBoard[matchedPos.y][matchedPos.x]) {
                                                _self.userHits++;
                                            }


                                            _self.checkGameWin();


                                            _self.turn = 1;

                                            if (_self.computerBoard[matchedPos.y][matchedPos.x]) {
                                                _self.userMove();
                                            } else {
                                                _self.computerMove();

                                                _self.turnDiv.textContent = "Ruch AI!";
                                            }
                                        } else {
                                            console.log("Tu juÅ¼ padÅ‚ strzaÅ‚");
                                            alert("Tu juÅ¼ padÅ‚ strzaÅ‚");
                                        }
                                    } else {
                                        console.log("CierpliwoÅ›ci");
                                        alert("CierpliwoÅ›ci");
                                    }
                                });
                            };

                            for (var _iterator = boardCells[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                _loop();
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return != null) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                    }
                }, {
                    key: "checkGameWin",
                    value: function checkGameWin() {
                        if (this.userHits >= 20) {
                            alert("Wygrana gracza w ".concat(this.userCounter, " ruchach"));
                        } else if (this.computerHits >= 20) {
                            alert("Wygrana komputera w ".concat(this.computerCounter, " ruchach"));

                            for (var i = 1; i < 11; i++) {
                                for (var j = 1; j < 11; j++) {
                                    document.getElementById("boardPosComputer-".concat(i).concat(j)).classList.add("shot-cell");
                                }
                            }
                        }
                    }
                }, {
                    key: "setupOverlay",
                    value: function setupOverlay() {
                        for (var i = 1; i < 11; i++) {
                            for (var j = 1; j < 11; j++) {
                                var overlayDiv = document.createElement("div");

                                overlayDiv.classList.add("user-board-cell-overlay");

                                overlayDiv.id = "boardOverlayPos-".concat(i).concat(j);

                                document.getElementById("boardPos-".concat(i).concat(j)).appendChild(overlayDiv);
                            }
                        }
                    }
                }]);

                return Battle;
            }();

        exports.default = Battle;

    }, {}], 3: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = void 0;

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        var Board =
            function () {
                function Board() {
                    _classCallCheck(this, Board);
                }

                _createClass(Board, [{
                    key: "generateBoard",
                    value: function generateBoard() {
                        var board = [];

                        for (var i = 0; i < 12; i++) {
                            board[i] = [];

                            for (var j = 0; j < 12; j++) {
                                board[i][j] = 0;
                            }
                        }


                        return board;
                    }
                }], [{
                    key: "checkCell",
                    value: function checkCell(x, y) {
                        var board = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

                        if (board == 0) {
                            console.log("Error: board == 0");
                            return;
                        }


                        if (board[x - 1][y - 1] || board[x][y - 1] || board[x + 1][y - 1] || board[x - 1][y] || board[x][y] || board[x + 1][y] || board[x - 1][y + 1] || board[x][y + 1] || board[x + 1][y + 1]) {
                            return false;
                        }


                        return true;
                    }
                }, {
                    key: "printToDocument",
                    value: function printToDocument(board, targetID) {
                        var isComputer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                        var target = document.getElementById(targetID);

                        target.innerHTML = "";

                        for (var i = 1; i < 11; i++) {
                            for (var j = 1; j < 11; j++) {
                                var div = document.createElement("div");

                                div.classList.add("board-cell");

                                !isComputer ? div.id = "boardPos-".concat(i).concat(j) : div.id = "boardPosComputer-".concat(i).concat(j);

                                if (board[i][j] == 1) div.classList.add("ship");

                                if (isComputer) {
                                    div.classList.add("computer-cell");
                                } else {
                                    div.classList.add("user-cell");
                                }


                                target.appendChild(div);
                            }
                        }
                    }
                }]);

                return Board;
            }();

        exports.default = Board;

    }, {}], 4: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = void 0;

        var _Board = _interopRequireDefault(require("./Board"));

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        var Computer =
            function () {
                function Computer() {
                    _classCallCheck(this, Computer);
                }

                _createClass(Computer, [{
                    key: "generateShips",
                    value: function generateShips(board) {
                        var _this = this;

                        var ships = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
                        var newBoard = board;

                        if (ships[0]) {
                            ships.forEach(function (element) {
                                newBoard = _this.addShip(element, newBoard);
                            });

                            return newBoard;
                        } else {
                            console.log("generateShips - Nie podano arraya statkÃ³w");
                            return;
                        }
                    }
                }, {
                    key: "addShip",
                    value: function addShip() {
                        var shipLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                        var board = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                        var newBoard = board;

                        if (shipLength > 4 || shipLength < 1) {
                            console.log("addShip - Error: shipLength == ".concat(shipLength));
                            return;
                        }


                        if (newBoard == 0) {
                            console.log("addShip - Error: board == 0");
                            return;
                        }


                        var position = {
                            x: Math.ceil(Math.random() * 10),
                            y: Math.ceil(Math.random() * 10)
                        };

                        var direction = Math.round(Math.random());

                        if (direction) {
                            if (position.x + shipLength - 1 > 10) {
                                return this.addShip(shipLength, newBoard);
                            }


                            for (var i = 0; i < shipLength; i++) {
                                if (!_Board.default.checkCell(position.x + i, position.y, newBoard)) {
                                    return this.addShip(shipLength, newBoard);
                                }
                            }


                            for (var _i = 0; _i < shipLength; _i++) {
                                newBoard[position.x + _i][position.y] = 1;
                            }
                        } else {
                            if (position.y + shipLength - 1 > 10) {
                                return this.addShip(shipLength, newBoard);
                            }


                            for (var _i2 = 0; _i2 < shipLength; _i2++) {
                                if (!_Board.default.checkCell(position.x, position.y + _i2, newBoard)) {
                                    return this.addShip(shipLength, newBoard);
                                }
                            }


                            for (var _i3 = 0; _i3 < shipLength; _i3++) {
                                newBoard[position.x][position.y + _i3] = 1;
                            }
                        }


                        return newBoard;
                    }
                }]);

                return Computer;
            }();

        exports.default = Computer;

    }, { "./Board": 3 }], 5: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = void 0;

        var _Board = _interopRequireDefault(require("./Board"));

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        var UI =
            function () {
                function UI() {
                    _classCallCheck(this, UI);

                    this.stage1 = {};

                    this.stage1.shipLength = 0;

                    this.stage1.ship = null;

                    this.stage1.direction = 1;

                    this.stage1.shipPos = {
                        x: null,
                        y: null
                    };

                    this.stage1.cellPos = {
                        x: null,
                        y: null
                    };
                }

                _createClass(UI, [{
                    key: "displayStage1",
                    value: function displayStage1() {
                        var ships = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                        var userBoard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

                        var _self = this;


                        if (ships[0] && userBoard[0]) {
                            var main = document.createElement("div");
                            main.id = "main";

                            var menuDiv = document.createElement("div");
                            menuDiv.id = "menu-ships";
                            menuDiv.classList.add("float-left");

                            main.appendChild(menuDiv);

                            var userBoardDiv = document.createElement("div");
                            userBoardDiv.id = "userboard";
                            userBoardDiv.classList.add("board", "float-right");

                            main.appendChild(userBoardDiv);

                            document.body.appendChild(main);

                            this.placeShipsMenu(ships, "menu-ships");

                            _Board.default.printToDocument(userBoard, "userboard");
                        } else {
                            console.log("displayStage1 - Nie podano arraya statkÃ³w");
                            return;
                        }


                        var menuShips = document.getElementsByClassName("menu-ship");

                        menuShips[0].classList.add("focused-ship");

                        this.stage1.shipLength = menuShips[0].childNodes.length;
                        this.stage1.ship = menuShips[0];

                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = menuShips[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var element = _step.value;
                                element.addEventListener("click", function () {
                                    var _iteratorNormalCompletion2 = true;
                                    var _didIteratorError2 = false;
                                    var _iteratorError2 = undefined;

                                    try {
                                        for (var _iterator2 = menuShips[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                            var item = _step2.value;
                                            item.classList.remove("focused-ship");
                                        }

                                    } catch (err) {
                                        _didIteratorError2 = true;
                                        _iteratorError2 = err;
                                    } finally {
                                        try {
                                            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                                                _iterator2.return();
                                            }
                                        } finally {
                                            if (_didIteratorError2) {
                                                throw _iteratorError2;
                                            }
                                        }
                                    }

                                    this.classList.add("focused-ship");

                                    _self.stage1.ship = this;
                                    _self.stage1.shipLength = this.childNodes.length;
                                });
                            }

                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return != null) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        this.addBoardListeners(userBoard);

                        this.addCellsListeners(userBoard);
                    }
                }, {
                    key: "addCellsListeners",
                    value: function addCellsListeners(userBoard) {
                        var _self = this;


                        var boardCells = document.getElementsByClassName("board-cell");

                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            var _loop = function _loop() {
                                var element = _step3.value;
                                var matchedPos = {
                                    x: null,
                                    y: null
                                };

                                if (element.id[element.id.length - 1] == 0) {
                                    var regex = /boardPos-(\d{1,2})(\d{2})/i;
                                    var match = element.id.match(regex);

                                    matchedPos.y = match[1];
                                    matchedPos.x = match[2];
                                } else {
                                    var _regex = /boardPos-(\d{1,2})(\d{1})/i;

                                    var _match = element.id.match(_regex);


                                    matchedPos.y = _match[1];
                                    matchedPos.x = _match[2];
                                }


                                element.addEventListener("mouseenter", function () {
                                    _self.stage1.shipPos.y = parseInt(matchedPos.y);
                                    _self.stage1.shipPos.x = parseInt(matchedPos.x);

                                    _self.stage1.cellPos.y = parseInt(matchedPos.y);
                                    _self.stage1.cellPos.x = parseInt(matchedPos.x);

                                    if (_self.stage1.direction) {
                                        if (_self.stage1.shipPos.y + _self.stage1.shipLength > 11) {
                                            _self.stage1.shipPos.y = 11 - _self.stage1.shipLength;
                                        }
                                    } else {
                                        if (_self.stage1.shipPos.x + _self.stage1.shipLength > 11) {
                                            _self.stage1.shipPos.x = 11 - _self.stage1.shipLength;
                                        }
                                    }


                                    _self.displayShipToPlace(_self.stage1.shipPos.y, _self.stage1.shipPos.x, _self.stage1.direction, _self.stage1.shipLength, userBoard);
                                });

                                element.addEventListener("click", function () {
                                    if (this.classList.contains("ship-can-place")) {
                                        for (var i = 0; i < _self.stage1.shipLength; i++) {
                                            if (_self.stage1.direction) {
                                                userBoard[_self.stage1.shipPos.y + i][_self.stage1.shipPos.x] = 1;
                                            } else {
                                                userBoard[_self.stage1.shipPos.y][_self.stage1.shipPos.x + i] = 1;
                                            }
                                        }


                                        _Board.default.printToDocument(userBoard, "userboard");


                                        _self.addCellsListeners(userBoard);


                                        _self.stage1.ship.remove();


                                        var menuShips = document.getElementsByClassName("menu-ship");

                                        if (!menuShips[0]) {
                                            return;
                                        }


                                        menuShips[0].classList.add("focused-ship");

                                        _self.stage1.shipLength = menuShips[0].childNodes.length;
                                        _self.stage1.ship = menuShips[0];
                                    }
                                });
                            };

                            for (var _iterator3 = boardCells[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                _loop();
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                                    _iterator3.return();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }
                    }
                }, {
                    key: "addBoardListeners",
                    value: function addBoardListeners() {
                        var userBoard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

                        var _self = this;


                        var board = document.getElementById("userboard");

                        board.addEventListener("contextmenu", function (e) {
                            e.preventDefault();

                            _self.stage1.direction ? _self.stage1.direction = 0 : _self.stage1.direction = 1;

                            _self.stage1.shipPos.y = _self.stage1.cellPos.y;
                            _self.stage1.shipPos.x = _self.stage1.cellPos.x;

                            if (_self.stage1.direction) {
                                if (_self.stage1.shipPos.y + _self.stage1.shipLength > 11) {
                                    _self.stage1.shipPos.y = 11 - _self.stage1.shipLength;
                                }
                            } else {
                                if (_self.stage1.shipPos.x + _self.stage1.shipLength > 11) {
                                    _self.stage1.shipPos.x = 11 - _self.stage1.shipLength;
                                }
                            }


                            _self.displayShipToPlace(_self.stage1.shipPos.y, _self.stage1.shipPos.x, _self.stage1.direction, _self.stage1.shipLength, userBoard);
                        });

                        board.addEventListener("mouseleave", function () {
                            _self.stage1.shipPos = {
                                x: null,
                                y: null
                            };

                            _self.stage1.cellPos = {
                                x: null,
                                y: null
                            };

                            _self.displayShipToPlace(_self.stage1.shipPos.y, _self.stage1.shipPos.x, _self.stage1.direction, _self.stage1.shipLength, userBoard);
                        }, false);
                    }
                }, {
                    key: "displayShipToPlace",
                    value: function displayShipToPlace(x, y, direction, shipLength, board) {
                        var boardCells = document.getElementsByClassName("board-cell");

                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = boardCells[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var _element4 = _step4.value;

                                _element4.classList.remove("ship-can-place");

                                _element4.classList.remove("ship-cannot-place");
                            }

                        } catch (err) {
                            _didIteratorError4 = true;
                            _iteratorError4 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                                    _iterator4.return();
                                }
                            } finally {
                                if (_didIteratorError4) {
                                    throw _iteratorError4;
                                }
                            }
                        }

                        if (!x || !y) {
                            return;
                        }


                        var canPlace = true;

                        for (var i = 0; i < shipLength; i++) {
                            if (direction) {
                                if (!_Board.default.checkCell(x + i, y, board)) {
                                    canPlace = false;
                                    break;
                                }
                            } else {
                                if (!_Board.default.checkCell(x, y + i, board)) {
                                    canPlace = false;
                                    break;
                                }
                            }
                        }


                        if (canPlace) {
                            for (var _i = 0; _i < shipLength; _i++) {
                                if (direction) {
                                    var element = document.getElementById("boardPos-".concat(x + _i).concat(y));
                                    element.classList.add("ship-can-place");
                                } else {
                                    var _element = document.getElementById("boardPos-".concat(x).concat(y + _i));

                                    _element.classList.add("ship-can-place");
                                }
                            }
                        } else {
                            for (var _i2 = 0; _i2 < shipLength; _i2++) {
                                if (direction) {
                                    var _element2 = document.getElementById("boardPos-".concat(x + _i2).concat(y));

                                    _element2.classList.add("ship-cannot-place");
                                } else {
                                    var _element3 = document.getElementById("boardPos-".concat(x).concat(y + _i2));

                                    _element3.classList.add("ship-cannot-place");
                                }
                            }
                        }
                    }
                }, {
                    key: "placeShipsMenu",
                    value: function placeShipsMenu() {
                        var ships = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                        var targetID = arguments.length > 1 ? arguments[1] : undefined;

                        if (ships[0]) {
                            var dest = document.getElementById(targetID);

                            ships.forEach(function (element) {
                                var ship = document.createElement("div");
                                ship.classList.add("menu-ship");

                                for (var i = 0; i < element; i++) {
                                    var shipCell = document.createElement("div");

                                    shipCell.classList.add("menu-ship-cell");

                                    ship.appendChild(shipCell);
                                }


                                dest.appendChild(ship);
                            });
                        } else {
                            console.log("plaeShipsMenu - Nie podano arraya statkÃ³w");
                            return;
                        }
                    }
                }, {
                    key: "displayStage2",
                    value: function displayStage2(userBoard, computerBoard) {
                        var main = document.createElement("div");
                        main.classList.add("main");

                        var userBoardDescDiv = document.createElement("div");
                        userBoardDescDiv.innerHTML = "User Board";

                        var computerBoardDescDiv = document.createElement("div");
                        computerBoardDescDiv.innerHTML = "Computer Board";

                        var userBoardDiv = document.createElement("div");
                        userBoardDiv.classList.add("board");
                        userBoardDiv.id = "userboard";

                        userBoardDiv.addEventListener("click", function () {
                            alert("Gdzie te Å‚apy?");
                        });

                        var computerBoardDiv = document.createElement("div");
                        computerBoardDiv.classList.add("board");
                        computerBoardDiv.id = "computerboard";

                        main.appendChild(userBoardDescDiv);
                        main.appendChild(computerBoardDescDiv);
                        main.appendChild(userBoardDiv);
                        main.appendChild(computerBoardDiv);

                        document.body.appendChild(main);

                        var turnDiv = document.createElement("div");
                        turnDiv.id = "turn-div";
                        turnDiv.textContent = "TwÃ³j ruch!";

                        document.body.appendChild(turnDiv);

                        _Board.default.printToDocument(userBoard, "userboard");

                        _Board.default.printToDocument(computerBoard, "computerboard", true);
                    }
                }]);

                return UI;
            }();

        exports.default = UI;

    }, { "./Board": 3 }], 6: [function (require, module, exports) {
        "use strict";

        var _Board = _interopRequireDefault(require("./class/Board"));

        var _Computer = _interopRequireDefault(require("./class/Computer"));

        var _UI = _interopRequireDefault(require("./class/UI"));

        var _AI = _interopRequireDefault(require("./class/AI"));

        var _Battle = _interopRequireDefault(require("./class/Battle"));

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        var Game =
            function () {
                function Game() {
                    _classCallCheck(this, Game);

                    this.board = new _Board.default();
                    this.computer = new _Computer.default();
                    this.userInterface = new _UI.default();

                    this.showOverlay = false;

                    this.shipsArray = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

                    this.artificialIntelligence = new _AI.default(this.showOverlay, this.shipsArray);

                    this.stage = 1;

                    this.computerBoard = this.board.generateBoard();
                    this.userBoard = this.board.generateBoard();

                    this.battle = new _Battle.default(this.userBoard, this.computerBoard, this.artificialIntelligence);

                    this.userShots = this.board.generateBoard();
                }

                _createClass(Game, [{
                    key: "initializeGame",
                    value: function initializeGame() {
                        var _this = this;

                        this.computer.generateShips(this.computerBoard, this.shipsArray);

                        this.userInterface.displayStage1(this.shipsArray, this.userBoard);

                        document.body.addEventListener("click", function () {
                            if (_this.stage == 1) {
                                var menuShips = document.getElementsByClassName("menu-ship");

                                if (!menuShips[0]) {
                                    document.getElementById("main").remove();

                                    _this.userInterface.displayStage2(_this.userBoard, _this.computerBoard);


                                    _this.battle.setListeners(_this.userShots);


                                    if (_this.showOverlay) _this.battle.setupOverlay();

                                    _this.battle.turnDiv = document.getElementById("turn-div");

                                    _this.stage = 2;
                                }
                            }
                        });
                    }
                }]);

                return Game;
            }();

        var statki = new Game();
        statki.initializeGame();

    }, { "./class/AI": 1, "./class/Battle": 2, "./class/Board": 3, "./class/Computer": 4, "./class/UI": 5 }]
}, {}, [6]);
