require("dotenv").config();
const router = require("express").Router();
const { fork } = require("child_process");
const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const flash = require("express-flash");
const yargs = require("yargs/yargs")(process.argv.slice(2));
const cluster = require("cluster");
const main = require("./controllers/main.js");
const multer = require("multer");
const logger = require("./utils/logger.js");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const {  createUser, findUser } = require("../controllers/usuarios.js");
const { listAll,randomize } = require("../controllers/productos.js");
const { getAllChats } = require("../controllers/chats.js");
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const mongoUrl = process.env.MONGOURL;
const userHandler = require("./classes/userH.js");
const usr = new userHandler(mongoUrl);
const { iniciarServidorFirebase, connectDB } = require("./config.js");
app.engine(
  "hbs",
  engine({
    defaultLayout: false,
  })
);

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGOURL,
      mongoOptions: advancedOptions,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const initializePassport = require("./config/passport.js");
initializePassport(
  passport,
  (email) => usr.findUserByMail(email),
  (id) => usr.findUserById(id)
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./publiv/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

function auth(req, res, next) {
  if (req.user) {
    return next();
  } else {
    return res.redirect("/login");
  }
}
function notAuth(req, res, next) {
  if (req.user) {
    return res.redirect("/");
  } else {
    return next();
  }
}

const iniciarServidor = async () => {
  try {
    iniciarServidorFirebase();
    connectDB().then(logger.info("MongoDb se encuentra conectado"));
    const server = app.listen(PORT, () => {
      logger.info(
        `Servidor Express iniciado en modo ${mode} escuchando en el puerto ${
          server.address().port
        } - Proceso N°: ${process.pid} `
      );
    });
    server.on("error", (error) => logger.error(`Error en servidor ${error}`));
  } catch (error) {
    logger.error(error);
  }
};

const { PORT, mode } = yargs
  .alias({
    p: "PORT",
    m: "mode",
  })
  .default({
    PORT: process.env.PORT || 8080,
    mode: "FORK",
  }).argv;

if (mode == "CLUSTER") {
  if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    
    logger.info(`Proceso Maestro: ${process.pid}`);
    cluster.on("exit", (worker, code, signal) => {
      logger.info(`el worker ${worker.process.pid} se ha cerrado`);
    });
  } else {
    iniciarServidor();
  }
} else {
  iniciarServidor();
}

const usuariosRuta = require("./routes/user.js");
const productosRuta = require("./routes/product.js");
const carritoRuta = require("./routes/cart.js");
app.use("/api/productos", productosRuta);
app.use("/api/carrito", carritoRuta);
app.use("/api/usuarios", usuariosRuta);

app.get("/", auth, main.main);

app.get("/login", notAuth, main.loginGet);

app.post(
  "/login",
  notAuth,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.post('/purchase', auth, (req, res) => {
  main.notifyPurchase(req.body)
} )

router.get("/exit", (req, res) => {
  logger.info(`ruta: '/exit' - método: get peticionada`);
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// app.get("/register", notAuth, main.registerGet);
router.get("/register", notAuth, (req, res) => {
  logger.info(`ruta: '/register' - método: get peticionada`);
  res.render("register", { titulo: "Sing In" });
});

//app.post("/register", notAuth, upload.single("avatar"), main.registerPost);
router.get("/register", notAuth, (req, res) => {
  logger.info(`ruta: '/register' - método: get peticionada`);
  res.render("register", { titulo: "Registro de usuario nuevo" });
});

router.post("/register", notAuth, async (req, res) => {
  logger.info(`ruta: '/register' - método: post peticionada`);
  if ((await findUser(req.body.email)) !== null) {
    res.render("register", {
      titulo: "Registro de usuario nuevo",
      error: "El usuario ya existe",
    });
  } else {
    try {
      createUser(req.body);
      res.redirect("/login");
    } catch (error) {
      console.log(error);
      res.redirect("/register");
    }
  }
});

app.get("/logout", auth, (req, res) => {
  logger.info(`ruta: '/logout' - método: get peticionada`);
  res.render("logout", { nombre: req.user.nombre, titulo: "cierre de sesión" });
});

app.get("*", main.notFound);

router.get("/", auth, async (req, res) => {
  logger.info(`ruta: '/' - método: get peticionada`);
  res.render("main", {
    email: req.user.email,
    titulo: "Home",
    lista: listAll(),
    mensajes: getAllChats(),
  });
});

router.get("/info", auth, (req, res) => {
  logger.info(`ruta: '${req.url}' - método: get peticionada`);
  res.render("info", { titulo: "Info del Proceso" });
});

router.get('/api/productos-test', async (req, res) => {
  logger.info(`ruta: '${req.url}' - método: get peticionada`);
  const {cant} = req.query
  res.render("test",{
    titulo: "TEST",
    lista: await randomize(parseInt(cant))
  })
})
