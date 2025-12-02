package com.carrental.controller;

import com.carrental.util.DBConnection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.sql.*;

@WebServlet("/api/profile")
public class ProfileServlet extends HttpServlet {

    // GET /api/profile -> returns profile JSON based on session userId
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        resp.setContentType("application/json; charset=UTF-8");

        Integer userId = null;
        if (session != null && session.getAttribute("userId") != null) {
            userId = (Integer) session.getAttribute("userId");
        } else {
            // fallback to query param (not recommended)
            String uid = req.getParameter("userId");
            if (uid != null) {
                try { userId = Integer.parseInt(uid); } catch (NumberFormatException ignored) {}
            }
        }

        if (userId == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"error\":\"Not authenticated\"}");
            return;
        }

        String sql = "SELECT id, name, email, phone FROM users WHERE id = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    resp.getWriter().write("{\"error\":\"User not found\"}");
                    return;
                }
                StringBuilder sb = new StringBuilder();
                sb.append("{");
                sb.append("\"id\":").append(rs.getInt("id")).append(",");
                sb.append("\"name\":\"").append(escape(rs.getString("name"))).append("\",");
                sb.append("\"email\":\"").append(escape(rs.getString("email"))).append("\",");
                sb.append("\"phone\":\"").append(escape(rs.getString("phone"))).append("\"");
                sb.append("}");
                resp.getWriter().write(sb.toString());
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\":\"internal\"}");
        }
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("\\","\\\\").replace("\"","\\\"");
    }
}
