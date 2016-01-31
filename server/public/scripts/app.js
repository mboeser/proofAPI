var myApp = angular.module('myApp', []);

myApp.controller('myCtrl', ['$scope', '$http', function($scope, $http){

    $scope.video = {};
    $scope.videos = [];

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

    //GET
    $scope.getVideos = function () {
        $http.get('https://proofapi.herokuapp.com/videos',{headers: {'X-Auth-Token': 'ZU2nsMBQqKnvEwPbKsczgJEv'}}).then(function (response) {
            $scope.videos = response.data.data;
            console.log(response.data.data);
        });
    };

    $scope.getVideos();

}]);
