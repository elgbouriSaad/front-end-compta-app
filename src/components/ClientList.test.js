import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ClientList from "./ClientList";
import { makeApiGetRequest, makeApiDeleteRequest } from "./ApiUtils";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";

jest.mock("./ApiUtils", () => ({
  makeApiGetRequest: jest.fn(),
  makeApiDeleteRequest: jest.fn(),
}));
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("ClientList", () => {
  test("displays loading message while fetching data", () => {
    makeApiGetRequest.mockResolvedValue([]);
    render(<ClientList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  test("displays error message when fetching data fails", async () => {
    makeApiGetRequest.mockRejectedValue(new Error("Failed to fetch data"));
    render(<ClientList />);
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test("should trigger a modal to delete client", async () => {
    const mockClients = [
      {
        id: 1,
        companyName: "Company A",
        rc: "12345",
        email: "companyA@example.com",
        address: {
          primaryAddress: "123 Main St",
          secondaryAddress: "Apt 4B",
          postalCode: "54321",
          city: "Cityville",
          country: "Countryland",
        },
        mobilePhone: "555-1234",
        phone: "555-5678",
        fax: "555-9876",
      },
    ];

    makeApiGetRequest.mockResolvedValue(mockClients);
    makeApiDeleteRequest.mockResolvedValue({});

    render(<ClientList />);
    await waitFor(() => {
      const dropdownButton = screen.getByTestId("dropdown-button");
      fireEvent.click(dropdownButton);

      fireEvent.click(screen.getByText("delete"));

      fireEvent.click(screen.getByText("confirm"));

      expect(makeApiDeleteRequest).toHaveBeenCalledWith("/api/v1/clients/1");
      expect(makeApiDeleteRequest).toHaveBeenCalledTimes(1);
    });
  });

  test("should navigate to client details page when view button is clicked", async () => {
    const mockClients = [
      {
        id: 1,
        companyName: "Company A",
        rc: "12345",
        email: "companyA@example.com",
        address: {
          primaryAddress: "123 Main St",
          secondaryAddress: "Apt 4B",
          postalCode: "54321",
          city: "Cityville",
          country: "Countryland",
        },
        mobilePhone: "555-1234",
        phone: "555-5678",
        fax: "555-9876",
      },
    ];

    makeApiGetRequest.mockResolvedValue(mockClients);

    render(<ClientList />);
    await waitFor(() => {
      const dropdownButton = screen.getByTestId("dropdown-button");
      fireEvent.click(dropdownButton);

      fireEvent.click(screen.getByText("view"));
      expect(mockNavigate).toHaveBeenCalledWith("/client/1");
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  test("should navigate to client details page when edit button is clicked", async () => {
    const mockClients = [
      {
        id: 1,
        companyName: "Company A",
        rc: "12345",
        email: "companyA@example.com",
        address: {
          primaryAddress: "123 Main St",
          secondaryAddress: "Apt 4B",
          postalCode: "54321",
          city: "Cityville",
          country: "Countryland",
        },
        mobilePhone: "555-1234",
        phone: "555-5678",
        fax: "555-9876",
      },
    ];

    makeApiGetRequest.mockResolvedValue(mockClients);

    render(<ClientList />);
    await waitFor(() => {
      const dropdownButton = screen.getByTestId("dropdown-button");
      fireEvent.click(dropdownButton);

      fireEvent.click(screen.getByText("edit"));
      expect(mockNavigate).toHaveBeenCalledWith("/client/1?editMode=true");
      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });
  });

  test("should navigate to client details page when add button is clicked", () => {
    render(<ClientList />);

    fireEvent.click(screen.getByText("add"));

    expect(mockNavigate).toHaveBeenCalledWith("/client");
  });
});
