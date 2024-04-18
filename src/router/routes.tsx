import MainLayout from "@/layouts/MainLayout";
import LogsList from "@/pages/LogsList";
import SheetRecords from "@/pages/SheetRecords";
import SheetMedia from "@/pages/SheetMedia";
import LogSheets from "@/pages/LogSheets";
import { Navigate } from "react-router-dom";

const routes = [
  {
    element: <MainLayout />,
    children: [
      { path: "/logs", element: <LogsList /> },
      { path: "/sheets", element: <LogSheets /> },
      { path: "/sheet", element: <SheetRecords /> },
      { path: "/media", element: <SheetMedia /> },
      { path: "/*", element: <Navigate to={"/logs"} replace /> },
    ],
  },
];

export default routes;
