package com.carrental.dao;

import com.carrental.util.DBConnection;
import org.json.JSONArray;
import org.json.JSONObject;
import java.sql.*;

public class CarDAO {

    public String getCarsAsJson() {
        JSONArray arr = new JSONArray();
        String query = "SELECT * FROM cars";

        try (Connection con = DBConnection.getConnection();
             Statement st = con.createStatement();
             ResultSet rs = st.executeQuery(query)) {

            while (rs.next()) {
                JSONObject car = new JSONObject();
                car.put("id", rs.getInt("id"));
                car.put("name", rs.getString("name"));
                car.put("price", rs.getDouble("price"));
                car.put("image", rs.getString("image"));
                arr.put(car);
            }

        } catch (Exception e) { e.printStackTrace(); }

        return arr.toString();
    }
}
