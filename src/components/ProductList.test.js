import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ProductList from "./ProductList";
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

describe("ProductList", () => {
  test("displays loading message while fetching data", () => {
    makeApiGetRequest.mockResolvedValue([]);
    render(<ProductList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  test("displays error message when fetching data fails", async () => {
    makeApiGetRequest.mockRejectedValue(new Error("Failed to fetch data"));
    render(<ProductList />);
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
  test("displays product data in the table and checking table headers and tab label", async () => {
    const mockProducts = [
      {
        label: "Company A",
        reference: "12345",
        unity: "company A",
        priceExclTax: "555-1234",
        qualification: "qualif",
      },
    ];
    makeApiGetRequest.mockResolvedValue(mockProducts);
    render(<ProductList />);
    await waitFor(() => {
      for (const product of mockProducts) {
        expect(screen.getByText(product.label)).toBeInTheDocument();
        expect(screen.getByText(product.reference)).toBeInTheDocument();
        expect(screen.getByText(product.unity)).toBeInTheDocument();
        expect(screen.getByText(product.priceExclTax)).toBeInTheDocument();
        expect(screen.getByText(product.qualification)).toBeInTheDocument();
      }
      expect(screen.getByText(/label/i)).toBeInTheDocument();
      expect(screen.getByText(/reference/i)).toBeInTheDocument();
      expect(screen.getByText(/unity/i)).toBeInTheDocument();
      expect(screen.getByText(/priceExclTax/i)).toBeInTheDocument();
      expect(screen.getByText(/qualification/i)).toBeInTheDocument();
      expect(screen.getByText(/ProductList.title/i)).toBeInTheDocument();
    });
  });

  test("should trigger a modal to delete product", async () => {
    const mockProducts = [
      {
        id: 1,
        label: "Company A",
        reference: "12345",
        unity: "company A",
        priceExclTax: "555-1234",
        qualification: "qualif",
        tax: "555-9876",
      },
    ];

    makeApiGetRequest.mockResolvedValue(mockProducts);
    makeApiDeleteRequest.mockResolvedValue({});

    render(<ProductList />);
    await waitFor(() => {
      const dropdownButton = screen.getByTestId("dropdown-button");
      fireEvent.click(dropdownButton);

      fireEvent.click(screen.getByText("delete"));

      fireEvent.click(screen.getByText("confirm"));

      expect(makeApiDeleteRequest).toHaveBeenCalledWith("/api/v1/products/1");
      expect(makeApiDeleteRequest).toHaveBeenCalledTimes(1);
    });
  });

  test("should navigate to product details page when view button is clicked", async () => {
    const mockProducts = [
      {
        id: 1,
        label: "Company A",
        reference: "12345",
        unity: "company A",
        priceExclTax: "555-1234",
        qualification: "qualif",
        tax: "555-9876",
      },
    ];

    makeApiGetRequest.mockResolvedValue(mockProducts);

    render(<ProductList />);
    await waitFor(() => {
      const dropdownButton = screen.getByTestId("dropdown-button");
      fireEvent.click(dropdownButton);

      fireEvent.click(screen.getByText("view"));
      expect(mockNavigate).toHaveBeenCalledWith("/product/1");
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  test("should navigate to product details page when edit button is clicked", async () => {
    const mockProducts = [
      {
        id: 1,
        label: "Company A",
        reference: "12345",
        unity: "company A",
        priceExclTax: "555-1234",
        qualification: "qualif",
        tax: "555-9876",
      },
    ];

    makeApiGetRequest.mockResolvedValue(mockProducts);

    render(<ProductList />);
    await waitFor(() => {
      const dropdownButton = screen.getByTestId("dropdown-button");
      fireEvent.click(dropdownButton);

      fireEvent.click(screen.getByText("edit"));
      expect(mockNavigate).toHaveBeenCalledWith("/product/1?editMode=true");
      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });
  });

  test("should navigate to product details page when add button is clicked", () => {
    render(<ProductList />);

    fireEvent.click(screen.getByText("add"));

    expect(mockNavigate).toHaveBeenCalledWith("/product");
  });
});
