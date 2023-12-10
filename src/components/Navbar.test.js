import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";
import { useTranslation } from "react-i18next";
import "@testing-library/jest-dom/extend-expect";

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

describe("Navbar", () => {
  test("changes language when dropdown item is clicked", () => {
    const toggleSidebar = jest.fn();
    const sidebarVisible = true;
    const changeLanguage = jest.fn();
    
    useTranslation.mockReturnValue({ t: jest.fn(), i18n: { language: "fr", changeLanguage } });

    render(<Navbar toggleSidebar={toggleSidebar} sidebarVisible={sidebarVisible} />);

    const dropdownToggle = screen.getByText("FR");
    fireEvent.click(dropdownToggle);

    const enOption = screen.getByText("EN"); 
    fireEvent.click(enOption);

    expect(changeLanguage).toHaveBeenCalledTimes(1);
    expect(changeLanguage).toHaveBeenCalledWith("en");
  });

});
