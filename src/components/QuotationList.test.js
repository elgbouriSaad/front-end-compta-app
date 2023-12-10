import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import QuotationList from "./QuotationList";
import { makeApiGetRequest, makeApiDeleteRequest } from "./ApiUtils";
import "@testing-library/jest-dom/extend-expect";

jest.mock("./ApiUtils", () => ({
  makeApiGetRequest: jest.fn(),
  makeApiDeleteRequest: jest.fn(),
}));
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useRef: () => ({ current: { contains: jest.fn() } }),
}));

describe("QuotationList", () => {
  test("displays loading message while fetching data", () => {
    makeApiGetRequest.mockResolvedValue([]);
    render(<QuotationList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("displays error message when fetching data fails", async () => {
    makeApiGetRequest.mockRejectedValue(new Error("Failed to fetch data"));
    render(<QuotationList />);
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test("displays quotation data in the table and checking table headers and tab label", async () => {
    const mockQuotations = [
      {
        id: 1,
        status: "SAVED",
        validationDelay: "2023-09-10",
        clientId: 1,
      },
    ];

    makeApiGetRequest.mockResolvedValue(mockQuotations);
    render(<QuotationList />);
    await waitFor(() => {
      for (const quotation of mockQuotations) {
        expect(screen.getByText(quotation.status)).toBeInTheDocument();
        expect(screen.getByText(quotation.validationDelay)).toBeInTheDocument();
        expect(screen.getByText("clientCompanyName")).toBeInTheDocument(); // Replace with your actual client field label
      }
      expect(screen.getByText(/status/i)).toBeInTheDocument();
      expect(screen.getByText(/validationDelay/i)).toBeInTheDocument();
      expect(screen.getByText(/clientCompanyName/i)).toBeInTheDocument(); // Replace with your actual client field label
      expect(screen.getByText(/QuotationList.title/i)).toBeInTheDocument();
    });
  });

  test("should trigger a modal to delete quotation", async () => {
    const mockQuotations = [
      {
        id: 1,
        status: "SAVED",
        validationDelay: "2023-09-10",
        clientId: 1,
      },
    ];

    makeApiGetRequest.mockResolvedValue(mockQuotations);
    makeApiDeleteRequest.mockResolvedValue({});

    render(<QuotationList />);
    await waitFor(() => {
      const dropdownButton = screen.getByTestId("dropdown-button");
      fireEvent.click(dropdownButton);

      fireEvent.click(screen.getByText("delete"));

      fireEvent.click(screen.getByText("confirm"));

      expect(makeApiDeleteRequest).toHaveBeenCalledWith("/api/v1/quotations/1");
      expect(makeApiDeleteRequest).toHaveBeenCalledTimes(1);
    });
  });

  test("should navigate to quotation details page when view button is clicked", async () => {
    const mockQuotations = [
      {
        id: 1,
        status: "SAVED",
        validationDelay: "2023-09-10",
        clientId: 1,
      },
    ];

    makeApiGetRequest.mockResolvedValue(mockQuotations);

    render(<QuotationList />);
    await waitFor(() => {
      const dropdownButton = screen.getByTestId("dropdown-button");
      fireEvent.click(dropdownButton);

      fireEvent.click(screen.getByText("view"));
      expect(mockNavigate).toHaveBeenCalledWith("/quotation/1");
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  test("should navigate to quotation details page when edit button is clicked", async () => {
    const mockQuotations = [
      {
        id: 1,
        status: "SAVED",
        validationDelay: "2023-09-10",
        clientId: 1,
      },
    ];

    makeApiGetRequest.mockResolvedValue(mockQuotations);

    render(<QuotationList />);
    await waitFor(() => {
      const dropdownButton = screen.getByTestId("dropdown-button");
      fireEvent.click(dropdownButton);

      fireEvent.click(screen.getByText("edit"));
      expect(mockNavigate).toHaveBeenCalledWith("/quotation/1?editMode=true");
      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });
  });

  test("should navigate to quotation details page when add button is clicked", () => {
    render(<QuotationList />);

    fireEvent.click(screen.getByText("add"));

    expect(mockNavigate).toHaveBeenCalledWith("/quotation");
  });
});
