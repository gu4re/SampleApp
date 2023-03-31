'use strict';

function Router(routes) {
    try {
        if (!routes) {
            throw 'error: routes param is mandatory';
        }
        this.constructor(routes);
        this.init();
    } catch (e) {
        console.error(e);   
    }
}

Router.prototype = {
    routes: undefined,
    rootElem: undefined,
    constructor: function (routes) {
        this.routes = routes;
        this.rootElem = document.getElementById('main');
    },
    init: function () {
        var r = this.routes;
        (function(scope, r) { 
            window.addEventListener('hashchange', function (e) {
                scope.hasChanged(scope, r);
            });
        })(this, r);
        this.hasChanged(this, r);
    },
    hasChanged: function(scope, r){
        var routeFound = true;
        if (window.location.hash.length > 0) {
            for (var i = 0, length = r.length; i < length; i++) {
                var route = r[i];
                if(route.isActiveRoute(window.location.hash.substr(1))) {
                    if (route.htmlName === 'login.html') {
                      var script = document.createElement('script');
                      script.src = 'js/login.js?' + Date.now();
                      document.head.appendChild(script);
                    }
                    scope.goToRoute(route.htmlName, !routeFound);
                    break;
                }
            }
            scope.goToRoute('404.html', !routeFound);
        } else {
            for (var i = 0, length = r.length; i < length; i++) {
                var route = r[i];
                if(route.default) {
                    scope.goToRoute(route.htmlName, !routeFound);
                }
            }
        }
    },
    goToRoute: function (htmlName, isRequestSent) {
        if (isRequestSent) {
            return;
        }
        (function(scope) {
            var url = 'html/' + htmlName,
                xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    scope.rootElem.innerHTML = this.responseText;
                }
            };
            xhttp.open('GET', url, true);
            xhttp.send();
            isRequestSent = true;
        })(this);
    }
};