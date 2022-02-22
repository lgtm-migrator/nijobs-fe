import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setSearchOffers } from "../../../../actions/searchOffersActions";
import Offer from "../Offer/Offer";
import { parseFiltersToURL } from "../../../../utils";
import config from "../../../../config";
import ErrorTypes from "../../../../utils/ErrorTypes";
import { SearchResultsConstants } from "./SearchResultsUtils";

const { API_HOSTNAME } = config;

export default ({ offerOffset, setOfferOffset, shouldFetchMoreOffers }) => {

    const dispatch = useDispatch();
    const offerSearch = useSelector(({ offerSearch }) => ({
        value: offerSearch.searchValue,
        jobType: offerSearch.jobType,
        jobMinDuration: offerSearch.jobDuration[0],
        jobMaxDuration: offerSearch.jobDuration[1],
        fields: offerSearch.fields,
        technologies: offerSearch.technologies,
    }));

    const filters = {
        offset: offerOffset,
        limit: SearchResultsConstants.fetchNewOffersLimit,
        ...offerSearch,
    };

    const offers = useSelector((state) => state.offerSearch.offers);
    const initialOffersLoading = useSelector((state) => state.offerSearch.loading);

    const [hasMoreOffers, setHasMoreOffers] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fetchedOffsets, setFetchedOffsets] = useState([]);

    useEffect(() => {
        if (initialOffersLoading) {
            setOfferOffset(0);
            setHasMoreOffers(true);
            setError(null);
            setLoading(false);
            setFetchedOffsets([]);
        }
    }, [setOfferOffset, initialOffersLoading]);

    useEffect(() => {

        const fetchOffers = async () => {

            try {
                setFetchedOffsets((offsets) => [...offsets, filters.offset]);
                setLoading(true);
                const query = parseFiltersToURL(filters);
                const res = await fetch(`${API_HOSTNAME}/offers?${query}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!res.ok) {
                    setError({
                        cause: ErrorTypes.BAD_RESPONSE,
                        error: res.status,
                    });
                    setLoading(false);
                    return;
                }
                const offersData = await res.json();

                const offerIds = [...offers.map((offer) => offer._id)];
                const newOffers = [...offers];

                offersData.forEach((offerData) => {
                    if (!offerIds.includes(offerData._id))
                        newOffers.push(new Offer(offerData));
                });

                setHasMoreOffers(offersData.length > 0);
                dispatch(setSearchOffers(newOffers));
                setLoading(false);
                setError(null);

            } catch (error) {
                setError({
                    cause: ErrorTypes.NETWORK_FAILURE,
                    error,
                });
                setLoading(false);
                return;
            }
        };

        if (shouldFetchMoreOffers && !fetchedOffsets.includes(filters.offset) && !initialOffersLoading && !loading) {
            fetchOffers().catch((error) => {
                setError({
                    cause: ErrorTypes.UNEXPECTED,
                    error,
                });
            });
        }

    }, [
        dispatch, shouldFetchMoreOffers, filters, initialOffersLoading,
        fetchedOffsets, loading, offers,
    ]);

    return { offers, hasMoreOffers, loading, error };
};
