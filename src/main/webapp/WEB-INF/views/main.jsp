<%@ taglib prefix="spring" uri="http://www.springframework.org/tags/form" %>

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>MainPage</title>
    <style><%@include file="/resources/styles.css"%></style>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-latest.min.js"></script>
</head>

<body id="body">

<form method="post" action="/">
    ${user.login} <input type="submit" value="Exit"/>
</form>
<br>

<div class="btn-group" role="group" aria-label="Basic example">
    <form><input id="search" type="button" value="Search"/></form>
    <form><input id="add" type="button" value="Add" style="visibility: ${visibility}"/></form>
    <form><input id="edit" type="button" value="Edit" style="visibility: ${visibility}"/></form>
    <form><input id="remove" type="button" value="Remove" style="visibility: ${visibility}"/></form>
</div>


<div class="row">
    <div class="col-4">
        <div class="list-group" id="list-tab" role="tablist"></div>
    </div>

    <div id = "descDiv" class="col-8">
        <div class="tab-content" id="nav-tabContent"></div>
    </div>

    <div id = "newDiv" class="col-8" style="display: none">
        <h5>Добавление новой записи в базу данных фильмов</h5>
        <spring:form modelAttribute="newVideoRecord">
            <div>Наименование фильма: <spring:input path="name" style='text' size='100'/></div>
            <div>Жанр фильма: <spring:input path="genre" style='text' size='100'/></div>
            <div>Год выхода в прокат: <spring:input path="year" style='text' size='100'/></div>
            <div>Страна производства: <spring:input path="country" style='text' size='100'/></div>
            <div>Ссылка на описание: <spring:input path="descriptionLink" style='text' size='100'/></div>
            <div>Ссылка на фильм: <spring:input path="videoLink" style='text' size='100'/></div>
            <input id='newsave' value='Save' type='button' />
            <input id='newcancel' value='Cancel' type='button' />
        </spring:form>
    </div>

    <div id = "removeDiv" class="col-8" style="display: none">
        <h5>Удаление записи из базы данных </h5>

<%--Вариант удаления без всплывающего окна - соответствует общему стилю--%>
<%--        <form>
            <input id='removesave' value='Yes' type='button' />
            <input id='removecancel' value='Cancel' type='button' />
        </form>--%>
    </div>
    <div id = "editDiv" class="col-8" style="display: none">
        <h5>Редактирование записи в базе данных </h5>
        <spring:form modelAttribute='editedVideoRecord'>
            <div>Наименование фильма: <spring:input path='name' style='text' size='100'/></div>
            <div>Жанр фильма: <spring:input path='genre' style='text' size='100'/></div>
            <div>Год выхода в прокат: <spring:input path='year' style='text' size='100'/></div>
            <div>Страна производства: <spring:input path='country' style='text' size='100'/></div>
            <div>Ссылка на описание: <spring:input path='descriptionLink' style='text' size='100'/></div>
            <div>Ссылка на фильм: <spring:input path='videoLink' style='text' size='100'/></div>
            <input id='editsave' value='Yes' type='button' />
            <input id='editcancel' value='Cancel' type='button' />
        </spring:form>
    </div>
    <div id = "searchDiv" class="col-8" style="display: none">
        <h5>Поиск записи в базе данных </h5>
        <div>Наименование фильма: <input id='name' type='text' size='100'/></div>
        <div>Жанр фильма: <input id='genre' type='text' size='100'/></div>
        <div>Год выхода в прокат: <input id='year' type='text' size='100'/></div>
        <div>Страна производства: <input id='country' type='text' size='100'/></div>
        <div>Ссылка на описание: <input id='descriptionLink' type='text' size='100'/></div>
        <div>Ссылка на фильм: <input id='videoLink' type='text' size='100'/></div>
        <input id='searchsave' value='Search' type='button' />
        <input id='searchcancel' value='Cancel' type='button' />
    </div>
</div>

<br>

<nav aria-label="Page navigation">
    <ul class="pagination justify-content">
        <select id="numberOfRecords" class="page-link" size="1" style="height: 2.4em">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
        </select>
        <li class="page-item disabled"><a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a></li>
        <li class="page-item disabled"><a class="page-link" href="next">Next</a>
        </li>
    </ul>
</nav>

<%--Всплывающее окно REMOVE - в соответствие с ТЗ --%>
<!-- Само окно -->
<div id="boxes">
    <div id="dialog" class="window">
        <div class="top"><h5>Удаление записи из базы данных</h5></div>
        <div class="content">
            <div class="content1"></div>
            <input id='removesave' value='Yes' type='button' />
            <input id='removecancel' value='No' type='button' />
        </div>
    </div>
</div>

<!-- Маска, затемняющая фон -->
<div id="mask"></div>

<script src="resources/script.js"/>

<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</body>
</html>
