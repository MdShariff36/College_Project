package com.carrental.dao;

import com.carrental.model.Booking;
import com.carrental.util.DBConnection;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class BookingDAO {

    /**
     * Check if a car is available for the requested interval.
     * Returns true if available (i.e. no overlapping booking).
     */
    public boolean isCarAvailable(int carId, LocalDateTime start, LocalDateTime end) {
        String sql = "SELECT COUNT(*) FROM bookings WHERE car_id = ? AND NOT (end_ts <= ? OR start_ts >= ?)";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, carId);
            ps.setTimestamp(2, Timestamp.valueOf(start)); // end <= start?
            ps.setTimestamp(3, Timestamp.valueOf(end));   // start >= end?
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    int cnt = rs.getInt(1);
                    return cnt == 0;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Create booking and return generated id (or -1 on failure).
     */
    public int createBooking(Booking b) {
        String sql = "INSERT INTO bookings (user_id, car_id, start_ts, end_ts) VALUES (?, ?, ?, ?)";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, b.getUserId());
            ps.setInt(2, b.getCarId());
            ps.setTimestamp(3, Timestamp.valueOf(b.getStart()));
            ps.setTimestamp(4, Timestamp.valueOf(b.getEnd()));
            int rows = ps.executeUpdate();
            if (rows == 0) return -1;
            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) return keys.getInt(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return -1;
    }

    /**
     * Get bookings for a user (most recent first)
     */
    public List<Booking> getBookingsByUser(int userId) {
        List<Booking> list = new ArrayList<>();
        String sql = "SELECT id, user_id, car_id, start_ts, end_ts FROM bookings WHERE user_id = ? ORDER BY start_ts DESC";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Booking b = new Booking();
                    b.setId(rs.getInt("id"));
                    b.setUserId(rs.getInt("user_id"));
                    b.setCarId(rs.getInt("car_id"));
                    b.setStart(rs.getTimestamp("start_ts").toLocalDateTime());
                    b.setEnd(rs.getTimestamp("end_ts").toLocalDateTime());
                    list.add(b);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }
}
