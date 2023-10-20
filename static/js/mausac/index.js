var app = angular.module("app", ["ngRoute"]);
app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when("/danhsach", {
            templateUrl: 'views/list.html',
            controller: 'mauSacListController'
        }).when("/detail/:id", {
            templateUrl: 'views/detail.html',
            controller: 'detailMauSacController'
        }).when("/update/:id", {
            templateUrl: 'views/update.html',
            controller: 'updatemauSacController'
        }).when("/add", {
            templateUrl: 'views/add.html',
            controller: 'addmauSacController'
        })
        .otherwise({ redirectTo: '/danhsach' });
});

app.controller("addmauSacController", function ($scope, $http, $location) {
    $scope.mauSac = {};
    $scope.addmauSac = function () {
        if ($scope.mauSacForm.$invalid) {
            $scope.mauSacForm.ten.$error.required = true;
            $scope.mauSacForm.ten.$dirty = true;
            console.log($scope.mauSacForm);
            return;
        }
        $http.post(host + '/admin/rest/mau-sac', $scope.mauSac)
            .then(function (response) {
                if (response.status === 200) {
                    toastr["success"]("Thêm thành công");
                }
                $location.path("/danhsach");
            })
            .catch(function (error) {
                toastr["error"]("Thêm thất bại");
                if (error.status === 400) {
                    $scope.errors = error.data;
                }
            });
    }

});


app.controller("mauSacListController", function ($scope, $http, $window, $location) {
    $http.get(host + '/admin/rest/mau-sac/get-all')
        .then(function (response) {
            $scope.mauSacs = response.data;
        })
        .catch(function (error) {
            toastr["error"]("Lấy dữ liệu thất bại");
            window.location.href = feHost + '/trang-chu';
        });
});

app.controller("updatemauSacController", function ($scope, $http, $routeParams, $location) {
    const id = $routeParams.id;
    $http.get(host + '/admin/rest/mau-sac/' + id)
        .then(function (response) {
            $scope.mauSac = response.data;
        }).catch(function (error) {
            toastr["error"]("Lấy dữ liệu thất bại");
            $location.path("/danhsach");
        });

    $scope.updatemauSac = function () {
        if ($scope.mauSacForm.$invalid) {
            $scope.mauSacForm.ten.$error.required = true;
            $scope.mauSacForm.ten.$dirty = true;
            console.log($scope.mauSacForm);
            return;
        }
        $http.put(host + '/admin/rest/mau-sac/' + id, $scope.mauSac)
            .then(function (response) {
                if (response.status == 200) {
                    toastr["success"]("Cập nhật thành công")
                } else {
                    toastr["error"]("Cập nhât thất bại. Lỗi bất định")
                }
                $location.path("/danhsach");
            }).catch(function (error) {
                toastr["error"]("Cập nhật thất bại");
                if (error.status === 400) {
                    $scope.errors = error.data;
                }
            })
    };
});
