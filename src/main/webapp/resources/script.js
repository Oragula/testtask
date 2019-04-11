var chosenRecordId;
var chosenRecordName;
var page = 1;
var selectedNumOfRecords = $('select').val();
var numberOfPages;
var searchString = prepareSearchRequest();

//после загрузки DOM запрашиваем количество страниц отправляя выбранное количество строк на странице
getNumberOfPages(selectedNumOfRecords, searchString);

//после постройки nav грузим и показываем первую страницу
executeQuery(page, selectedNumOfRecords, searchString);

//функция получает от сервера число страниц с учетом заданных условий для поиска, сохраняет его в глобальную переменную numberOfPages, а также сроит nav
function getNumberOfPages(selectedNumOfRecords, searchString){
    $.get("/getNumberOfPages",{'searchString': searchString,"number":selectedNumOfRecords}, function (data) {
        numberOfPages = data;
        //строим nav
        buildNav(numberOfPages);
    });
}

//функция собирающая в строку, формата заданного ТЗ, параметры поиска (всегда собираем их для унификации)
function prepareSearchRequest(){
    var str = 'name='+$('#searchDiv').find('input#name').val() +
        ' И year='+$('#searchDiv').find('input#year').val()+
        ' И genre='+$('#searchDiv').find('input#genre').val()+
        ' И country='+$('#searchDiv').find('input#country').val()+
        ' И descriptionLink='+$('#searchDiv').find('input#descriptionLink').val()+
        ' И videoLink='+$('#searchDiv').find('input#videoLink').val();
    return str;
}

//функция строит nav исходя из полученного количества страниц
function buildNav(numberOfPages) {
    var max=1;
    while ($('nav ul li:eq(1)').find('a').attr('href') != "next") $('nav ul li:eq(1)').remove();
    $('nav ul li:eq(0)').attr('class', 'page-item disabled');
    $('nav ul li:eq(1)').attr('class', 'page-item disabled');
    $('nav ul li:eq(0)').after("<li class=\"page-item active\"><a class=\"page-link\" href=\"1\">1</a></li>");
    if (numberOfPages > 1) {
        $('nav ul li:eq(1)').after("<li class='page-item'><a class='page-link' href='2'>2</a></li>");
        max = 3;
    }
    if (numberOfPages > 2) {
        $('nav ul li:eq(2)').after("<li class='page-item'><a class='page-link' href='3'>3</a></li>");
        max = 4;
    }
    if (numberOfPages > 3) {
        $('nav ul li:eq(4)').attr('class', 'page-item');
        max = 4;
    }

    //устанавливаем обработчики выбора страниц пользователем
    $('nav ul li').slice(1,max).find('a').click(function(event){
        event.preventDefault();
        $('nav ul li').slice(1,max).attr('class', 'page-item');
        $(this).parent().attr('class','page-item active');
        page = $(this).attr('href');
        executeQuery(page,selectedNumOfRecords,searchString);
        return false;
    });
}

//устанавливаем обработчик нажатия кнопки previous секции nav
$('nav ul li:first').click(function (event) {
    event.preventDefault();
    if ($(this).attr('class') != 'page-item disabled') {
        $('nav ul li:eq(4)').attr('class','page-item');
        var x = +($('nav ul li:eq(3)').find('a').attr('href'));
        $('nav ul li:eq(3)').attr('class','page-item');
        $('nav ul li:eq(3)').find('a').attr('href',x-1);
        $('nav ul li:eq(3)').find('a').text(x-1);
        $('nav ul li:eq(2)').attr('class','page-item');
        $('nav ul li:eq(2)').find('a').attr('href',x-2);
        $('nav ul li:eq(2)').find('a').text(x-2);
        $('nav ul li:eq(1)').attr('class','page-item');
        $('nav ul li:eq(1)').find('a').attr('href',x-3);
        $('nav ul li:eq(1)').find('a').text(x-3);
        if ($('nav ul li:eq(1)').find('a').attr('href') == 1) $('nav ul li:eq(0)').attr('class','page-item disabled');
    }
    return false;
});

//устанавливаем обработчик нажатия кнопки next секции nav
$('nav ul li:last').click(function (event) {
    event.preventDefault();
    if ($(this).attr('class') != 'page-item disabled') {
        $('nav ul li:eq(0)').attr('class','page-item');
        var x = +($('nav ul li:eq(1)').find('a').attr('href'));
        $('nav ul li:eq(1)').attr('class','page-item');
        $('nav ul li:eq(1)').find('a').attr('href',x+1);
        $('nav ul li:eq(1)').find('a').text(x+1);
        $('nav ul li:eq(2)').attr('class','page-item');
        $('nav ul li:eq(2)').find('a').attr('href',x+2);
        $('nav ul li:eq(2)').find('a').text(x+2);
        $('nav ul li:eq(3)').attr('class','page-item');
        $('nav ul li:eq(3)').find('a').attr('href',x+3);
        $('nav ul li:eq(3)').find('a').text(x+3);
        if ($('nav ul li:eq(3)').find('a').attr('href') == numberOfPages) $('nav ul li:eq(4)').attr('class','page-item disabled');
    }
    return false;
});

//функция выполняет ajax-запрос, получает указанную страницу из БД в формате json, строит список и описание
function executeQuery(page, selectedNumOfRecords, searchString) {
    $.get("/search", {page: page, number: selectedNumOfRecords, searchString: searchString}, function (responseJson) {
        $('#searchDiv').find('input#name').val('');
        $('#searchDiv').find('input#genre').val('');
        $('#searchDiv').find('input#year').val('');
        $('#searchDiv').find('input#country').val('');
        $('#searchDiv').find('input#descriptionLink').val('');
        $('#searchDiv').find('input#videoLink').val('');
        $('#list-tab').empty();
        $('#nav-tabContent').empty();
        $('#searchDiv').hide();
        showDescDiv(responseJson);
        chosenRecordId = responseJson[0].id;
        chosenRecordName = responseJson[0].name;
        chosenRecord = responseJson[0];
    });
}

//функция строит список и описание в соответствие с принимаемыми данными responseJson
function showDescDiv(responseJson) {
    for (k = 0; k < responseJson.length; k++) {
        $('#list-tab').append("<a class='list-group-item list-group-item-action' id='" + responseJson[k].id + "' data-toggle='list' href='#div"+responseJson[k].id+"' role='tab' aria-controls='settings' data-id='"+responseJson[k].name+"' >"+responseJson[k].id +". "+responseJson[k].name+"</a>");
        $('#nav-tabContent').append("<div class='tab-pane fade' id='div"+responseJson[k].id+"' role='tabpanel' aria-labelledby='list-settings-list'>");
        $('#div'+responseJson[k].id).append("<ul>");
        $('#div'+responseJson[k].id).append("<li>Наименование: " + responseJson[k].name + "</li>");
        $('#div'+responseJson[k].id).append("<li>Жанр: " + responseJson[k].genre + "</li>");
        $('#div'+responseJson[k].id).append("<li>Год выхода в прокат: " + responseJson[k].year + "</li>");
        $('#div'+responseJson[k].id).append("<li>Страна производства: " + responseJson[k].country + "</li>");
        if (responseJson[k].descriptionLink !="") $('#div'+responseJson[k].id).append("<li>Ссылка на описание: <a href='" + responseJson[k].descriptionLink + "' target='_blank'>описание</a></li>"); else $('#div'+responseJson[k].id).append("<li>Ссылка на описание: </li>");
        if (responseJson[k].videoLink !="") $('#div'+responseJson[k].id).append("<li>Ссылка для просмотра: <a href='" + responseJson[k].videoLink + "' target='_blank'>смотреть фильм</a></li>"); else $('#div'+responseJson[k].id).append("<li>Ссылка для просмотра: </li>");
        $('#div'+responseJson[k].id).append("</ul></div>");

        $('#'+responseJson[k].id).click(function () {
            chosenRecordId = this.id;
            chosenRecordName = this.getAttribute('data-id');
            $('#removeDiv').hide();
            $('#newDiv').hide();
            $('#editDiv').hide();
            $('#searchDiv').hide();
            $('#descDiv').show();
        })
    };
    $('#list-tab a:first-child').tab('show'); // Select first tab
}

/*-------------------------------------ADD---------------------------------------------------------------*/
//показ формы добавления новой записи при нажатии кнопки add
$('#add').click(function() {
    $('#descDiv').hide();
    $('#editDiv').hide();
    $('#removeDiv').hide();
    $('#searchDiv').hide();
    $('#newDiv').show();
});

//отправка данных новой записи на сервер и отображение ответа
$('#newsave').click(function () {
    var str = $('#newVideoRecord').serialize();
    $.ajax({
        type: 'POST',
        url: "/add",
        data: str,
        success: (function (data) {
            alert(data);
            $('#newVideoRecord').find('input#name').val('');
            $('#newVideoRecord').find('input#genre').val('');
            $('#newVideoRecord').find('input#year').val(0);
            $('#newVideoRecord').find('input#country').val('');
            $('#newVideoRecord').find('input#descriptionLink').val('');
            $('#newVideoRecord').find('input#videoLink').val('');
            getNumberOfPages(selectedNumOfRecords, prepareSearchRequest());
            executeQuery(1, selectedNumOfRecords,prepareSearchRequest());
            $('#newDiv').hide();
            $('#descDiv').show();
        })
    });
});

//отмена отправки данных новой записи и закрытие формы
$('#newcancel').click(function () {
    $('#newDiv').hide();
    $('#descDiv').show();
});

/*-------------------------------------REMOVE---------------------------------------------------------------*/
//показ формы удаления записи из БД
/*$('#remove').click(function() {
    $('#descDiv').hide();
    $('#newDiv').hide();
    $('#editDiv').hide();
    $('#searchDiv').hide();
    $('#removeDiv').find('h5').empty();
    $('#removeDiv').find('h5').append("Вы действительно хотите удалить запись \"" + chosenRecordName + "\" из базы данных?");
    $('#removeDiv').show();
});

//отправка id удаляемой записи на сервер и отображение ответа
$('#removesave').click(function () {
    $.ajax({
        type: 'POST',
        url: "/remove",
        data: {'id': chosenRecordId},
        success: (function (data) {
            alert(data);
            getNumberOfPages(selectedNumOfRecords, searchString);
            executeQuery(1, selectedNumOfRecords, searchString);
            $('#removeDiv').hide();
            $('#descDiv').show();
        })
    });
});

//отмена отправки данных для удаления записи и закрытие формы
$('#removecancel').click(function () {
    $('#removeDiv').hide();
    $('#descDiv').show();
});*/

/*----------------------------------------------REMOVE ALTERNATIVE----------------------------------------*/
//показ всплывающего окна удаления записи из БД (согласно ТЗ)
$('#remove').click(function() {
    //var id = $(this).attr('id');
    //console.log(id);
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();
    $('#mask').css({'width':maskWidth,'height':maskHeight});
    $('#mask').fadeIn(1000);
    $('#mask').fadeTo("slow",0.8);
    var winH = $(window).height();
    var winW = $(window).width();
    $('#dialog').css('top',  winH/2-$('#dialog').height()/2);
    $('#dialog').css('left', winW/2-$('#dialog').width()/2);
    $('#dialog').fadeIn(2000);
    $('.content1').empty();
    $('.content1').append("Вы действительно хотите удалить запись \"" + chosenRecordName + "\" из базы данных?");
});

        $('.window .close').click(function (e) {
            e.preventDefault();
            $('#mask, .window').hide();
        });

$('#mask').click(function () {
    $(this).hide();
    $('.window').hide();
});

//отправка id удаляемой записи на сервер и отображение ответа
$('#removesave').click(function () {
    $.ajax({
        type: 'POST',
        url: "/remove",
        data: {'id': chosenRecordId},
        success: (function (data) {
            alert(data);
            getNumberOfPages(selectedNumOfRecords, searchString);
            executeQuery(1, selectedNumOfRecords, searchString);
            $('#mask').hide();
            $('.window').hide();
        })
    });
});

//отмена отправки данных для удаления записи и закрытие формы
$('#removecancel').click(function () {
    $('#mask, .window').hide();
});

/*-------------------------------------EDIT---------------------------------------------------------------*/
//показ формы редактиврования записи при нажатии кнопки edit
var chosenRecord;
$('#edit').click(function() {
    $.ajax({
        url: "/chooseRecord",
        data: {'id': chosenRecordId},
        success: (function (data) {
            chosenRecord = data;
            $('#editedVideoRecord').find('input#name').val('');
            $('#editedVideoRecord').find('input#genre').val('');
            $('#editedVideoRecord').find('input#year').val('');
            $('#editedVideoRecord').find('input#country').val('');
            $('#editedVideoRecord').find('input#descriptionLink').val('');
            $('#editedVideoRecord').find('input#videoLink').val('');
            $('#editedVideoRecord').find('input#name').val(chosenRecord.name);
            $('#editedVideoRecord').find('input#genre').val(chosenRecord.genre);
            $('#editedVideoRecord').find('input#year').val(chosenRecord.year);
            $('#editedVideoRecord').find('input#country').val(chosenRecord.country);
            $('#editedVideoRecord').find('input#descriptionLink').val(chosenRecord.descriptionLink);
            $('#editedVideoRecord').find('input#videoLink').val(chosenRecord.videoLink);
            $('#descDiv').hide();
            $('#removeDiv').hide();
            $('#newDiv').hide();
            $('#searchDiv').hide();
            $('#editDiv').show();
        })
    });
});

//отправка данных отредактированной записи на сервер и отображение ответа
$('#editsave').click(function () {
    var edit = $('#editedVideoRecord').serialize();
    $.ajax({
        type: 'POST',
        url: "/editRecord",
        data: edit+'&id='+chosenRecord.id,
        success: (function (data) {
            alert(data);
            selectedNumOfRecords = $('select').val();
            executeQuery(page, selectedNumOfRecords, searchString);
            $('#editDiv').hide();
            $('#descDiv').show();
        })
    });
});

//отмена отправки данных для редактирования записи и закрытие формы
$('#editcancel').click(function () {
    $('#editDiv').hide();
    $('#descDiv').show();
});

/*-------------------------------------SEARCH---------------------------------------------------------------*/
//показ формы поиска при нажатии кнопки search
$('#search').click(function() {
    $('#descDiv').hide();
    $('#editDiv').hide();
    $('#removeDiv').hide();
    $('#newDiv').hide();
    $('#searchDiv').show();
});

//отправка данных на сервер для поиска записей по критериям и отображение результата
$('#searchsave').click(function () {
    searchString = prepareSearchRequest();
    getNumberOfPages(selectedNumOfRecords,searchString);
    executeQuery (1, selectedNumOfRecords,searchString);
});

//отмена отправки данных для поиска записи и закрытие формы
$('#searchcancel').click(function () {
    $('#searchDiv').hide();
    $('#descDiv').show();
});

/*-------------------------------------SELECT---------------------------------------------------------------*/
//Устанавливаем обработчик выбора количества записей на странице
$('select').change(function (){
    selectedNumOfRecords = $('select').val();
    getNumberOfPages(selectedNumOfRecords, searchString);
    page =1;
    executeQuery(page, selectedNumOfRecords, searchString);
});