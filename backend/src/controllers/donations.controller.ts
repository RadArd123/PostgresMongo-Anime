import { Request, Response } from 'express';
import { donationModel } from '../model/donations.model';
import { ExtendedRequest } from '../interfaces/request.types';

export const createDonation = async (req: ExtendedRequest, res: Response) => {
  try {
    const { tier_name, amount, coffees, donor_name, message } = req.body;
    const user_id = req.user!.id;
    
    const newDonation = await donationModel.createDonation(
      user_id, tier_name, amount, coffees, donor_name, message
    );
    
    res.status(201).json(newDonation);
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDonations = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
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
