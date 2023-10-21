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
            controller: 'updateMauSacController'
        }).when("/add", {
            templateUrl: 'views/add.html',
            controller: 'addMauSacController'
        })
        .otherwise({ redirectTo: '/danhsach' });
});

app.controller("addMauSacController", function ($scope, $http, $location) {
    $scope.mauSac = {};
    $scope.change = function (input) {
        input.$dirty = true;
    }

    $scope.addMauSac = function () {
        if ($scope.mauSacForm.$invalid) {
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
                    $scope.mauSacForm.ten.$dirty = false;
                    $scope.mauSacForm.moTa.$dirty = false;
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

app.controller("updateMauSacController", function ($scope, $http, $routeParams, $location) {
    const id = $routeParams.id;
    $scope.change = function (input) {
        input.$dirty = true;
    }
    $http.get(host + '/admin/rest/mau-sac/' + id)
        .then(function (response) {
            $scope.mauSac = response.data;
        }).catch(function (error) {
            toastr["error"]("Lấy dữ liệu thất bại");
            $location.path("/danhsach");
        });

    $scope.updateMauSac = function () {
        if ($scope.mauSacForm.$invalid) {
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
                    $scope.mauSacForm.ten.$dirty = false;
                    $scope.mauSacForm.moTa.$dirty = false;
                    $scope.errors = error.data;
                }
            })
    };
});
