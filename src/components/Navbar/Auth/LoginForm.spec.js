import React from "react";

import { login } from "../../../services/auth";

import AuthModal from "./AuthModal";
import { fireEvent, act, renderWithStoreAndTheme } from "../../../test-utils";
import Constants from "../../../utils/Constants";
import { SnackbarProvider } from "notistack";
import { createTheme } from "@material-ui/core";

jest.mock("../../../services/auth");

describe("Navbar - AuthModal - LoginForm", () => {
    const theme = createTheme({});
    describe("render", () => {
        it("Should not appear as default", () => {
            const wrapper = renderWithStoreAndTheme(
                <SnackbarProvider maxSnack={3}>
                    <AuthModal />
                </SnackbarProvider>, { initialState: {}, theme });
            const dialogTitle = wrapper.queryByRole("heading", { level: 2, name: "Login" });
            expect(dialogTitle).not.toBeInTheDocument();
        });
    });
    describe("interaction", () => {
        it("Should toggle the modal visibility when clicking Cancel button", async () => {

            const toggleAuthModal = jest.fn();

            const wrapper = renderWithStoreAndTheme(
                <SnackbarProvider maxSnack={3}>
                    <AuthModal open toggleAuthModal={toggleAuthModal} />
                </SnackbarProvider>, { initialState: {}, theme });

            const dialogTitle = wrapper.queryByRole("heading", { level: 2, name: "Login" });
            expect(dialogTitle).toBeInTheDocument();

            await act(async () => {
                await fireEvent.click(wrapper.getByText("Cancel"));
            });

            expect(toggleAuthModal).toHaveBeenCalledTimes(1);
        });

        it("Should change to the recovery page when clicking Lost Password button", () => {

            const toggleAuthModal = jest.fn();

            const wrapper = renderWithStoreAndTheme(
                <SnackbarProvider maxSnack={3}>
                    <AuthModal open toggleAuthModal={toggleAuthModal} />
                </SnackbarProvider>, { initialState: {}, theme });
            fireEvent.click(wrapper.getByText("Lost password?"));

            const dialogTitle = wrapper.queryByRole("heading", { level: 2, name: "Recover Password" });
            expect(dialogTitle).toBeInTheDocument();
        });

        it("Should login correctly and toggle Modal visibility", async () => {

            // Making sure that the login service allows the login
            login.mockImplementationOnce(() => true);

            const toggleAuthModal = jest.fn();

            const { getByRole, getByLabelText } = renderWithStoreAndTheme(
                <SnackbarProvider maxSnack={3}>
                    <AuthModal
                        open
                        toggleAuthModal={toggleAuthModal}
                        toggleLoginPending={() => {}}
                        updateSessionInfo={() => {}}
                    />
                </SnackbarProvider>, { initialState: {}, theme });

            await act(async () => {
                await fireEvent.change(getByLabelText("Email"), { target: { value: "asd@email.com" } });
            });
            await act(async () => {
                await fireEvent.change(getByLabelText("Password"), { target: { value: "asdahsdj" } });
            });
            await act(async () => {
                await fireEvent.click(getByRole("button", { name: "Login" }));
            });

            expect(toggleAuthModal).toHaveBeenCalledTimes(1);
        });

        it("Should not allow invalid email", async () => {

            const wrapper = renderWithStoreAndTheme(
                <SnackbarProvider maxSnack={3}>
                    <AuthModal
                        open
                        toggleAuthModal={() => {}}
                        toggleLoginPending={() => {}}
                        updateSessionInfo={() => {}}
                    />
                </SnackbarProvider>, { initialState: {}, theme });


            await act(async () => {
                await fireEvent.change(wrapper.getByLabelText("Email"), { target: { value: "invalidemail" } });
            });
            await act(async () => {
                await fireEvent.blur(wrapper.getByLabelText("Email"));
            });

            expect(await wrapper.findDescriptionOf(wrapper.getByLabelText("Email"))).toHaveTextContent("This must be a valid email.");

            await act(async () => {
                await fireEvent.change(wrapper.getByLabelText("Email"), { target: { value: "" } });
            });
            await act(async () => {
                await fireEvent.blur(wrapper.getByLabelText("Email"));
            });

            expect(await wrapper.findDescriptionOf(wrapper.getByLabelText("Email"))).toHaveTextContent("Please fill in your email.");

            await act(async () => {
                await fireEvent.change(wrapper.getByLabelText("Email"), { target: { value: "valid@email.com" } });
            });
            await act(async () => {
                await fireEvent.blur(wrapper.getByLabelText("Email"));
            });

            expect(await wrapper.findDescriptionOf(wrapper.getByLabelText("Email"))).toHaveTextContent("");
        });

        it("Should require password", async () => {

            const wrapper = renderWithStoreAndTheme(
                <SnackbarProvider maxSnack={3}>
                    <AuthModal
                        open
                        toggleAuthModal={() => {}}
                        toggleLoginPending={() => {}}
                        updateSessionInfo={() => {}}
                    />
                </SnackbarProvider>, { initialState: {}, theme });

            await act(async () => {
                await fireEvent.change(wrapper.getByLabelText("Password"), { target: { value: "" } });
            });
            await act(async () => {
                await fireEvent.blur(wrapper.getByLabelText("Password"));
            });

            expect(await wrapper.findDescriptionOf(wrapper.getByLabelText("Password"))).toHaveTextContent("Please fill in your password.");
        });

        it("Should show general error on login fail, and clear on input change", async () => {
            // Making sure that the login service denies the login
            login.mockImplementationOnce(() => {
                throw new Error();
            });

            // const toggleAuthModal = jest.fn();

            const wrapper = renderWithStoreAndTheme(
                <SnackbarProvider maxSnack={3}>
                    <AuthModal
                        open
                        toggleAuthModal={() => {}}
                        toggleLoginPending={() => {}}
                        updateSessionInfo={() => {}}
                    />
                </SnackbarProvider>, { initialState: {}, theme });

            await act(async () => {
                await fireEvent.change(wrapper.getByLabelText("Email"), { target: { value: "asd@email.com" } });
            });
            await act(async () => {
                await fireEvent.change(wrapper.getByLabelText("Password"), { target: { value: "asdahsdj" } });
            });
            await act(async () => {
                await fireEvent.click(wrapper.getByRole("button", { name: "Login" }));
            });
            expect(await wrapper.queryByText(Constants.UNEXPECTED_ERROR_MESSAGE)).toBeInTheDocument();

            await act(async () => {
                await fireEvent.change(wrapper.getByLabelText("Email"), { target: { value: "acsd@email.com" } });
            });

            expect(await wrapper.queryByText(Constants.UNEXPECTED_ERROR_MESSAGE)).not.toBeInTheDocument();
        });
    });
});
