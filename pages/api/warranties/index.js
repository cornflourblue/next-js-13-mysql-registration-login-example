import { apiHandler, warrantiesRepo } from 'helpers/api';

export default apiHandler({
    get: getAll
});

async function getAll(req, res) {
    const warranties = await warrantiesRepo.getAll();
    return res.status(200).json(warranties);
}
