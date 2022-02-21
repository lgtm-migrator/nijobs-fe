import React from "react";
import {
    DialogContent,
    CardContent,
    makeStyles,
} from "@material-ui/core";
import { useMobile } from "../../utils/media-queries";
import PrivacyPolicyContent from "./PrivacyPolicyContent";

const useStyles = makeStyles((theme) => ({
    content: {
        backgroundColor: "white",
        padding: theme.spacing(4),
    },
}));


const PrivacyPolicyComponent = () => {
    const classes = useStyles();
    const isMobile = useMobile();
    const ContentComponent = isMobile ? DialogContent : CardContent;

    return (
        <div className={classes.content}>
            <ContentComponent>
                <PrivacyPolicyContent />
            </ContentComponent>
        </div>
    );
};
export default PrivacyPolicyComponent;
