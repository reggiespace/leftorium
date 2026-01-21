
const STRAPI_URL = 'http://localhost:1337';

async function testQuery(endpoint) {
    console.log(`Testing: ${endpoint}`);
    try {
        const res = await fetch(`${STRAPI_URL}${endpoint}`);
        console.log(`Status: ${res.status}`);
        if (!res.ok) {
            console.log(`Error: ${await res.text()}`);
        } else {
            const json = await res.json();
            console.log('Success! Data sample (first item):');
            if (json.data && json.data.length > 0) {
                console.log(JSON.stringify(json.data[0], null, 2));
            } else {
                console.log('No data found.');
            }
        }
    } catch (e) {
        console.error('Fetch error:', e.message);
    }
    console.log('---');
}

async function run() {
    // 1. Fetch one leftorium-user to see attributes and relation names
    // We assume there's at least one, or we can see empty structure if supported?
    // If auth is needed, this might fail, but let's try public/generic endpoint.
    // If this returns 403, we know we need auth, but schema should still be inferable if we had docs.
    // Since we are running this "locally" effectively, we can hopefully see public data.
    await testQuery('/api/leftorium-users?populate=*');

    // 2. Fetch one leftorium-comment to see attributes and relation names
    await testQuery('/api/leftorium-comments?populate=*');

    // 3. Fetch one leftorium-rating (if any) to see schema
    await testQuery('/api/leftorium-ratings?populate=*');
}

run();
