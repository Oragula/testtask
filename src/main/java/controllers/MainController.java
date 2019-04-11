package controllers;

import dba.DBUtils;
import entities.User;
import entities.VideoRecord;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@Controller
public class MainController {
    private String loginMessage = null;
    private String visibility = null;

    public void setLoginMessage(String loginMessage) {
        this.loginMessage = loginMessage;
    }

    @RequestMapping(value = "/")
    public String start(HttpSession session){
        if (session.getAttribute("user") != null ) return "redirect:main";
        else {
            session.setAttribute("user", new User());
            return "redirect:login";
        }
    }

    @RequestMapping("main")
    public String showMain(HttpSession session, Model model){
        if (session.getAttribute("user")!=null && ((User)session.getAttribute("user")).getLogin() != null){
            model.addAttribute("newVideoRecord", new VideoRecord());
            model.addAttribute("editedVideoRecord", new VideoRecord());
            return "main";
        }
        else {
            loginMessage = "You had not authorised";
            return "redirect:login";
        }
    }

    @RequestMapping("login")
    public String showLogin(Model model){
        if (loginMessage !=null) model.addAttribute("loginMessage", loginMessage);
        return "login";
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)
    public String exit(HttpSession session, Model model){
        session.invalidate();
        model.asMap().clear();
        loginMessage = null;
        visibility = null;
        return "redirect:/";
    }

    @RequestMapping(value = "main", method = RequestMethod.POST)
    public String showMainPage(@ModelAttribute User sessionUser, HttpSession session, Model model){
        User user = DBUtils.checkUser(sessionUser.getLogin());
        if (user !=null && user.getPassword().equals(DigestUtils.md5DigestAsHex((DigestUtils.md5DigestAsHex(sessionUser.getPassword().getBytes())+user.getSalt()).getBytes()))) {
            session.setMaxInactiveInterval(3600);
            model.addAttribute("newVideoRecord", new VideoRecord());
            model.addAttribute("editedVideoRecord", new VideoRecord());
            if (user.isAdmin()) {
                sessionUser.setAdmin(true);
                visibility = "visible";
            }
            else visibility = "hidden";
            session.setAttribute("visibility", visibility);
            session.setAttribute("user", user);
            return "main";
        }
        else {
            loginMessage = "This user doesn't exist in DB";
            return "redirect:login";
        }
    }

}
