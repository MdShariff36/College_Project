package com.carrental.controller;

import javax.servlet.*;
import javax.servlet.http.*;
import com.carrental.dao.CarDAO;
import java.io.IOException;

public class CarListServlet extends HttpServlet {

    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        CarDAO dao = new CarDAO();
        String carsJson = dao.getCarsAsJson();

        res.setContentType("application/json");
        res.getWriter().write(carsJson);
    }
}
