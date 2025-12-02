package com.carrental.controller;

import javax.servlet.*;
import javax.servlet.http.*;
import com.carrental.dao.UserDAO;
import com.carrental.model.User;
import java.io.IOException;

public class LoginServlet extends HttpServlet {

    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        String email = req.getParameter("email");
        String pass = req.getParameter("password");

        UserDAO dao = new UserDAO();
        User user = dao.login(email, pass);

        res.setContentType("application/json");

        if (user != null) {
            res.getWriter().write("{\"status\":\"success\",\"name\":\"" + user.getName() + "\"}");
        } else {
            res.getWriter().write("{\"status\":\"fail\"}");
        }
    }
}
