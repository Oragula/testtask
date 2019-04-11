package dba;

import entities.User;
import entities.VideoRecord;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class DBUtils {

    private static SqlSession getSession() throws IOException {
        SqlSession session = null;
        String resource = "SqlMapConfig.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        session = sqlSessionFactory.openSession();
        return session;
    }

    public static User checkUser(String login){
        SqlSession session = null;
        User user = null;
        try {
            session = getSession();
            user = session.selectOne("mappers.getUser", login);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }
        return user;
    }

    public static int getNumberOfPages(HashMap<String,Object> map) {
        int count = 0;

        SqlSession session = null;
        try {
            session = getSession();
            count = session.selectOne("mappers.getCountOfRecords", map);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }

        return count;
    }

/*    public static List<VideoRecord> getAllRecords(int start, int numberOfRecords) {
        List<VideoRecord> list = new ArrayList<>();
        HashMap<String, Integer> map = new HashMap <>();
        map.put("start",start);
        map.put("number",numberOfRecords);
        SqlSession session = null;
        try {
            session = getSession();
            list = session.selectList("mappers.getListOfRecords", map);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }

        return list;
    }*/

    public static boolean addRecord(VideoRecord record){
        SqlSession session = null;
        int id=0;
        try {
            session = getSession();
            id = session.insert("mappers.addVideoRecord", record);
            session.commit();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }
        if (id != 0) return true;
        else return false;
    }

    public static boolean deleteRecord(int id){
        SqlSession session = null;
        int i=0;
        try {
            session = getSession();
            i = session.delete("mappers.deleteVideoRecord", id);
            session.commit();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }
        if (i != 0) return true;
        else return false;
    }

    public static VideoRecord chooseRecord(int id) {
        List<VideoRecord> list = new ArrayList<>();
        VideoRecord videoRecord = null;

        SqlSession session = null;
        try {
            session = getSession();
            list = session.selectList("mappers.getChosenRecord", id);
            videoRecord = list.get(0);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }

        return videoRecord;
    }

    public static boolean editRecord(VideoRecord record){
        SqlSession session = null;
        int id=0;
        try {
            session = getSession();
            id = session.update("mappers.editVideoRecord", record);
            session.commit();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }
        if (id != 0) return true;
        else return false;
    }

    public static List<VideoRecord> getDesiredRecords(HashMap<String,Object> map) {
        List<VideoRecord> list = new ArrayList<>();

        SqlSession session = null;
        try {
            session = getSession();
            list = session.selectList("mappers.getDesiredListOfRecords", map);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }

        return list;
    }
}
