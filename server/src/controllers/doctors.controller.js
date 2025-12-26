import DoctorService from "../services/doctors.service.js";

class DoctorController {
    static async getAll(req, res) {
        try {
            const doctors = await DoctorService.getAll();
            res.json(doctors);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const doctor = await DoctorService.getById(req.params.id);
            if (!doctor) return res.status(404).json({ message: "Doctor not found" });
            res.json(doctor);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async create(req, res) {
        try {
            const doctor = await DoctorService.create(req.body);
            res.status(201).json(doctor);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async update(req, res) {
        try {
            const doctor = await DoctorService.update(req.params.id, req.body);
            if (!doctor) return res.status(404).json({ message: "Doctor not found" });
            res.json(doctor);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const result = await DoctorService.delete(req.params.id);
            if (!result) return res.status(404).json({ message: "Doctor not found" });
            res.json({ message: "Doctor deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default DoctorController;
