const axios = require('axios');
const crypto = require('crypto');

class PaymentService {
    constructor() {
        // Configuración para PSE (usando PayU como ejemplo)
        this.apiKey = process.env.PAYU_API_KEY || 'your-api-key';
        this.merchantId = process.env.PAYU_MERCHANT_ID || 'your-merchant-id';
        this.accountId = process.env.PAYU_ACCOUNT_ID || 'your-account-id';
        this.baseUrl = process.env.PAYU_BASE_URL || 'https://api.payulatam.com/payments-api/4.0/service.cgi';
        this.testMode = process.env.PAYU_TEST_MODE === 'true';
    }

    // Generar firma para autenticación
    generateSignature(params) {
        const signatureString = `${this.apiKey}~${this.merchantId}~${params.referenceCode}~${params.amount}~${params.currency}`;
        return crypto.createHash('md5').update(signatureString).digest('hex');
    }

    // Crear transacción PSE
    async createPSEPayment(orderData) {
        try {
            const referenceCode = `ORDER_${orderData.id}_${Date.now()}`;
            const amount = Math.round(orderData.total * 100); // Convertir a centavos
            
            const paymentData = {
                language: 'es',
                command: 'SUBMIT_TRANSACTION',
                merchant: {
                    apiKey: this.apiKey,
                    apiLogin: this.merchantId
                },
                transaction: {
                    order: {
                        accountId: this.accountId,
                        referenceCode: referenceCode,
                        description: `Pedido #${orderData.id} - Mordipets`,
                        language: 'es',
                        signature: this.generateSignature({
                            referenceCode,
                            amount: orderData.total,
                            currency: 'COP'
                        }),
                        notifyUrl: `${process.env.FRONTEND_URL}/api/payments/webhook`,
                        additionalValues: {
                            TX_VALUE: {
                                value: orderData.total,
                                currency: 'COP'
                            }
                        },
                        buyer: {
                            fullName: orderData.clientName,
                            emailAddress: orderData.clientEmail,
                            phone: orderData.clientPhone,
                            dniNumber: '12345678' // En producción, obtener del formulario
                        },
                        shippingAddress: {
                            street1: orderData.clientLocation,
                            city: 'Bogotá',
                            state: 'Cundinamarca',
                            country: 'CO',
                            postalCode: '110111'
                        }
                    },
                    payer: {
                        fullName: orderData.clientName,
                        emailAddress: orderData.clientEmail,
                        phone: orderData.clientPhone
                    },
                    extraParameters: {
                        INSTALLMENTS_NUMBER: 1
                    },
                    type: 'AUTHORIZATION_AND_CAPTURE',
                    paymentMethod: 'PSE',
                    paymentCountry: 'CO',
                    deviceSessionId: `device_${Date.now()}`,
                    ipAddress: '127.0.0.1', // En producción, obtener IP real
                    cookie: `cookie_${Date.now()}`,
                    userAgent: 'Mordipets/1.0'
                }
            };

            const response = await axios.post(this.baseUrl, paymentData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            return {
                success: true,
                transactionId: response.data.transactionId,
                referenceCode: referenceCode,
                paymentUrl: response.data.extraParameters?.PSE_URL || null,
                data: response.data
            };

        } catch (error) {
            console.error('Error creando pago PSE:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }

    // Verificar estado de transacción
    async checkPaymentStatus(transactionId) {
        try {
            const response = await axios.get(`${this.baseUrl}`, {
                params: {
                    language: 'es',
                    command: 'GET_TRANSACTION_DETAILS',
                    merchant: {
                        apiKey: this.apiKey,
                        apiLogin: this.merchantId
                    },
                    transactionId: transactionId
                }
            });

            const transaction = response.data;
            return {
                success: true,
                status: transaction.state,
                transactionId: transaction.transactionId,
                referenceCode: transaction.referenceCode,
                amount: transaction.value,
                currency: transaction.currency,
                responseCode: transaction.responseCode,
                responseMessage: transaction.responseMessage
            };

        } catch (error) {
            console.error('Error verificando estado de pago:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }

    // Procesar webhook de confirmación de pago
    processWebhook(webhookData) {
        try {
            const {
                state_pol,
                response_code_pol,
                reference_sale,
                value,
                currency,
                transaction_id,
                signature
            } = webhookData;

            // Verificar firma del webhook
            const expectedSignature = this.generateSignature({
                referenceCode: reference_sale,
                amount: value,
                currency: currency
            });

            if (signature !== expectedSignature) {
                return {
                    success: false,
                    error: 'Firma inválida'
                };
            }

            // Determinar estado del pago
            let paymentStatus = 'pending';
            if (state_pol === '4' && response_code_pol === '1') {
                paymentStatus = 'paid';
            } else if (state_pol === '6' || response_code_pol !== '1') {
                paymentStatus = 'failed';
            }

            return {
                success: true,
                transactionId: transaction_id,
                referenceCode: reference_sale,
                status: paymentStatus,
                amount: value,
                currency: currency,
                responseCode: response_code_pol
            };

        } catch (error) {
            console.error('Error procesando webhook:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new PaymentService();
