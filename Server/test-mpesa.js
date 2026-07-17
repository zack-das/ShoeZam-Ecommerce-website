// simple-stk-test.js
require('dotenv').config();
const axios = require('axios');

async function simpleSTKPush() {
    console.log('📱 Sending STK Push to test phone...\n');
    
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    
    try {
        // Get token
        const tokenRes = await axios.get(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            { headers: { 'Authorization': `Basic ${auth}` } }
        );
        
        const token = tokenRes.data.access_token;
        console.log('✅ Token obtained');
        
        // Prepare STK Push
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
        const password = Buffer.from(`174379${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');
        
        const payload = {
            BusinessShortCode: '174379',
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: 10,
            PartyA: '254708374149',
            PartyB: '174379',
            PhoneNumber: '254708374149',
            CallBackURL: 'https://webhook.site/your-id', // Replace with your webhook URL
            AccountReference: `TEST${Date.now()}`,
            TransactionDesc: 'ShoeZam Test'
        };
        
        console.log('💰 Sending payment request...');
        
        const stkRes = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('\n✅ STK Push SENT Successfully!');
        console.log('📱 Check your test phone: 254708374149');
        console.log('🔑 Enter PIN: 174379');
        console.log('\nResponse:', JSON.stringify(stkRes.data, null, 2));
        
        const checkoutId = stkRes.data.CheckoutRequestID;
        console.log(`\n📝 CheckoutRequestID: ${checkoutId}`);
        console.log('\n💡 To check payment status later, run:');
        console.log(`node check-status.js ${checkoutId}`);
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

simpleSTKPush();