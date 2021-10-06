import React, { Fragment } from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";

import DashboardLayout from "layouts/DashboardLayout";
import InfographicsPage from "pages/InfographicsPage";
import FaqPage from "pages/FaqPage";
import CategoriesPage from "pages/CategoriesPage";
import LoginPage from "pages/LoginPage/LoginPage";
import { useSelector } from "react-redux";
import InfographicsDetailPage from "pages/InfographicsPage/InfographicsDetailPage";
import VideoBlogCategoryDetailsPage from "pages/CategoriesPage/VideoBlogCategoryPage/VideoBlogCategoryDetailsPage";
import FacilityCategoryDetailsPage from "pages/CategoriesPage/FacilityCategoryPage/FacilityCategoryDetailsPage";
import FaqDetailsPage from "pages/FaqPage/FaqDetailsPage";
import FeedbacksPage from "pages/FeedbacksPage";
import FeedbackDetailsPage from "pages/FeedbacksPage/FeedbackDetailsPage";
import SportCategoryDetailsPage from "pages/CategoriesPage/SportCategoryPage/SportCategoryDetailsPage";
import VideoBlogPage from "pages/VideoBlogPage";
import VideoblogDetailsPage from "pages/VideoBlogPage/VideoblogDetailsPage";
import ClubPage from "pages/ClubPage";
import ClubDetailsPage from "pages/ClubPage/ClubDetailsPage";
import FacilitiesPage from "pages/FacilitiesPage";
import DictionaryPage from "pages/DictionaryPage";
import DictionaryDetailsPage from "pages/DictionaryPage/DictionaryDetailsPage";
import ParentalFaqCategoryDetails from "pages/CategoriesPage/ParentalFaqCategory/ParentalFaqCategoryDetails";
import ParentalInfoCategoryDetails from "pages/CategoriesPage/ParentalInfoCategory/ParentalInfoCategoryDetails";
import ParentalFaqPage from "pages/ParentalFaqPage";
import ParentalFaqDetailsPage from "pages/ParentalFaqPage/ParentalFaqDetailsPage";
import ParentalInfoPage from "pages/ParentalInfoPage/ParentalInfoPage";
import ParentalInfoDetailsPage from "pages/ParentalInfoPage/ParentalInfoDetailsPage";
import UsersPage from "pages/UsersPage";
import FacilityDetailsPage from "pages/FacilitiesPage/FacilityDetailsPage";
import AboutPage from "pages/AboutPage/AboutPage";
import BannerPage from "pages/BannerPage";
import BannerDetailsPage from "pages/BannerPage/BannerDetailsPage";
import TipsPage from "pages/TipsPage";
import TipsDetailsPage from "pages/TipsPage/TipsDetailsPage";
import GamesPage from "pages/GamesPage";
import QuestionDetail from "pages/GamesPage/QuestionsPage/QuestionDetail";
import UserDetail from "pages/UsersPage/UserDetail/UserDetail";
import SportsmanPage from "pages/SportsmanPage";
import SportsmanDetailsPage from "pages/SportsmanPage/SportsmanDetailsPage";
import ApplicationsPage from "pages/ApplicationsPage";

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      <Layout>
        <Component {...props} />
      </Layout>
    )}
  />
);

const AltLayout = ({ children }) => <Fragment>{children}</Fragment>;

export const privateRoutes = [
  {
    path: "/",
    exact: true,
    layout: DashboardLayout,
    component: () => <Redirect to="/banner" />,
  },
  {
    path: "/infographics",
    layout: DashboardLayout,
    component: InfographicsPage,
  },
  {
    path: "/infographics/:id",
    layout: DashboardLayout,
    component: InfographicsDetailPage,
  },
  {
    path: "/categories",
    layout: DashboardLayout,
    component: CategoriesPage,
  },
  {
    path: "/categories/sport/:id",
    layout: DashboardLayout,
    component: SportCategoryDetailsPage,
  },
  {
    path: "/categories/videoblog/:id",
    layout: DashboardLayout,
    component: VideoBlogCategoryDetailsPage,
  },
  {
    path: "/categories/facility/:id",
    layout: DashboardLayout,
    component: FacilityCategoryDetailsPage,
  },
  {
    path: "/faq",
    layout: DashboardLayout,
    component: FaqPage,
  },
  {
    path: "/faq/:id",
    layout: DashboardLayout,
    component: FaqDetailsPage,
  },
  {
    path: "/feedback",
    layout: DashboardLayout,
    component: FeedbacksPage,
  },
  {
    path: "/feedback/:id",
    layout: DashboardLayout,
    component: FeedbackDetailsPage,
  },
  {
    path: "/sportsman",
    layout: DashboardLayout,
    component: SportsmanPage,
  },
  {
    path: "/sportsman/:id",
    layout: DashboardLayout,
    component: SportsmanDetailsPage,
  },
  {
    path: "/club",
    layout: DashboardLayout,
    component: ClubPage,
  },
  {
    path: "/club/:id",
    layout: DashboardLayout,
    component: ClubDetailsPage,
  },
  {
    path: "/facilities",
    layout: DashboardLayout,
    component: FacilitiesPage,
  },
  {
    path: "/facilities/:id",
    layout: DashboardLayout,
    component: FacilityDetailsPage,
  },
  {
    path: "/dictionary",
    layout: DashboardLayout,
    component: DictionaryPage,
  },
  {
    path: "/dictionary/:id",
    layout: DashboardLayout,
    component: DictionaryDetailsPage,
  },
  {
    path: "/parental-faq",
    layout: DashboardLayout,
    component: ParentalFaqPage,
  },
  {
    path: "/parental-faq/:id",
    layout: DashboardLayout,
    component: ParentalFaqDetailsPage,
  },
  {
    path: "/parental-info",
    layout: DashboardLayout,
    component: ParentalInfoPage,
  },
  {
    path: "/parental-info/:id",
    layout: DashboardLayout,
    component: ParentalInfoDetailsPage,
  },
  {
    path: "/categories/parental-faq/:id",
    layout: DashboardLayout,
    component: ParentalFaqCategoryDetails,
  },
  {
    path: "/categories/parental-info/:id",
    layout: DashboardLayout,
    component: ParentalInfoCategoryDetails,
  },
  {
    path: "/users",
    layout: DashboardLayout,
    component: UsersPage,
  },
  {
    path: "/users/:id",
    layout: DashboardLayout,
    component: UserDetail,
  },
  {
    path: "/about",
    layout: DashboardLayout,
    component: AboutPage,
  },
  {
    path: "/banner",
    layout: DashboardLayout,
    component: BannerPage,
  },
  {
    path: "/banner/:id",
    layout: DashboardLayout,
    component: BannerDetailsPage,
  },
  {
    path: "/tips",
    layout: DashboardLayout,
    component: TipsPage,
  },
  {
    path: "/tips/:id",
    layout: DashboardLayout,
    component: TipsDetailsPage,
  },
  {
    path: "/games",
    layout: DashboardLayout,
    component: GamesPage,
  },
  {
    path: "/games/question/:id",
    layout: DashboardLayout,
    component: QuestionDetail,
  },
  {
    path: "/videoblog",
    layout: DashboardLayout,
    component: VideoBlogPage,
  },
  {
    path: "/videoblog/:id",
    layout: DashboardLayout,
    component: VideoblogDetailsPage,
  },
  {
    path: "/applications",
    layout: DashboardLayout,
    component: ApplicationsPage,
  },
];

// const publicRoutes =  [
//     {
//         path: "/",
//         exact: true,
//         layout: AltLayout,
//         component: () => "Main Page"
//     }
// ];

const loginRoute = [
  {
    path: "/",
    exact: true,
    layout: DashboardLayout,
    component: () => <Redirect to="/login" />,
  },
  {
    path: "/login",
    exact: true,
    layout: AltLayout,
    component: LoginPage,
  },
];

const Routes = () => {
  const auth = useSelector((state) => state.auth);
  const token = auth && auth.accessToken;

  const privateRoutesList = privateRoutes.map((item, id) => {
    return (
      <AppRoute
        key={id}
        exact
        path={item.path}
        layout={item.layout}
        component={item.component}
      />
    );
  });
  // const publicRoutesList = publicRoutes.map((item, id) => {
  //     return <AppRoute key={id} exact path={item.path} layout={item.layout} component={item.component} />
  // });
  const loginRoutesList = loginRoute.map((item, id) => {
    return (
      <AppRoute
        key={id}
        exact
        path={item.path}
        layout={item.layout}
        component={item.component}
      />
    );
  });

  return (
    <Fragment>
      <Switch>
        {token ? privateRoutesList : loginRoutesList}
        {/*{privateRoutesList}*/}
        <Redirect from="*" to="/" />
      </Switch>
    </Fragment>
  );
};

export default withRouter(Routes);
