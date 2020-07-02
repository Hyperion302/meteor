// Entrance file, unrelated to service level code
import 'module-alias/register';
import app from './services/APIGatewayService';

const port = 8080 || process.env.PORT;

app.listen(port);
