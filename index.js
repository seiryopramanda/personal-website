const express = require("express");

const dbPool = require("./src/connection/index");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const upload = require("./src/middlewares/uploadFile");

const app = express();
const port = 3000;

// Sequelize config
const { development } = require("./src/config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const SequelizePool = new Sequelize(development);

// middleware session
app.use(
  session({
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 2 * 60 * 60 * 1000,
    },
    resave: false,
    store: session.MemoryStore(),
    secret: "session_storage",
    saveUninitialized: true,
  })
);
app.use(flash());

// Use handlebars for template engine
app.set("view engine", "hbs");
app.set("views", "src/views");

app.use("/assets", express.static("src/assets"));
app.use("/uploads", express.static("src/uploads"));
app.use(express.urlencoded({ extended: false }));

app.get("/register", formRegister);
app.post("/register", addRegister);
app.get("/login", formLogin);
app.post("/login", isLogin);
app.get("/logout", logout);

app.get("/", home);
app.get("/project", project);
app.get("/project-detail/:id", projectDetail);
app.get("/testimonial", testimonial);
app.get("/contact", contact);
app.post("/project", upload.single("image"), handlePostProject);
app.get("/delete/:id", handleDeleteProject);
app.get("/edit-project/:id", editProject);
app.post("/edit-project/:id", upload.single("image"), editPostProject);

const data = [];
const hbs = require("hbs");
const Handlebars = require("handlebars");

hbs.registerHelper("isChecked", (tech, value) => {
  return Array.isArray(tech) && tech.includes(value) ? "checked" : "";
});

Handlebars.registerHelper("isArray", function (value) {
  return Array.isArray(value);
});

function formRegister(req, res) {
  res.render("register", {
    title: "Register",
    isLogin: req.session.isLogin,
    user: req.session.user,
  });
}

async function addRegister(req, res) {
  try {
    const { name, email, password } = req.body;
    const salt = 10;

    bcrypt.hash(password, salt, async (err, hashPasword) => {
      await SequelizePool.query(
        `INSERT INTO users (name, email, password, "createdAt", "updatedAt") 
        VALUES ('${name}','${email}','${hashPasword}', NOW(), NOW())`
      );
    });
    req.flash(
      "success",
      "Congratulations! Your account has been successfully registered. Please login to access the website."
    );
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
}

function formLogin(req, res) {
  const logoutMessage = req.query.logout;

  res.render("login", {
    title: "Login",
    logoutMessage,
    isLogin: req.session.isLogin,
    user: req.session.user,
  });
}

async function isLogin(req, res) {
  try {
    const { email, password } = req.body;

    const checkEmail = await SequelizePool.query(
      `SELECT * FROM users WHERE email = '${email}'`,
      { type: QueryTypes.SELECT }
    );

    if (!checkEmail.length) {
      req.flash("failed", "Email is not register");
      return res.redirect("/login");
    }

    bcrypt.compare(password, checkEmail[0].password, function (err, result) {
      if (!result) {
        return res.redirect("/login");
      } else {
        req.session.isLogin = true;
        req.session.user = checkEmail[0].name;
        req.session.idUser = checkEmail[0].id;

        req.flash(
          "success",
          "Congratulations! You've successfully logged in to the website. Welcome back!"
        );
        return res.redirect("/");
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function home(req, res) {
  try {
    let projectNew;

    if (req.session.isLogin) {
      const author = req.session.idUser;

      projectNew = await SequelizePool.query(
        `SELECT projects.id, projects.title, projects.duration, projects.description, projects.tech, projects.image, 
     users.name AS author FROM projects INNER JOIN users ON projects.author = users.id WHERE author = '${author}' ORDER BY projects.id DESC`,
        { type: QueryTypes.SELECT }
      );
    } else {
      projectNew = await SequelizePool.query(
        `SELECT projects.id, projects.title, projects.duration, projects.description, projects.tech, projects.image,
    users.name AS author FROM projects INNER JOIN users ON projects.author = users.id ORDER BY projects.id DESC`,
        { type: QueryTypes.SELECT }
      );
    }

    const data = projectNew.map((res) => ({
      ...res,
      isLogin: req.session.isLogin,
    }));

    res.render("index", {
      data,
      title: "Home",
      isLogin: req.session.isLogin,
      user: req.session.user,
    });
  } catch (error) {
    throw error;
  }
}

function project(req, res) {
  res.render("project", {
    title: "Add Project",
    isLogin: req.session.isLogin,
    user: req.session.user,
  });
}

async function handlePostProject(req, res) {
  try {
    const { title, start_date, end_date, description, tech } = req.body;
    const image = req.file.filename;
    const author = req.session.idUser;

    const dateOne = new Date(start_date);
    const dateTwo = new Date(end_date);
    const time = Math.abs(dateTwo - dateOne);
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const months = Math.floor(time / (1000 * 60 * 60 * 24 * 30));
    const years = Math.floor(time / (1000 * 60 * 60 * 24) / 365);

    let duration = [];
    if (days < 24) {
      duration += days + " Days";
    } else if (months < 12) {
      duration += months + " Month";
    } else if (years < 365) {
      duration += years + " Years";
    }

    await SequelizePool.query(
      `INSERT INTO projects(title, start_date, end_date, duration, description, author, tech, image, "createdAt", "updatedAt") 
      VALUES ('${title}','${start_date}','${end_date}', '${duration}', '${description}','${author}','{${tech}}','${image}',NOW(), NOW())`
    );

    res.redirect("/");
  } catch (error) {
    throw error;
  }
}

async function projectDetail(req, res) {
  const { id } = req.params;
  const projectDetail = await SequelizePool.query(
    `SELECT projects.*, users.name AS author FROM projects INNER JOIN users ON projects.author = users.id WHERE projects.id = ${id}`
  );

  console.log(projectDetail);

  res.render("project-detail", {
    data: projectDetail[0][0],
    title: "Detail Project",
    isLogin: req.session.isLogin,
    user: req.session.user,
  });
}

async function editProject(req, res) {
  const { id } = req.params;
  const editProject = await SequelizePool.query(
    `SELECT * FROM projects WHERE id = ${id} `
  );

  res.render("edit-project", {
    data: editProject[0][0],
    title: "Edit My Project",
    isLogin: req.session.isLogin,
    user: req.session.user,
  });
}

async function editPostProject(req, res) {
  try {
    const { id } = req.params;
    const { title, start_date, end_date, description, tech } = req.body;

    // Check if a file is uploaded
    if (req.file) {
      const image = req.file.filename;

      const dateOne = new Date(start_date);
      const dateTwo = new Date(end_date);
      const time = Math.abs(dateTwo - dateOne);
      const days = Math.floor(time / (1000 * 60 * 60 * 24));
      const months = Math.floor(time / (1000 * 60 * 60 * 24 * 30));
      const years = Math.floor(time / (1000 * 60 * 60 * 24) / 365);
      let duration = [];
      if (days < 24) {
        duration += days + " Days";
      } else if (months < 12) {
        duration += months + " Month";
      } else if (years < 365) {
        duration += years + " Years";
      }

      await SequelizePool.query(
        `UPDATE projects SET title='${title}', start_date='${start_date}', end_date='${end_date}', 
        description='${description}',"updatedAt"=now(), duration='${duration}', tech='{${tech}}', image='${image}' WHERE id = ${id}`
      );

      res.redirect("/");
    } else {
      // Handle the case when no file is uploaded
      req.flash("failed", "Please upload an image");
      res.redirect(`/edit-project/${id}`);
    }
  } catch (error) {
    throw error;
  }
}

async function handleDeleteProject(req, res) {
  try {
    const { id } = req.params;
    await SequelizePool.query(`DELETE FROM projects WHERE id = ${id}`);

    res.redirect("/");
  } catch (error) {
    throw error;
  }
}

function testimonial(req, res) {
  res.render("testimonial", {
    title: "Testimonials",
    isLogin: req.session.isLogin,
    user: req.session.user,
  });
}

function contact(req, res) {
  res.render("contact", {
    title: "Contact Me",
    isLogin: req.session.isLogin,
    user: req.session.user,
  });
}

function logout(req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login?logout=success");
    }
  });
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
