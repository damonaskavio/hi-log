import SheetLayout from "@/layouts/SheetLayout";
import LogsList from "@/pages/LogsList";
import SheetDetails from "@/pages/SheetDetails";
import SheetMedia from "@/pages/SheetMedia";
import SheetsList from "@/pages/SheetsList";

const routes = [
  { path: "/", element: <LogsList /> },
  {
    element: <SheetLayout />,
    children: [
      { path: "/log/:logId/sheets", element: <SheetsList /> },
      { path: "/log/:logId/sheet/:sheetId", element: <SheetDetails /> },
      { path: "/log/:logId/sheet/:sheetId/media", element: <SheetMedia /> },
    ],
  },
];

export default routes;
