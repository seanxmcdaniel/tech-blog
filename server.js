const path = require ("path");
const express = require ("express");
const session = require ("express-session");
const helpers = require ("./utils/helpers");
const exphbs = require ("express-handlebars");

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require ("./config/connection");
const SequelizeStore = require ("connect-session-sequelize")
(session.Store);

const sess = {
    secret: 'Super Duper Secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    }),
};

app.use(session(sess));

const hbars = exphbs.create ({ helpers });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", hbars.engine);
app.set("view engine", "handlebars");

app.use(require('./controllers/'));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
    sequelize.sync({ force: false });
});
  