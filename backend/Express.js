const cors = require('cors');

const corsOptions = {
  origin: [
    'https://harekrishnamedical.vercel.app/'
    ],
credentials: true,

ethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], 
allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsoptions));
