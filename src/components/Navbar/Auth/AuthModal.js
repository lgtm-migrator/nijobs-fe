/* eslint-disable no-constant-condition */
import React, { useCallback } from "react";
import PropTypes from "prop-types";
import {
    Dialog,
} from "@material-ui/core";
import LoginForm from "./LoginForm";
import PasswordRecoveryForm from "./PasswordRecoveryForm";
import usePageSwitcher from "../../../hooks/usePageSwitcher";
import PasswordRecoveryFinishForm from "./PasswordRecoveryFinishForm";

const AuthModal = ({ open, toggleAuthModal, updateSessionInfo, addSnackbar }) => {
    const [
        [
            loginActive,
            recoveryRequestActive,
            recoveryFinishActive,
        ],
        [
            switchLogin,
            switchRecoveryRequest,
            switchRecoveryFinish,
        ],
        // reset,
    ] = usePageSwitcher(3, 0);

    const onClose = useCallback(
        () => {
            toggleAuthModal();
        },
        [toggleAuthModal],
    );

    // Reset to login page on opening
    // useEffect(() => {
    //     if (open) {
    //         reset();
    //     }
    // }, [open, reset, switchLogin]);


    return (
        <Dialog open={open} fullWidth aria-labelledby="form-dialog-title" onClose={onClose}>
            {loginActive &&
                <LoginForm
                    toggleAuthModal={toggleAuthModal}
                    updateSessionInfo={updateSessionInfo}
                    setRecoveryRequestPage={switchRecoveryRequest}
                />}
            {recoveryRequestActive &&
                <PasswordRecoveryForm
                    toggleAuthModal={toggleAuthModal}
                    setLoginPage={switchLogin}
                    setRecoveryFinishPage={switchRecoveryFinish}
                />}
            {recoveryFinishActive &&
                <PasswordRecoveryFinishForm
                    toggleAuthModal={toggleAuthModal}
                    setLoginPage={switchLogin}
                    setRecoveryFinishPage={switchRecoveryFinish}
                    addSnackbar={addSnackbar}
                />}
        </Dialog>
    );
};

AuthModal.propTypes = {
    open: PropTypes.bool.isRequired,
    toggleAuthModal: PropTypes.func.isRequired,
    updateSessionInfo: PropTypes.func.isRequired,
    addSnackbar: PropTypes.func.isRequired,
};

export default AuthModal;
