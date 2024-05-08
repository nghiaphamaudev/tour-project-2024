import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
  'pk_test_51PE0P0Es5Pctmf48yIApoIHhyQFPcjscnPdeKnX9MiN4Prba2RQaH4JXyz4zTTt6g9ZeMWGRMt3pr5eGl2U0iokJ009kUk2b8t'
);
export const bookTour = async (tourId) => {
  try {
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    //2) Checkout form  + chanre credit card

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', err);
  }
  //1) Get checkout session from API
};
