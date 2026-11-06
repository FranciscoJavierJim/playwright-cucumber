Feature: Autenticación de usuarios
  Background:
    Given El usuario está en la página principal de Demoblaze
    And El usuario abre el formulario de inicio de sesión

  @smoke @declarativo
  Scenario: Login satisfactorio
   When Introduzco usuario y contraseña válidos
   Then El usuario se logea correctamente

  @smoke @imperativo
  Scenario: Login inválido
    When Introduzco un usuario válido
    And Introduzco una contraseña inválida
    And Hago click en Log in
    Then La web nos devuelve el mensaje "Wrong password."

  @smoke
  Scenario Outline: Login inválido con diferentes combinaciones de credenciales
    When El usuario introduce el usuario "<usuario>" y la contraseña "<contraseña>" en el formulario de inicio de sesión
    And El usuario envía el formulario de inicio de sesión
    Then Se muestra el mensaje de error "<mensaje_esperado>"
//comentario
    Examples: Combinaciones de credenciales inválidas
      | usuario                | contraseña | mensaje_esperado                         |
      |                        |            | Please fill out Username and Password.   |
      |                        | pass123    | Please fill out Username and Password.   |
      | qa-usuario             |            | Please fill out Username and Password.   |
      | qa-usuario-inexistente | pass123    | User does not exist.    