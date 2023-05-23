const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


exports.checkoutSession = async (req, res) => {

    try{
        const { product } = req.body; 
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: product.name,
                        },
                        unit_amount: product.price * 100,
                    },
                    quantity: product.quantity,
                },
            ],
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/paymentsuccess`,
            cancel_url: `${process.env.FRONTEND_URL}/paymentcancel`,
        });
        //console.log(session)
        res.json({ id: session.id });
    }
    catch(err){
        console.log(err)
    }


}

exports.handleWebhook =  async (req, res) => {
    const event = req.body;
    console.log(event)
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':

        // Handle successful payment
        break;
      case 'payment_intent.failed':
        // Handle failed payment
        break;
    }
  
    res.sendStatus(200);
  };
