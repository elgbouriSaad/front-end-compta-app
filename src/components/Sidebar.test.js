import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "./Sidebar";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";

describe("Sidebar", () => {

  test("renders with correct position and visibility when isVisible is false", () => {
    render(
      <MemoryRouter initialEntries={["/"]} initialIndex={0}>
        <Sidebar isVisible={false} />
      </MemoryRouter>
    );
    const sidebar = screen.queryByTestId("sidebar");
    expect(sidebar).toBeNull();
  });

  test("navigates to links correctly", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Sidebar isVisible={true} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("accountant.groupTitle"));

    const addAccountantLink = screen.getByRole("link", { name: "accountant.title" });
    const accountantListLink = screen.getByRole("link", { name: "accountantList.title" });

    expect(addAccountantLink).toBeVisible();
    expect(accountantListLink).toBeVisible();

    fireEvent.click(addAccountantLink);
    expect(screen.getByText(/accountant.title/i)).toBeInTheDocument();

    fireEvent.click(accountantListLink);
    expect(screen.getByText(/accountantList.title/i)).toBeInTheDocument();
  });
});
