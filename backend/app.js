// Importo todo lo de la libreria de Express
import express from "express";
import productsRoutes from "./src/routes/products.js";
import customersRoutes from "./src/routes/customers.js";
import employeeRoutes from "./src/routes/employees.js";
import branchesRoutes from "./src/routes/branches.js";
import reviewRoutes from "./src/routes/reviews.js";
import registerEmployeesRoutes from "./src/routes/registerEmployee.js";
import cookieParser from "cookie-parser";
import loginRoute from "./src/routes/login.js";
import logoutRoute from "./src/routes/logout.js";
import registerClientsRouter from "./src/routes/registerClients.js";
import recoveryPasswordRoutes from "./src/routes/recoveryPassword.js";
import providersRoutes from "./src/routes/providers.js";
import brandRoutes from "./src/routes/brand.js";
import{validateAuthToken} from "./src/middlewares/validateAuthToken.js"
import cors from "cors"
import tasksRoutes from "./src/routes/tasks.js";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";

// Creo una constante que es igual a la libreria que importé
const app = express();
//s
//Que acepte datos en json
app.use(express.json());
// Para que postman guarde el token en una cookie
app.use(cookieParser());

// Definir las rutas de las funciones que tendrá la página web

app.use(
    cors({
        origin: "https://ferreteria-jaime15.vercel.app",
            // Permitir envío de cookies y credenciales
        credentials : true
    })
);
const swaggerDocument = JSON.parse(
    fs.readFileSync(path.resolve("./documentacion.json"), "utf-8")
  );
  
app.use("/api/docs",swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/products",/*validateAuthToken(["admin", "employee"]),*/ productsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/employee",/*validateAuthToken(["admin", "employee"]),*/  employeeRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/reviews", reviewRoutes);

app.use("/api/registerEmployee",/*vvalidateAuthToken(["admin"]),*/   registerEmployeesRoutes);
app.use("/api/login", loginRoute);
app.use("/api/logout", logoutRoute);

app.use("/api/registerClients", registerClientsRouter);

app.use("/api/RecoveryPassword", recoveryPasswordRoutes);

app.use("/api/providers", /*validateAuthToken(["admin"]),*/ providersRoutes);
app.use("/api/brand",brandRoutes );
app.use ("/api/tasks",tasksRoutes)
// Exporto la constante para poder usar express en otros archivos
export default app;
