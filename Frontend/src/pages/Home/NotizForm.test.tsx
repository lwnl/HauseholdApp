import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NotizForm from "./NotizForm";
import { createNotiz } from "../../api/notizenApi";
import { useToast } from "../../context/ToastContext";

jest.mock("../../api/notizenApi");
jest.mock("../../context/ToastContext");

const mockCreateNotiz = createNotiz as jest.MockedFunction<typeof createNotiz>;
const mockShowToast = jest.fn();

(useToast as jest.Mock).mockReturnValue({ showToast: mockShowToast });

describe("NotizForm", () => {
  it("renders the form correctly", () => {
    render(<NotizForm setNotizen={jest.fn()} />);
    expect(screen.getByLabelText(/Titel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Text/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Hinzufügen/i })
    ).toBeInTheDocument();
  });

  it("submits the form successfully", async () => {
    const setNotizen = jest.fn();
    mockCreateNotiz.mockResolvedValueOnce({
      _id: "1",
      title: "Test Title",
      text: "Test Text",
      owner: { _id: "user1", userName: "Test User" },
      createdAt: new Date().toISOString(),
    });

    render(<NotizForm setNotizen={setNotizen} />);

    fireEvent.change(screen.getByLabelText(/Titel/i), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByLabelText(/Text/i), {
      target: { value: "Test Text" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Hinzufügen/i }));

    await waitFor(() => {
      expect(mockCreateNotiz).toHaveBeenCalledWith("Test Title", "Test Text");
      expect(setNotizen).toHaveBeenCalled();
      expect(mockShowToast).toHaveBeenCalledWith(
        "Notiz erfolgreich erstellt",
        "success"
      );
    });
  });

  it("handles form submission error", async () => {
    const setNotizen = jest.fn();
    mockCreateNotiz.mockRejectedValueOnce(new Error("Test Error"));

    render(<NotizForm setNotizen={setNotizen} />);

    fireEvent.change(screen.getByLabelText(/Titel/i), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByLabelText(/Text/i), {
      target: { value: "Test Text" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Hinzufügen/i }));

    await waitFor(() => {
      expect(mockCreateNotiz).toHaveBeenCalledWith("Test Title", "Test Text");
      expect(setNotizen).not.toHaveBeenCalled();
      expect(mockShowToast).toHaveBeenCalledWith(
        "Fehler beim Erstellen der Notiz",
        "error"
      );
    });
  });
});
