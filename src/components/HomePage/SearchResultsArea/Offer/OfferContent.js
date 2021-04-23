import React from "react";
import PropTypes from "prop-types";

import { Typography } from "@material-ui/core";
import Offer from "./Offer";
import OfferContentItem from "./OfferContentItem";

import LoadingMagnifyGlass from "./loading_magnify_glass_svg";
import { useDesktop } from "../../../../utils/media-queries";

import useSearchResultsWidgetStyles from "../SearchResultsWidget/searchResultsWidgetStyles";
import LOADING_MESSAGES from "./offerLoadingMessages";
import { DateRange, LocationCity } from "@material-ui/icons";
import { format, parseISO } from "date-fns";

const getRandomOngoingSearchMessage = () => LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];

const OfferContent = ({ offer, loading }) => {
    const classes = useSearchResultsWidgetStyles({ isMobile: !useDesktop() });
    if (loading) {
        return (
            <div className={classes.offerContent} data-testid="offer-content">
                <div className={classes.unselectedOffer}>
                    <React.Fragment>
                        <div className={classes.magnifyingGlassAnimationWrapper}>
                            <LoadingMagnifyGlass duration={1.2} />
                        </div>
                        <Typography data-testid="random-loading-message" variant="h6">
                            {getRandomOngoingSearchMessage()}
                        </Typography>
                    </React.Fragment>

                </div>
            </div>
        );
    } else {
        return (
            <div className={classes.offerContent} data-testid="offer-content">
                {offer === null ?
                    <div className={classes.unselectedOffer} id="no_selected_offer_text">
                        <Typography variant="h5" classes={{ root: classes.pleaseSelectOfferText }}>
                            Please select an offer to view the details
                        </Typography>
                    </div>
                    :
                    <React.Fragment>
                        <div className={classes.offerHeader}>
                            <Typography variant="h4" gutterBottom>
                                {offer.title}
                            </Typography>

                            <Typography variant="h6" color="primary" gutterBottom>
                                {offer.ownerName}
                            </Typography>
                            <div>
                                <LocationCity style={{ verticalAlign: "sub" }} />
                                <Typography variant="body1" display="inline">
                                    {offer.location}
                                </Typography>
                            </div>
                            <div>
                                {(offer.jobMinDuration || offer.jobStartDate) &&
                                <DateRange style={{ verticalAlign: "sub" }} />
                                }
                                {offer.jobStartDate &&
                                <Typography display="inline" variant="body1">
                                    {format(parseISO(offer.jobStartDate), "yyyy-MM-dd")}
                                </Typography>
                                }
                                {offer.jobMinDuration &&
                                <>
                                    <Typography display="inline" variant="body1">
                                        {offer.jobStartDate && " • "}
                                        {offer.jobMinDuration}
                                    </Typography>
                                    <Typography display="inline" variant="body1">
                                        {offer.jobMaxDuration ?
                                            `-${offer.jobMaxDuration}` : "+"
                                        }
                                    </Typography>
                                </>
                                }
                                {offer.jobMinDuration && " months"}
                            </div>
                        </div>
                        <div className={classes.offerBody}>
                            <OfferContentItem hasPermissions title="Description" content={offer.description} />
                            <OfferContentItem hasPermissions title="Technologies" content={offer.technologies} />
                            <OfferContentItem hasPermissions title="Requirements" content={offer.requirements} />
                            <OfferContentItem hasPermissions title="Contacts" content={offer.contacts} />
                            <OfferContentItem hasPermissions title="Is Paid?" content={offer.isPaid ? "yes" : "no"} />
                            <OfferContentItem hasPermissions title="Vacancies" content={offer.vacancies?.toString()} />
                            <OfferContentItem hasPermissions title="Job Type" content={offer.jobType} />
                            <OfferContentItem hasPermissions title="Fields" content={offer.fields} />
                            <OfferContentItem hasPermissions title="Hidden Reason" content={offer.hiddenReason} />
                            <OfferContentItem hasPermissions title="Admin Reason" content={offer.adminReason} />
                            <OfferContentItem
                                hasPermissions title="Publish Date" content={format(parseISO(offer.publishDate), "yyyy-MM-dd")}
                            />
                            <OfferContentItem
                                hasPermissions title="Publish End Date" content={format(parseISO(offer.publishEndDate), "yyyy-MM-dd")}
                            />
                        </div>
                    </React.Fragment>
                }
            </div>
        );
    }
};

OfferContent.propTypes = {
    offer: PropTypes.instanceOf(Offer),
    loading: PropTypes.bool,
};

export default OfferContent;
