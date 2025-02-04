/* eslint-disable react/prop-types */
import React from "react";
import AdvancedSearchDesktop from "./AdvancedSearchDesktop";
import JobOptions from "../../../utils/offers/JobOptions";
import { renderWithStoreAndTheme, screen } from "../../../../test-utils";
import { AdvancedSearchControllerContext, AdvancedSearchController } from "../SearchArea";
import { fireEvent } from "@testing-library/dom";
import useComponentController from "../../../../hooks/useComponentController";
import FieldOptions from "../../../utils/offers/FieldOptions";
import TechOptions from "../../../utils/offers/TechOptions";
import { INITIAL_JOB_DURATION, INITIAL_JOB_TYPE } from "../../../../reducers/searchOffersReducer";
import { createTheme } from "@material-ui/core/styles";

import { MemoryRouter } from "react-router-dom";

const AdvancedSearchWrapper = ({
    children, enableAdvancedSearchDefault, showJobDurationSlider, setShowJobDurationSlider, jobMinDuration = INITIAL_JOB_DURATION,
    jobMaxDuration = INITIAL_JOB_DURATION + 1, jobType = INITIAL_JOB_TYPE, setJobDuration, setJobType, fields = [], setFields,
    technologies = [], setTechs, resetAdvancedSearchFields, onSubmit, searchValue, searchOffers, onMobileClose,
}) => {
    const {
        ContextProvider,
        contextProviderProps,
    } = useComponentController(
        AdvancedSearchController,
        {
            enableAdvancedSearchDefault, showJobDurationSlider, setShowJobDurationSlider, jobMinDuration,
            jobMaxDuration, setJobDuration, jobType, setJobType, fields, setFields, technologies, setTechs,
            resetAdvancedSearchFields, onSubmit, searchValue, searchOffers, onMobileClose,
        },
        AdvancedSearchControllerContext
    );

    return (
        <ContextProvider {...contextProviderProps}>
            {children}
        </ContextProvider>
    );
};

const RouteWrappedComponent = ({ children }) => (
    <MemoryRouter initialEntries={["/"]}>
        {children}
    </MemoryRouter>
);

describe("AdvancedSearchDesktop", () => {

    const theme = createTheme();
    const initialState = {};

    describe("render", () => {
        it("should render a job selector with all job types", () => {

            renderWithStoreAndTheme(
                <RouteWrappedComponent>
                    <AdvancedSearchWrapper enableAdvancedSearchDefault>
                        <AdvancedSearchDesktop />
                    </AdvancedSearchWrapper>
                </RouteWrappedComponent>,
                { initialState, theme }
            );

            fireEvent.mouseDown(screen.getByLabelText("Job Type"));
            expect(screen.getAllByRole("option")).toHaveLength(JobOptions.length);
            JobOptions.forEach(({ label: jobOption }) => {
                try {
                    expect(screen.getByRole("option", { name: jobOption })).toBeInTheDocument();
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error(`Could not find option: ${jobOption}`);
                    throw err;
                }
            });
        });

        it("should toggle job duration slider (on)", () => {
            const setShowJobDurationSliderMock = jest.fn();
            renderWithStoreAndTheme(
                <RouteWrappedComponent>
                    <AdvancedSearchWrapper
                        enableAdvancedSearchDefault
                        jobMinDuration={1}
                        jobMaxDuration={2}
                        showJobDurationSlider={false}
                        setShowJobDurationSlider={setShowJobDurationSliderMock}
                    >
                        <AdvancedSearchDesktop />
                    </AdvancedSearchWrapper>
                </RouteWrappedComponent>,
                { initialState, theme }
            );

            expect(screen.getByText("Job Duration: 1 - 2 months")).not.toBeVisible();
            fireEvent.click(screen.getByLabelText("Filter Job Duration"));
            expect(setShowJobDurationSliderMock).toHaveBeenCalledWith(true);
            // Can't test that element is visible now (after toggling), since we can't emulate redux logic, wihtout having the whole tree,
            // So, I'll just assert that when showJobDurationSlider=true, it shows correctly in the next test
        });

        it("should toggle job duration slider (off)", () => {
            const setShowJobDurationSliderMock = jest.fn();
            renderWithStoreAndTheme(
                <RouteWrappedComponent>
                    <AdvancedSearchWrapper
                        enableAdvancedSearchDefault
                        jobMinDuration={1}
                        jobMaxDuration={2}
                        showJobDurationSlider={true}
                        setShowJobDurationSlider={setShowJobDurationSliderMock}
                    >
                        <AdvancedSearchDesktop />
                    </AdvancedSearchWrapper>
                </RouteWrappedComponent>,
                { initialState, theme }
            );


            expect(screen.getByText("Job Duration: 1 - 2 months")).toBeVisible();
            fireEvent.click(screen.getByLabelText("Filter Job Duration"));
            expect(setShowJobDurationSliderMock).toHaveBeenCalledWith(false);
        });

        it("should render a fields selector with all field types", () => {

            renderWithStoreAndTheme(
                <RouteWrappedComponent>
                    <AdvancedSearchWrapper enableAdvancedSearchDefault>
                        <AdvancedSearchDesktop />
                    </AdvancedSearchWrapper>
                </RouteWrappedComponent>,
                { initialState, theme }
            );

            fireEvent.mouseDown(screen.getByLabelText("Fields", { selector: "input" }));

            const fieldOptionsValues = Object.values(FieldOptions);
            const screenFieldOptions = screen.getAllByRole("option");

            expect(screenFieldOptions).toHaveLength(fieldOptionsValues.length);
            screenFieldOptions.forEach((fieldOption) => {
                try {
                    expect(fieldOptionsValues).toContain(fieldOption.textContent);
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error(`Could not find option: ${fieldOption.textContent}`);
                    throw err;
                }
            });
        });

        it("should render a technologies selector with all technology types", () => {

            renderWithStoreAndTheme(
                <RouteWrappedComponent>
                    <AdvancedSearchWrapper enableAdvancedSearchDefault>
                        <AdvancedSearchDesktop />
                    </AdvancedSearchWrapper>
                </RouteWrappedComponent>,
                { initialState, theme }
            );

            fireEvent.mouseDown(screen.getByLabelText("Technologies", { selector: "input" }));

            const techOptionsValues = Object.values(TechOptions);
            const screenTechnologyOptions = screen.getAllByRole("option");

            expect(screenTechnologyOptions).toHaveLength(techOptionsValues.length);
            screenTechnologyOptions.forEach((technologyOption) => {
                try {
                    expect(techOptionsValues).toContain(technologyOption.textContent);
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error(`Could not find option: ${technologyOption.textContent}`);
                    throw err;
                }
            });
        });

        it("should disable reset button if no advanced field is set", () => {

            renderWithStoreAndTheme(
                <RouteWrappedComponent>
                    <AdvancedSearchWrapper
                        enableAdvancedSearchDefault
                    >
                        <AdvancedSearchDesktop />
                    </AdvancedSearchWrapper>
                </RouteWrappedComponent>,
                { initialState, theme }
            );

            expect(screen.getByRole("button", { name: "Reset Advanced Fields" })).toBeDisabled();
        });

        it("should enable reset button if some advanced field is set", () => {

            renderWithStoreAndTheme(
                <RouteWrappedComponent>
                    <AdvancedSearchWrapper
                        enableAdvancedSearchDefault
                        fields={[Object.keys(FieldOptions)[0]]}
                    >
                        <AdvancedSearchDesktop />
                    </AdvancedSearchWrapper>
                </RouteWrappedComponent>,
                { initialState, theme }
            );

            expect(screen.getByRole("button", { name: "Reset Advanced Fields" })).not.toBeDisabled();
        });

    });

    describe("interaction", () => {

        it("should change fields when selecting options", () => {

            const setFieldsMock = jest.fn();

            renderWithStoreAndTheme(
                <RouteWrappedComponent>
                    <AdvancedSearchWrapper
                        enableAdvancedSearchDefault
                        fields={[Object.keys(FieldOptions)[0]]}
                        setFields={setFieldsMock}
                    >
                        <AdvancedSearchDesktop />
                    </AdvancedSearchWrapper>
                </RouteWrappedComponent>,
                { initialState, theme }
            );

            expect(screen.getAllByTestId("chip-option", {})).toHaveLength(1);
            expect(screen.getByTestId("chip-option", { name: Object.keys(FieldOptions)[0] })).toBeInTheDocument();

            fireEvent.mouseDown(screen.getByLabelText("Fields", { selector: "input" }));
            fireEvent.click(screen.getByRole("option", { name: Object.values(FieldOptions)[1] }));
            expect(setFieldsMock).toHaveBeenNthCalledWith(1, Object.keys(FieldOptions).slice(0, 2));

            // The state isn't actaully changing in this test. So, in the following scenario,
            // the only selected value is actually FieldOptions[0]
            fireEvent.mouseDown(screen.getByLabelText("Fields", { selector: "input" }));
            fireEvent.click(screen.getByRole("option", { name: Object.values(FieldOptions)[0] }));
            expect(setFieldsMock).toHaveBeenNthCalledWith(2, []);

        });

        it("should change technologies when selecting options", () => {

            const setTechsMock = jest.fn();

            renderWithStoreAndTheme(
                <RouteWrappedComponent>
                    <AdvancedSearchWrapper
                        enableAdvancedSearchDefault
                        technologies={[Object.keys(TechOptions)[0]]}
                        setTechs={setTechsMock}
                    >
                        <AdvancedSearchDesktop />
                    </AdvancedSearchWrapper>
                </RouteWrappedComponent>,
                { initialState, theme }
            );

            expect(screen.getAllByTestId("chip-option", {})).toHaveLength(1);
            expect(screen.getByTestId("chip-option", { name: Object.keys(TechOptions)[0] })).toBeInTheDocument();

            fireEvent.mouseDown(screen.getByLabelText("Technologies", { selector: "input" }));
            fireEvent.click(screen.getByRole("option", { name: Object.values(TechOptions)[1] }));
            expect(setTechsMock).toHaveBeenNthCalledWith(1, Object.keys(TechOptions).slice(0, 2));

            // The state isn't actaully changing in this test. So, in the following scenario,
            // the only selected value is actually TechOptions[0]
            fireEvent.mouseDown(screen.getByLabelText("Technologies", { selector: "input" }));
            fireEvent.click(screen.getByRole("option", { name: Object.values(TechOptions)[0] }));
            expect(setTechsMock).toHaveBeenNthCalledWith(2, []);

        });

        it("should call resetAdvancedSearch when Reset button is clicked", () => {
            const resetFn = jest.fn();

            renderWithStoreAndTheme(
                <RouteWrappedComponent>
                    <AdvancedSearchWrapper
                        enableAdvancedSearchDefault
                        setJobType={() => { }}
                        setJobDuration={() => { }}
                        setShowJobDurationSlider={() => { }}
                        setFields={() => { }}
                        setTechs={() => { }}
                        resetAdvancedSearchFields={resetFn}
                        technologies={[Object.keys(TechOptions)[0]]} // Must have something set to be able to click reset
                    >
                        <AdvancedSearchDesktop />
                    </AdvancedSearchWrapper>
                </RouteWrappedComponent>,
                { initialState, theme }
            );

            fireEvent.click(screen.getByRole("button", { name: "Reset Advanced Fields" }));

            expect(resetFn).toHaveBeenCalledTimes(1);

        });
    });
});
