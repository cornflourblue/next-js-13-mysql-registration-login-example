import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Layout, AddEdit } from 'components/users';
import { Spinner } from 'components';
import { userService, alertService } from 'services';

export default Edit;

function Edit() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const { id } = router.query;
        if (!id) return;

        // fetch user and set default form values if in edit mode
        userService.getById(id)
            .then(x => setUser(x))
            .catch(alertService.error)
    }, [router]);

    return (
        <Layout>
            <h1>Edit User</h1>
            {user ? <AddEdit user={user} /> : <Spinner />}
        </Layout>
    );
}