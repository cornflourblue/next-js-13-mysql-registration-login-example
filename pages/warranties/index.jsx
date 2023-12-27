import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Spinner } from 'components';
import { Layout } from 'components/warranties';
import { warrantyService } from 'services';

export default Index;

function Index() {
    const [warranties, setWarranties] = useState(null);

    useEffect(() => {
        warrantyService.getAll().then(x => setWarranties(x));
    }, []);

    function deleteWarranty(id) {
        setWarranties(warranties.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        warrantyService.delete(id).then(() => {
            setWarranties(warranties => warranties.filter(x => x.id !== id));
        });
    }

    return (
        <Layout>
            <h1>Warranties</h1>
            <Link href="/warranties/add" className="btn btn-sm btn-success mb-2">Add Warranty</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Customer name</th>
                        <th>Customer mobile</th>
                        <th>Title</th>
                        <th>Total price</th>
                        <th>Description</th>
                        <th>Invocie date</th>
                        <th>Expire date</th>
                        <th>IMEI number</th>
                        <th>PIC</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {warranties && warranties.map(warranty =>
                        <tr key={warranty.id}>
                            <td>{warranty.cust_name}</td>
                            <td>{warranty.cust_mobile_number}</td>
                            <td>{warranty.title}</td>
                            <td>{warranty.cart_sub_total}</td>
                            <td>{warranty.description}</td>
                            <td>{warranty.invoice_date}</td>
                            <td>{warranty.expire_date}</td>
                            <td>{warranty.pic}</td>
                            <td>{warranty.imei_number}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <button onClick={() => deleteWarranty(warranty.id)} className="btn btn-sm btn-danger btn-delete-warranty" style={{ width: '60px' }} disabled={warranty.isDeleting}>
                                    {warranty.isDeleting
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!warranties &&
                        <tr>
                            <td colSpan="4">
                                <Spinner />
                            </td>
                        </tr>
                    }
                    {warranties && !warranties.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">No Warranty To Display</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </Layout>
    );
}
