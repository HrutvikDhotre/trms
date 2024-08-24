import { React, useState } from 'react'
import { Layout } from '../components'
import { GroupListForm, GroupDetailsForm } from '../components'

const ListGenerator = () => {
    const [formData, setFormData] = useState(null);

    const handleSubmit = (formData) => {
        // Handle form submission data here, such as sending it to an API or processing it further
        console.log('Form data submitted:', formData);
        setFormData(formData);
    };
    return (
        <Layout>
            <div className="" style={{margin : '60px'}}>
                {!formData ? (
                    <GroupListForm onSubmit={handleSubmit} />
                ) : (
                    <div>
                        <h1>Form Submitted Successfully!</h1>
                        <pre>{JSON.stringify(formData, null, 2)}</pre>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default ListGenerator