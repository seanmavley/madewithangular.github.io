angular.module('madeWithFirebase')

.controller('DetailController', ['$scope', '$rootScope', '$state',
    '$stateParams', 'DatabaseRef', '$firebaseObject', 'Auth',
    function($scope, $rootScope, $state, $stateParams,
        DatabaseRef, $firebaseObject, Auth) {

        $scope.loading = true;

        var fire = $firebaseObject(DatabaseRef.child('fire').child($stateParams.fireId));

        // Make the auth available in the scope for checking who
        // owns a piece.
        Auth.$onAuthStateChanged(function(firebaseUser) {
            if (firebaseUser) {
                console.log("Signed in as:", firebaseUser.uid);
                $scope.firebaseUserUid = firebaseUser.uid;
            } else {
                console.log("Not logged in");
            }
        });

        fire.$loaded()
            .then(function(data) {
                $scope.loading = false;
                $scope.fire = data;
                if ($scope.firebaseUserUid = $scope.fire.uid) {
                    $scope.allowed = true;
                    console.log($scope.allowed);
                };
            });


        // Let's handle deletion
        $scope.deleteFire = function() {
            swal({
                    title: "Are you sure?",
                    text: "You will not be able to reverse this process",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                },
                function() {
                    console.log('deleting fire');
                    console.log($scope.allowed);

                    if ($scope.allowed) {
                        console.log('delete happened');
                        fire.$remove()
                            .then(function(ref) {
                                swal("Deleted!", "Resource deletion is complete.", "success");
                                $state.go('admin');
                                toastr.success('Deletion done!', 'Finished Deletion')
                            });

                    } else {
                        toastr.error('You aint doing anything');
                    }
                });
        }

    }

]);
