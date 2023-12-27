import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { warrantyService, alertService } from 'services';

export { AddEdit };

function AddEdit(props) {
    const warranty = props?.warranty;
    const router = useRouter();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        cust_mobile_number: Yup.string()
            .required('MObile is required'),
        cust_name: Yup.string()
            .required('Name is required'),
        title: Yup.string()
            .required('title is required'),
        password: Yup.string()
            .transform(x => x === '' ? undefined : x)
            // password optional in edit mode
            .concat(warranty ? null : Yup.string().required('Password is required'))
            .min(6, 'Password must be at least 6 characters')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // set default form values if in edit mode
    if (warranty) {
        formOptions.defaultValues = props.warranty;
    }

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    async function onSubmit(data) {
        alertService.clear();
        try {
            // create or update warranty based on warranty prop
            let message;
            if (warranty) {
                await warrantyService.update(warranty.id, data);
                message = 'warranty updated';
            } else {
                await warrantyService.register(data);
                message = 'warranty added';
            }

            // redirect to warranty list with success message
            router.push('/warranties');
            alertService.success(message, true);
        } catch (error) {
            alertService.error(error);
            console.error(error);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="mb-3 col">
                    <label className="form-label">Customer Mobile</label>
                    <input name="cust_mobile_number" type="number" {...register('cust_mobile_number')} className={`form-control ${errors.cust_mobile_number ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.cust_mobile_number?.message}</div>
                </div>
                <div className="mb-3 col">
                    <label className="form-label">Customer Name</label>
                    <input name="cust_name" type="text" {...register('cust_name')} className={`form-control ${errors.cust_name ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.cust_name?.message}</div>
                </div>
            </div>
            <div className="row">
                <div className="mb-3 col">
                    <label className="form-label">Title</label>
                    <input name="title" type="text" {...register('title')} className={`form-control ${errors.title ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.title?.message}</div>
                </div>
            </div>
            <div className="mb-3">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary me-2">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                    Save
                </button>
                <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button>
                <Link href="/warranties" className="btn btn-link">Cancel</Link>
            </div>
        </form>
    );
}