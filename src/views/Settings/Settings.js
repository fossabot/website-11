import QRCode from 'qrcode.react';
import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Segment } from 'semantic-ui-react';

import { setupMfa, confirmMfa } from '../../actions/auth';

const mapStateToProps = state => ({
    loggedIn: state.auth.loggedIn,
    mfa: state.auth.mfa,
    attributes: state.auth.attributes,
});

export default connect(mapStateToProps)(
    ({ dispatch, loggedIn, history, attributes: { email }, mfa }) => {
        const [enteredCode, setEnteredCode] = useState('');
        useEffect(() => {
            if (!loggedIn) {
                history.push('/');
            }
        });

        const onSetupClick = () => {
            dispatch(setupMfa());
        };

        const onConfirmClick = () => {
            dispatch(confirmMfa(enteredCode));
        };

        const onDisableClick = () => {
            // dispatch(enableMfa());
        };

        return (
            <div>
                <Card>
                    <Card.Content>
                        <Card.Header>Multi Factor Authentication</Card.Header>
                        <Card.Description>
                            <p>
                                Multi factor authentication requires that you get a code from an
                                application (such as Google Authenticator) before being able to
                                login.
                            </p>
                            <p>
                                Turning this on will dramatically increase your account's security.
                            </p>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        {!mfa.enabled && (
                            <Button basic color="green" onClick={onSetupClick}>
                                Setup
                            </Button>
                        )}
                        {mfa.enabled && (
                            <Button basic color="red" onClick={onDisableClick}>
                                Disable
                            </Button>
                        )}
                    </Card.Content>
                </Card>

                {mfa.secret && (
                    <>
                        <QRCode
                            value={`otpauth://totp/atlauncher:${email}?secret=${
                                mfa.secret
                            }&issuer=atlauncher`}
                        />
                        <Segment attached="top" />
                        <Input
                            onChange={(e, { value }) => setEnteredCode(value)}
                            attached="bottom"
                            placeholder="Enter generated code"
                        >
                            <input />
                            <Button onClick={onConfirmClick}>Enable</Button>
                        </Input>
                    </>
                )}
            </div>
        );
    },
);
