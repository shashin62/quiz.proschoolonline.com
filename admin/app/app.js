angular.module('app', ['ui.router', 'ui.bootstrap', 'mwFormBuilder', 'mwFormViewer', 'mwFormUtils', 'pascalprecht.translate', 'monospaced.elastic'])
        .config(function ($translateProvider, $stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/home');

            $stateProvider
                    // HOME STATES AND NESTED VIEWS ========================================
                    .state('home', {
                        url: '/home',
                        templateUrl: 'partial-list.html'
                    })
                    .state('add', {
                        url: '/add',
                        templateUrl: 'partial-add.html'
                    })
                    .state('edit', {
                        url: '/edit/{quizId}',
                        templateUrl: 'partial-edit.html'
                    });


            $translateProvider.useStaticFilesLoader({
                prefix: '../dist/i18n/',
                suffix: '/angular-surveys.json'
            });
            $translateProvider.preferredLanguage('en');
        })
        .controller('MainController', function ($scope, $rootScope, $state) {

            $scope.gotoAdd = function () {
                $state.go('add');
            };

            $scope.gotoList = function () {
                $state.go('home');
            };

        })
        .controller('ListController', function ($scope, $rootScope, $state, $http) {

            var postData = {
                action: 'list'
            };

            $scope.quiz = [];

            $http.post('../api/index.php', postData).then(function (data) {
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
        .controller('BuilderController', function ($q, $http, $state, $translate, $scope, $filter, $stateParams) {

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

            if ($stateParams.quizId !== '' && $stateParams.quizId !== undefined) {
                //console.log('ID',$stateParams.quizId);
                $http.post('../api/index.php', {id:$stateParams.quizId,action:'fetch'}).then(function (data) {
                    data = data.data;
                    //console.log('data fetched', data);
                    //alert(data.message);
                    if (data.status === 1) {
                        ctrl.formData = JSON.parse(data.results[0].form_json);
                    } else {
                        //handle error
                    }
                },
                function (data) {
                    console.log('error', data);
                });
            } else {
                $http.get('form-data.json')
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

            ctrl.onImageSelection = function () {
                ctrl.imagePromise = $q.defer();
                document.getElementById('fileInputImage').click();
                return ctrl.imagePromise.promise;
            };

            $scope.onImageUploadComplete = function (files) {
                //console.log('selected');
                var fd = new FormData();
                //Take the first selected file
                fd.append("image", files[0]);

                document.getElementById('fileInputImage').value = '';
                $http.post('save-image.php', fd, {
                    withCredentials: false,
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                }).then(function (data) {
                    var data = data.data;
                    //console.log('data saved', data);
                    //alert('image saved.');
                    if (data.status == 1) {
                        ctrl.imagePromise.resolve(data.src);
                    } else {
                        //console.log('error',data);
                        ctrl.imagePromise.reject();
                        alert(data.msg);
                    }
                },
                        function (data) {
                            //console.log('error',data);
                            ctrl.imagePromise.reject();
                            alert('Something went wrong');
                        });

            };

            ctrl.resetBuilder = function () {
                if (ctrl.formBuilder.reset) {
                    ctrl.formBuilder.reset();
                }
            };

            ctrl.saveBuilder = function () {
                //console.log('saving data');
                var title = ctrl.formData.name;

                if (title === '' || title === undefined) {
                    title = 'form_' + (+new Date());
                }
                var jsonData = $filter('json')(ctrl.formData);
                //console.log(jsonData);
                var postData = {
                    form_json: jsonData,
                    title: title,
                    action: 'add'
                };

                $http.post('../api/index.php', postData).then(function (data) {
                    data = data.data;
                    //console.log('data saved', data);
                    alert(data.message);
                    if (data.status === 1) {
                        $state.go('home');
                    } else {
                        //handle error
                    }
                },
                function (data) {
                    console.log('error', data);
                });
            };
            
            ctrl.updateBuilder = function () {
                if ($stateParams.quizId !== '' && $stateParams.quizId !== undefined) {
                    //console.log('updating data');
                    var title = ctrl.formData.name;

                    if (title === '' || title === undefined) {
                        title = 'form_' + (+new Date());
                    }
                    var jsonData = $filter('json')(ctrl.formData);
                    //console.log(jsonData);
                    var postData = {
                        form_json: jsonData,
                        title: title,
                        action: 'edit',
                        id: $stateParams.quizId
                    };

                    $http.post('../api/index.php', postData).then(function (data) {
                        data = data.data;
                        //console.log('data updated', data);
                        alert(data.message);
                        if (data.status === 1) {
                            //$state.go('home');
                        } else {
                            //handle error
                        }
                    },
                    function (data) {
                        console.log('error', data);
                    });
                } else {
                    console.log('Empty quiz id');
                }
            };

            ctrl.changeLanguage = function (languageKey) {
                $translate.use(languageKey);
            };

        })
        .directive('customOnChange', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var onChangeFunc = scope.$eval(attrs.customOnChange);
                    element.bind('change', onChangeFunc);
                }
            };
        });