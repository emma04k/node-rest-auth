export const emailTemplate = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Validación de Correo Electrónico</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: white;
            margin: 20px auto;
            padding: 20px;
            width: 600px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333;
        }
        p {
            font-size: 16px;
            color: #666;
        }
        .button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            display: inline-block;
            margin-top: 20px;
        }
        .footer {
            font-size: 12px;
            color: #999;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>¡Bienvenido a Nuestro Servicio!</h2>
        <p>Hola <strong>[USER_NAME]</strong>,</p>
        <p>Gracias por registrarte en nuestro servicio. Para completar tu registro, por favor haz clic en el siguiente enlace para validar tu correo electrónico:</p>
        
        <!-- Aquí es donde se incluiría el enlace de validación -->
        <a href="[VALIDATION_LINK]" class="button">Validar mi correo electrónico</a>
        
        <p>Si no te registraste en nuestro servicio, por favor ignora este correo.</p>

        <div class="footer">
            <p>Este es un mensaje automático. No respondas a este correo.</p>
        </div>
    </div>
</body>
</html>
`;