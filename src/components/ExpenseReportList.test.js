import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ExpenseReportList from "./ExpenseReportList";
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

describe("ExpenseReportList", () => {
  test("displays loading message while fetching data", () => {
    makeApiGetRequest.mockResolvedValue([]);
    render(<ExpenseReportList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  test("displays error message when fetching data fails", async () => {
    makeApiGetRequest.mockRejectedValue(new Error("Failed to fetch data"));
    render(<ExpenseReportList />);
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
  test("displays ExpenseReport data in the table and checking table headers and tab label", async () => {
    const mockExpenseReports = [
      {
        label: "Company A",
        priceExclTax: "555-1234",
        qualification: "qualif",
      },
    ];
    makeApiGetRequest.mockResolvedValue(mockExpenseReports);
    render(<ExpenseReportList />);
    await waitFor(() => {
      for (const ExpenseReport of mockExpenseReports) {
        expect(screen.getByText(ExpenseReport.label)).toBeInTheDocument();
        expect(screen.getByText(ExpenseReport.priceExclTax)).toBeInTheDocument();
        expect(screen.getByText(ExpenseReport.qualification)).toBeInTheDocument();
      }
      expect(screen.getByText(/label/i)).toBeInTheDocument();
      expect(screen.getByText(/priceExclTax/i)).toBeInTheDocument();
      expect(screen.getByText(/qualification/i)).toBeInTheDocument();
      expect(screen.getByText(/ExpenseReportList.title/i)).toBeInTheDocument();
    });
  });

  test("should trigger a modal to delete ExpenseReport", async () => {
    const mockExpenseReports = [
      {
        id: 1,
        label: "Company A",
        priceExclTax: "555-1234",
        qualification: "qualif",
        tax: "555-9876",
      },
    ];

    makeApiGetRequest.mockResolvedValue(mockExpenseReports);
    makeApiDeleteRequest.mockResolvedValue({});

    render(<ExpenseReportList />);
    await waitFor(() => {
      const dropdownButton = screen.getByTestId("dropdown-button");
      fireEvent.click(dropdownButton);

      fireEvent.click(screen.getByText("delete"));

      fireEvent.click(screen.getByText("confirm"));

      expect(makeApiDeleteRequest).toHaveBeenCalledWith("/api/v1/expense_reports/1");
      expect(makeApiDeleteRequest).toHaveBeenCalledTimes(1);
    });
  });

  test("should navigate to ExpenseReport details page when view button is clicked", async () => {
    const mockExpenseReports = [
      {
        id: 1,
        label: "Company A",
        priceExclTax: "555-1234",
        qualification: "qualif",
        tax: "555-9876",
      },
    ];

    makeApiGetRequest.mockResolvedValue(mockExpenseReports);

    render(<ExpenseReportList />);
    await waitFor(() => {
      const dropdownButton = screen.getByTestId("dropdown-button");
      fireEvent.click(dropdownButton);

      fireEvent.click(screen.getByText("view"));
      expect(mockNavigate).toHaveBeenCalledWith("/expense-report/1");
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  test("should navigate to expense report details page when edit button is clicked", async () => {
    const mockExpenseReports = [
      {
        id: 1,
        label: "Company A",
        priceExclTax: "555-1234",
        qualification: "qualif",
        tax: "555-9876",
      },
    ];

    makeApiGetRequest.mockResolvedValue(mockExpenseReports);

    render(<ExpenseReportList />);
    await waitFor(() => {
      const dropdownButton = screen.getByTestId("dropdown-button");
      fireEvent.click(dropdownButton);

      fireEvent.click(screen.getByText("edit"));
      expect(mockNavigate).toHaveBeenCalledWith("/expense-report/1?editMode=true");
      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });
  });

  test("should navigate to expense-report details page when add button is clicked", () => {
    render(<ExpenseReportList />);

    fireEvent.click(screen.getByText("add"));

    expect(mockNavigate).toHaveBeenCalledWith("/expense-report");
  });
});
