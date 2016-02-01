var myApp = angular.module('myApp', []);

myApp.controller('myCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {

    var orderBy = $filter('orderBy');

    $scope.video = {};
    $scope.view = {};
    $scope.vote = {};
    $scope.votes = [];
    $scope.videos = [];
    $scope.checked = false;
    $scope.limitNumber = null;
    $scope.isActive = 0;
    $scope.isWeekBtnNum = 0;
    $scope.today = new Date(Date.now());
    $scope.vidVote = [];


    $scope.activeButton = function (num) {
        $scope.isActive = num;
    };

    $scope.activeWeekBtn = function (num) {
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

        return /[06]/.test(today.getDay());
    };


    // Add a NEW video

    $scope.newVideo = function (newVideoForm) {
        console.log(newVideoForm);


        $scope.videos.every(function (vid) {
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
        console.log('here is voteOne func info click', vid);

        $scope.vote = {
            opinion: num
        };

        $http.get('https://proofapi.herokuapp.com/videos/' + vid.id + '/votes', {headers: {'X-Auth-Token': 'ZU2nsMBQqKnvEwPbKsczgJEv'}}).then(function (response) {
            $scope.vidVote = response.data.data;
            //console.log('here is the video info', $scope.vidVote, new Date($scope.vidVote[0].attributes.created_at).getUTCDay(), $scope.today.getUTCDay());


            if ($scope.vidVote.length === 0 ||

                $scope.vidVote.some(function (vid) {
                    console.log(vid);
                    if (vid.attributes.created_at.slice(0, 10) == $scope.today.toISOString().slice(0, 10)) {
                        //console.log('its dup');
                        //alert("Sorry, no duplicate votes allowed");
                        $scope.vidVote = [];
                        return false;
                    }
                })

            )
            {
                $http.post('https://proofapi.herokuapp.com/videos/' + vid.id + '/votes', $scope.vote, {headers: {'X-Auth-Token': 'ZU2nsMBQqKnvEwPbKsczgJEv'}}).then(function (response) {
                    console.log('new vote added', response);
                    $scope.getVideos();
                });
            } else {
                    console.log('dup vote');
                    alert("Sorry, One Vote per Video per Day");
                    $scope.vidVote = [];
            }
        });
    };

    //GET all the videos
    $scope.getVideos = function () {
        $http.get('https://proofapi.herokuapp.com/videos', {headers: {'X-Auth-Token': 'ZU2nsMBQqKnvEwPbKsczgJEv'}}).then(function (response) {
            $scope.limitNumber = null;
            $scope.videos = response.data.data;
            console.log($scope.videos);
            $scope.order('attributes.created_at', true);
        });
    };

    //GET all the votes
    $scope.getVotes = function () {
        $http.get('https://proofapi.herokuapp.com/votes', {headers: {'X-Auth-Token': 'ZU2nsMBQqKnvEwPbKsczgJEv'}}).then(function (response) {
            $scope.votes = response;
            console.log($scope.votes);
        });
    };

    $scope.getVideos();
    $scope.getVotes();

}]);
