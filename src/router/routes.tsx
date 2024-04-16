import MainLayout from "@/layouts/MainLayout";
import LogsList from "@/pages/LogsList";
import SheetRecords from "@/pages/SheetRecords";
import SheetMedia from "@/pages/SheetMedia";
import SheetsList from "@/pages/SheetsList";
import { Navigate } from "react-router-dom";

const routes = [
  {
    element: <MainLayout />,
    children: [
      { path: "/logs", element: <LogsList /> },
      { path: "/sheets", element: <SheetsList /> },
      { path: "/sheet", element: <SheetRecords /> },
      { path: "/media", element: <SheetMedia /> },
      { path: "/*", element: <Navigate to={"/logs"} replace /> },
    ],
  },
];

export default routes;
