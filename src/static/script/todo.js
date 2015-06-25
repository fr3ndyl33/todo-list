$("#sortable").sortable();
$("#sortable").disableSelection();

countTodos();

//create todo
$('.add-todo').on('keypress',function (e) {
      e.preventDefault
      if (e.which == 13) {
           if($(this).val() != ''){
           var todo = $(this).val();                      
            $.get("/post/create", {topic: todo}, function(res){
              data = JSON.parse(res);              
              createTodo(todo, data.id);               
            },'text');
           }else{
               // some validation
           }
      }
});
// mark task as done
$('.todolist').on('change','#sortable li input[type="checkbox"]',function(){
    if($(this).prop('checked')){
        var doneItem = $(this).parent().parent().find('label').text();
        $(this).parent().parent().parent().addClass('remove');
        var id = $(this).attr('id');
        done(doneItem, id);              
    }
});

//delete done task from "already done"
$('.todolist').on('click','.remove-item',function(){
    removeItem(this);
});

// count tasks
function countTodos(){
    var count = $("#sortable li").length;
    if(count > 0)
      $('.count-todos').html(count+" Items Left");
    else
      $('.count-todos').html("Nothing To do yet!");
}

//create task
function createTodo(text, id){
    var markup = '<li class="ui-state-default"><div class="checkbox"><label><input type="checkbox" id="'+id+'" value="" />'+ text +'</label></div></li>';
    $('#sortable').prepend(markup);
    $('.add-todo').val('');
    countTodos();
}
function createDone(text, id){
    var markup = '<li>'+ text +'<button id="'+id+'" class="btn btn-default btn-xs pull-right remove-item"><span class="glyphicon glyphicon-remove"></span>Delete</button></li>';
    $('#done-items').prepend(markup);
    $('.remove').remove();
}

//mark task as done
function done(doneItem, id){
    var done = doneItem;    
    $.get("/post/done", {id: id}, function(res){
      createDone(doneItem, id);
      countTodos();
    },'text');
}

//remove done task from list
function removeItem(element){
    var id = $(element).attr('id');
    $.get("/post/delete", {id: id}, function(res){
      $(element).parent().remove();      
    },'text');    
}

function populateList(){
  $.get("/post/list", {}, function(res){      
      var data = JSON.parse(res);
      $.each(data.lists, function(index, item){
        if(!item.done_at){
          createTodo(item.topic, item.id);         
        }else{
          createDone(item.topic, item.id);
        }
      });
      countTodos();
    },'text');   
}

populateList();