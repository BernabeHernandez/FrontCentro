import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PaginaPrincipal from '../Paginas/PaginaPrincipal';
import PaginaPrincipalAdministrativa from '../Paginas/PaginaPrincipalAdministrativa';
import PaginaPrincipalCliente from '../Paginas/PaginaPrincipalCliente';
import Login from '../Componentes/Autenticacion/Login';
import Registro from '../Componentes/Autenticacion/Registro';
import Politicas from '../Componentes/Administrativo/Politicas';
import Terminos from '../Componentes/Administrativo/Terminos';
import Perfil from '../Componentes/Administrativo/Perfil';
import Deslinde from '../Componentes/Administrativo/Deslinde';
import ValidarCodigo from '../Componentes/Autenticacion/ValidarCodigo';
import CambiarPassword from '../Componentes/Autenticacion/CambiarPassword';
import SolicitarCodigo from '../Componentes/Autenticacion/SolicitarCodigo';
import VerificarCorreo from '../Componentes/Autenticacion/VerificarCorreo';
import ActividadLogeo from '../Componentes/Administrativo/ActividadLogeo';
import RegistroCambioPassw from '../Componentes/Administrativo/RegistroCambioPassw';
import TerminosF from '../Componentes/Compartidos/TerminosF';
import PoliticasF from '../Componentes/Compartidos/PoliticasF';
import DeslindeF from '../Componentes/Compartidos/DeslindeF';
import RolesF from '../Componentes/Administrativo/RolesF';
import ProtectedRoute from '../Componentes/Autenticacion/ProtectedRoute';
import TerminosHi from '../Componentes/Administrativo/TerminosHi';
import PoliticasHi from '../Componentes/Administrativo/PoliticasHi';
import DeslindesHi from '../Componentes/Administrativo/DeslindesHi';
import UserSospechosos from '../Componentes/Administrativo/UserSospechosos';
import VerificarCodigo from '../Componentes/Autenticacion/MFA';
import MFASetup from '../Componentes/Autenticacion/MFASetup';
import VerifyMFA from '../Componentes/Autenticacion/VerifyMFA';
import Productos from '../Componentes/Publico/Productos';
import Servicios from '../Componentes/Publico/Servicios';
import DetalleProducto from '../Componentes/Publico/DetalleProducto';
import DetallesServicio from '../Componentes/Publico/DetalleServicios';
import OpcionPagoD from '../Componentes/Pagos/OpcionPagoD';
import PaginaError400 from '../Paginas/PaginaError400';
import PaginaError404 from '../Paginas/PaginaError404';
import PaginaError500j from '../Paginas/PaginaError500';
import SimularError from '../Paginas/SimularError';
import CrearProducto from '../Componentes/Administrativo/CrearProducto';
import CrearServicio from '../Componentes/Administrativo/CrearServicio';
import ResultadosBusqueda from '../Componentes/Publico/ResultadoBusqueda';
import Inventario from '../Componentes/Administrativo/Inventario';
import InventarioServicios from '../Componentes/Administrativo/InventarioServicios';
import MapaSitio from '../Paginas/MapaSitio';
import Ayuda from '../Componentes/Ayuda/Ayuda';
import ChatGPT from '../Componentes/Ayuda/ChatGPT';
import Categoria from '../Componentes/Administrativo/Categoria';
import RegistroHorario from '../Componentes/Administrativo/RegsitroHorario';
import HorariosDis from '../Componentes/Administrativo/horariosDis';
import CitasCliente from '../Componentes/Cliente/citasCliente';
import ProductosC from '../Componentes/Cliente/ProductosC';
import ServiciosC from '../Componentes/Cliente/ServiciosC';
import DetallesServicioC from '../Componentes/Cliente/DetalleServicioC';
import DetalleProductoC from '../Componentes/Cliente/DetalleProductoC';
import Carrito from '../Componentes/Cliente/Carrito';
import Promociones from '../Componentes/Administrativo/Promociones';
import PerfilCliente from '../Componentes/Cliente/PerfilCliente';
import Mision from '../Componentes/Administrativo/Mision';
import Vision from '../Componentes/Administrativo/Vision';
import MisionView from '../Componentes/Compartidos/MisionView';
import VisionView from '../Componentes/Compartidos/VisionView';
import OpcionesRestauracion from '../Componentes/Autenticacion/OpcionesRestauracion';
import CambioPasswordP from '../Componentes/Autenticacion/RecuperacionPassword/PreguntaSecreta/CambioPasswordP';
import RespuestaPregunta from '../Componentes/Autenticacion/RecuperacionPassword/PreguntaSecreta/RespuestaPregunta';
import VerificacionUsuario from '../Componentes/Autenticacion/RecuperacionPassword/PreguntaSecreta/VerificacionUsuario';
import VerificacionUsuarioSMS from '../Componentes/Autenticacion/RecuperacionPassword/SMS/VerificacionUsuarioSMS';
import ValidarCodigoSMS from '../Componentes/Autenticacion/RecuperacionPassword/SMS/ValidarCodigoSMS';
import Ventas from '../Componentes/Administrativo/Ventas/Ventas';
import DetallesVentas from '../Componentes/Administrativo/Ventas/DetallesVenta';
import DetalleCitas from '../Componentes/Administrativo/Ventas/DetalleCitas';
import PayPal from '../Componentes/FormaPago/Paypal';
import OpcionPago from '../Componentes/FormaPago/OpcionPago';
import MasterCard from '../Componentes/FormaPago/MasterCard';
import MercadoPago from '../Componentes/FormaPago/MercadoPago';
import PagoCorrectoMercado from '../Componentes/Pagos/PagoCorrectoMercado';
import MetodoPagoServicios from '../Componentes/FormaPago/MetodoPagoServicios';
import PayPalServicio from '../Componentes/FormaPago/PayPalServicio';
import MercadoPagoServicio from '../Componentes/FormaPago/MercadoPagoServicio';
import HistorialClinico from '../Componentes/Administrativo/HistorialClinico/HistorialClinico';
import DetalleHistorial from '../Componentes/Administrativo/HistorialClinico/DetalleHistorial';
import Facturacion from '../Componentes/Facturacion/Facturacion';
import AsistenciaPaciente from '../Componentes/Administrativo/AsistenciaPaciente/AsistenciaPaciente';
import EntregaProductos from '../Componentes/Administrativo/EntregaProductos/EntregaProductos';
import MisCompras from '../Componentes/Cliente/Compras/MisCompras';
import PrediccionClasificacion from '../Models/PrediccionClasificacion';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<PaginaPrincipal />} />
    <Route path="/login" element={<Login />} />
    <Route path="/registro" element={<Registro />} />
    {/* Rutas protegidas para la sección administrativa */}
    <Route path="/admin" element={<ProtectedRoute allowedRoles={["Administrador"]}><PaginaPrincipalAdministrativa /></ProtectedRoute>} />
    <Route path="/admin/politicas" element={<ProtectedRoute allowedRoles={["Administrador"]}><Politicas /></ProtectedRoute>} />
    <Route path="/admin/terminos" element={<ProtectedRoute allowedRoles={["Administrador"]}><Terminos /></ProtectedRoute>} />
    <Route path="/admin/perfil" element={<ProtectedRoute allowedRoles={["Administrador"]}><Perfil /></ProtectedRoute>} />
    <Route path="/admin/deslinde" element={<ProtectedRoute allowedRoles={["Administrador"]}><Deslinde /></ProtectedRoute>} />
    <Route path="/admin/activity-log" element={<ProtectedRoute allowedRoles={["Administrador"]}><ActividadLogeo /></ProtectedRoute>} />
    <Route path="/admin/registro-password" element={<ProtectedRoute allowedRoles={["Administrador"]}><RegistroCambioPassw /></ProtectedRoute>} />
    <Route path="/admin/roles" element={<ProtectedRoute allowedRoles={["Administrador"]}><RolesF /></ProtectedRoute>} />
    <Route path="/admin/terminos-condiciones" element={<ProtectedRoute allowedRoles={["Administrador"]}><TerminosF /></ProtectedRoute>} />
    <Route path="/admin/politicass" element={<ProtectedRoute allowedRoles={["Administrador"]}><PoliticasF /></ProtectedRoute>} />
    <Route path="/admin/deslindes" element={<ProtectedRoute allowedRoles={["Administrador"]}><DeslindeF /></ProtectedRoute>} />
    <Route path="/admin/historial-terminos" element={<ProtectedRoute allowedRoles={["Administrador"]}><TerminosHi /></ProtectedRoute>} />
    <Route path="/admin/historial-politicas" element={<ProtectedRoute allowedRoles={["Administrador"]}><PoliticasHi/></ProtectedRoute>} />
    <Route path="/admin/historial-deslindes" element={<ProtectedRoute allowedRoles={["Administrador"]}><DeslindesHi/></ProtectedRoute>} />
    <Route path="/admin/registro-sospechosos" element={<ProtectedRoute allowedRoles={["Administrador"]}><UserSospechosos/></ProtectedRoute>} />
    <Route path="/admin/productos" element={<ProtectedRoute allowedRoles={["Administrador"]}><CrearProducto/></ProtectedRoute>} />
    <Route path="/admin/servicios" element={<ProtectedRoute allowedRoles={["Administrador"]}><CrearServicio/></ProtectedRoute>} />
    <Route path="/admin/inventario" element={<ProtectedRoute allowedRoles={["Administrador"]}><Inventario/></ProtectedRoute>} />
    <Route path="/admin/inventarioser" element={<ProtectedRoute allowedRoles={["Administrador"]}><InventarioServicios/></ProtectedRoute>} />
    <Route path="/admin/categoria" element={<ProtectedRoute allowedRoles={["Administrador"]}><Categoria/></ProtectedRoute>} />
    <Route path="/admin/registroH" element={<ProtectedRoute allowedRoles={["Administrador"]}><RegistroHorario/></ProtectedRoute>} />
    <Route path="/admin/horariosD" element={<ProtectedRoute allowedRoles={["Administrador"]}><HorariosDis /></ProtectedRoute>} />
    <Route path="/admin/promociones" element={<ProtectedRoute allowedRoles={["Administrador"]}><Promociones /></ProtectedRoute>} />
    <Route path="/admin/mision" element={<ProtectedRoute allowedRoles={["Administrador"]}><Mision /></ProtectedRoute>} />
    <Route path="/admin/vision" element={<ProtectedRoute allowedRoles={["Administrador"]}><Vision /></ProtectedRoute>} />
    <Route path="/admin/misionview" element={<ProtectedRoute allowedRoles={["Administrador"]}><MisionView /></ProtectedRoute>} />
    <Route path="/admin/visionview" element={<ProtectedRoute allowedRoles={["Administrador"]}><VisionView /></ProtectedRoute>} />
    <Route path="/admin/ventas" element={<ProtectedRoute allowedRoles={["Administrador"]}><Ventas /></ProtectedRoute>} />
    <Route path="/admin/detalleventas" element={<ProtectedRoute allowedRoles={["Administrador"]}><DetallesVentas /></ProtectedRoute>} />
    <Route path="/admin/detallecitas" element={<ProtectedRoute allowedRoles={["Administrador"]}><DetalleCitas /></ProtectedRoute>} />
    <Route path="/admin/historial" element={<ProtectedRoute allowedRoles={["Administrador"]}><HistorialClinico /></ProtectedRoute>} />
    <Route path="/admin/detallehistorial/:id" element={<ProtectedRoute allowedRoles={["Administrador"]}><DetalleHistorial /></ProtectedRoute>} />
    <Route path="/admin/asistenciaPaciente" element={<ProtectedRoute allowedRoles={["Administrador"]}><AsistenciaPaciente /></ProtectedRoute>} />
    <Route path="/admin/entregaproductos" element={<ProtectedRoute allowedRoles={["Administrador"]}><EntregaProductos /></ProtectedRoute>} />
    <Route path="/admin/prediccion-clasificacion" element={<ProtectedRoute allowedRoles={["Administrador"]}><PrediccionClasificacion /></ProtectedRoute>} />

    {/* Rutas protegidas para clientes */}
    <Route path="/cliente" element={<ProtectedRoute allowedRoles={["Cliente"]}><PaginaPrincipalCliente /></ProtectedRoute>} />
    <Route path="/cliente/terminos-condiciones" element={<ProtectedRoute allowedRoles={["Cliente"]}><TerminosF /></ProtectedRoute>} />
    <Route path="/cliente/politicass" element={<ProtectedRoute allowedRoles={["Cliente"]}><PoliticasF /></ProtectedRoute>} />
    <Route path="/cliente/deslindes" element={<ProtectedRoute allowedRoles={["Cliente"]}><DeslindeF /></ProtectedRoute>} />
    <Route path="/cliente/productos" element={<ProtectedRoute allowedRoles={["Cliente"]}><ProductosC /></ProtectedRoute>} />
    <Route path="/cliente/detalles/:id" element={<ProtectedRoute allowedRoles={["Cliente"]}><DetalleProductoC /></ProtectedRoute>} />
    <Route path="/cliente/servicios" element={<ProtectedRoute allowedRoles={["Cliente"]}><ServiciosC /></ProtectedRoute>} />
    <Route path="/cliente/detalle/:id" element={<ProtectedRoute allowedRoles={["Cliente"]}><DetallesServicioC /></ProtectedRoute>} />
    <Route path="/cliente/detalles/:id/opcionpago" element={<ProtectedRoute allowedRoles={["Cliente"]}><OpcionPago /></ProtectedRoute>} />
    <Route path="/cliente/detalle/:id/opcionpagos" element={<ProtectedRoute allowedRoles={["Cliente"]}><OpcionPagoD /></ProtectedRoute>} />
    <Route path="/cliente/error400" element={<ProtectedRoute allowedRoles={["Cliente"]}><PaginaError400 /></ProtectedRoute>} />
    <Route path="/cliente/error500" element={<ProtectedRoute allowedRoles={["Cliente"]}><PaginaError404 /></ProtectedRoute>} />
    <Route path="/cliente/resultados" element={<ProtectedRoute allowedRoles={["Cliente"]}><ResultadosBusqueda /></ProtectedRoute>} />
    <Route path="/cliente/ayuda" element={<ProtectedRoute allowedRoles={["Cliente"]}><Ayuda /></ProtectedRoute>} />
    <Route path="/cliente/chats" element={<ProtectedRoute allowedRoles={["Cliente"]}><ChatGPT /></ProtectedRoute>} />
    <Route path="/cliente/citasCliente" element={<ProtectedRoute allowedRoles={["Cliente"]}><CitasCliente /></ProtectedRoute>} />
    <Route path="/cliente/carrito" element={<ProtectedRoute allowedRoles={["Cliente"]}><Carrito /></ProtectedRoute>} />
    <Route path="/cliente/perfilUsuario" element={<ProtectedRoute allowedRoles={["Cliente"]}><PerfilCliente /></ProtectedRoute>} /> 
    <Route path="/cliente/misionview" element={<ProtectedRoute allowedRoles={["Cliente"]}><MisionView /></ProtectedRoute>} /> 
    <Route path="/cliente/visionview" element={<ProtectedRoute allowedRoles={["Cliente"]}><VisionView /></ProtectedRoute>} />    
    <Route path="/cliente/metodo" element={<ProtectedRoute allowedRoles={["Cliente"]}><OpcionPago /></ProtectedRoute>} />  

    <Route path="/cliente/paypal" element={<ProtectedRoute allowedRoles={["Cliente"]}><PayPal /></ProtectedRoute>} />  
    <Route path="/cliente/mastercard" element={<ProtectedRoute allowedRoles={["Cliente"]}><MasterCard /></ProtectedRoute>} />  
    <Route path="/cliente/mercadopago" element={<ProtectedRoute allowedRoles={["Cliente"]}><MercadoPago /></ProtectedRoute>} />     
    <Route path="/cliente/metodoServicios" element={<ProtectedRoute allowedRoles={["Cliente"]}><MetodoPagoServicios /></ProtectedRoute>} />       

    <Route path="/cliente/pago-servicio/paypal" element={<ProtectedRoute allowedRoles={["Cliente"]}><PayPalServicio /></ProtectedRoute>} />  
    <Route path="/cliente/pago-servicio/mercadopago" element={<ProtectedRoute allowedRoles={["Cliente"]}><MercadoPagoServicio /></ProtectedRoute>} />   
    <Route path="/cliente/facturacion/:id" element={<ProtectedRoute allowedRoles={["Cliente"]}><Facturacion /></ProtectedRoute>} />  
    <Route path="/cliente/misCompras/:idUsuario" element={<ProtectedRoute allowedRoles={["Cliente"]}><MisCompras /></ProtectedRoute>} />  

    {/* Rutas públicas */}
    <Route path="/verificar_correo" element={<SolicitarCodigo />} />
    <Route path="/validar_codigo" element={<ValidarCodigo />} />
    <Route path="/cambiar_password" element={<CambiarPassword />} />
    <Route path="/verificar-correo" element={<VerificarCorreo />} />
    <Route path="/verificacion-codigo" element={<VerificarCodigo />} />
    <Route path="/terminos-condiciones" element={<TerminosF />} />
    <Route path="/politicass" element={<PoliticasF />} />
    <Route path="/deslindes" element={<DeslindeF />} />
    <Route path="/MFAS" element={<MFASetup />} />
    <Route path="/codigo-mfa" element={<VerifyMFA />} />
    <Route path="/productos" element={<Productos />} />
    <Route path="/detalles/:id" element={<DetalleProducto />} />
    <Route path="/servicios" element={<Servicios />} />
    <Route path="/detalle/:id" element={<DetallesServicio />} />
    <Route path="/detalles/:id/opcionpago" element={<OpcionPagoD />} />
    <Route path="/detalle/:id/opcionpagos" element={<OpcionPagoD />} />
    <Route path="/error400" element={<PaginaError400 />} />  
    <Route path="/error500" element={<PaginaError500j />} /> 
    <Route path="/simularError500" element={<SimularError />} /> 
    <Route path="/resultados" element={<ResultadosBusqueda />} />
    <Route path="/mapasitio" element={<MapaSitio />} />
    <Route path="/ayuda" element={<Ayuda />} />
    <Route path="/chats" element={<ChatGPT/>} />
    <Route path="/citasCliente" element={<CitasCliente/>} />
    <Route path="/carrito" element={<Carrito/>} />
    <Route path="/misionview" element={<MisionView/>} />
    <Route path="/visionview" element={<VisionView/>} />
    <Route path="/opcionrestaurarpassw" element={<OpcionesRestauracion/>} />
    <Route path="/verificacionUserp" element={<VerificacionUsuario/>} />
    <Route path="/respuestaPregunta" element={<RespuestaPregunta/>} />
    <Route path="/cambiopasswordP" element={<CambioPasswordP/>} />
    <Route path="/verificarUserSMS" element={<VerificacionUsuarioSMS/>} />
    <Route path="/validarcodigoSMS" element={<ValidarCodigoSMS/>} />

    <Route path="/paypal" element={<PayPal/>} />
    <Route path="/pago-servicio/paypal" element={<PayPalServicio/>} />
    <Route path="/metodo" element={<OpcionPago/>} />
    <Route path="/mastercard" element={<MasterCard/>} />
    <Route path="/mercadopago" element={<MercadoPago/>} />
    <Route path="/pago-servicio/mercadopago" element={<MercadoPagoServicio/>} />
    <Route path="/pago/resultado" element={<PagoCorrectoMercado />} />
    <Route path="/metodoServicios" element={<MetodoPagoServicios />} />

    <Route path="*" element={<PaginaError404 />} />  
  </Routes>
);

export default AppRouter;
