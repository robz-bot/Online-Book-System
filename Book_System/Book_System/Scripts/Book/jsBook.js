//import { search } from "modernizr";

var objBook = new function () {
    this.Init = function () {
        $myApp.controller("BookController", function ($scope, customService) {
            $scope.value = "";
            $scope.SearchBook = null; 
            $scope.s = null;

            $scope.clearClientDetails = function () {
                $("#clientName").val(""); 
                $("#drop").val("");
                $("#date").val("");
                $("#bookrate").val("");
                $("#contact").val("");
                $("#email").val(""); 
                $("#age").val(""); 
                $("#address").val("");
            }

            $scope.getclientList = function () {
                request = {}
                request.s = ($scope.SearchBook != null && $scope.SearchBook != '' &&
                    $scope.SearchBook != undefined) ? $scope.s : null;
                customService.postData('Book/getclientList', {}, function (data) {
                    //$scope.TotBookCount = data.Item.length;
                    if (data.isSuccess) {
                        $scope.getClientList = data.Item;
                    }
                    else {
                        alert(data.Message);
                        location.reload();
                    }
                });
            }


            $scope.getClientListBySearch = function (client) {
                //request = {}
                //request.searchBook = ($scope.SearchBook != null && $scope.SearchBook != '' &&
                //$scope.SearchBook != undefined) ? $scope.SearchBook : null;
                customService.postData('Book/getclientListBySearch', client, function (data) {
                    //$scope.searchBookCount = data.Item.length;
                        if (data.isSuccess) {
                            $scope.getClientList = data.Item;
                            $scope.getclientList(); 
                        }
                        else {
                            alert(data.Message);
                            location.reload();
                        }
                });
            }

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
            }

            $scope.getBookRateListBySearch = function (search) {
                //request = {}
                //request.searchBook = ($scope.SearchBook != null && $scope.SearchBook != '' &&
                //$scope.SearchBook != undefined) ? $scope.SearchBook : null;
                customService.postData('Book/getBookRateListBySearch', search, function (data) {
                    $scope.searchBookCount = data.Item.length;
                        if (data.isSuccess) {
                            $scope.getBookRateList = data.Item;
                        }
                        else {
                            alert(data.Message);
                            location.reload();
                        }
                       // document.getElementById("noRec").innerHTML = "-- No Records Found --";
                });
            }

           

           
            $scope.Edit = function (index) {
                request = {};
                request.ClientName=$("#clientName").val($scope.getClientList[index].ClientName);
                $("#drop").val($scope.getClientList[index].BookId);
                $("#date").val($scope.getClientList[index].PurchaseDate);
                $("#bookrate").val($scope.getClientList[index].BookRate);
                $("#contact").val($scope.getClientList[index].ContactNumber);
                $("#email").val($scope.getClientList[index].Email);
                $("#age").val($scope.getClientList[index].Age);
                $("#address").val($scope.getClientList[index].Address);
                //$scope.EditItem.Country = $scope.Customers[index].Country;
                //customService.postData('Book/saveClientDetails', request, function (data) {
                //    if (data.isSuccess) {
                //        alert("Client Details Updated Succesfully ");
                //        window.location.reload();
                //    }
                //    else {
                //        alert("Error in Saving Client Details");
                //    }
                //});
            }

            $scope.getBookList = function () {
                customService.postData('Book/getBookList', {}, function (data) {
                    $scope.TotBookCount = data.Item.length;
                    if (data.isSuccess) {
                        $scope.getBookList = data.Item;
                    }
                    else {
                        alert(data.Message);
                        location.reload();
                    }
                });
            }

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
            $scope.getclientList();
        });
    }
}
