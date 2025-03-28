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
import DetalleHorariosComponent from "./pages/detallehorarios/detallehorarios";
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
import AsistenciaEventos from "./pages/asistencia_eventos/asistencia_eventos";
import CategoriaBitacoras from "./pages/categoria_bitacoras/categoria_bitacoras";
import Rifas from "./pages/rifas/rifas";
import Productos from "./pages/productos/productos";
import Personas from "./pages/personas/personas";
import Categorias from "./pages/categoria/categoria";
import Traslados from "./pages/traslados/traslados";
import TipoTraslado from "./pages/tipoTraslado/tipoTraslado";
import Eventos from "./pages/eventos/eventos";
import Pedidos from "./pages/pedidos/pedidos";
import CategoriaHorarios from "./pages/categoriaHorarios/categoriaHorarios";
import Permisos from "./pages/permisos/permisos";
import MercanciaVoluntarios from "./pages/mercanciaVoluntarios/mercanciaVoluntarios";
import InventarioMventas from "./pages/inventarioMventas/intentarioMventas";
import AutorizacionSolicitud from "./pages/autorizacionSolicitud/autorizacionSolicitud";
import AsignacionStands from "./pages/asignacionStand/asignacionStand";
import AutorizacionTalonarios from "./pages/autorizacionTalonarios/autorizacionTalonarios";
import ReporteProblemas from "./pages/reporteProblemas/reporteProblemas";
import SoporteSituaciones from "./pages/soporteSituaciones/soporteSituaciones";
import Desarrolladores from "./pages/desarrolladores/desarrolladores";
import PaginaPrincipal from "./pages/paginaPrincipal/paginaPrincipal";
import ReporteEventos from "./pages/reporteEventos/reporteEventos";
import ReporteStands from "./pages/reporteStands/reporteStands";
import ReporteMercanciaVoluntariosPage from "./pages/reporteMercanciaVoluntarios/reporteMercanciaVoluntarios";
import ReporteAspirantesPage from "./pages/reporteAspirantes/reporteAspirantes";
import ReporteRifasPage from "./pages/reporteRifas/reporteRifas"
import VentasVoluntarios from "./pages/ventas_voluntarios/ventas_voluntarios";
import VentasStands from "./pages/ventas_stands/ventas_stands";
import RecaudacionRifas from "./pages/recaudacion_rifas/recaudacion_rifas";
import RecaudacionEventos from "./pages/recaudaciones_eventos/recaudaciones_eventos";
import ProductosVentVoluntario from "./pages/productosVentVoluntario/productosVentVoluntario";
import Empleados from "./pages/empleados/empleados";
import DetalleProductos from "./pages/detalleProductos/detalleProductos";
import ReporteTraslados from "./pages/reporteTraslados/reporteTraslados";
import ReportePedidos from "./pages/reportePedidos/reportePedidos";
import Bitacoras from "./pages/bitacoras/bitacoras";
import ReporteContabilidad from "./pages/reporteContabilidad/reporteContabilidad";


const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginLayout />,
    // children: [
    //   {
    //     index: true, 
    //     element: <LoginLayout />, 
    //   },
    //   {
    //     path: "/create-account",
    //     element: <CreateAccount />,
    //   },
    //   {
    //     path: "/forget-password",
    //     element: <ForgetPassword />,
    //   },
    //   {
    //     path: "/confirm-password",
    //     element: <ConfirmPassword />,
    //   },
    //   {
    //     path: "/verificaiton",
    //     element: <Verification />,
    //   },
    //   {
    //     path: "/password-success",
    //     element: <PasswordSuccess />,
    //   },
    // ],
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
        path: "/paginaPrincipal",
        element: <PaginaPrincipal/>,
      },
      {
        path: "/asistencia_eventos",
        element: <AsistenciaEventos />,
      },
      {
        path: "/tipoPago",
        element: <TipoPago />,
      },
      {
        path: "/ventas_voluntarios",
        element: <VentasVoluntarios />,
      },
      {
        path: "/ventas_stands",
        element: <VentasStands />,
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
        path: "/recaudacion_rifas",
        element: <RecaudacionRifas />,
      },
      {
        path: "/recaudacion_eventos",
        element: <RecaudacionEventos />,
      },
      {
        path: "/productos",
        element: <Productos />,
      },
      {
        path: "/productosVentVoluntarios",
        element: <ProductosVentVoluntario />,
      },
      {
        path: "/detalleProductos",
        element: <DetalleProductos />,
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
        path: "/desarrolladores",
        element: <Desarrolladores />,
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
        path: "/mercanciaVoluntarios",
        element: <MercanciaVoluntarios/>,
      },
      {
        path: "/inventarioMventas",
        element: <InventarioMventas/>,
      },
      {
        path: "/autorizacionSolicitud",
        element: <AutorizacionSolicitud/>,
      },
      {
        path: "/autorizacionTalonarios",
        element: <AutorizacionTalonarios/>,
      },
      {
        path: "/asignacionStand",
        element: <AsignacionStands/>,
      },
      {
        path: "/soporteSituaciones",
        element: <SoporteSituaciones/>,
      },
      {
        path: "/reporteProblemas",
        element: <ReporteProblemas/>,
      },
      {
        path: "/reporteEventos",
        element: <ReporteEventos/>,
      },
      {
        path: "/reporteStands",
        element: <ReporteStands/>,
      },
      {
        path: "/reporteContabilidad",
        element: <ReporteContabilidad/>,
      },
      {
        path: "/reporteMercanciaVoluntarios",
        element: <ReporteMercanciaVoluntariosPage/>,
      },
      {
        path: "/reporteAspirantes",
        element: <ReporteAspirantesPage/>,
      },
      {
        path: "/reporteRifas",
        element: <ReporteRifasPage/>,
      },
      {
        path: "/reporteTraslados",
        element: <ReporteTraslados/>,
      },
      {
        path: "/reportePedidos",
        element: <ReportePedidos/>,
      },
      {
        path: "/empleados",
        element: <Empleados/>,
      },
      {
        path: "/bitacoras",
        element: <Bitacoras/>,
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
          /*{
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
          },*/
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
