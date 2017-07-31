angular.module('app', ['ui.router', 'ui.bootstrap', 'mwFormBuilder', 'mwFormViewer', 'mwFormUtils', 'pascalprecht.translate', 'monospaced.elastic', 'ngCookies', 'angular.filter', 'ngStorage', 'angularValidator'])
        .config(function ($translateProvider, $stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/login');

            $stateProvider
                    // HOME STATES AND NESTED VIEWS ========================================
                    .state('login', {
                        url: '/login',
                        templateUrl: 'partial-login.html',
                        controller: 'LoginController'
                    })
                    .state('signup', {
                        url: '/signup',
                        templateUrl: 'partial-signup.html',
                        controller: 'SignupController'
                    })
                    .state('home', {
                        url: '/home',
                        templateUrl: 'partial-list.html'
                    })
                    .state('view', {
                        url: '/view/:quizId/:code',
                        params: {
                            quizId: {value: null},
                            code: {value: null, squash: true}
                        },
                        templateUrl: 'partial-view.html',
                        resolve: {
                            loggedIn: function ($http, $stateParams, $state) {

                                if ($stateParams.code !== null) {

                                    var postData = {
                                        action: 'view-code',
                                        id: $stateParams.quizId,
                                        code: $stateParams.code
                                    };

                                    $http.post('api/index.php', postData).then(
                                            function (data) {
                                                data = data.data;
                                                //console.log(data);
                                                if (data.status !== 1) {
                                                    $state.go('login');
                                                }
                                            },
                                            function (data) {
                                                console.log('error', data);
                                                //deferred.reject();
                                            });
                                }
                            }
                        }
                    });

            $translateProvider.useStaticFilesLoader({
                prefix: 'dist/i18n/',
                suffix: '/angular-surveys.json'
            });
            $translateProvider.preferredLanguage('en');


        })
        .run(function ($rootScope, $state, $localStorage) {
            $rootScope.storage = $localStorage.$default({
                token: null
            });
            $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
                //console.log(fromState.name + ' ==> ' + toState.name, toParams);
                if (toParams.code !== null && toState.name === 'view') {
                    // show without login
                } else if ($rootScope.storage.token === null && toState.name !== 'login' && toState.name !== 'signup') {
                    // User isn’t authenticated
                    $state.go("login");
                    event.preventDefault();
                } else if ($rootScope.storage.token !== null && (toState.name === 'login' || toState.name === 'signup')) {
                    // User is authenticated
                    $state.go("home");
                    event.preventDefault();
                }
            });
        })
        .controller('MainController', function ($scope, $rootScope, $state, $localStorage) {

            $scope.gotoView = function () {
                $state.go('view');
            };

            $scope.gotoList = function () {
                $state.go('home');
            };

            $scope.logout = function () {
                $rootScope.storage.token = null;
                $state.go('login');
            };
        })
        .controller('LoginController', function ($scope, $rootScope, $state, $http, $localStorage) {

            $scope.formData = {};

            $scope.login = function (loginForm) {
                console.log(loginForm.$valid);
                if (loginForm.$valid) {
                    $scope.formData.action = 'login';
                    $http.post('api/index.php', $scope.formData).then(
                            function (data) {
                                data = data.data;
                                console.log(data);
                                if (data.status === 1) {
                                    $rootScope.storage.token = data.token;
                                    $state.go('home');
                                } else {
                                    alert(data.message);
                                }
                            },
                            function (data) {
                                console.log('error', data);
                            }
                    );
                } else {
                    console.log('Invalid form entries');
                }
            };

        })
        .controller('SignupController', function ($scope, $rootScope, $state, $http) {

            $scope.userData = {};
            
            $scope.mobilePattern = /^\+?\d{8,15}$/;
            
            $scope.signup = function (registerForm) {

                if (registerForm.$valid) {
                    $scope.userData.action = 'signup';
                    $http.post('api/index.php', $scope.userData).then(
                            function (data) {
                                data = data.data;
                                console.log(data);
                                if (data.status === 1) {
                                    alert(data.message);
                                } else {
                                    alert(data.message);
                                }
                            },
                            function (data) {
                                console.log('error', data);
                            });
                } else {
                    console.log('invalid form entries');
                }
            };

        })
        .controller('ListController', function ($scope, $rootScope, $state, $http) {

            var postData = {
                action: 'list'
            };

            $scope.quiz = [];

            $http.post('api/index.php', postData).then(function (data) {
                data = data.data;
                //console.log(data);
                if (data.status === 1) {
                    $scope.quiz = data.results;
                } else {
                    //handle error
                }
            },
                    function (data) {
                        console.log('error', data);
                    });

        })
        .controller('ViewerController', function ($window, $q, $http, $translate, mwFormResponseUtils, $rootScope, $stateParams, $state) {

            //console.log($rootScope.sessionInfo);

            var ctrl = this;

            ctrl.mergeFormWithResponse = true;
            ctrl.cgetQuestionWithResponseList = true;
            ctrl.cgetResponseSheetHeaders = true;
            ctrl.cgetResponseSheetRow = true;
            ctrl.cgetResponseSheet = true;
            ctrl.headersWithQuestionNumber = true;
            ctrl.builderReadOnly = false;
            ctrl.viewerReadOnly = false;
            ctrl.languages = ['en', 'pl', "es", "ru"];
            ctrl.formData = null;
            ctrl.formId = 0;
            if ($stateParams.quizId !== '' && $stateParams.quizId !== undefined) {
                //console.log('ID',$stateParams.quizId);
                $http.post('api/index.php', {id: $stateParams.quizId, action: 'fetch'}).then(function (data) {
                    data = data.data;
                    //console.log('data fetched', data);
                    //alert(data.message);
                    if (data.status === 1 && data.results.length > 0) {
                        ctrl.formData = JSON.parse(data.results[0].form_json);
                        ctrl.formId = data.results[0].id;
                    } else {
                        $state.go('home');
                        //handle error
                    }
                },
                        function (data) {
                            console.log('error', data);
                        });
            } else {
                $state.go('home');
                $http.get('admin/form-data-02-06-2017.json')
                        .then(function (res) {
                            ctrl.formData = res.data;
                        });
            }
            ctrl.formBuilder = {};
            ctrl.formViewer = {};
            ctrl.formOptions = {
                autoStart: false,
                disableSubmit: false
            };
            ctrl.selectedTabIndex = 0;
            ctrl.optionsBuilder = {
                /*elementButtons:   [{title: 'My title tooltip', icon: 'fa fa-database', text: '', callback: ctrl.callback, filter: ctrl.filter, showInOpen: true}],
                 customQuestionSelects:  [
                 {key:"category", label: 'Category', options: [{key:"1", label:"Uno"},{key:"2", label:"dos"},{key:"3", label:"tres"},{key:"4", label:"4"}], required: false},
                 {key:"category2", label: 'Category2', options: [{key:"1", label:"Uno"},{key:"2", label:"dos"},{key:"3", label:"tres"},{key:"4", label:"4"}]}
                 ],
                 elementTypes: ['question', 'image'],
                 pagesSize: [1,10,25,50,100],
                 pageSize: 1 */
            };
            ctrl.formStatus = {};
            ctrl.responseData = {};
//        $http.get('response-data.json')
//            .then(function(res){
//                ctrl.responseData = res.data;
//            });

            $http.get('template-data.json')
                    .then(function (res) {
                        ctrl.templateData = res.data;
                    });

            ctrl.showResponseRata = false;
            ctrl.formSubmitted = false;

            ctrl.saveResponse = function () {

                var rData = ctrl.getMerged();

                var d = $q.defer();
                var res = confirm("Are you sure to submit?");
                if (res) {

                    $http.post('api/index.php', {action: 'response', data: rData, userid: 1, formid: ctrl.formId}).then(function (data) {
                        data = data.data;
                        //console.log('data saved', data);
                        alert(data.message);
                        if (data.status === 1) {
                            d.resolve(true);
                            ctrl.formSubmitted = true;
                            ctrl.calculateResult(rData);
                        } else {
                            //handle error
                            d.reject();
                        }
                    },
                            function (data) {
                                d.reject();
                                console.log('error', data);
                            });


                } else {
                    d.reject();
                }
                return d.promise;
            };

            ctrl.calculateResult = function (rData) {


                var sections = rData.pages;

                ctrl.testResult = [];
                ctrl.finalScore = 0;
                if (sections.length > 0) {

                    sections.forEach(function (section, index, array) {
                        //console.log('' + section.name + ' = ', section.elements);
                        ctrl.testResult[index] = {};
                        ctrl.testResult[index]['name'] = section.name;
                        var points = 0;
                        section.elements.forEach(function (element, index, array) {
                            if (element.type === "question") {
                                //console.log('elements[' + index + '] = ', element);
                                var answer = element.question.answer.toLowerCase();

                                if (element.question.response != null && !angular.equals(element.question.response, {})) {
                                    if (element.question.type == "radio") {

                                        if (element.question.response.selectedAnswer.value.toLowerCase() == answer) {
                                            points++;
                                        }
                                    } else if (element.question.type == "text") {
                                        if (element.question.response.toLowerCase() == answer) {
                                            points++;
                                        }
                                    }
                                }
                            }
                        });

                        ctrl.testResult[index]['points'] = points;
                        ctrl.finalScore += points;
                    });

                    ctrl.finalScore = ctrl.finalScore / sections.length;
                }
            };

            ctrl.onImageSelection = function () {

                var d = $q.defer();
                var src = prompt("Please enter image src");
                if (src != null) {
                    d.resolve(src);
                } else {
                    d.reject();
                }

                return d.promise;
            };

            ctrl.setSelectedTabIndex = function (index) {
                ctrl.selectedTabIndex = index;
                if (index === 1) {
                    ctrl.resetViewer();
                }
            };

            ctrl.resetViewer = function () {
                if (ctrl.formViewer.reset) {
                    ctrl.formViewer.reset();
                }

            };

            ctrl.resetBuilder = function () {
                if (ctrl.formBuilder.reset) {
                    ctrl.formBuilder.reset();
                }
            };

            ctrl.changeLanguage = function (languageKey) {
                $translate.use(languageKey);
            };

            ctrl.getMerged = function () {
                return mwFormResponseUtils.mergeFormWithResponse(ctrl.formData, ctrl.responseData);
            };

            ctrl.getQuestionWithResponseList = function () {
                return mwFormResponseUtils.getQuestionWithResponseList(ctrl.formData, ctrl.responseData);
            };
            ctrl.getResponseSheetRow = function () {
                return mwFormResponseUtils.getResponseSheetRow(ctrl.formData, ctrl.responseData);
            };
            ctrl.getResponseSheetHeaders = function () {
                return mwFormResponseUtils.getResponseSheetHeaders(ctrl.formData, ctrl.headersWithQuestionNumber);
            };

            ctrl.getResponseSheet = function () {
                return mwFormResponseUtils.getResponseSheet(ctrl.formData, ctrl.responseData, ctrl.headersWithQuestionNumber);
            };

        });
