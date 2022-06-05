import { loadStripe } from '@stripe/stripe-js'

var PromesaStripe = null

const getStripe= () => {
    if (!PromesaStripe) {
        PromesaStripe = loadStripe("pk_test_51Kyv19K0adc9LJm2eVYycCZuzBfA7S1p2ipndOimY6RNkoMo1fgnjMcivcsgmZiWdzVFC4IEIBjz6lGj3WR1fbSs00vCv6TN5B")
    }
    return PromesaStripe
}
export default getStripe;
