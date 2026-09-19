import { env } from './config/env.js';
import { testConnection, sequelize } from './config/db.js';
import './models/index.js';
// App
import app from './app.js';


(async () => {
    await testConnection();
    // لا تستخدم force:true في الإنتاج. هنا sync فقط لضبط الأعمدة كما في DB
    await sequelize.sync({ alter: true });


    app.listen(env.port, () => {
        console.log(`🚀 Server listening on http://localhost:${env.port}`);
    });
})();