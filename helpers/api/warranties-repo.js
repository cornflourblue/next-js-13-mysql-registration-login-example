import getConfig from 'next/config';
import { db } from 'helpers/api';

const { serverRuntimeConfig } = getConfig();

export const warrantiesRepo = {
    getAll,
    getById
};
async function getAll() {
    return await db.Warranty.findAll();
}
async function getById(id) {
    return await db.Warranty.findByPk(id);
}





