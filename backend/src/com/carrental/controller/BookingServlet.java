package com.carrental.controller;

import com.carrental.dao.BookingDAO;
import com.carrental.model.Booking;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;

@WebServlet("/api/book")
public class BookingServlet extends HttpServlet {

    private final BookingDAO bookingDAO = new BookingDAO();

    // Accepts form-encoded POST: carId, start, end
    // start,end format: "YYYY-MM-DDTHH:MM" or "YYYY-MM-DD HH:MM:SS" — we'll accept LocalDateTime.parse ISO_LOCAL_DATE_TIME
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // Determine userId from session (LoginServlet should set session attribute "userId")
        HttpSession session = req.getSession(false);
        Integer userId = null;
        if (session != null && session.getAttribute("userId") != null) {
            userId = (Integer) session.getAttribute("userId");
        } else {
            // fallback: allow passing userId param (less secure) — frontend ideally logs in and uses session
            String uid = req.getParameter("userId");
            if (uid != null) {
                try { userId = Integer.parseInt(uid); } catch (NumberFormatException ignored) {}
            }
        }

        resp.setContentType("application/json; charset=UTF-8");
        if (userId == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"error\":\"Not authenticated\"}");
            return;
        }

        // read parameters (support both form-post and json-by-body fallback)
        String carIdStr = req.getParameter("carId");
        String startStr = req.getParameter("start");
        String endStr = req.getParameter("end");

        if ((carIdStr == null || startStr == null || endStr == null) && "application/json".equalsIgnoreCase(req.getContentType())) {
            // read JSON body (simple)
            StringBuilder sb = new StringBuilder();
            try (BufferedReader reader = req.getReader()) {
                String line;
                while ((line = reader.readLine()) != null) sb.append(line);
            }
            String body = sb.toString().trim();
            if (!body.isEmpty()) {
                // very small JSON parsing without external libs: look for "carId","start","end"
                carIdStr = extractJsonValue(body, "carId");
                startStr = extractJsonValue(body, "start");
                endStr = extractJsonValue(body, "end");
            }
        }

        if (carIdStr == null || startStr == null || endStr == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"Missing parameters. Required: carId, start, end\"}");
            return;
        }

        int carId;
        try { carId = Integer.parseInt(carIdStr); }
        catch (NumberFormatException ex) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"Invalid carId\"}");
            return;
        }

        LocalDateTime start, end;
        try {
            // accepts ISO_LOCAL_DATE_TIME e.g. 2025-12-31T10:00
            start = LocalDateTime.parse(startStr);
            end = LocalDateTime.parse(endStr);
        } catch (DateTimeParseException e) {
            // allow "yyyy-MM-dd HH:mm:ss"
            try {
                start = LocalDateTime.parse(startStr.replace(' ', 'T'));
                end = LocalDateTime.parse(endStr.replace(' ', 'T'));
            } catch (Exception ex) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"error\":\"Invalid date format. Use ISO local date-time (e.g. 2025-12-31T10:00)\"}");
                return;
            }
        }

        if (!start.isBefore(end)) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"start must be before end\"}");
            return;
        }

        // check availability
        boolean available = bookingDAO.isCarAvailable(carId, start, end);
        if (!available) {
            resp.setStatus(HttpServletResponse.SC_CONFLICT);
            resp.getWriter().write("{\"error\":\"Car not available for selected time\"}");
            return;
        }

        Booking b = new Booking();
        b.setUserId(userId);
        b.setCarId(carId);
        b.setStart(start);
        b.setEnd(end);

        int createdId = bookingDAO.createBooking(b);
        if (createdId > 0) {
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write("{\"bookingId\":" + createdId + "}");
        } else {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\":\"Could not create booking\"}");
        }
    }

    // small helper to extract simple JSON value for a key (handles "key":"value" or "key":123)
    private String extractJsonValue(String json, String key) {
        String pattern = "\"" + key + "\"\\s*:\\s*";
        int idx = json.indexOf("\"" + key + "\"");
        if (idx < 0) return null;
        int colon = json.indexOf(':', idx);
        if (colon < 0) return null;
        int i = colon + 1;
        // skip spaces
        while (i < json.length() && Character.isWhitespace(json.charAt(i))) i++;
        if (i >= json.length()) return null;
        char c = json.charAt(i);
        if (c == '"') {
            int j = json.indexOf('"', i + 1);
            if (j < 0) return null;
            return json.substring(i + 1, j);
        } else {
            // number or unquoted value: read until comma or brace
            int j = i;
            while (j < json.length() && json.charAt(j) != ',' && json.charAt(j) != '}' && json.charAt(j) != '\n') j++;
            return json.substring(i, j).trim().replaceAll("\"", "");
        }
    }
}
