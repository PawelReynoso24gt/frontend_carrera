import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home";
import HomeAnalytics from "./pages/home-analytics";
import Layout from "./component/layout";
import DashboardSass from "./pages/dashboard-sass";
import Statistics from "./pages/statistics";
import Inbox from "./pages/inbox";
import Email from "./pages/email";
import ToDoList from "./pages/to-dolist";
import Integrations from "./pages/Integrations";
import Pricing from "./pages/pricing";
import Teams from "./pages/team";
import Gallery from "./pages/gallery";
import Faq from "./pages/faq";
import Calendar from "./pages/calendar";
import Error from "./pages/error";
import Login from "./pages/login";
import CreateAccount from "./pages/create-account";
import LoginLayout from "./component/layout/LoginLayout";
import ForgetPassword from "./pages/forget-password";
import ConfirmPassword from "./pages/confirm-password";
import Verification from "./pages/verification";
import PasswordSuccess from "./pages/password-success";
import Transaction from "./pages/transaction";
import Notifications from "./pages/notifications";
import Users from "./pages/user";
import History from "./pages/history";
import ProfileOverview from "./pages/profile-overview";
import Overview from "./pages/profile-overview/overview";
import Activities from "./pages/profile-overview/activities";
import Projects from "./pages/profile-overview/projects";
import Documents from "./pages/profile-overview/documents";
import Gallery2 from "./pages/profile-overview/gallery";
import Settings from "./pages/settings";
import PersonalInfo from "./pages/settings/personal-info";
import PaymentMethod from "./pages/settings/payment-method";
import NotificationSetting from "./pages/settings/notification-setting";
import LoginActivity from "./pages/settings/login-activity";
import ChangePassword from "./pages/settings/change-password";
import SettingsFaq from "./pages/settings/faq";
import TermsAndCondition from "./pages/settings/terms-and-conditions";
import SupportTicket from "./pages/support-ticket";
import Sedes from "./pages/sedes/sedes";
import Roles from "./pages/Roles/roles";
import Departamentos from "./pages/departamentos/departamentos";
import TipoPago from "./pages/tipoPago/tipoPago";
import TipoStands from "./pages/tipoStands/tipoStands";
import Horarios from "./pages/horarios/horarios";
import DetalleHorariosComponent from "./component/detallehorarios/detallehorarios";
import FotoSedesPage from "./pages/fotosedes/fotosedes";
import TipoPublico from "./pages/tipo_publicos/tipo_publicos"
import Stands from "./pages/stands/stands";
import Municipios from "./pages/municipios/municipios";
import Talonarios from "./pages/talonarios/talonarios";
import Voluntarios from "./pages/voluntarios/voluntarios";
import Comisiones from "./pages/comisiones/comisiones";
import Actividades from "./pages/actividades/actividades";
import Publicaciones from "./pages/publicaciones/publicaciones";
import Materiales from "./pages/materiales/materiales";
import Administradores from "./pages/administradores/administradores";
import CategoriaBitacoras from "./pages/categoria_bitacoras/categoria_bitacoras";
import Rifas from "./pages/rifas/rifas";
import Productos from "./pages/productos/productos";
import Personas from "./pages/personas/personas";
import Categorias from "./pages/categoria/categoria";
import Traslados from "./pages/traslados/traslados";
import TipoTraslado from "./pages/tipoTraslado/tipoTraslado";
import Eventos from "./component/eventos/eventos";
import Pedidos from "./component/pedidos/pedidos";
import CategoriaHorarios from "./component/categoriaHorarios/categoriaHorarios";
import Permisos from "./component/permisos/permisos";

const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginLayout,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/create-account",
        element: <CreateAccount />,
      },
      {
        path: "/forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "/confirm-password",
        element: <ConfirmPassword />,
      },
      {
        path: "/verificaiton",
        element: <Verification />,
      },
      {
        path: "/password-success",
        element: <PasswordSuccess />,
      },
    ],
  },
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "//home-analytics",
        element: <HomeAnalytics />,
      },
      {
        path: "/dashboard-sass",
        element: <DashboardSass />,
      },
      {
        path: "/statistics",
        element: <Statistics />,
      },
      {
        path: "/inbox",
        element: <Inbox />,
      },
      {
        path: "/email",
        element: <Email />,
      },
      {
        path: "/to-dolist",
        element: <ToDoList />,
      },
      {
        path: "/integrations",
        element: <Integrations />,
      },
      {
        path: "/pricing",
        element: <Pricing />,
      },
      //rutas crud
      {
        path: "/Sedes",
        element: <Sedes />,
      },
      {
        path: "/publicaciones",
        element: <Publicaciones />,
      },
      {
        path: "/departamentos",
        element: <Departamentos />,
      },
      {
        path: "/tipoPago",
        element: <TipoPago />,
      },
      {
        path: "/categoria_bitacoras",
        element: <CategoriaBitacoras />,
      },
      {
        path: "/tipo_publicos",
        element: <TipoPublico />,
      },
      {
        path: "/comisiones",
        element: <Comisiones />,
      },
      {
        path: "/actividades",
        element: <Actividades />,
      },
      {
        path: "/rifas",
        element: <Rifas />,
      },
      {
        path: "/productos",
        element: <Productos />,
      },
      {
        path: "/personas",
        element: <Personas />,
      },
      {
        path: "/stands",
        element: <Stands />,
      },
      {
        path: "/municipios",
        element: <Municipios />,
      },
      {
        path: "/categorias",
        element: <Categorias />,
      },
      {
        path: "/eventos",
        element: <Eventos />,
      },
      {
        path: "/tipoTraslado",
        element: <TipoTraslado />,
      },
      {
        path: "/traslados",
        element: <Traslados />,
      },
      {
        path: "/categoriaHorarios",
        element: <CategoriaHorarios />,
      },
      {
        path: "/pedidos",
        element: <Pedidos />,
      },
      {
        path: "/permisos",
        element: <Permisos />,
      },
      {
        path: "/teams",
        element: <Teams />,
      },
      {
        path: "/roles",
        element: <Roles />,
      },
      {
        path: "/talonarios",
        element: <Talonarios />,
      },
      {
        path: "/voluntarios",
        element: <Voluntarios />,
      },
      {
        path: "/tipoStands",
        element: <TipoStands/>,
      },
      {
        path: "/horarios",
        element: <Horarios/>,
      },
      {
        path: "/detallehorarios",
        element: <DetalleHorariosComponent/>,
      },
      {
        path: "/fotosedes",
        element: <FotoSedesPage/>,
      },
      {
        path: "/materiales",
        element: <Materiales/>,
      },
      {
        path: "/administradores",
        element: <Administradores/>,
      },
      {
        path: "/gallery",
        element: <Gallery />,
      },
      {
        path: "/faq",
        element: <Faq />,
      },
      {
        path: "/calendar",
        element: <Calendar />,
      },
      {
        path: "/transaction",
        element: <Transaction />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/user",
        element: <Users />,
      },
      {
        path: "/history",
        element: <History />,
      },
      {
        path: "/profile-overview",
        Component: ProfileOverview,
        children: [
          {
            index: true,
            element: <Overview />,
          },
          {
            path: "activities",
            element: <Activities />,
          },
          {
            path: "projects",
            element: <Projects />,
          },
          {
            path: "documents",
            element: <Documents />,
          },
          {
            path: "gallery",
            element: <Gallery2 />,
          },
        ],
      },
      {
        path: "/settings",
        Component: Settings,
        children: [
          {
            index: true,
            element: <PersonalInfo />,
          },
          {
            path: "payment-method",
            element: <PaymentMethod />,
          },
          {
            path: "notification-setting",
            element: <NotificationSetting />,
          },
          {
            path: "login-Activity",
            element: <LoginActivity />,
          },
          {
            path: "change-password",
            element: <ChangePassword />,
          },
          {
            path: "faq",
            element: <SettingsFaq />,
          },
          {
            path: "terms-and-conditions",
            element: <TermsAndCondition />,
          },
        ],
      },
      {
        path: "/support-ticket",
        element: <SupportTicket />,
      },
    ],
  },
  {
    path: "/error-page",
    element: <Error />,
  },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
