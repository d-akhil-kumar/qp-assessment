import { paymentLink } from "../types";

export class PaymentService {
    private readonly GATEWAY_SECRET: string;

    constructor() {
        this.GATEWAY_SECRET = 'DUMMY_SECRET'
    }

    //dummy function, can integrate payment gateways
    //out of scope for this challenge
    //assumption: currency is INR
    public generatePaymentLink(amount: number, orderId: string): paymentLink {
        return {
            link: `https://securePAymentGateway.com/id=3213SD2dsr42323&orderID=${orderId}&price=${amount}&ttl=5`,
            paymentId: `${orderId}-${Date.toString()}`,
        }

    }
}