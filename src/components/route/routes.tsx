

// const SignIn = lazy(() => import("@/components/page/signin/signin"));
// const Dashboard = lazy(() => import("@/components/page/dashboard/dashboard"));
// const DashboardLayout = lazy(() => import("@/components/layout/layout"));

import SignIn from "../page/signin/signin";
import Dashboard from "../page/dashboard/dashboard";
import DashboardLayout from "../layout/layout";

export const routes = [
    { path: "/signin", component: SignIn, public: true },
    { path: "/", component: Dashboard, layout: DashboardLayout, public: false}
];