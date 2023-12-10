import React from "react";
import { render, screen, fireEvent, waitFor} from "@testing-library/react";
import ExpenseReport from "./ExpenseReport.js";
import {BrowserRouter as Router, MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import Home from "./Home.js";
jest.mock("./ApiUtils", () => ({
  makeApiGetRequest: jest.fn(),
  makeApiPostRequest: jest.fn(),
  makeApiPutRequest: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("ExpenseReport Component", () => {
  test("renders labels, inputs and buttons", () => {
    render(
      <MemoryRouter initialEntries={[`/`]}>
        <ExpenseReport />
      </MemoryRouter>
    );

    const labelLabel = screen.getByText("label *");
    const labelPriceExclTax = screen.getByText("priceExclTax *");
    const labelQualification = screen.getByText("qualification *");
    const labelTax = screen.getByText("tax *");

    const inputLabel = screen.getByRole("textbox", { name: "label *" });
    const inputPriceExclTax = screen.getByRole("spinbutton", { name: "priceExclTax *" });
    const inputQualification = screen.getByRole("textbox", { name: "qualification *" });
    const inputTax = screen.getByRole("spinbutton", { name: "tax *" });

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    const submitButton = screen.getByRole("button", { name: /save/i }); // Or "edit" depending on the state

    expect(labelLabel).toBeInTheDocument();
    expect(labelPriceExclTax).toBeInTheDocument();
    expect(labelQualification).toBeInTheDocument();
    expect(labelTax).toBeInTheDocument();

    expect(inputLabel).toBeInTheDocument();
    expect(inputPriceExclTax).toBeInTheDocument();
    expect(inputQualification).toBeInTheDocument();
    expect(inputTax).toBeInTheDocument();

    expect(cancelButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test("validating when empty", () => {
    render(
      <Router>
        <ExpenseReport />
      </Router>
    );
  
    const textsToCheck = [
      /save/i,
      /invalidFeedbackLabel/i,
      /invalidFeedbackPriceExclTax/i,
      /invalidFeedbackQualification/i,
      /invalidFeedbackTax/i,
    ];
  
    for (const text of textsToCheck) {
      const linkElement = screen.getByText(text);
      expect(linkElement).toBeInTheDocument();
    }
  });

  test("cancel button redirects to /", async () => {
    const navigateMock = jest.fn(); // Create a mock function for navigate
    const useNavigateMock = jest.requireMock("react-router-dom").useNavigate; // Get the mocked useNavigate
    useNavigateMock.mockReturnValue(navigateMock);

    render(
      <MemoryRouter>
        <ExpenseReport />
      </MemoryRouter>
    );

    const linkElement = screen.getByText(/cancel/i);
    fireEvent.click(linkElement);

    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  test("submits form data correctly and redirects to home on success", async () => {
    const makeApiPostRequestMock = jest.requireMock("./ApiUtils").makeApiPostRequest;
    makeApiPostRequestMock.mockResolvedValue({ status: "success" });

    render(
      <MemoryRouter initialEntries={["/"]}>
          <Home />
          <ExpenseReport />
      </MemoryRouter>
    );
    const labelField = screen.getByLabelText("label *");
    fireEvent.change(labelField, { target: { value: "Test home" } });
    const priceExclTaxField = screen.getByLabelText("priceExclTax *");
    fireEvent.change(priceExclTaxField, { target: { value: "10" } });
    const qualificationField = screen.getByLabelText("qualification *");
    fireEvent.change(qualificationField, { target: { value: "Test home" } });
    const taxField = screen.getByLabelText("tax *");
    fireEvent.change(taxField, { target: { value: "10" } });

    const submitButton = screen.getByText("save");
    fireEvent.click(submitButton);


    await waitFor(() => {
      expect(screen.getByText("Test home")).toBeInTheDocument();
    });

    expect(makeApiPostRequestMock).toHaveBeenCalledWith("/api/v1/expense_reports", {
      status: "SAVED",
        label: "Test home",
        priceExclTax: "10",
        qualification: "Test home",
        tax: "10",
        customerId: "",
    });
  });
});
