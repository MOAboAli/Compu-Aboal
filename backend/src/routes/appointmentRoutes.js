const express = require('express');

function createAppointmentRoutes(appointmentAvailabilityController, { requireAuth, requireRoles }) {
  const router = express.Router();
  const staff = [requireAuth, requireRoles('super_admin', 'admin', 'service_manager')];

  router.get('/availability', appointmentAvailabilityController.getAvailability);
  router.get('/blocked-dates', ...staff, appointmentAvailabilityController.listBlocked);
  router.post('/blocked-dates', ...staff, appointmentAvailabilityController.createBlocked);
  router.delete('/blocked-dates/:id', ...staff, appointmentAvailabilityController.deleteBlocked);

  return router;
}

module.exports = createAppointmentRoutes;
