import offerKitsService from '../services/offerKits.service.js';

class OfferKitsController {
    async getAllOfferKits(req, res) {
        try {
            const offerKits = await offerKitsService.getAllOfferKits();
            res.json(offerKits);
        } catch (error) {
            console.error('Error in getAllOfferKits:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async getOfferKitById(req, res) {
        try {
            const offerKit = await offerKitsService.getOfferKitById(req.params.id);
            res.json(offerKit);
        } catch (error) {
            console.error('Error in getOfferKitById:', error);
            if (error.message === 'Offer Kit not found') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }

    async createOfferKit(req, res) {
        try {
            const offerKit = await offerKitsService.createOfferKit(req.body);
            res.status(201).json(offerKit);
        } catch (error) {
            console.error('Error in createOfferKit:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async updateOfferKit(req, res) {
        try {
            const offerKit = await offerKitsService.updateOfferKit(req.params.id, req.body);
            res.json(offerKit);
        } catch (error) {
            console.error('Error in updateOfferKit:', error);
            if (error.message === 'Offer Kit not found') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }

    async deleteOfferKit(req, res) {
        try {
            await offerKitsService.deleteOfferKit(req.params.id);
            res.json({ message: 'Offer Kit deleted successfully' });
        } catch (error) {
            console.error('Error in deleteOfferKit:', error);
            if (error.message === 'Offer Kit not found') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }
}

export default new OfferKitsController();
