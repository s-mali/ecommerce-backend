const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


exports.checkoutSession = async (req, res) => {

    try{
        const { product } = req.body; 
        console.log(product)
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
            success_url: "http://localhost:3000/stripepaymentsuccess",
            cancel_url: "http://localhost:3000/stripepaymentcancel",
        });
        res.json({ id: session.id });
    }
    catch(err){
        console.log(err)
    }
    

}