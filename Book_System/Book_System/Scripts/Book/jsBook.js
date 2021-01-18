var objBook = new function () {
    this.Init = function () {
        $myApp.controller("BookController", function ($scope, customService) {
            $scope.value = "";
            $scope.SearchBook = null;

            $scope.getBookRateListBySearch = function (SearchBook) {
                request = {}
                request.search = ($scope.SearchBook != null && $scope.SearchBook != '' &&
                    $scope.SearchBook != undefined) ? $scope.SearchBook : null;
                customService.postData('Book/getBookRateListBySearch', request, function (data) {
                    $scope.count = data.Item.length;
                    if (data.isSuccess) {
                        $scope.getBookRateList = data.Item;
                    }
                    else {
                        alert(data.Message);
                        location.reload();
                    }
                });
            };

            $scope.getBookRateList = function () {
                request = {}
                request.search = ($scope.SearchBook != null && $scope.SearchBook != '' &&
                    $scope.SearchBook != undefined) ? $scope.SearchBook : null;
                customService.postData('Book/getBookRateList', search, function (data) {
                    $scope.count = data.Item.length;
                    if (data.isSuccess) {
                        $scope.getBookRateList = data.Item;
                    }
                    else {
                        alert(data.Message);
                        location.reload();
                    }
                });
            };

            $scope.getBookList = function () {
                customService.postData('Book/getBookList', {}, function (data) {
                    $scope.count = data.Item.length;
                    if (data.isSuccess) {
                        $scope.getBookList = data.Item;
                    }
                    else {
                        alert(data.Message);
                        location.reload();
                    }
                });
            };

            $scope.saveClientDetails = function (Book) {
                customService.postData('Book/saveClientDetails', Book, function (data) {
                    if (data.isSuccess) {
                        alert("Client Details Added Succesfully ");
                        window.location.reload();
                    }
                    else {
                        alert("Error in Saving Client Details");
                    }
                });
            }



            $scope.getBookList();
            $scope.getBookRateList();
        });
    }
}
