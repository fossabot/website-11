import { connect } from 'react-redux';
import React, { useState } from 'react';
import { Button, Checkbox, Form, Message } from 'semantic-ui-react';

import { login } from '../../../actions/auth';

const Login = ({ dispatch, error }) => {
    const [fields, updateFields] = useState({ email: '', password: '', rememberMe: false });

    const handleSubmit = () => {
        dispatch(login(fields));
    };

    const handleChange = (e, { name, value }) => {
        updateFields({
            ...fields,
            [name]: value,
        });
    };

    const handleCheckboxChange = () => {
        updateFields({
            ...fields,
            rememberMe: !fields.rememberMe,
        });
    };

    return (
        <>
            <Form onSubmit={handleSubmit} error={error}>
                {error && (
                    <Message error={true}>
                        <Message.Header>Something wen't wrong!</Message.Header>
                        <p>{error}</p>
                    </Message>
                )}
                <Form.Field required>
                    <label>Email</label>
                    <Form.Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={fields.email}
                        onChange={handleChange}
                    />
                </Form.Field>
                <Form.Field required>
                    <label>Password</label>
                    <Form.Input
                        name="password"
                        type="password"
                        value={fields.password}
                        placeholder="Password"
                        onChange={handleChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        name="rememberMe"
                        label="Remember me"
                        onChange={handleCheckboxChange}
                        checked={fields.rememberMe}
                    />
                </Form.Field>
                <Button type="submit">Submit</Button>
            </Form>
        </>
    );
};

export default connect(({ auth: { error } }) => ({ error }))(Login);
