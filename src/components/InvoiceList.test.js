import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import InvoiceList from "./InvoiceList";
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

describe("InvoiceList", () => {
  test("displays loading message while fetching data", () => {
    makeApiGetRequest.mockResolvedValue([]);
    render(<InvoiceList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("displays error message when fetching data fails", async () => {
    makeApiGetRequest.mockRejectedValue(new Error("Failed to fetch data"));
    render(<InvoiceList />);
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test("displays invoice data in the table and checking table headers and tab label", async () => {
    const mockInvoices = [
      {
        id: 1,
        status: "SAVED",
        paymentDelay: "2023-09-10",
        clientId: 1,
      },
    ];

    makeApiGetRequest.mockResolvedValue(mockInvoices);
    render(<InvoiceList />);
    await waitFor(() => {
      for (const invoice of mockInvoices) {
        expect(screen.getByText(invoice.status)).toBeInTheDocument();
        expect(screen.getByText(invoice.paymentDelay)).toBeInTheDocument();
        expect(screen.getByText("clientCompanyName")).toBeInTheDocument(); // Replace with your actual client field label
      }
      expect(screen.getByText(/status/i)).toBeInTheDocument();
      expect(screen.getByText(/paymentDelay/i)).toBeInTheDocument();
      expect(screen.getByText(/clientCompanyName/i)).toBeInTheDocument(); // Replace with your actual client field label
      expect(screen.getByText(/InvoiceList.title/i)).toBeInTheDocument();
    });
  });

  test("should trigger a modal to delete invoice", async () => {
    const mockInvoices = [
      {
        id: 1,
        status: "SAVED",
        paymentDelay: "2023-09-10",
        clientId: 1,
      },
    ];

    makeApiGetRequest.mockResolvedValue(mockInvoices);
    makeApiDeleteRequest.mockResolvedValue({});

    render(<InvoiceList />);
    await waitFor(() => {
      const dropdownButton = screen.getByTestId("dropdown-button");
      fireEvent.click(dropdownButton);

      fireEvent.click(screen.getByText("delete"));

      fireEvent.click(screen.getByText("confirm"));

      expect(makeApiDeleteRequest).toHaveBeenCalledWith("/api/v1/invoices/1");
      expect(makeApiDeleteRequest).toHaveBeenCalledTimes(1);
    });
  });

  test("should navigate to invoice details page when view button is clicked", async () => {
    const mockInvoices = [
      {
        id: 1,
        status: "SAVED",
        paymentDelay: "2023-09-10",
        clientId: 1,
      },
    ];

    makeApiGetRequest.mockResolvedValue(mockInvoices);

    render(<InvoiceList />);
    await waitFor(() => {
      const dropdownButton = screen.getByTestId("dropdown-button");
      fireEvent.click(dropdownButton);

      fireEvent.click(screen.getByText("view"));
      expect(mockNavigate).toHaveBeenCalledWith("/invoice/1");
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  test("should navigate to invoice details page when edit button is clicked", async () => {
    const mockInvoices = [
      {
        id: 1,
        status: "SAVED",
        paymentDelay: "2023-09-10",
        clientId: 1,
      },
    ];

    makeApiGetRequest.mockResolvedValue(mockInvoices);

    render(<InvoiceList />);
    await waitFor(() => {
      const dropdownButton = screen.getByTestId("dropdown-button");
      fireEvent.click(dropdownButton);

      fireEvent.click(screen.getByText("edit"));
      expect(mockNavigate).toHaveBeenCalledWith("/invoice/1?editMode=true");
      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });
  });

  test("should navigate to invoice details page when add button is clicked", () => {
    render(<InvoiceList />);

    fireEvent.click(screen.getByText("add"));

    expect(mockNavigate).toHaveBeenCalledWith("/invoice");
  });
});
