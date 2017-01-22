// name our angular app
angular.module('firstApp', ['routerRoutes', 'ngAnimate'])

    .controller('mainController', function() {

        // bind this to vm (view-model)
        var vm = this;

        vm.bigMessage = 'A smooth sea never made a skilled sailor.';

        // define  variables and objects on this
        // this lets them be available to our views
        // define a basic variables
        vm.message = 'Hey there! Come and see how good I look!';

        // define a list of items
        vm.computers = [
            { name: 'Macbook Pro', color: 'White', nerdness: 7},
            { name: 'Yoga 2 Pro', color: 'Gray', nerdness: 6},
            { name: 'Chromebook', color: 'Black', nerdness: 5}
        ];

        // information that comes from our form
        vm.computerData = {};

        vm.addComputer = function() {

            // add a computer to the list
            vm.computers.push({
                name: vm.computerData.name,
                color: vm.computerData.color,
                nerdness: vm.computerData.nerdness
            });

            // after our computer has been added, clear the form
            vm.computerData = {};
        };

        // remove computer from the list
        vm.removeComputer = function() {

            // add a computer to the list
            vm.computers.pop({
                name: vm.computerData.name,
                color: vm.computerData.color,
                nerdness: vm.computerData.nerdness
            });

            // after our computer has been added, clear the form
            // vm.computerData = {};
        };
    })

    // home page specific controller
    .controller('homeController', function() {

        var vm = this;

        vm.message = 'This is the home page!';
    })

    // about page controller
    .controller('aboutController', function() {

        var vm = this;

        vm.message = 'Look! I am an about page.';
    })

    // contact page controller
    .controller('contactController', function() {

        // bind this to view-model
        var vm = this;

        vm.message = 'Contact us! MZ. This is just a demo.';
    });