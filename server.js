const express = require("express");
const app = express();
const PORT = 3000;

const prisma = require("./prisma");

app.use(express.json());
app.use(require("morgan")("dev"));

app.get("/api/users", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

app.get("/api/places", async (req, res, next) => {
  try {
    const places = await prisma.place.findMany();
    res.json(places);
  } catch (err) {
    next(err);
  }
});

app.get("/api/vacations", async (req, res, next) => {
  try {
    const vacations = await prisma.vacation.findMany();
    res.json(vacations);
  } catch (err) {
    next(err);
  }
});

app.post("/api/users/:id/vacations", async (req, res, next) => {
  try {
    const userId = +req.params.id;
    const { placeId, travelDate } = req.body;
    const vacation = await prisma.vacation.create({
      data: {
        userId,
        placeId,
        travelDate,
      },
    });
    res.json(vacation);
  } catch (err) {
    next(err);
  }
});

app.delete("/api/users/:userId/vacations/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const vacationExists = await prisma.vacation.findFirst({
      where: { id },
    });

    if (!vacationExists) {
      return next({
        status: 404,
        message: `Could not find vacation with id ${id}.`,
      });
    }
    await prisma.vacation.delete({ where: { id } });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

// Simple error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status ?? 500;
  const message = err.message ?? 'Internal server error.';
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
