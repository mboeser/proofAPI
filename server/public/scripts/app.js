var myApp = angular.module('myApp', []);

myApp.controller('myCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {

    var orderBy = $filter('orderBy');

    $scope.video = {};
    $scope.view = {};
    $scope.vote = {};
    $scope.videos = [];
    $scope.checked = false;
    $scope.limitNumber = null;
    $scope.isActive = 0;
    $scope.isWeekBtnNum = 0;

    $scope.activeButton = function(num) {
        $scope.isActive = num;
    };

    $scope.activeWeekBtn = function(num) {
        $scope.isWeekBtnNum = num;
    }

    $scope.order = function (predicate, tf) {

        console.log(predicate, tf);

        if (tf === undefined) {
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;

        } else {
            $scope.reverse = tf;
        }

        $scope.predicate = predicate;

        $scope.videos = orderBy($scope.videos, predicate, $scope.reverse);
    };

    $scope.isWeekend = function () {

        var today = new Date(Date.now());

        return /[12345]/.test(today.getDay());
    };


    // Add a NEW video

    $scope.newVideo = function (newVideoForm) {
        console.log(newVideoForm);


        $scope.videos.every( function(vid){
            //console.log(vid);
            if (vid.attributes.url == newVideoForm.url) {
                console.log('its dup');
                alert("Sorry, no duplicate videos allowed");
                $scope.video = {};
                $scope.newVideoForm.$setPristine();
                $scope.newVideoForm.$setUntouched();
                return;
            } else {

                $scope.video = {
                    title: newVideoForm.title,
                    url: newVideoForm.url,
                    slug: newVideoForm.title.trim().toLowerCase().replace(/\W/gi, '-')
                };

                $http.post('https://proofapi.herokuapp.com/videos', $scope.video, {headers: {'X-Auth-Token': 'ZU2nsMBQqKnvEwPbKsczgJEv'}}).then(function (response) {
                    //$scope.videos = response.data.data;
                    console.log('new vid added', response);
                });
                console.log($scope.video);
                $scope.video = {};
                $scope.newVideoForm.$setPristine();
                $scope.newVideoForm.$setUntouched();
                $scope.getVideos();

            }

        });
    };

    // Add ONE view

    $scope.viewOne = function (vid) {
        console.log(vid);

        $scope.view = {
            video_id: vid.id
        };
        $http.post('https://proofapi.herokuapp.com/views', $scope.view, {headers: {'X-Auth-Token': 'ZU2nsMBQqKnvEwPbKsczgJEv'}}).then(function (response) {
            console.log('new view added', response);
            $scope.getVideos();
        });
    };


    // Add or minus ONE vote

    $scope.voteOne = function (vid, num) {
        console.log(vid);

        $scope.vote = {
            opinion: num
        };
        $http.post('https://proofapi.herokuapp.com/videos/' + vid.id + '/votes', $scope.vote, {headers: {'X-Auth-Token': 'ZU2nsMBQqKnvEwPbKsczgJEv'}}).then(function (response) {
            console.log('new vote added', response);
            $scope.getVideos();
        });
    };

    //GET all the videos
    $scope.getVideos = function () {
        $http.get('https://proofapi.herokuapp.com/videos', {headers: {'X-Auth-Token': 'ZU2nsMBQqKnvEwPbKsczgJEv'}}).then(function (response) {
            $scope.videos = response.data.data;
            console.log($scope.videos);
            $scope.order('attributes.created_at', true);
        });
    };

    $scope.getVideos();

}]);
