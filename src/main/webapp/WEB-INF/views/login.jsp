<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <style><%@include file="/resources/styles.css"%></style>
    <title>LoginPage</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
</head>
<body>
    <div class="white"></div>
    <form class="btn-group, pad" action="main" method="post">
        <input type="text" name="login" width="20" autocomplete="on" placeholder="login"/>
        <input type="password" name="password" width="20" autocomplete="off" placeholder="password"/>
        <input type="submit" value="Sign in">
    </form>
    <div class="pad1">
    ${loginMessage}
    </div>
</body>
</html>
