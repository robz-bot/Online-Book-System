/*------------------------------------------------Optional / Required to update / change----------------------------------------------------
err_class - CCS Class Name for error
Resource: $login - Login URL
$loginkey - This is unique key, must be available in login view like as html id, title, body id etc...
--------------------------------------------------------------------------------------------------------------------------------------------*/


var _APPLocation = window.location.href.split("/");
if (_APPLocation[2].toLowerCase().indexOf("localhost") > -1) {
    if (_APPLocation[2].indexOf(":") > -1) {
        _APPLocation = _APPLocation[0] + "//" + _APPLocation[2] + "/";
    }
    else {
        _APPLocation = _APPLocation[0] + "//" + _APPLocation[2] + "/" + _APPLocation[3] + "/";
    }

}
else if (window.location.href.toLowerCase().indexOf("fasttruck") > -1) {
    _APPLocation = _APPLocation[0] + "//" + _APPLocation[2] + "/" + _APPLocation[3] + "/";
}
else { _APPLocation = _APPLocation[0] + "//" + _APPLocation[2] + "/"; }

function ValidateAjaxResult(response) {
    var _result;
    if (response && response.data) {
        _result = response.data;
    }
    else {
        _result = response;
    }
    if (typeof (_result) == "string") {
        _result = $(_result);
        if (_result.length > 0) {
            _result = _result.find("#frmSignIn");
            if (_result.length > 0) {
                $('#page-preloader').hide();
                alert(_$session);
                // alert('Token life time invalid');
                window.location = "/Signin?returnUrl=" + window.location.pathname + window.location.search;
                return false;
            }
        }
    }
    else if (_result && _result.Message == "Sign in to Continue") {
        $('#page-preloader').hide();
        window.location = "/Signin?returnUrl=" + window.location.pathname + window.location.search;
        return false;
    }
    return true;
};


var $myApp = angular.module("BookApp", []);

var percentValue = 10;
$myApp.calculatePercentage = function (value) {
    return (value * percentValue) / 100;
}
$myApp.ShowLoader = function () {
    $('#page-preloader').show();
};

$myApp.HideLoader = function () {
    $('#page-preloader').hide();
}
//$myApp.run(function (uiMaskConfig) {
//    uiMaskConfig.clearOnBlur = false;
//});
var diplayError = false;
$myApp.service('amilInterceptor', function ($q, $injector) {
    var flightCalls = null;
    return {
        responseError: function (response) {
            var config = response.config;
            //Invalid/Error/403
            switch (response.status) {
                case 401:

                    var deferred = $q.defer();
                    if (!flightCalls) {
                        var lcInformation = localStorage.getItem('token');
                        if (lcInformation) {
                            var jsonInfor = JSON.parse(lcInformation);
                            flightCalls = $injector.get("$http").post(_APPLocation + 'Home/GetNewToken',
                                {
                                    RefreshToken: jsonInfor.RefreshToken
                                });
                        }
                    }
                    flightCalls.then(function (response) {
                        flightCalls = null;
                        if (response) {
                            if (!response.data) {
                                deferred.reject();
                                if (!$myApp.tokenExpiredMessageShow) {
                                    $myApp.tokenExpiredMessageShow = true;
                                    alert('Token life time invalid');
                                    localStorage.clear();
                                    window.location = _APPLocation + "Home/Logout";
                                }
                                return;
                            }
                            if (response.data) {
                                localStorage.setItem("token", response.data);
                            }
                            var lcInformation = localStorage.getItem('token');
                            if (!lcInformation) {
                                deferred.reject();
                                if (!$myApp.tokenExpiredMessageShow) {
                                    $myApp.tokenExpiredMessageShow = true;
                                    alert('Token life time invalid');
                                    localStorage.clear();
                                    window.location = _APPLocation + "Home/Logout";
                                }
                                return;
                            }
                            var jsonInfor = JSON.parse(lcInformation);
                            config.headers = {
                                'Authorization': 'Bearer ' + jsonInfor.Token
                            };
                            $injector.get("$http")(config).then(function (resp) {
                                deferred.resolve(resp);
                                if (response.status != 200) {

                                    console.log('Token Invalid');
                                }
                            }, function (resp) {
                                console.log(resp);
                                console.log(response.headers());
                                if (!$myApp.tokenExpiredMessageShow) {
                                    $myApp.tokenExpiredMessageShow = true;
                                    alert('Token life time invalid');
                                    localStorage.clear();
                                    window.location = _APPLocation + "Home/Logout";
                                }
                                return deferred.reject();
                            });
                        } else {
                            if (!$myApp.tokenExpiredMessageShow) {
                                $myApp.tokenExpiredMessageShow = true;
                                alert('Token life time invalid');
                                localStorage.clear();
                                window.location = _APPLocation + "Home/Logout";
                            }
                            return deferred.reject();
                        }
                    }, function (response) {
                        if (!$myApp.tokenExpiredMessageShow) {
                            $myApp.tokenExpiredMessageShow = true;
                            alert('Token life time invalid');
                            localStorage.clear();
                            window.location = _APPLocation + "Home/Logout";
                        }
                        console.log(response.headers());
                        flightCalls = null;
                        deferred.reject();
                        authService.clear();
                        //TODO Naviaget to Login Page    
                        localStorage.clear();
                        window.location = _APPLocation + "Home/Logout";
                        return;
                    });
                    return deferred.promise;
                    break;
                case 403:
                    var deferred = $q.defer();
                    if (!diplayError) {
                        diplayError = true;
                        $.notify("<div id='divVMSGCtrl' class='msgul'>Access Forbidden:</div><ul class='msgul'><li><label class='error'>Sorry, You don't have access. Please contact support team.</label></li></ul>", {
                            autoHide: false, className: "warn", globalPosition: 'top center', IsHTML: true
                        });
                    }
                    return deferred.promise;
                    break;
                //case 401:
                //    window.location = "/Invalid/Error/403";
                //    break;
                default:
                    break;
            }
            return response || $q.when(response);
        }
        //,
        //    tokenvalidate: function () {
        //    if (!$myApp.tokenExpiredMessageShow) {
        //        $myApp.tokenExpiredMessageShow = true;
        //        alert('Token life time invalid');
        //        window.location = "/Signin?returnUrl=" + window.location.pathname + window.location.search;
        //    }
        //},
    }
});
$myApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('amilInterceptor');

    var tokenvalue = localStorage.getItem('token');
    var tokenData;
    if (tokenvalue) {
        try {
            tokenData = JSON.parse(tokenvalue);
        }
        catch (e) {
            tokenData = tokenvalue;
        }
        if (tokenData) {
            $httpProvider.defaults.headers.common = {
                'Authorization': 'Bearer ' + tokenData.Token,
                'apikey': "BA43D6DE-608A-40B0-ABC5-E97E4FB2A3B5",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
        }
    } else {
        $httpProvider.defaults.headers.common = {
            'apikey': "BA43D6DE-608A-40B0-ABC5-E97E4FB2A3B5",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }
    //var headers = {
    //'Access-Control-Allow-Origin': '*',
    //'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
    //'Content-Type': 'application/json',
    //'Accept': 'application/json'
    //};
}]);
$myApp.factory('customService', function ($http, $location, $q) {
    return {
        appUrl: _APPLocation,
        formValidate: function (id) {
            var result = false;
            var _obj = id;
            if (_obj.$valid) {
                result = true;
            }
            else if (_obj.$invalid) {
                angular.forEach(_obj.$error, function (field) {
                    angular.forEach(field, function (errorField) {
                        $('form[name="' + _obj.$name + '"]').find('input[name="' + errorField.$name + '"]').addClass('error');
                        errorField.$setTouched();
                    });
                });
            }
            return result;
        },
        getCrossDomainData: function (url, params, callback, loadingmessage, type) {
            if (loadingmessage == undefined || loadingmessage == '') {
                loadingmessage = "Loading";
            }
            $myApp.Preloader.hide();
            if (loadingmessage != "-") {
                $myApp.Preloader.find("#preloadermsg").html(loadingmessage);
                $myApp.Preloader.show();
            }
            $http.get(url, params)
                .then(function (response) {
                    if (ValidateAjaxResult(response)) {
                        if (response.data) {
                            callback(response.data);
                        }
                        else {
                            callback(response);
                        }
                    }
                    if (type != "showloader") {
                        $('#page-preloader').hide();
                    }
                }, function (error) {
                    try { $('#page-preloader').hide(); } catch (e) { }
                    if (error.status == 401) {
                        app.Alert(Resource.$session, function () {
                            window.location = _APPLocation + Resource.$session;
                        });
                    }
                    else {
                        app.Alert(Resource.$error);
                    }
                });
        },
        postData: function (url, params, callback, loadingmessage, showLoader = true) {
            //$myApp.Preloader.hide();
            if (showLoader) {
                if (loadingmessage && loadingmessage != "-") {
                    $myApp.Preloader.find("#preloadermsg").html(loadingmessage);
                    $myApp.Preloader.show();
                }
            }
            $http.post(_APPLocation + url, params)
                .then(function (response) {
                    if (ValidateAjaxResult(response)) {
                        if (response.data) {
                            callback(response.data);
                        }
                        else {
                            callback(response);
                        }
                    }
                   //$myApp.Preloader.hide();
                }, function (error) {
                    $myApp.Preloader.hide();
                    if (error.status == 401) {
                        app.Alert(Resource.$session, function () {
                            window.location = _APPLocation + Resource.$session;
                        });
                    }
                    else {
                        app.Alert(Resource.$error);
                    }
                });
        },
        postFastFind: function (url, params, callback, loadingmessage) {
            $myApp.Preloader.hide();
            if (loadingmessage != "-") {
                $myApp.Preloader.find("#preloadermsg").html(loadingmessage);
                $myApp.Preloader.show();
            }

            $myApp.cancellerFastFind = $q.defer();
            var requestPromise = $http({
                url: _APPLocation + url,
                data: params,
                method: 'POST',
                timeout: $myApp.cancellerFastFind.promise
            });
            requestPromise.
                success(function (data, status, headers, config) {

                    if (ValidateAjaxResult(data)) {
                        if (data.data) {
                            callback(data.data);
                        }
                        else {
                            callback(data);
                        }
                    }
                    $myApp.Preloader.hide();
                }).
                error(function (data, status, headers, config) {
                    $myApp.Preloader.hide();
                    $myApp.cancellerFastFind.resolve();

                });
        },
        postFastFind: function (url, params, callback, loadingmessage) {
            $myApp.Preloader.hide();
            if (loadingmessage != "-") {
                $myApp.Preloader.find("#preloadermsg").html(loadingmessage);
                $myApp.Preloader.show();
            }

            $myApp.cancellerFastFind = $q.defer();
            var requestPromise = $http({
                url: url,
                data: params,
                method: 'POST',
                timeout: $myApp.cancellerFastFind.promise
            });
            requestPromise.
                success(function (data, status, headers, config) {

                    if (ValidateAjaxResult(data)) {
                        if (data.data) {
                            callback(data.data);
                        }
                        else {
                            callback(data);
                        }
                    }
                    $myApp.Preloader.hide();
                }).
                error(function (data, status, headers, config) {
                    $myApp.Preloader.hide();
                    $myApp.cancellerFastFind.resolve();

                });
        },
        postFastFind: function (url, params, callback, loadingmessage) {
            $myApp.Preloader.hide();
            if (loadingmessage != "-") {
                $myApp.Preloader.find("#preloadermsg").html(loadingmessage);
                $myApp.Preloader.show();
            }

            $myApp.cancellerFastFind = $q.defer();
            var requestPromise = $http({
                url: url,
                data: params,
                method: 'POST',
                timeout: $myApp.cancellerFastFind.promise
            });
            requestPromise.
                success(function (data, status, headers, config) {

                    if (ValidateAjaxResult(data)) {
                        if (data.data) {
                            callback(data.data);
                        }
                        else {
                            callback(data);
                        }
                    }
                    $myApp.Preloader.hide();
                }).
                error(function (data, status, headers, config) {
                    $myApp.Preloader.hide();
                    $myApp.cancellerFastFind.resolve();

                });
        },
        postMapCrossdomain: function (url, params, callback, loadingmessage) {
            $myApp.Preloader.hide();
            if (loadingmessage != "-") {
                $myApp.Preloader.find("#preloadermsg").html(loadingmessage);
                $myApp.Preloader.show();
            }

            $myApp.canceller = $q.defer();
            var requestPromise = $http({
                url: url,
                data: params,
                method: 'POST',
                timeout: $myApp.canceller.promise
            });
            requestPromise.
                success(function (data, status, headers, config) {

                    if (ValidateAjaxResult(data)) {
                        if (data && data.data) {
                            callback(data.data);
                        }
                        else {
                            callback(data);
                        }
                    }
                    $myApp.Preloader.hide();
                }).
                error(function (data, status, headers, config) {
                    $myApp.Preloader.hide();
                    $myApp.canceller.resolve();

                });
        },
        postCrossdomain: function (url, params, callback, loadingmessage) {
            $myApp.Preloader.hide();
            if (loadingmessage != "-") {
                $myApp.Preloader.find("#preloadermsg").html(loadingmessage);
                $myApp.Preloader.show();
            }
            $http.post(url, params)
                .then(function (response) {
                    if (ValidateAjaxResult(response)) {
                        if (response.data) {
                            callback(response.data);
                        }
                        else {
                            callback(response);
                        }
                    }
                    $myApp.Preloader.hide();
                }, function (error) {
                    $myApp.Preloader.hide();
                    if (error.status == 401) {
                        app.Alert(Resource.$session, function () {
                            window.location = _APPLocation + Resource.$session;
                        });
                    }
                    else {
                        app.Alert(Resource.$error);
                    }
                });
        },
        getData: function (url, params, callback, loadingmessage) {
            if (loadingmessage == undefined || loadingmessage == '') {
                loadingmessage = "Loading";
            }
            $myApp.Preloader.find("#preloadermsg").html(loadingmessage);
            $myApp.Preloader.show();
            $http.get(_APPLocation + url, params)
                .then(function (response) {
                    if (ValidateAjaxResult(response)) {
                        if (response.data) {
                            callback(response.data);
                        }
                        else {
                            callback(response);
                        }
                    }
                    $('#page-preloader').hide();
                }, function (error) {
                    try { $('#page-preloader').hide(); } catch (e) { }
                    if (error.status == 401) {
                        app.Alert(Resource.$session, function () {
                            window.location = _APPLocation + Resource.$session;
                        });
                    }
                    else {
                        app.Alert(Resource.$error);
                    }
                });
        },
        putData: function (url, params, callback, loadingmessage) {
            if (loadingmessage == undefined || loadingmessage == '') {
                loadingmessage = "Loading";
            }
            $myApp.Preloader.find("#preloadermsg").html(loadingmessage);
            $myApp.Preloader.show();
            $http.put(_APPLocation + url, params)
                .then(function (response) {
                    callback(response.data);
                    $('#page-preloader').hide();
                }, function (error) {
                    try { $('#page-preloader').hide(); } catch (e) { }
                    if (error.status == 401) {
                        app.Alert(Resource.$session, function () {
                            window.location = _APPLocation + Resource.$session;
                        });
                    }
                    else {
                        app.Alert(Resource.$error);
                    }
                });
        },
        postFilesdata: function (url, params, callback, loadingmessage) {
            if (loadingmessage == undefined || loadingmessage == '') {
                loadingmessage = "Loading";
            }
            $myApp.Preloader.find("#preloadermsg").html(loadingmessage);
            $myApp.Preloader.show();
            $http({
                url: _APPLocation + url,
                method: "POST",
                headers: { "Content-Type": undefined },
                transformRequest: function (data) {
                    var formData = new FormData();
                    for (name in data) {
                        var obj = eval("data." + name);
                        if (obj != null) {
                            if (typeof (obj) == 'object' && obj.toLocaleString && obj.toLocaleString().indexOf("File") > -1) {

                                for (var i = 0; i < obj.length; i++) {
                                    formData.append(name + "[" + i + "]", obj[i]);
                                }
                            }
                            else {
                                formData.append(name, angular.toJson(obj));
                            }
                        }
                    }
                    return formData;
                },
                data: params
            }).then(function (response) {
                if (ValidateAjaxResult(response)) {
                    callback(response.data);
                }
                $myApp.Preloader.hide();
            }, function (error) {
                try { $myApp.Preloader.hide(); } catch (e) { }
                if (error.status == 401) {
                    app.Alert(Resource.$session, function () {
                        window.location = _APPLocation + Resource.$session;
                    });
                }
                else {
                    app.Alert(Resource.$error);
                }
            })
        },
        postFilesdataCrossDomain: function (url, params, callback, loadingmessage) {
            if (loadingmessage == undefined || loadingmessage == '') {
                loadingmessage = "Loading";
            }
            $myApp.Preloader.find("#preloadermsg").html(loadingmessage);
            $myApp.Preloader.show();
            $http({
                url: url,
                method: "POST",
                headers: { "Content-Type": undefined },
                transformRequest: function (data) {
                    var formData = new FormData();
                    for (name in data) {
                        var obj = eval("data." + name);
                        if (obj != null) {
                            if (typeof (obj) == 'object' && obj.toLocaleString && obj.toLocaleString().indexOf("File") > -1) {

                                for (var i = 0; i < obj.length; i++) {
                                    formData.append(name + "[" + i + "]", obj[i]);
                                }
                            }
                            else {
                                formData.append(name, angular.toJson(obj));
                            }
                        }
                    }
                    return formData;
                },
                data: params
            }).then(function (response) {
                if (ValidateAjaxResult(response)) {
                    callback(response.data);
                }
                $myApp.Preloader.hide();
            }, function (error) {
                try { $myApp.Preloader.hide(); } catch (e) { }
                if (error.status == 401) {
                    $myApp.Alert(Resource.$session, function () {
                        window.location = _APPLocation + Resource.$session;
                    });
                }
                else {
                    app.Alert(Resource.$error);
                }
            })
        },
        getDate: function (input, getDefaultDateForNull, format) {
            var date = '';

            if (input != undefined && input != null && input != '') {

                var dateFormat = (format == null || format == undefined || format == '') ? 'mm/dd/yyyy' : format;

                var Months = new Array();
                Months[0] = "Jan";
                Months[1] = "Feb";
                Months[2] = "Mar";
                Months[3] = "Apr";
                Months[4] = "May";
                Months[5] = "Jun";
                Months[6] = "Jul";
                Months[7] = "Aug";
                Months[8] = "Sep";
                Months[9] = "Oct";
                Months[10] = "Nov";
                Months[11] = "Dec";

                var currentDate = null;
                var dateString = null;
                if (input == null || input == undefined || input == "") {
                    if ((getDefaultDateForNull != null && getDefaultDateForNull != undefined && getDefaultDateForNull == true)) {
                        currentDate = new Date();
                    }
                }
                else {
                    dateString = input.substr(6);
                    currentDate = new Date(parseInt(dateString));
                }

                var month = currentDate.getMonth() + 1;
                var day = currentDate.getDate();
                var year = currentDate.getFullYear();
                var separatorElement = dateFormat.split(/[/,-]+/);

                if (currentDate != null && dateFormat != null) {
                    for (var i = 0; i < separatorElement.length; i++) {
                        switch (separatorElement[i]) {
                            case "dd":
                                day = ("0" + day).slice(-2);
                                dateFormat = dateFormat.replace("dd", day);
                                break;
                            case "mm":
                                month = ("0" + month).slice(-2);
                                dateFormat = dateFormat.replace("mm", month);
                                break;
                            case "yyyy":
                                dateFormat = dateFormat.replace("yyyy", year);
                                break;
                            case "mmm":
                                dateFormat = dateFormat.replace("mmm", Months[currentDate.getMonth()]);
                                break;
                            default:
                                break;
                        }
                    }
                }

                return dateFormat;
            }
            return null;
        }
    }

});


$myApp.directive('ngCompareto', function () {
    return {
        require: "ngModel",
        scope: { otherModelValue: "=ngCompareto" },
        link: function (scope, element, attrs, ctrl) {
            if (!ctrl) return;
            var validator = function (value) {
                ctrl.$setValidity('compareto', (value == scope.otherModelValue));
                return value;
            }
            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.push(validator);
            attrs.$observe("compareto", function () {
                validator(ctrl.$viewValue);
            });
        }
    };
}).directive('ngRdbrequired', function () {
    return {
        require: "ngModel",
        scope: { otherModelValue: "=ngRdbrequired" },
        link: function (scope, element, attrs, ctrl) {
            if (!ctrl) return;
            var validator = function (value) {
                var _result = false;
                if (typeof (scope.otherModelValue) == "boolean") {
                    _result = value;
                }
                else if (typeof (scope.otherModelValue) == "number")
                    _result = (value > 0);
                ctrl.$setValidity('rdbrequired', _result);
                return value;
            }
            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.push(validator);
            attrs.$observe("rdbrequired", function () {
                validator(ctrl.$viewValue);
            });
        }
    };
}).directive('ngValidfile', function () {
    var validFormats = ['doc', 'docx', 'pdf'];
    return {
        require: 'ngModel',
        scope: { otherModelValue: "=ngValidfile" },
        link: function (scope, element, attrs, ctrl) {
            if (!ctrl) return;
            attrs.$observe("validfile", function () {

            });
            element.bind('change', function () {
                var value = element.val();
                ext = value.substring(value.lastIndexOf('.') + 1).toLowerCase();
                ctrl.$setValidity("validfile", (validFormats.indexOf(ext) != -1));
            });
        }
    };
}).directive('ngSelectbyvalue', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            attrs.$observe("selectbyvalue", function () {
            });
        }
    }
}).directive('compile', ['$compile', function ($compile) {
    return function (scope, element, attrs) {
        scope.$watch(
            function (scope) {
                return scope.$eval(attrs.compile);
            },
            function (value) {
                element.html(value);
                $compile(element.contents())(scope);
            }
        );
    };
}]).directive('chosen', function () {
    var linker = function (scope, element, attr) {

        $(".chosen-container .chosenState").bind('keypress', function (e) {

            element.trigger('change');
        });

        scope.$watch(('StateCollection', 'vendorList', 'CityCollection'), function () {
            element.trigger('chosen:updated');
        })


        element.chosen({ search_contains: true });

    };
    return {
        restrict: '',
        link: linker
    }
}).directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
}).directive('nullToEmpty', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            ctrl.$parsers.push(function (viewValue) {
                if (viewValue === null || viewValue === undefined) {
                    return '';
                }
                return viewValue;
            });
        }
    };
}).directive('ngRequiredUscontact', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = /[1-9]{2}\d{8}/;
                    if (transformedInput.test(text)) {
                        ngModelCtrl.$setValidity('validate', true);
                    }
                    else {
                        ngModelCtrl.$setValidity('validate', false);
                    }

                    return text;
                }
                ngModelCtrl.$setValidity('validate', false);
                return undefined;
            }
            ngModelCtrl.$parsers.unshift(fromUser);
        }
    }
}).directive('ngRequiredNumbersOnly', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    ngModelCtrl.$setValidity('validate', true);
                    return transformedInput;
                }
                ngModelCtrl.$setValidity('validate', false);
            }
            ngModelCtrl.$parsers.unshift(fromUser);
        }
    };
}).directive('ngStartWithNonZeroNumbers', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput == 0) {
                        transformedInput = '';
                    }

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    ngModelCtrl.$setValidity('validate', true);
                    return transformedInput;
                }
                ngModelCtrl.$setValidity('validate', false);
            }
            ngModelCtrl.$parsers.unshift(fromUser);
        }
    };
}).directive('ngNumbersOnly', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    ngModelCtrl.$setValidity('validate', true);
                    return transformedInput;
                }
                ngModelCtrl.$setValidity('validate', true);
                return '';
            }
            ngModelCtrl.$parsers.unshift(fromUser);
        }
    };
}).directive('ngRequiredAlphanumeric', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^a-zA-Z0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    ngModelCtrl.$setValidity('validate', true);
                    return transformedInput;
                }
                ngModelCtrl.$setValidity('validate', false);
            }
            ngModelCtrl.$parsers.unshift(fromUser);
        }
    };
}).directive('ngRequiredAlphabetsOnly', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^a-zA-Z\s]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    ngModelCtrl.$setValidity('validate', true);
                    return transformedInput;
                }
                ngModelCtrl.$setValidity('validate', false);
            }
            ngModelCtrl.$parsers.unshift(fromUser);
        }
    };
}).directive('ngAlphabetsOnly', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^a-zA-Z\s]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    ngModelCtrl.$setValidity('validate', true);
                    return transformedInput;
                }
                ngModelCtrl.$setValidity('validate', true);
                return '';
            }
            ngModelCtrl.$parsers.unshift(fromUser);
        }
    };
}).directive('ngRequiredEmail', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {

                    var transformedInput = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (transformedInput.test(text)) {
                        ngModelCtrl.$setValidity('validate', true);
                    }
                    else {
                        ngModelCtrl.$setValidity('validate', false);
                    }

                    return text;
                }
                ngModelCtrl.$setValidity('validate', false);
                return undefined;
            }
            ngModelCtrl.$parsers.unshift(fromUser);
        }
    };
})
    .directive('ngOfficialMail', function () {
        return {
            require: 'ngModel',
            validate: false,
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {

                        var isdigit = text.charAt(0).replace(/[^a-zA-Z]/g, '');
                        if (isdigit == text.charAt(0)) {
                            var transformedInput = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@ebintl.com$/;;

                            if (transformedInput.test(text)) {
                                ngModelCtrl.$setValidity('validate', true);
                            }
                            else {
                                ngModelCtrl.$setValidity('validate', false);
                            }

                            return text;
                        }
                        else {
                            return isdigit;
                        }
                    }
                    ngModelCtrl.$setValidity('validate', false);
                    return undefined;
                }

                ngModelCtrl.$parsers.unshift(fromUser);
            }
        };
    }).directive('ngPanNumber', function () {
        return {
            require: 'ngModel',
            validate: false,
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = /^([A-Z]{5})(\d{4})([A-Z]{1})$/;

                        if (transformedInput.test(text)) {
                            ngModelCtrl.$setValidity('validate', true);
                        }
                        else {
                            ngModelCtrl.$setValidity('validate', false);
                        }
                        return text;
                    }
                    ngModelCtrl.$setValidity('validate', true);
                    return '';
                }

                ngModelCtrl.$parsers.unshift(fromUser);
            }
        };
    }).directive('ngAlphabetSplCharsOnly', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^a-zA-Z!@#$%^&*()_+\s]/g, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        ngModelCtrl.$setValidity('validate', true);
                        return transformedInput;
                    }
                    ngModelCtrl.$setValidity('validate', false);
                }
                ngModelCtrl.$parsers.unshift(fromUser);
            }
        };
    }).directive('compile', ['$compile', function ($compile) {
        return function (scope, element, attrs) {
            scope.$watch(
                function (scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function (value) {
                    element.html(value);

                    $compile(element.contents())(scope);
                }
            );
        };
    }]).directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        }
    }).directive('myCurrency', function () {
        'use strict';
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                if (!ctrl) {
                    return;
                }

                elem.bind('focusout', function () {

                    var s = $(this).val().replace(/[\,\-\+]/g, '');
                    var x = fn(s);
                    if (x.endsWith('.')) {
                        x = x.replace('.', '');
                    }
                    $(this).val(x);


                });

                var fn = function (viewValue) {
                    var x = viewValue.replace(/[\,\-\+]/g, '');
                    var pointindex = x.indexOf('.');
                    var s = viewValue.replace(/[^0-9]/g, '');
                    if (pointindex > 0)
                        x = s.substring(0, pointindex) + '.' + s.substring(pointindex, s.length);
                    else
                        x = s;

                    var afterPoint = '';
                    if (x.indexOf('.') > 0) {
                        afterPoint = x.substring(x.indexOf('.'), x.length);
                        afterPoint = afterPoint == ".." ? "." : afterPoint;
                        afterPoint = afterPoint.substring(afterPoint.indexOf('.'), 3);
                        x = x.replace('..', '');
                    }

                    x = x != '' ? Math.floor(x) : x;
                    x = x.toString();
                    var lastThree = x.substring(x.length - 3);
                    var otherNumbers = x.substring(0, x.length - 3);
                    if (otherNumbers != '')
                        lastThree = ',' + lastThree;
                    var res = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + lastThree + afterPoint;
                    return res;
                }

                ctrl.$parsers.unshift(function (viewValue) {

                    var res = fn(viewValue);
                    var plainNumber = res.replace(/[\,\-\+]/g, '');
                    elem.val(res);
                    return plainNumber;
                });
            }
        };
    }).directive('uiCurrency', function ($filter, $parse) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, ngModel) {

                function parse(viewValue, noRender) {
                    if (!viewValue)
                        return viewValue;

                    // strips all non digits leaving periods.
                    var clean = viewValue.toString().replace(/[^0-9.]+/g, '').replace(/\.{2,}/, '.');

                    // case for users entering multiple periods throughout the number
                    var dotSplit = clean.split('.');
                    if (dotSplit.length > 2) {
                        clean = dotSplit[0] + '.' + dotSplit[1].slice(0, 2);
                    } else if (dotSplit.length == 2) {
                        clean = dotSplit[0] + '.' + dotSplit[1].slice(0, 2);
                    }

                    if (!noRender)
                        ngModel.$render();
                    return clean;
                }

                ngModel.$parsers.unshift(parse);

                ngModel.$render = function () {
                    //console.log('viewValue', ngModel.$viewValue);
                    //console.log('modelValue', ngModel.$modelValue);
                    var clean = parse(ngModel.$viewValue, true);
                    if (!clean)
                        return;

                    var currencyValue,
                        dotSplit = clean.split('.');

                    // todo: refactor, this is ugly
                    if (clean[clean.length - 1] === '.') {
                        currencyValue = $filter('number')(parseFloat(clean)) + '.';

                    } else if (clean.indexOf('.') != -1 && dotSplit[dotSplit.length - 1].length == 1) {
                        currencyValue = $filter('number')(parseFloat(clean), 1);
                    } else if (clean.indexOf('.') != -1 && dotSplit[dotSplit.length - 1].length == 1) {
                        currencyValue = $filter('number')(parseFloat(clean), 2);
                    } else {
                        currencyValue = $filter('number')(parseFloat(clean));
                    }

                    element.val(currencyValue);
                };

            }
        };
    }).directive('currenyformat', ['$filter', function ($filter) {
        return {
            require: '?ngModel',
            link: function (scope, elem, attrs, ctrl) {
                if (!ctrl) return;

                ctrl.$formatters.unshift(function (a) {
                    return $filter(attrs.format)(ctrl.$modelValue)
                });

                elem.bind('blur', function (event) {
                    var plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '');
                    elem.val($filter(attrs.format)(plainNumber));
                });
            }
        };
    }]);;

function CreateGuid() {
    function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

$myApp.Find = function (ctrlSelector) {
    var x = function (ctrlSelector) {
        this.CTRL = null;
        this.Scope = null;
        this.Element = null;
        this.Selector = ctrlSelector;
        this.Refresh = function () {
            this.CTRL = $(this.Selector);
            if (this.CTRL.length > 0) {
                this.Element = angular.element(this.CTRL[0]);
                if (typeof (this.Element.scope) == "function") { this.Scope = this.Element.scope(); }
            }
        }
        this.BindData = function () {
            var _this = this;
            var result = false;
            if (typeof (_this.Scope) == "object") {
                this.Element.injector().invoke(function ($compile) {
                    $compile(_this.CTRL.contents())(_this.Scope);
                    result = true;
                });
            }
            return result;
        }
        this.Refresh();
    }
    var fn = new x(ctrlSelector);
    return fn;
};
$myApp.Apply = function (id) {
    angular.element(document.getElementById(id)).scope().$apply();
};
$myApp.BindData = function (element, val) {
    var ngm = element.attr("ng-model");
    if (ngm) { eval("angular.element(element[0]).scope()." + ngm + "=val"); }
};
$myApp.DeepBindData = function (element, val) {
    var ngm = element.attr("ng-model");
    var _n = ngm.split(".");
    if (_n.length > 1) {
        var ev = "angular.element(element[0]).scope()";
        for (var i = 0; i < _n.length - 1; i++) {
            ev = ev + "." + _n[i];
            if (!eval(ev)) {
                eval(ev + "={}");
            }
        }
    }
    if (ngm) { eval("angular.element(element[0]).scope()." + ngm + "=val"); }
};

var Resource = new function () {
    this.$login = "/Login";
    this.$loginkey = "loginpage";
    this.$session = "Your session has expired after a period of inactivity or is no longer valid. Please try again.";
    this.$error = "Sorry, This Portal has encountered an error. Please close the current browser window and reopen it. Contact your administrator if the problem persists."
    this.$file = "The requested URL was not found on this server.";
    this.$tokenexpiry = "The token lifetime is invalid";
};
