import LabelCalendar from "../models/LabelCalendar";
import EventCalendar from "../models/EventCalendar";

export const getLabels = async (req, res) => {
  const { usuario } = req.params;
  try {
    const labels = await LabelCalendar.find({}, {
      createdAt: 0,
      updatedAt: 0,
      usuario: 0
    }).where('usuario').equals(usuario);
    const labelsARetornar = labels.map(({ _id, title, color }) => ({ id: _id, title: title, color: color }));
    return res.json(labelsARetornar);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  };
};

export const addLabel = async (req, res) => {
  const label = JSON.parse(req.body.datos);
  try {
    const newLabel = new LabelCalendar(label);
    await newLabel.save();
    const labelARetornar = { id: newLabel._id, title: newLabel.title, color: newLabel.color };
    return res.json(labelARetornar);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  };
};

export const updateLabel = async (req, res) => {
  const label = JSON.parse(req.body.datos);
  const { id } = req.params;
  try {
    const updatedLabel = await LabelCalendar.findByIdAndUpdate(
      id,
      { $set: label },
      {
        new: true,
      }
    );
    if (!updatedLabel) return res.sendStatus(404);
    await updatedLabel.save();
    const updatedLabelARetornar = { id: updatedLabel._id, title: updatedLabel.title, color: updatedLabel.color };
    return res.json(updatedLabelARetornar);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  };
};

export const removeLabel = async (req, res) => {
  const { id } = req.params;
  try {
    const label = await LabelCalendar.findByIdAndDelete(id);
    if (!label) return res.sendStatus(404);
    await EventCalendar.deleteMany({ label: id }).where('usuario').equals(label.usuario);
    res.status(200).send({ message: "Etiqueta eliminada con éxito." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  };
};

export const getEvents = async (req, res) => {
  const { usuario } = req.params;
  try {
    const events = await EventCalendar.find({}, {
      createdAt: 0,
      updatedAt: 0,
      usuario: 0
    }).where('usuario').equals(usuario);
    const eventsARetornar = events.map(({ _id, title, allDay, start, end, desc, label }) => ({
      id: _id,
      title: title,
      allDay: allDay,
      start: start,
      end: end,
      extendedProps: {
        desc: desc,
        label: label
      }
    }));
    return res.json(eventsARetornar);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  };
};

export const addEvent = async (req, res) => {
  const event = JSON.parse(req.body.datos);
  try {
    const newEvent = new EventCalendar(event);
    await newEvent.save();
    const newEventARetornar = {
      id: newEvent._id,
      title: newEvent.title,
      allDay: newEvent.allDay,
      start: newEvent.start,
      end: newEvent.end,
      extendedProps: {
        desc: newEvent.desc,
        label: newEvent.label
      }
    };
    return res.json(newEventARetornar);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  };
};

export const updateEvent = async (req, res) => {
  const event = JSON.parse(req.body.datos);
  const { id } = req.params;
  try {
    const updatedEvent = await EventCalendar.findByIdAndUpdate(
      id,
      { $set: event },
      {
        new: true,
      }
    );
    if (!updatedEvent) return res.sendStatus(404);
    await updatedEvent.save();
    const updatedEventARetornar = {
      id: updatedEvent._id,
      title: updatedEvent.title,
      allDay: updatedEvent.allDay,
      start: updatedEvent.start,
      end: updatedEvent.end,
      extendedProps: {
        desc: updatedEvent.desc,
        label: updatedEvent.label
      }
    };
    return res.json(updatedEventARetornar);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  };
};

export const removeEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await EventCalendar.findByIdAndDelete(id);
    if (!event) return res.sendStatus(404);
    res.status(200).send({ message: "Evento eliminado con éxito." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  };
};

export const getEventsDia = async (req, res) => {
  const { usuario } = req.params;
  const hoy = new Date();
  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  const primerDiaMesVar = primerDiaMes.toISOString().split('T')[0];
  const ultimoDiaMesVar = ultimoDiaMes.toISOString().split('T')[0];
  try {
    const eventsParaFiltrar = await EventCalendar.find({
      $and: [
        {
          start: {
            $gte: `${primerDiaMesVar}T00:00:00.000Z`
          }
        },
        {
          end: {
            $lt: `${ultimoDiaMesVar}T23:59:59.999Z`
          }
        }]
    }, {
      usuario: 0,
      allDay: 0,
      desc: 0,
      label: 0,
      createdAt: 0,
      updatedAt: 0
    }).where('usuario').equals(usuario);
    let eventsFiltrados = [];
    eventsParaFiltrar.map((event) => {
      if (hoy > new Date(event.start) && hoy < new Date(event.end)) {
        eventsFiltrados.push(event);
      };
    });
    const eventsARetornar = eventsFiltrados.map(({ _id, title }) => ({
      id: _id,
      title: title
    }));
    return res.json(eventsARetornar);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  };
};

export const getEventsMes = async (req, res) => {
  const { usuario } = req.params;
  const hoy = new Date();
  const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  const hoyVar = hoy.toISOString().split('T')[0];
  const ultimoDiaMesVar = ultimoDiaMes.toISOString().split('T')[0];
  try {
    const events = await EventCalendar.find({
      $and: [
        {
          start: {
            $gte: `${hoyVar}T00:00:00.000Z`
          }
        },
        {
          end: {
            $lt: `${ultimoDiaMesVar}T23:59:59.999Z`
          }
        }]
    }, {
      usuario: 0,
      title: 0,
      allDay: 0,
      desc: 0,
      label: 0,
      createdAt: 0,
      updatedAt: 0
    }).where('usuario').equals(usuario);
    const eventsARetornar = events.map(({ _id }) => ({
      id: _id
    }));
    return res.json(eventsARetornar);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  };
};