// React imports
import { useEffect, useState } from "react";

// Component imports
import CardLink from "./components/cardLink/CardLink";
import Footer from "@components/Footer";
import { StyledSnackbar } from "@components/StyledSnackbar";

// MUI component and icon imports
import { CircularProgress, IconButton } from "@mui/material";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

// Router imports
import { useNavigate } from "react-router-dom";

// Hook imports
import { useGetUserById } from "@hooks/useGetList";

interface LinkType {
  fileName: string;
  fileId: string;
  uploadDate: string;
  link: string;
  _id: string;
}

export default function LinkListing() {
  const navigate = useNavigate();
  const storedUserId = localStorage.getItem("userId") ?? "";
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarState, setSnackbarState] = useState<"loading" | "success">(
    "success"
  );

  const {
    data: list,
    refetch,
    isFetching,
    isLoading,
  } = useGetUserById(storedUserId);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    if (snackbarState === "success") {
      setSnackbarState("loading");
    }
  };

  useEffect(() => {
    if (!isFetching && snackbarState === "loading" && snackbarOpen) {
      setSnackbarState("success");
    }
  }, [isFetching, snackbarState, snackbarOpen]);

  const refetchList = () => {
    setSnackbarState("loading");
    setSnackbarOpen(true);
    refetch();
  };

  function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const snackbarMessage =
    snackbarState === "loading" ? (
      <div className="flex gap-2 justify-center items-center">
        <CircularProgress size={20} sx={{ color: "#4747FF" }} />
        <p className="align-middle leading-none">Updating list...</p>
      </div>
    ) : (
      <div className="flex gap-2 justify-center items-center">
        <CheckRoundedIcon fontSize="small" sx={{ color: "#4747FF" }} />
        <p className="align-middle leading-none">Link successfully deleted</p>
      </div>
    );

  return (
    <>
      <StyledSnackbar
        open={snackbarOpen}
        autoHideDuration={snackbarState === "loading" ? null : 6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />

      <div className="w-full h-full grid grid-rows-[1fr_2fr_1fr] grid-cols-1 justify-center items-center">
        <div className="h-full w-full grid grid-cols-3 justify-center items-center">
          <div className="flex justify-start w-full pl-14 h-full items-start pt-14">
            <IconButton
              sx={{
                position: "absolute",
                top: "2%",
                left: "2%",
              }}
              onClick={() => {
                navigate("/form");
              }}
            >
              <KeyboardBackspaceRoundedIcon sx={{ color: "#4747FF" }} />
            </IconButton>
          </div>
          <div className="flex justify-center">
            <h1
              className="font-normal leading-tight font-Sora md:text-[2.8rem] text-[1.8rem] text-transparent bg-clip-text animate-gradient text-center"
              style={{
                backgroundImage:
                  "linear-gradient(270deg, #4747FF, #7979bd, #4747FF)",
                backgroundSize: "400% 400%",
              }}
            >
              Your saved links
            </h1>
          </div>
          <div></div>
        </div>

        {/* Condição de loading */}
        {isLoading ? (
          <div className=" inset-0 flex w-full h-full items-center justify-center">
            <div className="w-12 h-12 border-t-2 border-white border-solid rounded-full animate-spin"></div>
          </div>
        ) : list && list.length > 0 ? (
          <div className="w-full flex flex-col h-[100%] items-center justify-center gap-6 md:p-0 px-4">
            {list.map((link: LinkType) => (
              <CardLink
                key={link._id}
                link={link.link}
                date={formatDate(link.uploadDate)}
                fileId={link.fileId}
                onDeleteSuccess={refetchList}
              />
            ))}
          </div>
        ) : (
          <div className="w-full flex justify-center items-center">
            <h2 className="text-xl font-regular text-blue-700 mb-3">
              No links saved...
            </h2>
          </div>
        )}

        <div className="h-full flex-col flex justify-end pb-6">
          <Footer />
        </div>
      </div>
    </>
  );
}
