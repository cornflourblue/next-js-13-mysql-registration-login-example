import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { alertService } from 'services';

export { Alert };

function Alert() {
    const router = useRouter();
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        // subscribe to new alert notifications
        const subscription = alertService.alert.subscribe(alert => setAlert(alert));

        // unsubscribe when the component unmounts
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        // clear alert on location change
        alertService.clear();
    }, [router]);

    if (!alert) return null;

    return (
        <div className="container">
            <div className="m-3">
                <div className={`alert alert-dismissible ${alert.type}`}>
                    {alert.message}
                    <button type="button" className="btn-close" onClick={() => alertService.clear()}></button>
                </div>
            </div>
        </div>
    );
}
