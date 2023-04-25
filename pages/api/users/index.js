import { apiHandler, usersRepo } from 'helpers/api';

export default apiHandler({
    get: getAll
});

async function getAll(req, res) {
    const users = await usersRepo.getAll();
    return res.status(200).json(users);
}
