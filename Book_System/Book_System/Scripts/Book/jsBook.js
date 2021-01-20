var objBook = new function () {
    this.Init = function () {
        $myApp.controller("BookController", function ($scope, customService) {
            $scope.SearchBook = null; 
            $scope.searchClient = 0;
            $scope.searchBookCount = 0;
            $("#AddClientDiv").hide();

            $scope.closeClientDetails = function () {
                $("#AddClientDiv").hide();
                $("#ListClientDiv").show();
                $scope.clearClientDetails();
            }

            $scope.showClientAddDiv = function () {
                $("#AddClientDiv").show();
            }

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

            $scope.clearClientSearch = function () {
                $("#dateSearch").val("");
                $("#clientSearch").val("");
                $("#bookSearch").val("");
                $scope.getclientList(); 
                $scope.searchClient = 0;
            }

            $scope.clearBookSearch = function () {
                $("#search").val("");
                $scope.getBookRateListBySearch(); 
                $scope.searchBookCount = 0;
            }

            $scope.getclientList = function () {
                customService.postData('Book/getclientList', {}, function (data) {
                    $scope.TotClientCount = data.Item.length;
                    if (data.isSuccess) {
                        $scope.getClientList = data.Item;
                    }
                    else {
                        alert(data.Message);
                        location.reload();
                    }
                });
            }

            $scope.DeleteClientDetails = function (list) {
                var confirmDeletion = window.confirm("Do you want permanently delete the Client?");
                if (confirmDeletion) {
                    var obj = {};
                    obj.ClientId = list;
                    customService.postData('Book/DeleteClientDetails', obj.ClientId, function (data) {
                        if (data.isSuccess) {
                            alert("Client Deleted Succesfully ");
                            $scope.getclientList();
                        }
                        else {
                            alert("Error in Saving Client Details");
                        }
                    });
                }
                
            }

            $scope.getClientListBySearch = function (client) {
                if (client.dateSearch == "NaN/NaN/NaN" ) {
                    var dt = new Date(client.dateSearch);
                    client.dateSearch = parseInt(dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear();

                    customService.postData('Book/getclientListBySearch', client, function (data) {
                        $scope.searchClient = data.Item.length;
                        if (data.isSuccess) {
                            $scope.getClientList = data.Item;
                        }
                        else {
                            alert(data.Message);
                            $scope.getclientList();
                        }
                    });
                }
                else if (client.clientSearch != null || client.bookSearch != null) {
                    client.clientSearch = client.clientSearch;
                    client.bookSearch = client.bookSearch;

                    customService.postData('Book/getclientListBySearch', client, function (data) {
                        $scope.searchClient = data.Item.length;
                        if (data.isSuccess) {
                            $scope.getClientList = data.Item;
                        }
                        else {
                            alert(data.Message);
                            $scope.getclientList();
                        }
                    });
                }
            }

            $scope.getBookRateList = function () {
                request = {};
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
                customService.postData('Book/getBookRateListBySearch', search, function (data) {
                    $scope.searchBookCount = data.Item.length;
                        if (data.isSuccess) {
                            $scope.getBookRateList = data.Item;
                        }
                        else {
                            alert(data.Message);
                            location.reload();
                        }
                });
            }
           
            $scope.Edit = function (Book) {
                $scope.copyBook = angular.copy(Book);
                $("#AddClientDiv").show();
                $("#ListClientDiv").hide();
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

            $scope.saveClientDetails = function (copyBook) {
                //if (copyBook.ClientId == 0) {
                //    customService.postData('Book/saveClientDetails', copyBook, function (data) {
                //        if (data.isSuccess) {
                //            alert("Client Details Added Succesfully ");
                //            $scope.getclientList();
                //            $scope.clearClientDetails();
                //        }
                //        else {
                //            alert("Error in Saving Client Details");
                //        }
                //    });
                //}
                //else {
                customService.postData('Book/saveClientDetails', copyBook, function (data) {
                    window.location.reload();
                        if (data.isSuccess) {
                            alert("Client Details Updated Succesfully");
                            $scope.getclientList();
                            //$("#AddClientDiv").load(location.href + " #AddClientDiv");
                            $scope.closeClientDetails();
                          
                        }
                        else {
                            alert("Error in Updating Client Details");
                        }
                    });
                //}
               
            }

            $scope.getBookList();
            $scope.getBookRateList();
            $scope.getclientList();
        });
    }
}
