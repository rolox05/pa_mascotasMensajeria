import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { WelcomeComponent } from "./welcome/welcome.component";
import { NuevaMascotaComponent } from "./mascota/nueva-mascota.component";
import { MascotaComponent } from "./mascota/mascota.component";
import { PerfilComponent } from "./perfil/perfil.component";
import { RegistrarUsuarioComponent } from "./usuario/registrar-usuario.component";
import { MensajeriaComponent } from "./mensajeria/mensajeria.component";
import { UserAuthGuard } from "./mensajeria/mensajeria.guard";

// Route Configuration
export const routes: Routes = [
  { path: "", component: WelcomeComponent },
  { path: "perfilUsuario", component: PerfilComponent },
  { path: "registrarUsuario", component: RegistrarUsuarioComponent },
  { path: "mascotas", component: MascotaComponent },
  { path: "nuevaMascota/:id", component: NuevaMascotaComponent },
  { path: "nuevaMascota", component: NuevaMascotaComponent },
  // rutas de mensajería
  { path: "mensajeria", component: MensajeriaComponent, canActivate: [UserAuthGuard] }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
