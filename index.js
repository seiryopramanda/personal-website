const express = require("express");

const app = express();
const port = 3000;

// Use handlebars for template engine
app.set("view engine", "hbs");
app.set("views", "src/views");

app.use("/assets", express.static("src/assets"));

app.get("/", home);
app.get("/project", project);
app.get("/project-detail/:id", projectDetail);
app.get("/testimonial", testimonial);
app.get("/contact", contact);

function home(req, res) {
  const data = [
    {
      id: 1,
      name: "Project 1",
      description: "This is the first project.",
    },
    {
      id: 2,
      name: "Project 2",
      description: "This is the second project.",
    },
    {
      id: 3,
      name: "Project 3",
      description: "This is the third project.",
    },
  ];
  res.render("index", { data });
}

function project(req, res) {
  res.render("project");
}

function projectDetail(req, res) {
  const { id } = req.params;
  res.render("project-detail", { id });
}

function testimonial(req, res) {
  res.render("testimonial");
}

function contact(req, res) {
  res.render("contact");
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
