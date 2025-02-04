import React, { useState } from "react";
import PropTypes from "prop-types";
import { login } from "../../../services/auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LoginSchema from "./LoginSchema";
import useAuthStyles from "./authStyles";
import {
    CircularProgress,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    FormHelperText,
} from "@material-ui/core";
import useToggle from "../../../hooks/useToggle";

const LoginForm = ({ toggleAuthModal, updateSessionInfo, setRecoveryRequestPage }) => {
    const classes = useAuthStyles();

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(LoginSchema),
        reValidateMode: "onChange",
    });

    const [loginPending, toggleLoginPending] = useToggle(false);

    const [errorCleared, setErrorCleared] = useState(true);

    const [loginError, setLoginError] = React.useState(null);
    const resetError = () => {
        if (!errorCleared) {
            setLoginError([]);
            setErrorCleared(true);
        }
    };

    const handleLogin = async (data) => {
        toggleLoginPending();
        try {
            await login(data.email, data.password);
            updateSessionInfo();
            toggleLoginPending();
            toggleAuthModal();
        } catch (e) {
            toggleLoginPending();
            setLoginError(e.status === 401 ? "Email/Password combination is invalid." : "Unexpected Error. Please try again later.");
        }
    };

    const onSubmit = async (data) => {
        setErrorCleared(false);
        await handleLogin(data);
    };

    return (
        <form
            aria-label="Login"
            onSubmit={handleSubmit(onSubmit)}
        >
            <DialogTitle id="form-dialog-title">Login</DialogTitle>
            <DialogContent>
                <TextField
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    onChange={resetError}
                    margin="normal"
                    fullWidth
                    inputProps={{ ...register("email") }}
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : <span />}
                />
                <TextField
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    onChange={resetError}
                    margin="normal"
                    fullWidth
                    inputProps={{ ...register("password") }}
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : <span />}
                />
                <FormHelperText error={!!loginError}>
                    {loginError || " "}
                </FormHelperText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={setRecoveryRequestPage}
                    variant="text"
                    disabled={loginPending}
                    color="secondary"
                >
                        Lost password?
                </Button>
                <Button
                    onClick={toggleAuthModal}
                    variant="text"
                    color="secondary"
                    disabled={loginPending}
                >
                        Cancel
                </Button>
                <div className={classes.loginBtnWrapper}>
                    <Button
                        type="submit"
                        className={classes.loginBtn}
                        color="primary"
                        variant="contained"
                        disabled={loginPending}
                    >
                            Login
                    </Button>
                    {loginPending &&
                    <CircularProgress
                        size={24}
                        className={classes.loginProgressRed}
                    />
                    }
                </div>
            </DialogActions>
        </form>
    );
};

LoginForm.propTypes = {
    toggleAuthModal: PropTypes.func.isRequired,
    updateSessionInfo: PropTypes.func.isRequired,
    setRecoveryRequestPage: PropTypes.func.isRequired,
};

export default LoginForm;
