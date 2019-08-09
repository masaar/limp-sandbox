(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "fieldset {\r\n\tborder: none;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvYXBwLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Q0FDQyxZQUFZO0FBQ2IiLCJmaWxlIjoic3JjL2FwcC9hcHAuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbImZpZWxkc2V0IHtcclxuXHRib3JkZXI6IG5vbmU7XHJcbn0iXX0= */"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h1>LIMP Sandbox</h1>\r\n<div style=\"display: flex\">\r\n\t<div style=\"flex: 1\">\r\n\t\t<div *ngIf=\"showInit\">\r\n\t\t\t<h2>SDK Init</h2>\r\n\t\t\t<fieldset>\r\n\t\t\t\t<label>API URI</label>\r\n\t\t\t\t<input type=\"text\" [(ngModel)]=\"environment.ws_api\">\r\n\t\t\t</fieldset>\r\n\t\t\t<fieldset>\r\n\t\t\t\t<label>API Anon Token</label>\r\n\t\t\t\t<input type=\"text\" [(ngModel)]=\"environment.anon_token\" (change)=\"updateAnonToken()\">\r\n\t\t\t</fieldset>\r\n\t\t\t<button (click)=\"init()\">init()</button>\r\n\t\t</div>\r\n\t\t<button (click)=\"showInit = !showInit\">toggle showInit</button>\r\n\t\t<div *ngIf=\"showAuth\">\r\n\t\t\t<h2>SDK Auth</h2>\r\n\t\t\t<fieldset>\r\n\t\t\t\t<label>Auth Var</label>\r\n\t\t\t\t<select [(ngModel)]=\"authVars.var\">\r\n\t\t\t\t\t<option *ngFor=\"let authVar of ['username', 'email', 'phone']\" [value]=\"authVar\">{{authVar}}\r\n\t\t\t\t\t</option>\r\n\t\t\t\t</select>\r\n\t\t\t</fieldset>\r\n\t\t\t<fieldset>\r\n\t\t\t\t<label>Auth Val</label>\r\n\t\t\t\t<input type=\"text\" [(ngModel)]=\"authVars.val\">\r\n\t\t\t</fieldset>\r\n\t\t\t<fieldset>\r\n\t\t\t\t<label>Password</label>\r\n\t\t\t\t<input type=\"text\" [(ngModel)]=\"authVars.password\">\r\n\t\t\t</fieldset>\r\n\t\t\t<button (click)=\"auth()\">auth()</button>\r\n\t\t\t<button (click)=\"checkAuth()\">checkAuth()</button>\r\n\t\t\t<button (click)=\"signout()\">signout()</button>\r\n\t\t</div>\r\n\t\t<button (click)=\"showAuth = !showAuth\">toggle showAuth</button>\r\n\t\t<div>\r\n\t\t\t<h2>SDK Call</h2>\r\n\t\t\t<fieldset>\r\n\t\t\t\t<label>Endpoint</label>\r\n\t\t\t\t<input type=\"text\" [(ngModel)]=\"callArgs.endpoint\">\r\n\t\t\t</fieldset>\r\n\t\t\t<fieldset>\r\n\t\t\t\t<label>SID</label>\r\n\t\t\t\t<input type=\"text\" [(ngModel)]=\"callArgs.sid\">\r\n\t\t\t</fieldset>\r\n\t\t\t<fieldset>\r\n\t\t\t\t<label>Token</label>\r\n\t\t\t\t<input type=\"text\" [(ngModel)]=\"callArgs.token\">\r\n\t\t\t</fieldset>\r\n\t\t\t<fieldset>\r\n\t\t\t\t<label>Query</label>\r\n\t\t\t\t<json-editor [options]=\"editorOptionsCode\" [(ngModel)]=\"callArgs.query\"></json-editor>\r\n\t\t\t</fieldset>\r\n\t\t\t<fieldset>\r\n\t\t\t\t<label>Doc</label>\r\n\t\t\t\t<json-editor [options]=\"editorOptionsCode\" [(ngModel)]=\"callArgs.doc\"></json-editor>\r\n\t\t\t</fieldset>\r\n\t\t\t<button (click)=\"call()\">call()</button>\r\n\t\t</div>\r\n\t</div>\r\n\t<div id=\"output-console\" style=\"flex: 1; height: 80vh; overflow-x: auto; overflow-y: scroll;\">\r\n\t\t<h2>Output</h2>\r\n\t\t<ng-container *ngFor=\"let item of output\">\r\n\t\t\t<pre *ngIf=\"item.type == 'text'\" style=\"white-space: pre-line; word-break: break-all;\">\r\n\t\t\t\t{{ item.value }}\r\n\t\t\t</pre>\r\n\t\t\t<json-editor *ngIf=\"item.type == 'json'\" [options]=\"editorOptionsView\" [data]=\"item.value\"></json-editor>\r\n\t\t</ng-container>\r\n\t\t<button (click)=\"output = []\">clear output</button>\r\n\t</div>\r\n</div>"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var ang_jsoneditor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ang-jsoneditor */ "./node_modules/ang-jsoneditor/fesm5/ang-jsoneditor.js");
/* harmony import */ var ng_limp__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ng-limp */ "./node_modules/ng-limp/fesm5/ng-limp.js");
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/environments/environment */ "./src/environments/environment.ts");








var AppComponent = /** @class */ (function () {
    function AppComponent(api, formBuilder) {
        this.api = api;
        this.formBuilder = formBuilder;
        this.environment = src_environments_environment__WEBPACK_IMPORTED_MODULE_7__["environment"];
        this.authVars = {
            var: 'email',
            val: 'ADMIN@LIMP.MASAAR.COM',
            password: '__ADMIN',
            auth: null
        };
        this.showInit = true;
        this.showAuth = true;
        this.guardOn = true;
        this.callArgs = {
            sid: 'f00000000000000000000012',
            token: src_environments_environment__WEBPACK_IMPORTED_MODULE_7__["environment"].anon_token,
            endpoint: '',
            query: [],
            doc: {}
        };
        this.output = [];
        this.editorOptionsView = new ang_jsoneditor__WEBPACK_IMPORTED_MODULE_5__["JsonEditorOptions"]();
        this.editorOptionsView.modes = ['code', 'view']; // set all allowed modes
        this.editorOptionsView.mode = 'view'; //set only one mode
        this.editorOptionsView.statusBar = false;
        this.editorOptionsCode = new ang_jsoneditor__WEBPACK_IMPORTED_MODULE_5__["JsonEditorOptions"]();
        this.editorOptionsCode.modes = ['code', 'view'];
        this.editorOptionsCode.mode = 'code';
        this.editorOptionsCode.statusBar = false;
    }
    AppComponent.prototype.ngOnInit = function () {
        this.api.debug = true;
    };
    AppComponent.prototype.updateAnonToken = function () {
        this.callArgs.token = src_environments_environment__WEBPACK_IMPORTED_MODULE_7__["environment"].anon_token;
    };
    AppComponent.prototype.init = function () {
        var _this = this;
        this.api.init(src_environments_environment__WEBPACK_IMPORTED_MODULE_7__["environment"].ws_api, src_environments_environment__WEBPACK_IMPORTED_MODULE_7__["environment"].anon_token)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(function (err) {
            if (err instanceof CloseEvent) {
                _this.output.push({ type: 'text', value: 'Connection Closed.' });
            }
            else {
                _this.output.push({ type: 'json', value: err });
            }
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["throwError"])(err);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["retry"])(10))
            .subscribe(function (res) {
            if (res.args.code == 'CORE_CONN_OK') {
                _this.showInit = false;
            }
            _this.output.push({ type: 'json', value: res });
            document.querySelector('#output-console > button').scrollIntoView();
        }, function (err) {
            if (err instanceof CloseEvent) {
                _this.output.push({ type: 'text', value: 'Connection Closed.' });
            }
            else {
                _this.output.push({ type: 'json', value: err });
            }
        }, function () {
            console.log('complete');
        });
        this.api.authed$.subscribe(function (session) {
            if (session) {
                _this.guardOn = false;
                _this.authVars.auth = session;
            }
            else {
                _this.guardOn = true;
            }
        });
    };
    AppComponent.prototype.auth = function () {
        var _this = this;
        this.logCall("api.auth(" + this.authVars.var + ", " + this.authVars.val + ", " + this.authVars.password + ")");
        this.api.auth(this.authVars.var, this.authVars.val, this.authVars.password).subscribe(function (res) {
            _this.showAuth = false;
            // this.authVars.auth = res.args.docs[0]
            _this.callArgs.sid = res.args.docs[0]._id;
            _this.callArgs.token = res.args.docs[0].token;
        }, function (err) {
        });
    };
    AppComponent.prototype.checkAuth = function () {
        var _this = this;
        this.logCall('api.checkAuth()');
        this.api.checkAuth()
            .subscribe(function (res) {
            _this.showAuth = false;
            _this.callArgs.sid = _this.api.session._id;
            _this.callArgs.token = _this.api.session.token;
        }, function (err) {
            _this.output.push({ type: 'json', value: err });
        });
    };
    AppComponent.prototype.signout = function () {
        this.logCall('api.signout()');
        this.api.signout().subscribe();
    };
    AppComponent.prototype.call = function () {
        var query = JSON.parse(JSON.stringify(this.callArgs.query));
        var doc = JSON.parse(JSON.stringify(this.callArgs.doc));
        this.logCall("api.call(" + this.callArgs.endpoint + ", {query:" + JSON.stringify(query) + ", doc:" + JSON.stringify(doc) + "})");
        this.api.call(this.callArgs.endpoint, {
            sid: this.callArgs.sid,
            token: this.callArgs.token,
            query: query,
            doc: doc
        }).subscribe(function (res) {
            // this.output += JSON.stringify(res) + '\n';
        }, function (err) {
            // this.output += JSON.stringify(err) + '\n';
        });
    };
    AppComponent.prototype.logCall = function (call) {
        this.output.push({ type: 'text', value: "===\nPushing call:\n" + call + "\n===\n" });
    };
    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [ng_limp__WEBPACK_IMPORTED_MODULE_6__["ApiService"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ang_jsoneditor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ang-jsoneditor */ "./node_modules/ang-jsoneditor/fesm5/ang-jsoneditor.js");
/* harmony import */ var ng_limp__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ng-limp */ "./node_modules/ng-limp/fesm5/ng-limp.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _object_pipe__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./object.pipe */ "./src/app/object.pipe.ts");









var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_7__["AppComponent"],
                _object_pipe__WEBPACK_IMPORTED_MODULE_8__["KeysPipe"],
                _object_pipe__WEBPACK_IMPORTED_MODULE_8__["ValuesPipe"]
            ],
            imports: [
                _angular_http__WEBPACK_IMPORTED_MODULE_2__["HttpModule"],
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["BrowserModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
                ang_jsoneditor__WEBPACK_IMPORTED_MODULE_5__["NgJsonEditorModule"],
                ng_limp__WEBPACK_IMPORTED_MODULE_6__["NgLimpModule"].forRoot()
            ],
            providers: [],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_7__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/object.pipe.ts":
/*!********************************!*\
  !*** ./src/app/object.pipe.ts ***!
  \********************************/
/*! exports provided: KeysPipe, ValuesPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KeysPipe", function() { return KeysPipe; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ValuesPipe", function() { return ValuesPipe; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var KeysPipe = /** @class */ (function () {
    function KeysPipe() {
    }
    KeysPipe.prototype.transform = function (value, args) {
        // // create instance vars to store keys and final output
        // let keyArr: any[] = Object.keys(value),
        //     dataArr = [];
        // // loop through the object,
        // // pushing values to the return array
        // keyArr.forEach((key: any) => {
        //     dataArr.push(value[key]);
        // });
        // // return the resulting array
        // return dataArr;
        return Object.keys(value);
    };
    KeysPipe = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Pipe"])({ name: 'keys', pure: false })
    ], KeysPipe);
    return KeysPipe;
}());

var ValuesPipe = /** @class */ (function () {
    function ValuesPipe() {
    }
    ValuesPipe.prototype.transform = function (value, args) {
        var keyArr = Object.keys(value), dataArr = [], keyName = (args && args[0]) ? args[0] : 'key', keyOrder = (args && args[1]) ? args[1] : false;
        keyArr.forEach(function (key) {
            value[key][keyName] = key;
            dataArr.push(value[key]);
        });
        if (keyOrder) {
            dataArr.sort(function (a, b) {
                return a[keyName] > b[keyName] ? 1 : -1;
            });
        }
        return dataArr;
    };
    ValuesPipe = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Pipe"])({ name: 'values', pure: false })
    ], ValuesPipe);
    return ValuesPipe;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false,
    ws_api: 'ws://localhost:8081/ws',
    http_api: 'http://localhost:8081',
    anon_token: '__ANON_TOKEN_f00000000000000000000012'
};
/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\devel\limp\limp-sandbox\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map