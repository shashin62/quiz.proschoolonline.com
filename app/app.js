angular.module('app', ['ui.bootstrap', 'mwFormBuilder', 'mwFormViewer', 'mwFormUtils', 'pascalprecht.translate', 'monospaced.elastic'])
        .config(function ($translateProvider) {
            $translateProvider.useStaticFilesLoader({
                prefix: 'dist/i18n/',
                suffix: '/angular-surveys.json'
            });
            $translateProvider.preferredLanguage('en');
        })
        .controller('ViewerController', function ($q, $http, $translate, mwFormResponseUtils, $rootScope) {

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
            $http.get('admin/form-data.json')
                    .then(function (res) {
                        ctrl.formData = res.data;
                    });
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

                var sections = rData.pages;
                
                ctrl.testResult = [];
                ctrl.finalScore = 0;
                if(sections.length > 0){
                
                    sections.forEach(function (section, index, array) {
                        console.log('' + section.name + ' = ' , section.elements);
                        ctrl.testResult[index] = {};
                        ctrl.testResult[index]['name'] = section.name;
                        var points = 0;
                        section.elements.forEach(function (element, index, array) {
                            if(element.type === "question"){
                                console.log('elements[' + index + '] = ' , element);
                                var answer = element.question.answer.toLowerCase();

                                if(element.question.response != null && !angular.equals(element.question.response, {})){
                                    if(element.question.type == "radio"){

                                        if( element.question.response.selectedAnswer.value.toLowerCase() == answer){
                                            points++;
                                        }
                                    } else if(element.question.type == "text"){
                                        if( element.question.response.toLowerCase() == answer){
                                            points++;
                                        }
                                    }
                                }
                            }
                        });

                        ctrl.testResult[index]['points'] = points;
                        ctrl.finalScore += points;
                    });
                    
                    ctrl.finalScore = ctrl.finalScore/sections.length;
                }

                var d = $q.defer();
                var res = confirm("Are you sure to submit?");
                if (res) {
                    d.resolve(true);
                    ctrl.formSubmitted = true;
                } else {
                    d.reject();
                }
                return d.promise;
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