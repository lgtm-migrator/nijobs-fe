/* istanbul ignore file */
import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import { Provider } from "react-redux";
import reducer from "./reducers";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";


/** *************** RTL *************** **/

import { render as defaultRender, buildQueries, queries } from "@testing-library/react";
import { applyMiddleware, compose, createStore } from "redux";

export const mountWithStore = (component, initialState, theme) => {

    const mockStore = configureMockStore([thunk]);
    const store = mockStore(initialState);

    return mount(
        <Provider store={store}>
            {theme ?
                <ThemeProvider theme={theme}>
                    {component}
                </ThemeProvider>
                :
                <>
                    {component}
                </>
            }
        </Provider>
    );
};

export const mountWithTheme = (component, theme) => mount(
    <ThemeProvider theme={theme}>
        {component}
    </ThemeProvider>
);

export const TestComponent = ({ callback }) => {
    callback();
    return null;
};

export const testHook = (callback, Wrapper = React.Fragment, wrapperProps = {}) => {
    mount(
        <Wrapper {...wrapperProps}>
            <TestComponent callback={callback} />
        </Wrapper>
    );
};

const [queryDescriptionOf, , getDescriptionOf, , findDescriptionOf] = buildQueries(
    function queryAllDescriptionsOf(container, element) {
        return container.querySelectorAll(`#${element.getAttribute("aria-describedby")}`);
    },
    function getMultipleError() {
        return "Found multiple descriptions. An element should be described by a unique element.";
    },
    function getMissingError() {
        return "Found no describing element.";
    },
);

const [queryByTag, , getByTag, , findByTag] = buildQueries(
    function queryAllByTag(container, tag) {
        return container.querySelectorAll(`${tag}`);
    },
    function getMultipleError() {
        return "Found multiple descriptions. An element should be described by a unique element.";
    },
    function getMissingError() {
        return "Found no describing element.";
    },
);

const customQueries = { queryDescriptionOf, getDescriptionOf, findDescriptionOf, queryByTag, getByTag, findByTag };

const customRender = (
    ui,
    renderOptions
) => defaultRender(ui, { queries: { ...queries, ...customQueries }, ...renderOptions });

export const renderWithStore = (
    ui,
    {
        initialState,
        ...renderOptions
    } = {}
) => {
    const store = createStore(reducer, initialState, compose(applyMiddleware(thunk)));
    // eslint-disable-next-line react/prop-types
    const wrapper = ({ children }) =>
        <Provider store={store}>
            {children}
        </Provider>;
    return customRender(ui, { wrapper, ...renderOptions });
};

export const renderWithTheme = (
    ui,
    {
        theme,
        ...renderOptions
    } = {}
) => {
    // eslint-disable-next-line react/prop-types
    const wrapper = ({ children }) => (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
    return customRender(ui, { wrapper, ...renderOptions });
};

export const renderWithStoreAndTheme = (
    ui,
    {
        initialState,
        theme,
        ...renderOptions
    }
) => {

    const store = createStore(reducer, initialState, compose(applyMiddleware(thunk)));

    // eslint-disable-next-line react/prop-types
    const wrapper = ({ children }) =>
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                {children}
            </Provider>
        </ThemeProvider>;
    return customRender(ui, { wrapper, ...renderOptions });
};

const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
};
global.localStorage = localStorageMock;

// re-export everything
export * from "@testing-library/react";

export { customRender as render };
