import MainLayout from "@/layouts/MainLayout";
import LogSheets from "@/pages/LogSheets";
import LogsList from "@/pages/LogsList";
import PeopleList from "@/pages/PeopleList";
import SheetMedia from "@/pages/SheetMedia";
import SheetRecords from "@/pages/SheetRecords";
import { Navigate } from "react-router-dom";

const routes = [
  {
    element: <MainLayout />,
    children: [
      { path: "/logs", element: <LogsList /> },
      { path: "/sheets", element: <LogSheets /> },
      { path: "/sheet", element: <SheetRecords /> },
      { path: "/media", element: <SheetMedia /> },
      { path: "/people", element: <PeopleList /> },
      { path: "/*", element: <Navigate to={"/logs"} replace /> },
    ],
  },
];

export default routes;
