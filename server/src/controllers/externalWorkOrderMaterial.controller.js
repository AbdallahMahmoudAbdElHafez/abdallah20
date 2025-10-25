import ExternalWorkOrderMaterialService from '../services/externalWorkOrderMaterial.service.js';

class ExternalWorkOrderMaterialController {
static async getAll(req, res) {
try {
const data = await ExternalWorkOrderMaterialService.getAll();
res.json(data);
} catch (err) {
res.status(500).json({ error: err.message });
}
}

static async create(req, res) {
try {
const data = await ExternalWorkOrderMaterialService.create(req.body);
res.status(201).json(data);
} catch (err) {
res.status(500).json({ error: err.message });
}
}

static async delete(req, res) {
try {
await ExternalWorkOrderMaterialService.delete(req.params.id);
res.json({ message: 'Deleted' });
} catch (err) {
res.status(500).json({ error: err.message });
}
}
}

export default ExternalWorkOrderMaterialController;