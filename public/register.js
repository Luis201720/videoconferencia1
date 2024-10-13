var j = jQuery.noConflict(); 

const app = angular.module('videoApp', [])


app.controller('CallController1', function($scope,$http) {
    $scope.message = 'ok'
  setTimeout(() => {
    console.log($scope.message)
    if($scope.message !== 'ok'){
      console.log('message',$scope.message)



      Swal.fire({
        position: "top-center",
        icon: "error",
        title: `Usuario o Password incorrecto`,
        showConfirmButton: false,
        timer: 4000
      })

      setTimeout(function(){
         $scope.message = 'ok'
      },300)
    }else{
      console.log('hola')
    }
  }, 1000);



  $scope.recupera =  function(register){
    console.log(register)
    $http({
      method : "POST",
        url : "/recupera",
        data: register
    }).then(function mySuccess(response) {
      console.log(response.data)
      if(response.data.mensaje){
        $scope.reg = {}
        j('#exampleModal1').modal('toggle')

        Swal.fire({
          position: "top-center",
          icon: "success",
          title: `Mensaje enviado a ${response.data.correo}`,
          showConfirmButton: false,
          timer: 3000
        });
      }
     
    })
  }

$scope.cambiarC = function(cambiarC,id){
  console.log(cambiarC,id)

  var data1= {'password':cambiarC}

  
  $http({
    method : "PUT",
      url : `/users/${id}`,
      data: data1
  }).then(function mySuccess(response) {
    console.log(response)
    Swal.fire({
      position: "top-center",
      icon: "success",
      title: "contraseña Actualizada",
      showConfirmButton: false,
      timer: 3000
    });
  })
  
}






    $scope.register =function(registro){


        $http({
        method : "POST",
          url : "/users/register",
          data: registro
      }).then(function mySuccess(response) {
       console.log(response.data)
    
        $scope.usuarioRe = response.data
        Swal.fire({
            position: "top-center",
            icon: "success",
            title: "registrado Correctamente",
            showConfirmButton: false,
            timer: 3000
          });
          $scope.reg={}
    
        if($scope.usuarioRe.message){
          console.log($scope.usuarioRe.error)
    
          switch($scope.usuarioRe.error.code){
            case 11000 :
              Swal.fire({
                position: "top-center",
                icon: "error",
                title: "usuario ya registrado",
                showConfirmButton: false,
                timer: 3000
              });
              break;
              default:
                console.log($scope.usuarioRe.error.message)
                Swal.fire({
                  position: "top-center",
                  icon: "error",
                  title: `${$scope.usuarioRe.error.message}`,
                  showConfirmButton: false,
                  timer: 5000
                });
    
           
          }
         
    
        }else{
          $scope.reg = {}
          j('#exampleModal').modal('toggle')
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Usuario creado con Exito",
          showConfirmButton: false,
          timer: 3000
        });
          
        }
        
    })
      
    }

})