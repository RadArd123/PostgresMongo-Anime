import { Request, Response } from 'express';
import { donationModel } from '../model/donations.model';
import { ExtendedRequest } from '../interfaces/request.types';
import Stripe from 'stripe';
import { checkoutSessionSchema } from '../schemas/donation.schemas';
import { getPrimaryFrontendUrl } from '../config/security';
import { z } from 'zod';

let stripeClient: Stripe | null = null;

const getStripe = (): Stripe => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error('STRIPE_SECRET_KEY is not configured');

  stripeClient ??= new Stripe(secretKey, { apiVersion: '2026-08-26.dahlia' });
  return stripeClient;
};

export const getDonations = async (req: Request, res: Response) => {
  try {
    const requestedLimit = parseInt(req.query.limit as string, 10) || 20;
    const limit = Math.min(100, Math.max(1, requestedLimit));
    const donations = await donationModel.getDonations(limit);
    res.status(200).json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserDonations = async (req: ExtendedRequest, res: Response) => {
  try {
    const user_id = req.user!.id;
    const donations = await donationModel.getUserDonations(user_id);
    res.status(200).json(donations);
  } catch (error) {
    console.error('Error fetching user donations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDonationStats = async (req: Request, res: Response) => {
  try {
    const stats = await donationModel.getDonationStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createCheckoutSession = async (req: ExtendedRequest, res: Response) => {
  try {
    const { amount, donor_name, message } = checkoutSessionSchema.parse(req.body);
    const userId = req.user?.id;
    const frontendUrl = getPrimaryFrontendUrl();

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Anime App Support',
              description: 'Donation for the development of the application',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${frontendUrl}/donation-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/`,
      client_reference_id: userId ? String(userId) : undefined,
      metadata: {
        donor_name: donor_name || 'Anonymous',
        message,
        user_id: userId ? String(userId) : '',
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.issues[0]?.message || 'Invalid donation data' });
      return;
    }
    console.error('Error creating Stripe session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCheckoutSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    res.status(400).json({ message: 'Invalid checkout session' });
    return;
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    res.status(200).json({
      paid: session.payment_status === 'paid',
      amount: (session.amount_total || 0) / 100,
      currency: session.currency,
      donor_name: session.metadata?.donor_name || 'Anonymous',
    });
  } catch (error) {
    console.error('Error retrieving Stripe session:', error);
    res.status(404).json({ message: 'Checkout session not found' });
  }
};

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !endpointSecret) {
    res.status(500).json({ message: 'Stripe webhook is not configured' });
    return;
  }

  let event: Stripe.Event;

  try {
    // req.body MUST be raw buffer here
    event = getStripe().webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== 'paid' || session.currency !== 'usd') {
      res.status(200).send();
      return;
    }

    const amount = (session.amount_total || 0) / 100;
    const coffees = Math.max(1, Math.round(amount / 3));
    const donorName = (session.metadata?.donor_name || 'Anonymous').slice(0, 100);
    const message = (session.metadata?.message || '').slice(0, 500);
    const metadataUserId = Number(session.metadata?.user_id);
    const userId = Number.isSafeInteger(metadataUserId) && metadataUserId > 0
      ? metadataUserId
      : null;

    try {
      await donationModel.createStripeDonation(
        userId,
        'Supporter',
        amount,
        coffees,
        donorName,
        message,
        session.id,
        event.id
      );
    } catch (dbErr) {
      console.error('Database insertion error:', dbErr);
      res.status(500).send();
      return;
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).send();
};
