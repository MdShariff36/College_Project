package com.carrental.controller;

import com.carrental.util.DBConnection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.sql.*;

@WebServlet("/api/car")
public class CarDetailsServlet extends HttpServlet {

    // GET /api/car?id=123
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String idParam = req.getParameter("id");
        resp.setContentType("application/json; charset=UTF-8");

        if (idParam == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"Missing id parameter\"}");
            return;
        }

        int id;
        try { id = Integer.parseInt(idParam); }
        catch (NumberFormatException ex) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"Invalid id\"}");
            return;
        }

        String sql = "SELECT id, make, model, year, fuel, price, features, image, location, status FROM cars WHERE id = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    resp.getWriter().write("{\"error\":\"Car not found\"}");
                    return;
                }
                // build JSON manually
                StringBuilder sb = new StringBuilder();
                sb.append("{");
                sb.append("\"id\":").append(rs.getInt("id")).append(",");
                sb.append("\"make\":\"").append(escape(rs.getString("make"))).append("\",");
                sb.append("\"model\":\"").append(escape(rs.getString("model"))).append("\",");
                sb.append("\"year\":").append(rs.getInt("year")).append(",");
                sb.append("\"fuel\":\"").append(escape(rs.getString("fuel"))).append("\",");
                sb.append("\"price\":").append(rs.getDouble("price")).append(",");
                sb.append("\"features\":\"").append(escape(rs.getString("features"))).append("\",");
                sb.append("\"image\":\"").append(escape(rs.getString("image"))).append("\",");
                sb.append("\"location\":\"").append(escape(rs.getString("location"))).append("\",");
                sb.append("\"status\":\"").append(escape(rs.getString("status"))).append("\"");
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
