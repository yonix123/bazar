const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function seed() {
    // Load env vars from .env.local
    try {
        const envPath = path.resolve(__dirname, '.env.local');
        if (fs.existsSync(envPath)) {
            const envFile = fs.readFileSync(envPath, 'utf8');
            envFile.split('\n').forEach(line => {
                const parts = line.split('=');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    const value = parts.slice(1).join('=').trim().replace(/^"(.*)"$/, '$1');
                    if (key && value) {
                        process.env[key] = value;
                    }
                }
            });
            console.log('Loaded env vars from .env.local');
        } else {
            console.log('.env.local file not found at:', envPath);
        }
    } catch (e) {
        console.log('Error reading .env.local:', e);
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing Supabase env vars. URL:', !!supabaseUrl, 'Key:', !!supabaseServiceKey);
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const userId = 'user_2l8k4j29d023'; // Random ID used for manual testing

    console.log('Creating listing...');
    const { data: listing, error: listingError } = await supabase
        .from('sell_listings')
        .insert({
            owner_id: userId,
            title: 'Test Motor NEO',
            description: 'A test motor description.',
            category: 'motors',
            condition: 'new',
            price: 50.00,
            location: 'New York, NY',
            contact_type: 'phone',
            contact_value: '1234567890',
            images: ['https://placehold.co/600x400'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (listingError) console.error('Listing error:', listingError);
    else console.log('Listing created:', listing.id);

    console.log('Creating buy request...');
    const { data: request, error: requestError } = await supabase
        .from('buy_requests')
        .insert({
            owner_id: userId,
            item_needed: 'Test Sensor',
            max_budget: 100,
            location: 'Boston, MA',
            contact_type: 'telegram',
            contact_value: '@tester',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (requestError) console.error('Buy request error:', requestError);
    else console.log('Buy request created:', request.id);
}

seed();
