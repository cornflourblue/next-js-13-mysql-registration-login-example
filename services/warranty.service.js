import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { alertService } from './alert.service';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/warranties`;
const warrantySubject = new BehaviorSubject(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user')));

export const warrantyService = {
    warranty: warrantySubject.asObservable(),
    get warrantyValue() { return warrantySubject.value },
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete
};

async function login(username, password) {
    const user = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });

    // publish user to subscribers and store in local storage to stay logged in between page refreshes
    warrantySubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
}

function logout() {
    alertService.clear();
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    warrantySubject.next(null);
    Router.push('/account/login');
}

async function register(user) {
    await fetchWrapper.post(`${baseUrl}/register`, user);
}

async function getAll() {
    return await fetchWrapper.get(baseUrl);
}

async function getById(id) {
    return await fetchWrapper.get(`${baseUrl}/${id}`);
}

async function update(id, params) {
    await fetchWrapper.put(`${baseUrl}/${id}`, params);

    // update stored user if the logged in user updated their own record
    if (id === warrantySubject.value.id) {
        // update local storage
        const user = { ...warrantySubject.value, ...params };
        localStorage.setItem('user', JSON.stringify(user));

        // publish updated user to subscribers
        warrantySubject.next(user);
    }
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(id) {
    await fetchWrapper.delete(`${baseUrl}/${id}`);

    // auto logout if the logged in user deleted their own record
    if (id === warrantySubject.value.id) {
        logout();
    }
}
