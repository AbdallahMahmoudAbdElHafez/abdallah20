import ExternalWorkOrdersService from '../services/externalWorkOrders.service.js';

class ExternalWorkOrdersController {
  static async getAll(req, res) {
    try {
      const data = await ExternalWorkOrdersService.getAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req, res) {
      console.log(req.body);

    try {

      const data = await ExternalWorkOrdersService.create(req.body);
      res.status(201).json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async receive(req, res) {
    try {
      const { id } = req.params;
      const data = await ExternalWorkOrdersService.receive(id, req.body.receipts);
      res.json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await ExternalWorkOrdersService.delete(id);
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default ExternalWorkOrdersController;