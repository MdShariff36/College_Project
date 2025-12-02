package com.carrental.controller;

import javax.servlet.*;
import javax.servlet.http.*;
import com.carrental.dao.UserDAO;
import com.carrental.model.User;
import java.io.IOException;

public class SignupServlet extends HttpServlet {

    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        User user = new User();
        user.setName(req.getParameter("name"));
        user.setEmail(req.getParameter("email"));
        user.setPassword(req.getParameter("password"));

        UserDAO dao = new UserDAO();
        boolean saved = dao.register(user);

        res.setContentType("application/json");

        if (saved)
            res.getWriter().write("{\"status\":\"success\"}");
        else
            res.getWriter().write("{\"status\":\"fail\"}");
    }
}
