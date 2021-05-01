import React, { useCallback, useContext } from "react";
import PropTypes from "prop-types";
import { Box, Button, FormControl, Grid, IconButton, makeStyles, TextField, Tooltip, Typography } from "@material-ui/core";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { FinishCompanyRegistrationControllerContext } from "./FinishCompanyRegistrationWidget";

const RemoveContactButton = ({ onClick, contacts }) => {
    const disabled = Object.keys(contacts).length < 2;
    return (
        <FormControl>
            <Tooltip
                title={disabled ? "At least 1 contact required" : "Remove Entry"}
                aria-label={disabled ? "At least 1 contact required" : "Remove Entry"}
            >
                <span>
                    <IconButton
                        aria-label="remove entry"
                        onClick={onClick}
                        disabled={disabled}
                    >
                        <RemoveCircle />
                    </IconButton>
                </span>
            </Tooltip>
        </FormControl>
    );
};

RemoveContactButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    contacts: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
    })).isRequired,
};

const useStyles = makeStyles(() => ({
    addContactBtn: {
        width: "max-content",
    },
}));


export const useContacts = ({ control }) => {

    const { fields, append, remove } = useFieldArray({
        control,
        name: "contacts",
    });

    const contacts = useWatch({
        name: "contacts",
        control,
    });

    // TODO USE CONSTANTS FILE
    const validateStep = useCallback(() =>
        contacts?.length > 0
        && contacts?.length < 11
        && contacts.every(({ value }) => value !== "")
    , [contacts]);

    return {
        validateStep,
        fields,
        append,
        remove,
    };
};
const ContactsForm = () => {

    const {
        contactsOptions,
        control,
        getValues,
        errors,
    } = useContext(FinishCompanyRegistrationControllerContext);

    const { fields, append, remove } = contactsOptions;

    const classes = useStyles();

    return (
        <Grid container>
            <Grid item xs={12} direction="column">
                <Typography variant="h6">
                    Enter your contacts.
                </Typography>
                <Typography variant="caption" gutterBottom paragraph>
                    Give us any form of communication that students can use if they want to contact you.
                    It can be anything: e-mail, phone number or some website.
                </Typography>
                <Box fontStyle="italic" my={2}>
                    <Typography variant="caption" gutterBottom paragraph>
                        Smoke signals are currently not supported, though.
                    </Typography>
                </Box>
                <Box display="flex" flexDirection="column">

                    {fields.map(({ id }, i) => (
                        <Controller
                            key={id}
                            name={`contacts.${i}.value`}
                            render={(
                                { field: { onChange, onBlur, ref, name, value } },
                            ) => (
                                <TextField
                                    name={name}
                                    value={value}
                                    label={`Contact #${i}`}
                                    id={`Contact #${i}`}
                                    error={!!errors.contacts?.[i]}
                                    inputRef={ref}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    InputProps={{ endAdornment: <RemoveContactButton contacts={fields} onClick={() => remove(i)} /> }}
                                    margin="normal"
                                    helperText={errors.contacts?.[i]?.value?.message || ""}
                                />)}
                            control={control}
                            defaultValue={getValues(`contacts.${i}.value`) || ""}
                        />
                    ))}
                    <Button
                        color="primary"
                        startIcon={<AddCircle />}
                        disabled={Object.keys(fields).length > 9} // TODO MOVE THIS TO CONSTANTS PLACE
                        onClick={() => append()}
                        className={classes.addContactBtn}
                    >
                Add Entry
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
};

export default ContactsForm;
