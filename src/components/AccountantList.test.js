import React from "react";
import { render, screen, waitFor, fireEvent, getByTestId } from "@testing-library/react";
import AccountantList from "./AccountantList";
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
  useRef: () => ({ current: { contains: jest.fn() } }),
}));

describe("AccountantList", () => {
  test("displays loading message while fetching data", () => {
    makeApiGetRequest.mockResolvedValue([]);
    render(<AccountantList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  test("displays error message when fetching data fails", async () => {
    makeApiGetRequest.mockRejectedValue(new Error("Failed to fetch data"));
    render(<AccountantList />);
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
  test("displays accountant data in the table and checking table headers and tab label", async () => {
    const mockAccountants = [
      {
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
    makeApiGetRequest.mockResolvedValue(mockAccountants);
    render(<AccountantList />);
    await waitFor(() => {
      for (const accountant of mockAccountants) {
        expect(screen.getByText(accountant.companyName)).toBeInTheDocument();
        expect(screen.getByText(accountant.rc)).toBeInTheDocument();
        expect(screen.getByText(accountant.email)).toBeInTheDocument();
        expect(screen.getByText(accountant.mobilePhone)).toBeInTheDocument();
        expect(screen.getByText(accountant.phone)).toBeInTheDocument();
        expect(screen.getByText(accountant.address.city)).toBeInTheDocument();
        expect(screen.getByText(accountant.address.country)).toBeInTheDocument();
      }
      expect(screen.getByText(/labelCompanyName/i)).toBeInTheDocument();
      expect(screen.getByText(/labelRC/i)).toBeInTheDocument();
      expect(screen.getByText(/labelEmail/i)).toBeInTheDocument();
      expect(screen.getByText(/labelMobilePhone/i)).toBeInTheDocument();
      expect(screen.getByText(/labelPhone/i)).toBeInTheDocument();
      expect(screen.getByText(/labelCity/i)).toBeInTheDocument();
      expect(screen.getByText(/labelCountry/i)).toBeInTheDocument();
      expect(screen.getByText(/accountantList.title/i)).toBeInTheDocument();
    });
  });

  test("should trigger a modal to delete accountant",async () => {
    const mockAccountants = [
      {
        id : 1,
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
  
    makeApiGetRequest.mockResolvedValue(mockAccountants);
    makeApiDeleteRequest.mockResolvedValue({});
  
    render(<AccountantList />);
    await waitFor(() => {
      const dropdownButton = screen.getByTestId("dropdown-button");
      fireEvent.click(dropdownButton);
  
      fireEvent.click(screen.getByText("delete"));
  
      fireEvent.click(screen.getByText("confirm"));
  
      expect(makeApiDeleteRequest).toHaveBeenCalledWith("/api/v1/accountants/1");
      expect(makeApiDeleteRequest).toHaveBeenCalledTimes(1);
    });
  });

  test("should navigate to accountant details page when view button is clicked",async () => {
    const mockAccountants = [
      {
        id : 1,
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
  
    makeApiGetRequest.mockResolvedValue(mockAccountants);
  
    render(<AccountantList />);
    await waitFor(() => {
      const dropdownButton = screen.getByTestId("dropdown-button");
      fireEvent.click(dropdownButton);
  
      fireEvent.click(screen.getByText("view"));
      expect(mockNavigate).toHaveBeenCalledWith("/accountant/1");
      expect(mockNavigate).toHaveBeenCalledTimes(1); 
    });
  });

  test("should navigate to accountant details page when edit button is clicked",async () => {
    const mockAccountants = [
      {
        id : 1,
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
  
    makeApiGetRequest.mockResolvedValue(mockAccountants);
  
    render(<AccountantList />);
    await waitFor(() => {
      const dropdownButton = screen.getByTestId("dropdown-button");
      fireEvent.click(dropdownButton);
  
      fireEvent.click(screen.getByText("edit"));
      expect(mockNavigate).toHaveBeenCalledWith("/accountant/1?editMode=true");
      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });
  });

  test('should navigate to accountant details page when add button is clicked', () => {

    render(<AccountantList />);

    fireEvent.click(screen.getByText('add'));

    expect(mockNavigate).toHaveBeenCalledWith('/accountant');
  });
});
