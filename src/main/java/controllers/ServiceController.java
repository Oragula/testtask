package controllers;

import com.google.gson.Gson;
import dba.DBUtils;
import entities.User;
import entities.VideoRecord;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;

@RestController
public class ServiceController {

    @RequestMapping(value = "getNumberOfPages", produces = "plain/text; charset=UTF-8")
    public String getNumberOfPages(@RequestParam(value = "searchString", required = true) String str, @RequestParam(value = "number", required = true) int numberOfRecords, HttpSession session){
        if (session.getAttribute("user")!=null && ((User)session.getAttribute("user")).getLogin() != null) {
            HashMap<String,Object> map = mapFromString(str);
            int countOfRecords = DBUtils.getNumberOfPages(map);
            int numberOfPages = (countOfRecords%numberOfRecords == 0) ? countOfRecords/numberOfRecords : countOfRecords/numberOfRecords+1;
            return numberOfPages+"";
        }
        else return "You had not authorised";
    }

/*    @RequestMapping(value = "list", produces = "application/json; charset=UTF-8")
    public String getList(@RequestParam(value = "page", required = false) int page, @RequestParam(value = "number", required = true) int numberOfRecords, HttpSession session){
        if (session.getAttribute("user")!=null && ((User)session.getAttribute("user")).getLogin() != null) {
            int start = (page-1)*numberOfRecords;
            System.out.println("start: "+start);
            System.out.println("numberOfRecords: "+numberOfRecords);
            List <VideoRecord> list = DBUtils.getAllRecords(start, numberOfRecords);
            String listOfRecords = new Gson().toJson(list);
            return listOfRecords;
        }
        else return "You had not authorised";
    }*/

    @RequestMapping(value = "add", method = RequestMethod.POST, produces = "plain/text; charset=UTF-8")
    public String addRecord(@ModelAttribute("newVideoRecord") VideoRecord record, HttpSession session){
        if (session.getAttribute("user")!=null && ((User)session.getAttribute("user")).isAdmin()) {
            String message;
            if (DBUtils.addRecord(record)) message = "Запись успешно добавлена в базу данных";
            else message = "Не удалось добавить запись в базу данных";
            return message;
        }
        return "You had not authorised or you have no rights for this operation";
    }

    @RequestMapping(value = "remove", method = RequestMethod.POST, produces = "plain/text; charset=UTF-8")
    public String removeRecord(@RequestParam(required = true) int id, HttpSession session){
        if (session.getAttribute("user")!=null && ((User)session.getAttribute("user")).isAdmin()) {
            String message;
            if (DBUtils.deleteRecord(id)) message = "Запись успешно удалена из базы данных";
            else message = "Не удалось удалить запись из базы данных";
            return message;
        }
        return "You had not authorised or you have no rights for this operation";
    }

    @RequestMapping(value = "chooseRecord", produces = "application/json; charset=UTF-8")
    public String chooseRecord(@RequestParam(required = true) int id, HttpSession session){
        if (session.getAttribute("user")!=null && ((User)session.getAttribute("user")).isAdmin()) {
            VideoRecord videoRecord = DBUtils.chooseRecord(id);
            String record = null;
            if (videoRecord !=null) record = new Gson().toJson(videoRecord);
            return record;
        }
        return "You had not authorised or you have no rights for this operation";
    }

    @RequestMapping(value = "editRecord", method = RequestMethod.POST, produces = "plain/text; charset=UTF-8")
    public String editRecord(@ModelAttribute("editedVideoRecord") VideoRecord videoRecord, HttpSession session){
        if (session.getAttribute("user")!=null && ((User)session.getAttribute("user")).isAdmin()) {
            String message;
            if (DBUtils.editRecord(videoRecord)) message = "Запись успешно отредактирована в базе данных";
            else message = "Не удалось отредактировать запись в базе данных";
            return message;
        }
        return "You had not authorised or you have no rights for this operation";
    }

    @RequestMapping(value = "search", produces = "application/json; charset=UTF-8")
    public String getDesiredList(@RequestParam(value = "searchString", required = true) String str, @RequestParam(value = "page", required = true) int page, @RequestParam(value = "number", required = true) int numberOfRecords, HttpSession session){
        if (session.getAttribute("user")!=null && ((User)session.getAttribute("user")).getLogin() != null) {
            System.out.println("-----------------------------"+str+"----------------------------------------------");
            HashMap<String,Object> map = mapFromString(str);
            map.put("number",numberOfRecords);
            int start = (page-1)*numberOfRecords;
            map.put("start",start);
            System.out.println(map);
            List <VideoRecord> list = DBUtils.getDesiredRecords(map);
            System.out.println(list);
            String listOfRecords = new Gson().toJson(list);
            return listOfRecords;
        }
        else return "You had not authorised";
    }

    private HashMap<String,Object> mapFromString(String str){
        String[] array = str.split(" И ");
        HashMap<String, Object> map = new HashMap <>();
        for (String s :array) {
            if (!s.matches(".+=$")) {
                String[] array1 = s.split("=");
                map.put(array1[0],"%"+array1[1]+"%");
            }
            else {
                String param = s.substring(0,s.length()-1);
                map.put(param,null);
            }
        }
        return map;
    }
}
