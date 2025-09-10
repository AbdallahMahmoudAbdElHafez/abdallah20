 export const ok = (res, data) => res.json(data);
 export const created = (res, data) => res.status(201).json(data);
export const notFound = (res, message = "Not found") => res.status(404).json({ message });
export const error = (res, message = "Internal server error") => res.status(500).json({ message });

export default { ok, created , notFound, error };