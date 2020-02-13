// Entrance file, unrelated to service level code
import app from './services/APIGatewayService';

const port = 8080 || process.env.PORT;

app.listen(port, () => {
    console.log('Started');
});
