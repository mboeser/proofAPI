var myApp = angular.module('myApp', []);

myApp.controller('myCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter){

    var orderBy = $filter('orderBy');

    $scope.video = {};
    $scope.view = {};
    $scope.vote = {};
    $scope.videos = [];

    $scope.order = function(predicate) {

        console.log(predicate);

        $scope.predicate = predicate;
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.videos = orderBy($scope.videos, predicate, $scope.reverse);
    };


    $scope.newVideo = function(newVideoForm) {
        console.log(newVideoForm);

        $scope.video = {
            title: newVideoForm.title,
            url: newVideoForm.url,
            slug: newVideoForm.title.trim().toLowerCase().replace(/\ /gi, '-')
        };

        $http.post('https://proofapi.herokuapp.com/videos',$scope.video, {headers: {'X-Auth-Token': 'ZU2nsMBQqKnvEwPbKsczgJEv'}}).then(function (response) {
            //$scope.videos = response.data.data;
            console.log('new vid added', response);
        });
            console.log($scope.video);
            $scope.video = {};
        $scope.getVideos();

    };

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

    //GET
    $scope.getVideos = function () {
        $http.get('https://proofapi.herokuapp.com/videos',{headers: {'X-Auth-Token': 'ZU2nsMBQqKnvEwPbKsczgJEv'}}).then(function (response) {
            $scope.videos = response.data.data;
            console.log($scope.videos);
            $scope.order('attributes.created_at');
        });
    };

    $scope.getVideos();

}]);
