const http = require('http');

const get = (path) => {
    return new Promise((resolve, reject) => {
        http.get(`http://localhost:5000/api/reports${path}`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(data);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
};

(async () => {
    try {
        console.log('Fetching Summary...');
        const summary = await get('/summary');
        console.log('Summary Result:', summary);

        console.log('\nFetching Top Products...');
        const topProducts = await get('/top-products');
        console.log('Top Products Result:', topProducts);

        console.log('\nFetching Low Stock...');
        const lowStock = await get('/low-stock');
        console.log('Low Stock Result:', lowStock);

    } catch (error) {
        console.error('Error:', error.message);
    }
})();
