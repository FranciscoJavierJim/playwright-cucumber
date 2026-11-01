@auth
Feature: Autenticación de usuarios en la plataforma
  Como usuario registrado de la aplicación
  Quiero iniciar sesión con mis credenciales de acceso
  Para acceder de forma segura a mi panel principal de trabajo

  Background:
    Given el usuario se encuentra en la página de inicio de sesión

  @smoke
  Scenario: Acceso exitoso con credenciales válidas
    When el usuario intenta autenticarse con el usuario "usuario.valido@ejemplo.com" y la contraseña "ClaveSegura123!"
    Then el usuario accede correctamente al panel principal de la aplicación

  @regression
  Scenario Outline: Rechazo de acceso ante credenciales inválidas
    When el usuario intenta autenticarse con el usuario "<usuario>" y la contraseña "<contrasena>"
    Then el sistema muestra el mensaje de alerta "<mensaje_esperado>"
    And el usuario permanece en la página de inicio de sesión

    Examples:
      | usuario                      | contrasena       | mensaje_esperado                            |
      | usuario.valido@ejemplo.com   | ClaveIncorrecta! | Las credenciales introducidas no son válidas |
      | usuario.inexistente@test.com | ClaveSegura123!  | Las credenciales introducidas no son válidas |
      |                              | ClaveSegura123!  | El campo usuario es obligatorio             |

