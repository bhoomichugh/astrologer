import Appointment from "../models/Appointment.js";
import Client from "../models/Client.js";
import Consultation from "../models/Consultation.js";
import FollowUp from "../models/FollowUp.js";
import Lead from "../models/Lead.js";
import Payment from "../models/Payment.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const clientFilter = req.user.role === "admin" ? {} : { assignedAstrologer: req.user._id };
    const consultationFilter = req.user.role === "admin" ? {} : { astrologerId: req.user._id };
    const appointmentFilter = req.user.role === "admin" ? {} : { astrologerId: req.user._id };
    const followUpFilter = req.user.role === "admin" ? {} : { astrologerId: req.user._id };

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalClients,
      upcomingConsultations,
      completedConsultations,
      pendingConsultations,
      totalRevenue,
      monthlyEarnings,
      todaysAppointments,
      totalLeads,
      convertedLeads,
      pendingPayments,
      upcomingFollowUps
    ] = await Promise.all([
      Client.countDocuments(clientFilter),
      Consultation.countDocuments({
        ...consultationFilter,
        date: { $gte: now },
        status: "Scheduled"
      }),
      Consultation.countDocuments({ ...consultationFilter, status: "Completed" }),
      Consultation.countDocuments({
        ...consultationFilter,
        status: { $in: ["Pending", "Scheduled"] }
      }),
      Payment.aggregate([
        { $match: { status: "Paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]).then((result) => (result.length > 0 ? result[0].total : 0)),
      Payment.aggregate([
        { $match: { status: "Paid", paidAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]).then((result) => (result.length > 0 ? result[0].total : 0)),
      Appointment.countDocuments({
        ...appointmentFilter,
        date: { $gte: startOfToday, $lte: endOfToday }
      }),
      Lead.countDocuments(),
      Lead.countDocuments({ status: "Converted" }),
      Payment.countDocuments({ status: "Pending" }),
      FollowUp.countDocuments({
        ...followUpFilter,
        status: "Pending",
        scheduledDate: { $gte: now }
      })
    ]);

    const conversionRate = totalLeads > 0
      ? Math.round((convertedLeads / totalLeads) * 1000) / 10
      : 0;

    res.json({
      totalClients,
      upcomingConsultations,
      completedConsultations,
      pendingConsultations,
      totalRevenue,
      monthlyEarnings,
      todaysAppointments,
      conversionRate,
      pendingPayments,
      upcomingFollowUps
    });
  } catch (error) {
    next(error);
  }
};
