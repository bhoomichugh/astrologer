import FollowUp from "../models/FollowUp.js";

const getAstrologerFilter = (user) => {
  return user.role === "admin" ? {} : { astrologerId: user._id };
};

export const getFollowUps = async (req, res, next) => {
  try {
    const filter = { ...getAstrologerFilter(req.user) };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.upcoming === "true") {
      filter.scheduledDate = { $gte: new Date() };
    }

    const followUps = await FollowUp.find(filter)
      .populate("clientId", "name phone")
      .populate("astrologerId", "name")
      .sort({ scheduledDate: 1 });

    res.json(followUps);
  } catch (error) {
    next(error);
  }
};

export const createFollowUp = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      astrologerId: req.user.role === "admin" ? req.body.astrologerId : req.user._id
    };

    const followUp = await FollowUp.create(payload);
    const populatedFollowUp = await followUp.populate([
      { path: "clientId", select: "name phone" },
      { path: "astrologerId", select: "name" }
    ]);

    res.status(201).json(populatedFollowUp);
  } catch (error) {
    next(error);
  }
};

export const updateFollowUp = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id, ...getAstrologerFilter(req.user) };
    const followUp = await FollowUp.findOne(filter);

    if (!followUp) {
      return res.status(404).json({ message: "Follow-up not found" });
    }

    if (req.body.status === "Completed" && followUp.status !== "Completed") {
      req.body.completedDate = new Date();
    }

    const updatedFollowUp = await FollowUp.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true
    })
      .populate("clientId", "name phone")
      .populate("astrologerId", "name");

    res.json(updatedFollowUp);
  } catch (error) {
    next(error);
  }
};

export const deleteFollowUp = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id, ...getAstrologerFilter(req.user) };
    const followUp = await FollowUp.findOneAndDelete(filter);

    if (!followUp) {
      return res.status(404).json({ message: "Follow-up not found" });
    }

    res.json({ message: "Follow-up deleted" });
  } catch (error) {
    next(error);
  }
};
